import { prisma } from "@/lib/prisma";
import { scrapeUrl } from "./scraper";
import {
  extractOpportunities,
  checkDuplicate,
  type ExtractedOpportunity,
} from "./ai";
import { slugify } from "@/lib/slugify";

// Auto-approve threshold: opportunities with confidence >= this are published automatically
const AUTO_APPROVE_CONFIDENCE = 75;

export interface ScoutResult {
  sourceId: string;
  sourceName: string;
  found: number;
  added: number;
  autoApproved: number;
  skippedDuplicates: number;
  errors: string[];
}

export async function scoutSource(sourceId: string): Promise<ScoutResult> {
  const source = await prisma.scoutedSource.findUnique({
    where: { id: sourceId },
  });

  if (!source) {
    return {
      sourceId,
      sourceName: "Unknown",
      found: 0,
      added: 0,
      autoApproved: 0,
      skippedDuplicates: 0,
      errors: ["Source not found"],
    };
  }

  const result: ScoutResult = {
    sourceId: source.id,
    sourceName: source.name,
    found: 0,
    added: 0,
    autoApproved: 0,
    skippedDuplicates: 0,
    errors: [],
  };

  try {
    // 1. Scrape the page
    console.log(`[Scouter] Scraping: ${source.name} (${source.url})`);
    const content = await scrapeUrl(source.url);
    if (!content || content.length < 50) {
      result.errors.push("Page content too short or empty");
      return result;
    }

    // 2. Extract opportunities using AI
    console.log(`[Scouter] Extracting opportunities from: ${source.name}`);
    const opportunities = await extractOpportunities(
      content,
      source.url,
      source.name
    );
    result.found = opportunities.length;
    console.log(`[Scouter] Found ${opportunities.length} opportunities`);

    // 3. Get existing titles for deduplication
    const existingListings = await prisma.listing.findMany({
      select: { title: true },
    });
    const existingTitles = existingListings.map((l) => l.title);

    const existingResults = await prisma.scoutedResult.findMany({
      where: { sourceId: source.id },
      select: { title: true },
    });
    const existingResultTitles = existingResults.map((r) => r.title);
    const allExistingTitles = [...existingTitles, ...existingResultTitles];

    // 4. Store results and create listings
    for (const opp of opportunities) {
      try {
        // Check for duplicates
        const isDuplicate = await checkDuplicate(opp.title, allExistingTitles);
        if (isDuplicate) {
          result.skippedDuplicates++;
          continue;
        }

        const { autoApproved } = await storeOpportunity(
          opp,
          source.id,
          source.url
        );
        result.added++;
        if (autoApproved) result.autoApproved++;

        // Add to existing titles to prevent duplicates within same batch
        allExistingTitles.push(opp.title);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        if (!msg.includes("Unique constraint")) {
          result.errors.push(`Failed to store "${opp.title}": ${msg}`);
        }
      }
    }

    // 5. Update last scraped timestamp
    await prisma.scoutedSource.update({
      where: { id: source.id },
      data: { lastScraped: new Date() },
    });

    console.log(
      `[Scouter] ${source.name}: added ${result.added}, auto-approved ${result.autoApproved}, skipped ${result.skippedDuplicates} dupes`
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    result.errors.push(`Scraping failed: ${msg}`);
    console.error(`[Scouter] Error scraping ${source.name}:`, msg);
  }

  return result;
}

async function storeOpportunity(
  opp: ExtractedOpportunity,
  sourceId: string,
  sourceUrl: string
): Promise<{ autoApproved: boolean }> {
  const confidence = opp.confidence || 0;
  const shouldAutoApprove =
    confidence >= AUTO_APPROVE_CONFIDENCE &&
    opp.title.length > 10 &&
    opp.description.length > 30;

  // Create scouted result
  await prisma.scoutedResult.create({
    data: {
      title: opp.title,
      description: opp.description,
      url: opp.applyUrl || sourceUrl,
      rawData: JSON.parse(JSON.stringify(opp)),
      sourceId,
      isApproved: shouldAutoApprove,
    },
  });

  // Create listing
  let slug = slugify(opp.title);
  const existingListing = await prisma.listing.findUnique({
    where: { slug },
  });
  if (existingListing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  await prisma.listing.create({
    data: {
      title: opp.title,
      slug,
      description: opp.description,
      type: opp.type || "OTHER",
      status: shouldAutoApprove ? "PUBLISHED" : "DRAFT",
      source: "AI_SCOUTED",
      country: opp.country || null,
      city: opp.city || null,
      isRemote: opp.isRemote || false,
      isPaid: opp.isPaid || false,
      salary: opp.salary || null,
      currency: opp.currency || null,
      deadline: opp.deadline ? new Date(opp.deadline) : null,
      startDate: opp.startDate ? new Date(opp.startDate) : null,
      endDate: opp.endDate ? new Date(opp.endDate) : null,
      applyUrl: opp.applyUrl || sourceUrl,
    },
  });

  return { autoApproved: shouldAutoApprove };
}

export async function scoutAllSources(): Promise<{
  results: ScoutResult[];
  runId: string;
}> {
  // Create run log
  const run = await prisma.scouterRun.create({
    data: {
      type: "scheduled",
      status: "running",
    },
  });

  const sources = await prisma.scoutedSource.findMany({
    where: { isActive: true },
  });

  const results: ScoutResult[] = [];
  let totalFound = 0;
  let totalAdded = 0;
  let totalAutoApproved = 0;
  const allErrors: string[] = [];

  console.log(
    `[Scouter] Starting automated run: ${sources.length} sources`
  );

  for (const source of sources) {
    const result = await scoutSource(source.id);
    results.push(result);

    totalFound += result.found;
    totalAdded += result.added;
    totalAutoApproved += result.autoApproved;
    allErrors.push(...result.errors);

    // Delay between sources to be respectful to servers
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  // Update run log
  await prisma.scouterRun.update({
    where: { id: run.id },
    data: {
      status: "completed",
      sourcesCount: sources.length,
      foundCount: totalFound,
      addedCount: totalAdded,
      autoApproved: totalAutoApproved,
      errors: allErrors,
      completedAt: new Date(),
    },
  });

  console.log(
    `[Scouter] Run complete: ${totalFound} found, ${totalAdded} added, ${totalAutoApproved} auto-approved`
  );

  return { results, runId: run.id };
}

export async function runAutoDiscovery(): Promise<{
  newSourcesAdded: number;
  runId: string;
}> {
  const { discoverSources } = await import("./ai");

  const run = await prisma.scouterRun.create({
    data: {
      type: "discovery",
      status: "running",
    },
  });

  const topics = [
    "scholarships for Central Asian students",
    "international internships for students from developing countries",
    "youth exchange programs and fellowships",
    "STEM research opportunities for international students",
    "volunteer programs for young people",
  ];

  // Pick a random topic each time
  const topic = topics[Math.floor(Math.random() * topics.length)];
  console.log(`[Scouter] Auto-discovering sources for: "${topic}"`);

  let newSourcesAdded = 0;
  const errors: string[] = [];

  try {
    const suggestions = await discoverSources(topic);

    const existingUrls = new Set(
      (await prisma.scoutedSource.findMany({ select: { url: true } })).map(
        (s) => s.url
      )
    );

    for (const suggestion of suggestions) {
      if (!existingUrls.has(suggestion.url)) {
        try {
          await prisma.scoutedSource.create({
            data: {
              name: suggestion.name,
              url: suggestion.url,
              description: suggestion.description,
              isActive: true,
            },
          });
          newSourcesAdded++;
          console.log(`[Scouter] New source added: ${suggestion.name}`);
        } catch (err) {
          // Skip duplicates
          const msg = err instanceof Error ? err.message : "";
          if (!msg.includes("Unique constraint")) {
            errors.push(`Failed to add source ${suggestion.name}: ${msg}`);
          }
        }
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    errors.push(`Discovery failed: ${msg}`);
  }

  await prisma.scouterRun.update({
    where: { id: run.id },
    data: {
      status: "completed",
      addedCount: newSourcesAdded,
      errors,
      completedAt: new Date(),
    },
  });

  console.log(`[Scouter] Discovery complete: ${newSourcesAdded} new sources`);
  return { newSourcesAdded, runId: run.id };
}

export async function cleanupExpiredListings(): Promise<number> {
  const now = new Date();

  const result = await prisma.listing.updateMany({
    where: {
      deadline: { lt: now },
      status: "PUBLISHED",
    },
    data: { status: "CLOSED" },
  });

  if (result.count > 0) {
    console.log(`[Scouter] Closed ${result.count} expired listings`);
  }

  return result.count;
}

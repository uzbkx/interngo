import cron from "node-cron";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scrapeUrl } from "./scraper";
import {
  extractOpportunities,
  checkDuplicate,
  discoverSources,
} from "./ai";
import { slugify } from "../../lib/slugify";

// Standalone scheduler — runs outside of Next.js
// Start with: npx tsx src/lib/scouter/scheduler.ts

const AUTO_APPROVE_CONFIDENCE = 75;

function createPrisma() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  });
  return new PrismaClient({ adapter });
}

async function scoutAllSources(prisma: PrismaClient) {
  const run = await prisma.scouterRun.create({
    data: { type: "scheduled", status: "running" },
  });

  const sources = await prisma.scoutedSource.findMany({
    where: { isActive: true },
  });

  let totalFound = 0;
  let totalAdded = 0;
  let totalAutoApproved = 0;
  const allErrors: string[] = [];

  console.log(
    `\n[${new Date().toISOString()}] Scouter run started: ${sources.length} sources`
  );

  for (const source of sources) {
    try {
      console.log(`  Scraping: ${source.name}...`);
      const content = await scrapeUrl(source.url);

      if (!content || content.length < 50) {
        console.log(`  ⚠ ${source.name}: page content too short, skipping`);
        continue;
      }

      const opportunities = await extractOpportunities(
        content,
        source.url,
        source.name
      );
      totalFound += opportunities.length;
      console.log(`  Found ${opportunities.length} opportunities`);

      // Get existing titles for dedup
      const existingTitles = (
        await prisma.listing.findMany({ select: { title: true } })
      ).map((l) => l.title);

      const existingResultTitles = (
        await prisma.scoutedResult.findMany({
          where: { sourceId: source.id },
          select: { title: true },
        })
      ).map((r) => r.title);

      const allExisting = [...existingTitles, ...existingResultTitles];

      for (const opp of opportunities) {
        const isDuplicate = await checkDuplicate(opp.title, allExisting);
        if (isDuplicate) continue;

        const confidence = opp.confidence || 0;
        const shouldAutoApprove =
          confidence >= AUTO_APPROVE_CONFIDENCE &&
          opp.title.length > 10 &&
          opp.description.length > 30;

        // Store scouted result
        await prisma.scoutedResult.create({
          data: {
            title: opp.title,
            description: opp.description,
            url: opp.applyUrl || source.url,
            rawData: JSON.parse(JSON.stringify(opp)),
            sourceId: source.id,
            isApproved: shouldAutoApprove,
          },
        });

        // Create listing
        let slug = slugify(opp.title);
        const existingSlug = await prisma.listing.findUnique({
          where: { slug },
        });
        if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`;

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
            applyUrl: opp.applyUrl || source.url,
          },
        });

        totalAdded++;
        if (shouldAutoApprove) totalAutoApproved++;
        allExisting.push(opp.title);

        console.log(
          `    + ${opp.title} ${shouldAutoApprove ? "(auto-published)" : "(draft)"}`
        );
      }

      // Update last scraped
      await prisma.scoutedSource.update({
        where: { id: source.id },
        data: { lastScraped: new Date() },
      });

      // Delay between sources
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown";
      allErrors.push(`${source.name}: ${msg}`);
      console.error(`  ✗ ${source.name}: ${msg}`);
    }
  }

  // Close expired listings
  const closed = await prisma.listing.updateMany({
    where: { deadline: { lt: new Date() }, status: "PUBLISHED" },
    data: { status: "CLOSED" },
  });

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
    `[${new Date().toISOString()}] Run complete: found ${totalFound}, added ${totalAdded}, auto-published ${totalAutoApproved}, closed ${closed.count} expired`
  );
  if (allErrors.length > 0) {
    console.log(`  Errors: ${allErrors.join("; ")}`);
  }
}

async function autoDiscoverSources(prisma: PrismaClient) {
  const topics = [
    "scholarships for Central Asian students",
    "international internships for university students",
    "youth exchange programs and fellowships",
    "STEM research opportunities for international students",
    "volunteer programs abroad for young people",
    "fully funded masters programs for developing countries",
    "summer internships at international organizations",
    "government sponsored study abroad programs",
  ];

  const topic = topics[Math.floor(Math.random() * topics.length)];
  console.log(
    `\n[${new Date().toISOString()}] Auto-discovering sources for: "${topic}"`
  );

  const run = await prisma.scouterRun.create({
    data: { type: "discovery", status: "running" },
  });

  let added = 0;

  try {
    const suggestions = await discoverSources(topic);
    const existingUrls = new Set(
      (await prisma.scoutedSource.findMany({ select: { url: true } })).map(
        (s) => s.url
      )
    );

    for (const s of suggestions) {
      if (!existingUrls.has(s.url)) {
        try {
          await prisma.scoutedSource.create({
            data: { name: s.name, url: s.url, description: s.description },
          });
          added++;
          console.log(`  + New source: ${s.name}`);
        } catch {
          // Skip duplicates
        }
      }
    }
  } catch (err) {
    console.error(`  Discovery error:`, err);
  }

  await prisma.scouterRun.update({
    where: { id: run.id },
    data: {
      status: "completed",
      addedCount: added,
      completedAt: new Date(),
    },
  });

  console.log(`  Discovery complete: ${added} new sources added`);
}

// --- MAIN ---
async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ERROR: ANTHROPIC_API_KEY not set in environment");
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL not set in environment");
    process.exit(1);
  }

  const prisma = createPrisma();

  console.log("═══════════════════════════════════════════════");
  console.log("  InternGo AI Scouter — Automated Pipeline");
  console.log("═══════════════════════════════════════════════");
  console.log(`  Database: connected`);
  console.log(`  AI: Anthropic Claude`);
  console.log("");
  console.log("  Schedule:");
  console.log("  • Scout all sources: every 6 hours");
  console.log("  • Discover new sources: once daily at 3 AM");
  console.log("  • Cleanup expired listings: every hour");
  console.log("═══════════════════════════════════════════════\n");

  // Run immediately on start
  console.log("Running initial scout...");
  await scoutAllSources(prisma);

  // Schedule: scout all sources every 6 hours
  cron.schedule("0 */6 * * *", async () => {
    console.log("\n--- Scheduled scouting run ---");
    await scoutAllSources(prisma);
  });

  // Schedule: discover new sources once daily at 3 AM
  cron.schedule("0 3 * * *", async () => {
    console.log("\n--- Scheduled source discovery ---");
    await autoDiscoverSources(prisma);
  });

  // Schedule: cleanup expired listings every hour
  cron.schedule("0 * * * *", async () => {
    const closed = await prisma.listing.updateMany({
      where: { deadline: { lt: new Date() }, status: "PUBLISHED" },
      data: { status: "CLOSED" },
    });
    if (closed.count > 0) {
      console.log(
        `[${new Date().toISOString()}] Closed ${closed.count} expired listings`
      );
    }
  });

  console.log("Scouter is running. Press Ctrl+C to stop.\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});

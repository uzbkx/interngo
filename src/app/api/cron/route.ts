import { NextResponse } from "next/server";
import { scoutAllSources, cleanupExpiredListings } from "@/lib/scouter/engine";

export const maxDuration = 300;

// Secured cron endpoint — call this from Vercel Cron, EasyCron, or any scheduler
// GET /api/cron?key=YOUR_CRON_SECRET
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  const cronSecret = process.env.CRON_SECRET;

  // Verify cron secret
  if (!cronSecret || key !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    // 1. Close expired listings
    const closed = await cleanupExpiredListings();

    // 2. Scout all sources
    const { results, runId } = await scoutAllSources();

    const totalFound = results.reduce((sum, r) => sum + r.found, 0);
    const totalAdded = results.reduce((sum, r) => sum + r.added, 0);
    const totalAutoApproved = results.reduce(
      (sum, r) => sum + r.autoApproved,
      0
    );

    return NextResponse.json({
      success: true,
      runId,
      summary: {
        sourcesScanned: results.length,
        opportunitiesFound: totalFound,
        newListingsAdded: totalAdded,
        autoPublished: totalAutoApproved,
        expiredClosed: closed,
      },
    });
  } catch (error) {
    console.error("Cron scouter error:", error);
    return NextResponse.json(
      { error: "Cron job failed", details: String(error) },
      { status: 500 }
    );
  }
}

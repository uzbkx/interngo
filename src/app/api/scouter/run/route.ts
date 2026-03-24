import { NextResponse } from "next/server";
import { requireAdminOrSecret } from "@/lib/auth";
import {
  scoutSource,
  scoutAllSources,
  runAutoDiscovery,
  cleanupExpiredListings,
} from "@/lib/scouter/engine";

export const maxDuration = 300;

export async function POST(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured. Add it to your .env file." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const { sourceId, action } = body;

  try {
    if (action === "discover") {
      const result = await runAutoDiscovery();
      return NextResponse.json(result);
    }

    if (action === "cleanup") {
      const closed = await cleanupExpiredListings();
      return NextResponse.json({ closedListings: closed });
    }

    if (sourceId) {
      const result = await scoutSource(sourceId);
      return NextResponse.json({ results: [result] });
    }

    const { results, runId } = await scoutAllSources();
    return NextResponse.json({ results, runId });
  } catch (error) {
    console.error("Scouter error:", error);
    return NextResponse.json(
      { error: "Scouter failed", details: String(error) },
      { status: 500 }
    );
  }
}

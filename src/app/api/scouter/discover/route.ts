import { NextResponse } from "next/server";
import { discoverSources } from "@/lib/scouter/ai";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  const { topic } = await request.json();

  if (!topic) {
    return NextResponse.json(
      { error: "Topic is required (e.g. 'scholarships', 'tech internships')" },
      { status: 400 }
    );
  }

  try {
    const suggestions = await discoverSources(topic);

    const existingUrls = new Set(
      (await prisma.scoutedSource.findMany({ select: { url: true } })).map(
        (s) => s.url
      )
    );

    const newSources = suggestions.filter((s) => !existingUrls.has(s.url));

    return NextResponse.json({
      suggestions: newSources,
      alreadyTracked: suggestions.length - newSources.length,
    });
  } catch (error) {
    console.error("Discovery error:", error);
    return NextResponse.json(
      { error: "Discovery failed", details: String(error) },
      { status: 500 }
    );
  }
}

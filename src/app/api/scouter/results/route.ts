import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const pending = searchParams.get("pending") === "true";

    const where = pending
      ? { isApproved: false, isRejected: false }
      : {};

    const results = await prisma.scoutedResult.findMany({
      where,
      include: { source: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Failed to fetch scouted results:", error);
    return NextResponse.json(
      { error: "Failed to fetch results" },
      { status: 500 }
    );
  }
}

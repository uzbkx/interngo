import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ listingId: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ saved: false });
  }

  try {
    const { listingId } = await params;

    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId, listingId } },
    });

    return NextResponse.json({ saved: !!existing });
  } catch (error) {
    console.error("Failed to check saved status:", error);
    return NextResponse.json({ saved: false });
  }
}

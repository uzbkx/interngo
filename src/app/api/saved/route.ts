import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const saved = await prisma.savedListing.findMany({
      where: { userId: auth.userId },
      include: {
        listing: {
          include: { organization: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ saved });
  } catch (error) {
    console.error("Failed to fetch saved listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved listings" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { listingId } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }

    const existing = await prisma.savedListing.findUnique({
      where: { userId_listingId: { userId: auth.userId, listingId } },
    });

    if (existing) {
      await prisma.savedListing.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    }

    await prisma.savedListing.create({
      data: { userId: auth.userId, listingId },
    });

    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Failed to toggle saved listing:", error);
    return NextResponse.json(
      { error: "Failed to save listing" },
      { status: 500 }
    );
  }
}

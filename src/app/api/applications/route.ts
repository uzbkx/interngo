import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import type { ApplicationStatus } from "@/generated/prisma/client";

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const applications = await prisma.application.findMany({
      where: { userId: auth.userId },
      include: {
        listing: {
          include: { organization: { select: { name: true } } },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { listingId, status, notes } = await request.json();
    if (!listingId) {
      return NextResponse.json({ error: "listingId required" }, { status: 400 });
    }

    const application = await prisma.application.upsert({
      where: { userId_listingId: { userId: auth.userId, listingId } },
      update: {
        status: (status as ApplicationStatus) || "INTERESTED",
        notes: notes || null,
      },
      create: {
        userId: auth.userId,
        listingId,
        status: (status as ApplicationStatus) || "INTERESTED",
        notes: notes || null,
      },
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error("Failed to create/update application:", error);
    return NextResponse.json(
      { error: "Failed to save application" },
      { status: 500 }
    );
  }
}

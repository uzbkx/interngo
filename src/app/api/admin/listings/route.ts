import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";
import type { ListingStatus } from "@/generated/prisma/client";

export async function GET(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const status = (searchParams.get("status") || "DRAFT") as ListingStatus;

    const listings = await prisma.listing.findMany({
      where: { status },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Failed to fetch admin listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

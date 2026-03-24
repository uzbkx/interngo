import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const { action } = await request.json();

    if (action === "approve") {
      await prisma.scoutedResult.update({
        where: { id },
        data: { isApproved: true },
      });

      const result = await prisma.scoutedResult.findUnique({ where: { id } });
      if (result) {
        const listing = await prisma.listing.findFirst({
          where: {
            title: result.title,
            source: "AI_SCOUTED",
            status: "DRAFT",
          },
        });
        if (listing) {
          await prisma.listing.update({
            where: { id: listing.id },
            data: { status: "PUBLISHED" },
          });
        }
      }

      return NextResponse.json({ status: "approved" });
    }

    if (action === "reject") {
      await prisma.scoutedResult.update({
        where: { id },
        data: { isRejected: true },
      });

      const result = await prisma.scoutedResult.findUnique({ where: { id } });
      if (result) {
        const listing = await prisma.listing.findFirst({
          where: {
            title: result.title,
            source: "AI_SCOUTED",
            status: "DRAFT",
          },
        });
        if (listing) {
          await prisma.listing.update({
            where: { id: listing.id },
            data: { status: "ARCHIVED" },
          });
        }
      }

      return NextResponse.json({ status: "rejected" });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Failed to process scouted result:", error);
    return NextResponse.json(
      { error: "Failed to process result" },
      { status: 500 }
    );
  }
}

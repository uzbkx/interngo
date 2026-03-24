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

    const listing = await prisma.listing.update({
      where: { id },
      data: { status: "PUBLISHED" },
    });

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Failed to approve listing:", error);
    return NextResponse.json(
      { error: "Failed to approve listing" },
      { status: 500 }
    );
  }
}

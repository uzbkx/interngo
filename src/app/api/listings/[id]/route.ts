import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await prisma.listing.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();

    const listing = await prisma.listing.update({
      where: { id },
      data: body,
    });

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Failed to update listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const runs = await prisma.scouterRun.findMany({
      orderBy: { startedAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ runs });
  } catch (error) {
    console.error("Failed to fetch scouter runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch runs" },
      { status: 500 }
    );
  }
}

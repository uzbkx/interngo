import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminOrSecret } from "@/lib/auth";

export async function GET(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const sources = await prisma.scoutedSource.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { results: true } },
      },
    });

    return NextResponse.json({ sources });
  } catch (error) {
    console.error("Failed to fetch sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminOrSecret(request);
  if (auth.error) return auth.error;

  try {
    const { name, url, description } = await request.json();

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const source = await prisma.scoutedSource.create({
      data: { name, url, description },
    });

    return NextResponse.json({ source }, { status: 201 });
  } catch (error) {
    console.error("Failed to create source:", error);
    return NextResponse.json(
      { error: "Failed to create source" },
      { status: 500 }
    );
  }
}

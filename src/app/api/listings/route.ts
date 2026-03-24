import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import type { ListingType } from "@/generated/prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      title,
      type,
      organization,
      description,
      country,
      city,
      deadline,
      applyUrl,
      isRemote,
      isPaid,
    } = body;

    if (!title || !type || !description) {
      return NextResponse.json(
        { error: "Title, type, and description are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = slugify(title);
    const existing = await prisma.listing.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    // Store the organization name in the description header if provided
    // (full org linking will be added when org accounts are implemented)
    const fullDescription = organization
      ? `Organization: ${organization}\n\n${description}`
      : description;

    const listing = await prisma.listing.create({
      data: {
        title,
        slug,
        type: type as ListingType,
        status: "DRAFT",
        source: "USER_SUBMITTED",
        description: fullDescription,
        country: country || null,
        city: city || null,
        deadline: deadline ? new Date(deadline) : null,
        applyUrl: applyUrl || null,
        isRemote: isRemote || false,
        isPaid: isPaid || false,
      },
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Failed to create listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const q = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { status: "PUBLISHED" };
    if (type) where.type = type;
    if (q) where.title = { contains: q, mode: "insensitive" };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: { organization: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Failed to fetch listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

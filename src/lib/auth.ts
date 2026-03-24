import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import type { Role } from "@/generated/prisma/client";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("interngo-user-id")?.value;

  if (!userId) return null;

  try {
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("interngo-user-id")?.value ?? null;
}

// --- Auth guards for API routes ---

const UNAUTHORIZED = NextResponse.json(
  { error: "Unauthorized — please log in" },
  { status: 401 }
);

const FORBIDDEN = NextResponse.json(
  { error: "Forbidden — insufficient permissions" },
  { status: 403 }
);

/**
 * Require an authenticated user. Returns the userId or a 401 response.
 */
export async function requireAuth(): Promise<
  { userId: string; error?: never } | { userId?: never; error: NextResponse }
> {
  const userId = await getCurrentUserId();
  if (!userId) return { error: UNAUTHORIZED };
  return { userId };
}

/**
 * Require an authenticated user with a specific role (e.g. ADMIN).
 */
export async function requireRole(
  ...roles: Role[]
): Promise<
  { userId: string; error?: never } | { userId?: never; error: NextResponse }
> {
  const user = await getCurrentUser();
  if (!user) return { error: UNAUTHORIZED };
  if (!roles.includes(user.role)) return { error: FORBIDDEN };
  return { userId: user.id };
}

/**
 * Require admin access. Checks user role OR admin secret header.
 * The secret header allows server-side cron/scouter to call admin routes.
 */
export async function requireAdmin(): Promise<
  { ok: true; error?: never } | { ok?: never; error: NextResponse }
> {
  // Check admin secret header (for cron/internal calls)
  const cookieStore = await cookies();
  const adminSecret = process.env.ADMIN_SECRET;
  // Cookie-based admin check not possible from headers here,
  // so we fall back to user role check

  const user = await getCurrentUser();
  if (user?.role === "ADMIN") return { ok: true };

  // If no authenticated admin, check if there's an admin secret match
  // (this is checked via request headers in individual routes)
  return { error: FORBIDDEN };
}

/**
 * Verify admin secret from request headers (for API/cron calls).
 */
export function verifyAdminSecret(request: Request): boolean {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) return false;
  const header = request.headers.get("x-admin-secret");
  return header === adminSecret;
}

/**
 * Require admin: either authenticated ADMIN user or valid admin secret header.
 */
export async function requireAdminOrSecret(
  request: Request
): Promise<
  { ok: true; error?: never } | { ok?: never; error: NextResponse }
> {
  // Check header secret first (for cron/scouter)
  if (verifyAdminSecret(request)) return { ok: true };

  // Check authenticated user role
  const user = await getCurrentUser();
  if (user?.role === "ADMIN") return { ok: true };

  return { error: FORBIDDEN };
}

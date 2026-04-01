import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");

  if (token) {
    // Redirect to a client page that stores the token in localStorage
    return NextResponse.redirect(
      `${origin}/auth/callback/success?token=${encodeURIComponent(token)}`
    );
  }

  return NextResponse.redirect(`${origin}/auth/login?error=auth_failed`);
}

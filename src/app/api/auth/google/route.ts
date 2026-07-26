import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const rawClientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientId = rawClientId.trim().replace(/^["']|["']$/g, "");
  
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost"))
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/$/, "")
    : req.nextUrl.origin;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "student";

  console.log("[Google OAuth Init] Client ID:", clientId ? `${clientId.substring(0, 15)}...` : "MISSING", "Redirect URI:", redirectUri, "Role:", role);

  if (!clientId || clientId === "your-google-client-id.apps.googleusercontent.com") {
    return NextResponse.json(
      { error: "Google OAuth is not configured. Please set GOOGLE_CLIENT_ID in your .env file." },
      { status: 503 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: role,
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

  return NextResponse.redirect(googleAuthUrl);
}

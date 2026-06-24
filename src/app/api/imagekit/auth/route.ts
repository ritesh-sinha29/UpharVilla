import { getUploadAuthParams } from "@imagekit/next/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  // Check for Better Auth session cookie — this is a lightweight,
  // server-side-only check that works reliably on Vercel without
  // needing a roundtrip to the Convex backend.
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

  if (!privateKey || !publicKey) {
    return NextResponse.json(
      { error: "ImageKit keys not configured" },
      { status: 500 },
    );
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey,
    publicKey,
  });

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey,
  });
}

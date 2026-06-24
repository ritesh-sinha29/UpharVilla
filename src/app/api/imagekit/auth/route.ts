import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-server";

export async function GET() {
  // Use the authenticated check from your auth-server
  const isAuthed = await isAuthenticated();

  if (!isAuthed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { token, expire, signature } = getUploadAuthParams({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  });

  return NextResponse.json({
    token,
    expire,
    signature,
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  });
}

// import { getUploadAuthParams } from "@imagekit/next/server";
// import { isAuthenticated } from "@/lib/auth-server";
// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

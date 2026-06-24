import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getImageKit } from "@/lib/ImageKit";

export async function POST(req: Request) {
  // Auth check — verify session cookie exists
  const cookieStore = await cookies();
  const sessionCookie =
    cookieStore.get("better-auth.session_token") ??
    cookieStore.get("__Secure-better-auth.session_token");

  if (!sessionCookie?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract the file name from the URL path
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    if (!fileName) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    // List files matching the name
    const files = await getImageKit().listFiles({
      searchQuery: `name = "${fileName}"`,
    });

    if (files && files.length > 0) {
      // @ts-expect-error
      await getImageKit().deleteFile(files[0].fileId);
      return NextResponse.json({
        success: true,
        message: "File deleted from ImageKit",
      });
    }

    return NextResponse.json({
      success: true,
      message: "File not found on ImageKit, skipped deletion",
    });
  } catch (error: any) {
    console.error("ImageKit delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete file" },
      { status: 500 },
    );
  }
}

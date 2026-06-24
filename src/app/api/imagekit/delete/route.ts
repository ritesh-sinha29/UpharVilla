import { NextResponse } from "next/server";
import { getImageKit } from "@/lib/ImageKit";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Extract the file name from the URL path
    // e.g. "https://ik.imagekit.io/dedak5eij/banners/hero_banner_1779528790609_fDeriPQEn" -> "hero_banner_1779528790609_fDeriPQEn"
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    if (!fileName) {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    console.log("Searching for file name on ImageKit:", fileName);

    // List files matching the name
    const files = await getImageKit().listFiles({
      searchQuery: `name = "${fileName}"`,
    });

    if (files && files.length > 0) {
      // @ts-expect-error
      console.log("Found file on ImageKit, deleting ID:", files[0].fileId);
      // Delete the file using fileId
      // @ts-expect-error
      await getImageKit().deleteFile(files[0].fileId);
      return NextResponse.json({
        success: true,
        message: "File deleted from ImageKit",
      });
    }

    console.log("File not found on ImageKit:", fileName);
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

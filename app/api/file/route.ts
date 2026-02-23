import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const filePath = searchParams.get("path");
  const filename = searchParams.get("filename") || "download";

  if (!filePath) {
    return NextResponse.json({ error: "File path required" }, { status: 400 });
  }

  // Security: only allow files in the tmp directory
  const normalizedPath = path.resolve(filePath);
  const tmpDir = path.resolve(path.join(process.cwd(), "tmp"));

  if (!normalizedPath.startsWith(tmpDir)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!fs.existsSync(normalizedPath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(normalizedPath);
  const ext = path.extname(normalizedPath);
  const contentType =
    ext === ".mp4" ? "video/mp4" : ext === ".mp3" ? "audio/mpeg" : "application/octet-stream";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}${ext}"`,
    },
  });
}

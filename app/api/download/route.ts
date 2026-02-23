import { NextRequest, NextResponse } from "next/server";
import { isValidYouTubeUrl, getVideoInfo, downloadAudio, downloadVideo } from "@/app/lib/youtube";
import { randomUUID } from "crypto";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    if (!isValidYouTubeUrl(url)) {
      return NextResponse.json(
        { error: "Invalid YouTube URL. Please paste a valid YouTube link." },
        { status: 400 }
      );
    }

    const id = randomUUID();

    const [info, audioPath, videoPath] = await Promise.all([
      getVideoInfo(url),
      downloadAudio(url, `audio-${id}`),
      downloadVideo(url, `video-${id}`),
    ]);

    return NextResponse.json({
      videoPath,
      audioPath,
      title: info.title,
      thumbnail: info.thumbnail,
      duration: info.duration,
      author: info.author,
      id,
    });
  } catch (err: unknown) {
    console.error("[download] error:", err);

    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";

    if (message.includes("private") || message.includes("Private")) {
      return NextResponse.json(
        { error: "This video is private and cannot be downloaded." },
        { status: 403 }
      );
    }

    if (message.includes("age") || message.includes("Age")) {
      return NextResponse.json(
        { error: "This video is age-restricted and cannot be processed." },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: "Failed to process the video. Please try another URL." },
      { status: 500 }
    );
  }
}

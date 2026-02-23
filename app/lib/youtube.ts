import ytdl from "ytdl-core";
import path from "path";
import fs from "fs";
import { pipeline } from "stream/promises";

const TMP_DIR = path.join(process.cwd(), "tmp");

export function ensureTmpDir() {
  if (!fs.existsSync(TMP_DIR)) {
    fs.mkdirSync(TMP_DIR, { recursive: true });
  }
}

export function isValidYouTubeUrl(url: string): boolean {
  try {
    return ytdl.validateURL(url);
  } catch {
    return false;
  }
}

export async function getVideoInfo(url: string) {
  const info = await ytdl.getInfo(url);
  return {
    title: info.videoDetails.title,
    thumbnail:
      info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
        ?.url || "",
    duration: formatDuration(parseInt(info.videoDetails.lengthSeconds)),
    author: info.videoDetails.author.name,
  };
}

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export async function downloadAudio(url: string, filename: string): Promise<string> {
  ensureTmpDir();
  const outputPath = path.join(TMP_DIR, `${filename}.mp3`);

  const audioStream = ytdl(url, {
    quality: "highestaudio",
    filter: "audioonly",
  });

  await pipeline(audioStream, fs.createWriteStream(outputPath));
  return outputPath;
}

export async function downloadVideo(url: string, filename: string): Promise<string> {
  ensureTmpDir();
  const outputPath = path.join(TMP_DIR, `${filename}.mp4`);

  const videoStream = ytdl(url, {
    quality: "highestvideo",
    filter: "videoandaudio",
  });

  await pipeline(videoStream, fs.createWriteStream(outputPath));
  return outputPath;
}

export function cleanupFile(filePath: string) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch {
    // silently fail cleanup
  }
}

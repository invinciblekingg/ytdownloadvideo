import OpenAI from "openai";
import fs from "fs";

let openaiClient: OpenAI | null = null;

function getClient(): OpenAI {
  if (!openaiClient) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

export async function transcribeAudio(audioPath: string): Promise<string> {
  const client = getClient();

  const audioFile = fs.createReadStream(audioPath);

  const transcription = await client.audio.transcriptions.create({
    file: audioFile,
    model: "whisper-1",
    response_format: "text",
  });

  return transcription;
}

"use client";

const items = [
  "▶ MP4 4K Download",
  "♪ MP3 Audio Rip",
  "✦ AI Transcription",
  "⚡ 30s Processing",
  "🌐 100+ Languages",
  "🔒 Secure & Private",
  "📋 Copy Transcript",
  "💾 .TXT Export",
  "🎬 Any YouTube URL",
  "🤖 OpenAI Whisper",
];

export default function FeatureTicker() {
  const doubled = [...items, ...items];

  return (
    <div
      className="relative overflow-hidden py-4 border-y"
      style={{ borderColor: "var(--border)", background: "rgba(10,10,18,0.6)" }}
    >
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--void), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--void), transparent)" }} />

      <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-2 font-mono text-sm shrink-0" style={{ color: "var(--dim)" }}>
            <span style={{ color: "var(--cyan)", opacity: 0.6 }}>◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

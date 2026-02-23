"use client";

import { useEffect, useRef, useState } from "react";

interface VideoData {
  videoPath: string;
  audioPath: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
}

interface Props {
  data: VideoData;
  transcript: string;
  transcribing: boolean;
}

export default function DownloadButtons({ data, transcript, transcribing }: Props) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const safeName = data.title.replace(/[^a-zA-Z0-9\s]/g, "").trim().slice(0, 50) || "video";

  useEffect(() => {
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          y: 30, opacity: 0, duration: 0.6, ease: "power3.out"
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  const handleDownload = async (type: "video" | "audio" | "transcript") => {
    setDownloading(type);
    try {
      if (type === "transcript") {
        const blob = new Blob([transcript], { type: "text/plain" });
        const href = URL.createObjectURL(blob);
        Object.assign(document.createElement("a"), { href, download: `${safeName}-transcript.txt` }).click();
        URL.revokeObjectURL(href);
      } else {
        const filePath = type === "video" ? data.videoPath : data.audioPath;
        const ext = type === "video" ? "mp4" : "mp3";
        const href = `/api/file?path=${encodeURIComponent(filePath)}&filename=${encodeURIComponent(safeName)}`;
        Object.assign(document.createElement("a"), { href, download: `${safeName}.${ext}` }).click();
      }
    } finally {
      setTimeout(() => setDownloading(null), 1200);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttons = [
    { type: "video" as const, label: "Download MP4", sub: "Full Video · " + data.duration, icon: "▶", color: "var(--cyan)", border: "rgba(0,229,255,0.2)", glow: "rgba(0,229,255,0.12)" },
    { type: "audio" as const, label: "Download MP3", sub: "Audio Only", icon: "♪", color: "var(--emerald)", border: "rgba(0,255,157,0.2)", glow: "rgba(0,255,157,0.1)" },
    { type: "transcript" as const, label: "Download .TXT", sub: transcribing ? "Generating..." : transcript ? `${transcript.split(" ").length} words` : "No transcript", icon: "✦", color: "var(--violet)", border: "rgba(168,85,247,0.2)", glow: "rgba(168,85,247,0.1)", disabled: transcribing || !transcript },
  ];

  return (
    <div ref={containerRef} className="w-full max-w-2xl mx-auto px-4 mt-5 space-y-4">
      {/* Video info */}
      <div className="flex items-center gap-4 p-4 rounded-2xl"
        style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
        {data.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.thumbnail} alt="" className="w-20 h-14 object-cover rounded-xl shrink-0" />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-display font-bold text-sm truncate" style={{ color: "var(--text-bright)" }} title={data.title}>
            {data.title}
          </div>
          <div className="font-mono text-xs mt-1" style={{ color: "var(--dim)" }}>
            {data.author} · {data.duration}
          </div>
        </div>
        <button onClick={handleCopyLink}
          className="shrink-0 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 hover:bg-white/5"
          style={{ border: "1px solid var(--border)", color: copied ? "var(--emerald)" : "var(--dim)" }}>
          {copied ? "✓ Copied" : "⎘ Share"}
        </button>
      </div>

      {/* Download buttons grid */}
      <div className="grid grid-cols-3 gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.type}
            onClick={() => !btn.disabled && handleDownload(btn.type)}
            disabled={btn.disabled || downloading === btn.type}
            className="group relative rounded-xl p-4 text-left overflow-hidden transition-all duration-300"
            style={{
              background: btn.disabled ? "rgba(0,0,0,0.2)" : "var(--panel)",
              border: `1px solid ${btn.disabled ? "var(--border)" : btn.border}`,
              boxShadow: btn.disabled ? "none" : `0 0 30px ${btn.glow}`,
              cursor: btn.disabled ? "not-allowed" : "pointer",
              opacity: btn.disabled ? 0.4 : 1,
            }}>
            {/* Hover bg */}
            {!btn.disabled && (
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `radial-gradient(ellipse at 50% 0%, ${btn.glow} 0%, transparent 80%)` }} />
            )}

            <div className="relative z-10">
              <div className="text-xl mb-2 transition-transform duration-200 group-hover:scale-110"
                style={{ color: btn.disabled ? "var(--muted)" : btn.color }}>
                {downloading === btn.type ? (
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : btn.icon}
              </div>
              <div className="font-display font-bold text-xs" style={{ color: btn.disabled ? "var(--muted)" : "var(--text-bright)" }}>
                {btn.label}
              </div>
              <div className="font-mono text-xs mt-0.5" style={{ color: "var(--dim)" }}>
                {btn.sub}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

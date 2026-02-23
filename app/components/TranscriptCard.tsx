"use client";

import { useState, useRef, useEffect } from "react";

interface TranscriptCardProps {
  transcript: string;
  loading: boolean;
}

export default function TranscriptCard({ transcript, loading }: TranscriptCardProps) {
  const [copied, setCopied] = useState(false);
  const [search, setSearch] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!transcript && !loading) return;
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.from(cardRef.current, { y: 30, opacity: 0, duration: 0.6, ease: "power3.out", delay: 0.1 });
      });
    };
    init();
    return () => ctx?.revert();
  }, [transcript, loading]);

  if (!loading && !transcript) return null;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlight = (text: string) => {
    if (!search.trim()) return text;
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === search.toLowerCase()
        ? `<mark key="${i}" style="background:rgba(0,229,255,0.25);color:var(--cyan);border-radius:3px;padding:0 2px">${p}</mark>`
        : p
    ).join("");
  };

  const wordCount = transcript ? transcript.trim().split(/\s+/).length : 0;
  const charCount = transcript.length;

  return (
    <div ref={cardRef} className="w-full max-w-2xl mx-auto px-4 mt-5">
      <div className="rounded-2xl overflow-hidden"
        style={{ background: "var(--panel)", border: "1px solid var(--border)", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
              style={{ background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.2)", color: "var(--violet)" }}>
              ✦
            </div>
            <div>
              <div className="font-display font-bold text-sm" style={{ color: "var(--text-bright)" }}>
                AI Transcript
              </div>
              {transcript && (
                <div className="font-mono text-xs mt-0.5" style={{ color: "var(--dim)" }}>
                  {wordCount.toLocaleString()} words · {charCount.toLocaleString()} chars
                </div>
              )}
            </div>
          </div>

          {transcript && (
            <div className="flex items-center gap-2">
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 hover:bg-white/5"
                style={{ border: "1px solid var(--border)", color: copied ? "var(--emerald)" : "var(--dim)" }}>
                {copied ? "✓ Copied" : "⎘ Copy"}
              </button>
            </div>
          )}
        </div>

        {/* Search */}
        {transcript && (
          <div className="px-5 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search in transcript..."
              className="w-full bg-transparent outline-none font-mono text-xs"
              style={{ color: "var(--text)", background: "transparent" }}
            />
          </div>
        )}

        {/* Content */}
        <div className="px-5 py-5">
          {loading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-5">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} className="w-2 h-2 rounded-full animate-ping"
                    style={{ backgroundColor: "var(--violet)", animationDelay: `${d}s`, animationDuration: "1.2s" }} />
                ))}
                <span className="font-mono text-xs" style={{ color: "var(--dim)" }}>
                  Transcribing with OpenAI Whisper...
                </span>
              </div>
              {[100, 85, 70, 90, 60, 75].map((w, i) => (
                <div key={i} className="skeleton h-3.5" style={{ width: `${w}%` }} />
              ))}
            </div>
          ) : (
            <div
              className="h-56 overflow-y-auto pr-2 text-sm leading-relaxed"
              style={{ color: "var(--text)", scrollbarWidth: "thin", scrollbarColor: "var(--border-bright) transparent" }}
            >
              {transcript.split("\n").map((line, i) =>
                line.trim() ? (
                  <p key={i} className="mb-3"
                    dangerouslySetInnerHTML={{ __html: highlight(line) }} />
                ) : <br key={i} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

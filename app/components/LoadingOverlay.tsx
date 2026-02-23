"use client";

import { useEffect, useRef } from "react";

interface LoadingOverlayProps {
  stage: "downloading" | "transcribing";
}

export default function LoadingOverlay({ stage }: LoadingOverlayProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.from(cardRef.current, {
          scale: 0.95, opacity: 0, duration: 0.5, ease: "power3.out"
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  const stages = [
    { key: "downloading", label: "Downloading video & audio", sub: "Fetching via ytdl-core..." },
    { key: "transcribing", label: "Generating AI transcript", sub: "Processing with Whisper..." },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-5">
      <div ref={cardRef} className="rounded-2xl p-6"
        style={{ background: "var(--panel)", border: "1px solid rgba(0,229,255,0.15)", boxShadow: "0 0 40px rgba(0,229,255,0.06)" }}>

        {/* Steps */}
        <div className="space-y-4 mb-6">
          {stages.map((s) => {
            const isActive = s.key === stage;
            const isDone = stage === "transcribing" && s.key === "downloading";

            return (
              <div key={s.key} className="flex items-center gap-4">
                {/* Status indicator */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500"
                  style={{
                    background: isDone ? "rgba(0,255,157,0.12)" : isActive ? "rgba(0,229,255,0.12)" : "rgba(0,0,0,0.3)",
                    border: `1px solid ${isDone ? "rgba(0,255,157,0.3)" : isActive ? "rgba(0,229,255,0.3)" : "var(--border)"}`,
                    color: isDone ? "var(--emerald)" : isActive ? "var(--cyan)" : "var(--muted)",
                  }}>
                  {isDone ? "✓" : isActive ? (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <span className="w-2 h-2 rounded-full" style={{ background: "var(--border-bright)" }} />
                  )}
                </div>

                <div>
                  <div className="font-display font-semibold text-sm transition-colors duration-300"
                    style={{ color: isDone ? "var(--emerald)" : isActive ? "var(--text-bright)" : "var(--muted)" }}>
                    {s.label}
                  </div>
                  {isActive && (
                    <div className="font-mono text-xs mt-0.5 animate-pulse" style={{ color: "var(--dim)" }}>
                      {s.sub}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-px rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
          <div className="h-full rounded-full progress-fill"
            style={{ background: "linear-gradient(90deg, var(--cyan) 0%, var(--emerald) 100%)" }} />
        </div>

        <p className="font-mono text-xs mt-3 text-center" style={{ color: "var(--muted)" }}>
          {stage === "downloading" ? "Video length affects processing time..." : "AI transcription in progress..."}
        </p>
      </div>
    </div>
  );
}

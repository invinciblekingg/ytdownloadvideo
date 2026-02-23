"use client";

import { useEffect, useRef, useState } from "react";

interface UrlFormProps {
  onSubmit: (url: string) => void;
  loading: boolean;
}

export default function UrlForm({ onSubmit, loading }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isYT = url.includes("youtube.com/") || url.includes("youtu.be/");

  useEffect(() => {
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        gsap.from(formRef.current, {
          y: 40, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.1
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || loading) return;
    onSubmit(url.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) { setUrl(text); inputRef.current?.focus(); }
    } catch { /* blocked */ }
  };

  return (
    <div ref={formRef} id="demo" className="w-full max-w-2xl mx-auto px-4">
      <form onSubmit={handleSubmit}>
        {/* Input container */}
        <div className="relative rounded-2xl p-px transition-all duration-500"
          style={{
            background: focused
              ? "linear-gradient(135deg, rgba(0,229,255,0.5) 0%, rgba(0,255,157,0.3) 100%)"
              : "rgba(255,255,255,0.06)",
          }}>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: "rgba(10,10,18,0.97)", backdropFilter: "blur(20px)" }}>

            {/* Glow on focus */}
            {focused && (
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(0,229,255,0.06) 0%, transparent 65%)" }} />
            )}

            <div className="flex items-center gap-3 px-5 py-4">
              {/* YT icon */}
              <div className="shrink-0 w-7 h-7 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    fill={isYT ? "#ff0000" : "var(--muted)"}
                    style={{ transition: "fill 0.3s" }}
                  />
                </svg>
              </div>

              <input
                ref={inputRef}
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 bg-transparent outline-none text-base md:text-lg"
                style={{
                  color: "var(--text-bright)",
                  fontFamily: "var(--font-display)",
                }}
                disabled={loading}
              />

              {/* Placeholder buttons */}
              {!url && !loading && (
                <button type="button" onClick={handlePaste}
                  className="shrink-0 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-200 hover:border-opacity-50"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--dim)" }}>
                  paste
                </button>
              )}
              {url && !loading && (
                <button type="button" onClick={() => setUrl("")}
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white/5"
                  style={{ color: "var(--muted)" }}>
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="btn-primary w-full mt-3 py-4 text-base disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </span>
          ) : (
            "Extract Video →"
          )}
        </button>

        <p className="text-center font-mono text-xs mt-3" style={{ color: "var(--muted)" }}>
          Supports youtube.com and youtu.be links · No account required
        </p>
      </form>
    </div>
  );
}

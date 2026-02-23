"use client";

import { useEffect, useRef } from "react";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.from(footerRef.current, {
          opacity: 0, y: 20, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 95%", once: true }
        });
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  const links = [
    { group: "Product", items: ["Features", "How it Works", "API Docs", "Try Demo"] },
    { group: "Stack", items: ["Next.js 14", "OpenAI Whisper", "ytdl-core", "Tailwind CSS"] },
    { group: "Legal", items: ["Privacy Policy", "Terms of Use", "DMCA", "Cookie Policy"] },
  ];

  return (
    <footer ref={footerRef} className="relative border-t mt-16" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-5 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--cyan) 0%, #0088aa 100%)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M8 5v14l11-7z" fill="var(--void)" />
                </svg>
              </div>
              <span className="font-display font-black text-base" style={{ color: "var(--text-bright)" }}>
                yt<span className="text-gradient-cyan">extract</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--dim)" }}>
              The modern YouTube extraction toolkit. Built with Next.js and powered by OpenAI.
            </p>
            <div className="flex items-center gap-2 mt-4 font-mono text-xs"
              style={{ color: "var(--muted)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--emerald)" }} />
              All systems operational
            </div>
          </div>

          {/* Link groups */}
          {links.map((g) => (
            <div key={g.group}>
              <div className="font-display font-bold text-xs uppercase tracking-widest mb-4"
                style={{ color: "var(--muted)" }}>{g.group}</div>
              <ul className="space-y-2">
                {g.items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sm transition-colors duration-200 hover:opacity-100"
                      style={{ color: "var(--dim)" }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "var(--text)")}
                      onMouseOut={(e) => (e.currentTarget.style.color = "var(--dim)")}>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="section-line mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs" style={{ color: "var(--muted)" }}>
            © 2025 ytextract · Built for personal, educational use. Respect copyright.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs px-2 py-1 rounded"
              style={{ background: "var(--panel)", border: "1px solid var(--border)", color: "var(--dim)" }}>
              v1.0.0
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--muted)" }}>
              Powered by OpenAI Whisper
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

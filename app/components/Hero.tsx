"use client";

import { useEffect, useRef } from "react";

export default function Hero() {
  const badgeRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const orb1Ref = useRef<HTMLDivElement>(null);
  const orb2Ref = useRef<HTMLDivElement>(null);
  const orb3Ref = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      ctx = gsap.context(() => {
        // Orbs floating
        gsap.to(orb1Ref.current, { y: -30, x: 20, duration: 9, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to(orb2Ref.current, { y: 25, x: -15, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 2 });
        gsap.to(orb3Ref.current, { y: -20, x: 10, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 4 });
        gsap.to(ringRef.current, { rotation: 360, duration: 50, ease: "none", repeat: -1 });

        const tl = gsap.timeline({ delay: 0.5 });
        tl.from(badgeRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" })
          .from(h1Ref.current, { y: 50, opacity: 0, duration: 0.9, ease: "power3.out" }, "-=0.4")
          .from(subRef.current, { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
          .from(statsRef.current ? Array.from(statsRef.current.children) : [], {
            y: 24, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power3.out"
          }, "-=0.4");
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-24 px-4 overflow-hidden">
      {/* Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div ref={orb1Ref} className="absolute rounded-full blur-[130px]"
          style={{ width: 700, height: 700, background: "radial-gradient(circle, rgba(0,229,255,0.09) 0%, transparent 70%)", top: "-15%", left: "50%", transform: "translateX(-50%)" }} />
        <div ref={orb2Ref} className="absolute rounded-full blur-[100px]"
          style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", top: "25%", right: "-8%" }} />
        <div ref={orb3Ref} className="absolute rounded-full blur-[90px]"
          style={{ width: 400, height: 400, background: "radial-gradient(circle, rgba(0,255,157,0.07) 0%, transparent 70%)", bottom: "5%", left: "-5%" }} />

        {/* Spinning rings */}
        <div ref={ringRef} className="absolute"
          style={{ width: 800, height: 800, top: "50%", left: "50%", marginTop: -400, marginLeft: -400 }}>
          <div className="absolute inset-0 rounded-full" style={{ border: "1px solid rgba(0,229,255,0.05)" }} />
          <div className="absolute inset-[80px] rounded-full" style={{ border: "1px solid rgba(168,85,247,0.04)" }} />
          <div className="absolute inset-[160px] rounded-full" style={{ border: "1px solid rgba(0,255,157,0.03)" }} />
        </div>
      </div>

      {/* Dot grid */}
      <div className="absolute inset-0 dot-grid opacity-50 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <div ref={badgeRef}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-mono text-xs mb-8"
            style={{ background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.18)", color: "var(--cyan)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: "var(--cyan)" }} />
              <span className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: "var(--emerald)" }} />
            </span>
            OpenAI Whisper · ytdl-core · Next.js 14 — Free & Open Source
          </div>
        </div>

        <h1 ref={h1Ref} className="font-display font-black leading-[1.02] tracking-tight mb-6">
          <span className="block text-5xl md:text-7xl lg:text-[88px] text-gradient-main">
            Extract. Download.
          </span>
          <span className="block text-5xl md:text-7xl lg:text-[88px] mt-1"
            style={{ color: "var(--text)", opacity: 0.65 }}>
            Transcribe.
          </span>
        </h1>

        <p ref={subRef} className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12"
          style={{ color: "var(--dim)" }}>
          The most powerful YouTube extraction toolkit. Download MP4 & MP3, and generate
          <span style={{ color: "var(--text)" }}> word-perfect AI transcripts</span> powered by OpenAI Whisper — in under 30 seconds.
        </p>

        {/* Stats */}
        <div ref={statsRef} className="flex flex-wrap items-center justify-center gap-6 md:gap-12">
          {[
            { num: "4K", label: "HD Quality", color: "var(--cyan)" },
            { num: "99%", label: "Accuracy", color: "var(--emerald)" },
            { num: "30s", label: "Avg Speed", color: "var(--violet)" },
            { num: "100+", label: "Languages", color: "var(--amber)" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-black text-3xl" style={{ color: s.color }}>{s.num}</div>
              <div className="font-mono text-xs mt-1" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <span className="font-mono text-xs" style={{ color: "var(--dim)" }}>scroll</span>
        <div className="w-px h-10" style={{ background: "linear-gradient(to bottom, var(--cyan), transparent)" }} />
      </div>
    </section>
  );
}

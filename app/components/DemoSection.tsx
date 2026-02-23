"use client";

import { useEffect, useRef } from "react";

interface DemoSectionProps {
  children: React.ReactNode;
}

export default function DemoSection({ children }: DemoSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void };
    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.from(headRef.current, {
          y: 40, opacity: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: headRef.current, start: "top 85%", once: true }
        });
      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="demo" className="relative py-24 px-4">
      <div className="section-line mb-24 max-w-6xl mx-auto" />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute rounded-full blur-[150px] opacity-40"
          style={{ width: 600, height: 400, background: "radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 70%)", top: "10%", left: "50%", transform: "translateX(-50%)" }} />
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div ref={headRef} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs mb-4"
            style={{ background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.18)", color: "var(--cyan)" }}>
            ◆ Try It Now
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4 text-gradient-main">
            Paste. Extract. Done.
          </h2>
          <p className="text-lg" style={{ color: "var(--dim)" }}>
            No sign-up. No limits. Free to use.
          </p>
        </div>

        {children}
      </div>
    </section>
  );
}

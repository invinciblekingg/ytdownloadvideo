"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "Paste URL",
    desc: "Copy any public YouTube URL and paste it into the input field.",
    color: "var(--cyan)",
    icon: "🔗",
  },
  {
    num: "02",
    title: "Process",
    desc: "Our server validates, downloads, and pipes audio to OpenAI Whisper simultaneously.",
    color: "var(--emerald)",
    icon: "⚙",
  },
  {
    num: "03",
    title: "Download",
    desc: "Get your MP4, MP3, or transcript — ready to save in seconds.",
    color: "var(--violet)",
    icon: "⬇",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

        const cards = stepsRef.current ? Array.from(stepsRef.current.children) : [];
        gsap.from(cards, {
          y: 60, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: stepsRef.current, start: "top 80%", once: true }
        });
      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="relative py-28 px-4">
      <div className="section-line mb-28 max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto">
        <div ref={headRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs mb-4"
            style={{ background: "rgba(168,85,247,0.07)", border: "1px solid rgba(168,85,247,0.18)", color: "var(--violet)" }}>
            ◆ Simple Process
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4">
            <span className="text-gradient-violet">3 steps.</span>{" "}
            <span style={{ color: "var(--text)", opacity: 0.7 }}>That's it.</span>
          </h2>
          <p className="text-lg max-w-md mx-auto" style={{ color: "var(--dim)" }}>
            No sign-up, no extensions, no nonsense. Just paste, wait, download.
          </p>
        </div>

        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+40px)] right-0 h-px"
                  style={{ background: `linear-gradient(90deg, ${step.color}40, transparent)` }} />
              )}

              <div className="rounded-2xl p-8 text-center feature-card"
                style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
                {/* Number */}
                <div className="font-mono text-xs mb-4" style={{ color: "var(--muted)" }}>{step.num}</div>

                {/* Icon circle */}
                <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl text-2xl mb-5"
                  style={{ background: `rgba(0,0,0,0.4)`, border: `1px solid ${step.color}30`, color: step.color }}>
                  {step.icon}
                  <div className="absolute inset-0 rounded-2xl opacity-20"
                    style={{ background: step.color, filter: "blur(12px)" }} />
                </div>

                <h3 className="font-display font-bold text-xl mb-3" style={{ color: "var(--text-bright)" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--dim)" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

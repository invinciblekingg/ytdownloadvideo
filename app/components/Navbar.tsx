"use client";

import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let gsap: typeof import("gsap").gsap;

    const init = async () => {
      const mod = await import("gsap");
      gsap = mod.gsap;

      // Entrance animation
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" })
        .from(linksRef.current?.children ?? [], {
          y: -16, opacity: 0, duration: 0.5, stagger: 0.07, ease: "power3.out"
        }, "-=0.3")
        .from(ctaRef.current, { y: -16, opacity: 0, duration: 0.5, ease: "power3.out" }, "-=0.3");
    };

    init();

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "API Docs", href: "#api" },
    { label: "Try It", href: "#demo" },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "navbar-scrolled" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <div ref={logoRef} className="flex items-center gap-3">
              <div
                className="relative w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, var(--cyan) 0%, #0088aa 100%)" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M8 5v14l11-7z"
                    fill="var(--void)"
                  />
                </svg>
                <div
                  className="absolute inset-0 rounded-xl"
                  style={{ boxShadow: "0 0 20px rgba(0,229,255,0.5)" }}
                />
              </div>
              <span
                className="font-display font-900 text-lg tracking-tight text-bright"
                style={{ fontWeight: 900 }}
              >
                yt<span className="text-gradient-cyan">extract</span>
              </span>
            </div>

            {/* Desktop nav links */}
            <div ref={linksRef} className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-display font-500 text-dim hover:text-text transition-all duration-200 hover:bg-white/5"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA */}
            <div ref={ctaRef} className="hidden md:flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono"
                style={{ background: "rgba(0,229,255,0.07)", border: "1px solid rgba(0,229,255,0.15)", color: "var(--cyan)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse" />
                <span>API v1 · Live</span>
              </div>
              <a
                href="#demo"
                className="btn-primary px-5 py-2 text-sm"
              >
                Get Started
              </a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            >
              <span
                className="block w-5 h-0.5 bg-text transition-all duration-300"
                style={{ transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "" }}
              />
              <span
                className="block w-5 h-0.5 bg-text transition-all duration-300"
                style={{ opacity: mobileOpen ? 0 : 1 }}
              />
              <span
                className="block w-5 h-0.5 bg-text transition-all duration-300"
                style={{ transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "" }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`mobile-menu md:hidden absolute top-full left-0 right-0 ${mobileOpen ? "open" : ""}`}
          style={{ background: "rgba(3,3,10,0.97)", borderBottom: "1px solid var(--border)" }}
        >
          <div className="px-5 py-4 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-sm text-dim hover:text-text hover:bg-white/5 transition-all font-display"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#demo"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 btn-primary py-3 text-center text-sm"
            >
              Start Extracting
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

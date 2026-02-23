"use client";

import { useEffect, useRef, useState } from "react";

const endpoints = [
  {
    method: "POST",
    path: "/api/download",
    description: "Download video and audio from a YouTube URL. Returns file paths, metadata, and a unique session ID.",
    requestBody: `{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}`,
    responseBody: `{
  "videoPath": "/tmp/video-a3f2.mp4",
  "audioPath": "/tmp/audio-a3f2.mp3",
  "title": "Rick Astley - Never Gonna Give You Up",
  "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "duration": "3:33",
  "author": "Rick Astley",
  "id": "a3f2c1b9-..."
}`,
    params: [
      { name: "url", type: "string", required: true, desc: "Valid YouTube video URL" },
    ],
    responses: [
      { code: "200", label: "Success", color: "var(--emerald)" },
      { code: "400", label: "Invalid URL", color: "var(--amber)" },
      { code: "403", label: "Private / Age-gated", color: "var(--rose)" },
      { code: "500", label: "Server Error", color: "var(--rose)" },
    ],
  },
  {
    method: "POST",
    path: "/api/transcribe",
    description: "Transcribe an audio file using OpenAI Whisper. Returns full text with multi-language support.",
    requestBody: `{
  "audioPath": "/tmp/audio-a3f2.mp3"
}`,
    responseBody: `{
  "transcript": "We're no strangers to love. You know the rules and so do I..."
}`,
    params: [
      { name: "audioPath", type: "string", required: true, desc: "Server-side audio file path from /api/download" },
    ],
    responses: [
      { code: "200", label: "Success", color: "var(--emerald)" },
      { code: "400", label: "Missing path", color: "var(--amber)" },
      { code: "503", label: "API key not set", color: "var(--rose)" },
      { code: "500", label: "Transcription failed", color: "var(--rose)" },
    ],
  },
  {
    method: "GET",
    path: "/api/file",
    description: "Securely serve a downloaded file for client-side download. Path is validated against the /tmp directory.",
    requestBody: null,
    responseBody: `Binary file stream with Content-Disposition header`,
    params: [
      { name: "path", type: "string (query)", required: true, desc: "Encoded server-side file path" },
      { name: "filename", type: "string (query)", required: false, desc: "Desired download filename (no extension)" },
    ],
    responses: [
      { code: "200", label: "File stream", color: "var(--emerald)" },
      { code: "403", label: "Path outside /tmp", color: "var(--rose)" },
      { code: "404", label: "File not found", color: "var(--amber)" },
    ],
  },
];

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="code-block overflow-auto text-xs leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

export default function ApiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<{ [key: number]: "request" | "response" }>({
    0: "request", 1: "request", 2: "request",
  });

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

        const endpointEls = sectionRef.current?.querySelectorAll(".endpoint-card") ?? [];
        gsap.from(Array.from(endpointEls), {
          y: 50, opacity: 0, duration: 0.7, stagger: 0.15, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true }
        });
      }, sectionRef);
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <section ref={sectionRef} id="api" className="relative py-28 px-4">
      <div className="section-line mb-28 max-w-6xl mx-auto" />
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div ref={headRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs mb-4"
            style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)", color: "var(--amber)" }}>
            ◆ REST API Reference
          </div>
          <h2 className="font-display font-black text-4xl md:text-5xl tracking-tight mb-4"
            style={{ color: "var(--text-bright)" }}>
            Integrate anything.
          </h2>
          <p className="text-lg max-w-lg mx-auto" style={{ color: "var(--dim)" }}>
            A clean, predictable JSON API. No auth required for local development.
          </p>

          {/* Base URL */}
          <div className="inline-flex items-center gap-3 mt-6 px-4 py-3 rounded-xl font-mono text-sm"
            style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
            <span style={{ color: "var(--muted)" }}>Base URL</span>
            <span style={{ color: "var(--cyan)" }}>http://localhost:3000</span>
          </div>
        </div>

        {/* Endpoints */}
        <div className="space-y-6">
          {endpoints.map((ep, idx) => (
            <div key={ep.path} className="endpoint-card rounded-2xl overflow-hidden"
              style={{ background: "var(--panel)", border: "1px solid var(--border)" }}>
              {/* Header */}
              <div className="flex flex-wrap items-center gap-3 px-6 py-5"
                style={{ borderBottom: "1px solid var(--border)" }}>
                <span className={`px-3 py-1 rounded-lg font-mono text-xs font-500 ${ep.method === "POST" ? "method-post" : "method-get"}`}>
                  {ep.method}
                </span>
                <code className="font-mono text-sm" style={{ color: "var(--cyan)" }}>{ep.path}</code>
                <p className="text-sm ml-auto" style={{ color: "var(--dim)" }}>{ep.description}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x"
                style={{ borderColor: "var(--border)" }}>
                {/* Left: params + responses */}
                <div className="p-6 space-y-6">
                  {/* Parameters */}
                  <div>
                    <div className="font-mono text-xs mb-3" style={{ color: "var(--muted)" }}>
                      {ep.method === "GET" ? "QUERY PARAMETERS" : "REQUEST BODY"}
                    </div>
                    <div className="space-y-2">
                      {ep.params.map((p) => (
                        <div key={p.name} className="flex items-start gap-3 p-3 rounded-xl"
                          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <code className="font-mono text-sm" style={{ color: "var(--cyan)" }}>{p.name}</code>
                              <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                                style={{ background: "rgba(168,85,247,0.1)", color: "var(--violet)", border: "1px solid rgba(168,85,247,0.15)" }}>
                                {p.type}
                              </span>
                              {p.required && (
                                <span className="font-mono text-xs px-1.5 py-0.5 rounded"
                                  style={{ background: "rgba(255,77,109,0.1)", color: "var(--rose)", border: "1px solid rgba(255,77,109,0.15)" }}>
                                  required
                                </span>
                              )}
                            </div>
                            <p className="text-xs" style={{ color: "var(--dim)" }}>{p.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response codes */}
                  <div>
                    <div className="font-mono text-xs mb-3" style={{ color: "var(--muted)" }}>RESPONSE CODES</div>
                    <div className="grid grid-cols-2 gap-2">
                      {ep.responses.map((r) => (
                        <div key={r.code} className="flex items-center gap-2 p-2 rounded-lg"
                          style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)" }}>
                          <span className="font-mono text-xs font-bold" style={{ color: r.color }}>{r.code}</span>
                          <span className="text-xs" style={{ color: "var(--dim)" }}>{r.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: code examples */}
                <div className="p-6">
                  {/* Tabs */}
                  {ep.requestBody && (
                    <div className="flex gap-2 mb-4">
                      {(["request", "response"] as const).map((tab) => (
                        <button key={tab} onClick={() => setActiveTab(prev => ({ ...prev, [idx]: tab }))}
                          className="font-mono text-xs px-3 py-1.5 rounded-lg transition-all duration-200"
                          style={{
                            background: activeTab[idx] === tab ? "rgba(0,229,255,0.12)" : "rgba(0,0,0,0.3)",
                            border: `1px solid ${activeTab[idx] === tab ? "rgba(0,229,255,0.25)" : "var(--border)"}`,
                            color: activeTab[idx] === tab ? "var(--cyan)" : "var(--dim)",
                          }}>
                          {tab === "request" ? "Request Body" : "Response"}
                        </button>
                      ))}
                    </div>
                  )}

                  <CodeBlock code={
                    activeTab[idx] === "response" || !ep.requestBody
                      ? ep.responseBody
                      : ep.requestBody!
                  } />

                  {/* cURL example */}
                  {ep.requestBody && activeTab[idx] === "request" && (
                    <div className="mt-4">
                      <div className="font-mono text-xs mb-2" style={{ color: "var(--muted)" }}>cURL EXAMPLE</div>
                      <CodeBlock code={`curl -X ${ep.method} http://localhost:3000${ep.path} \\
  -H "Content-Type: application/json" \\
  -d '${ep.requestBody.replace(/\n/g, " ").replace(/\s+/g, " ")}'`} />
                    </div>
                  )}

                  {ep.method === "GET" && (
                    <div className="mt-4">
                      <div className="font-mono text-xs mb-2" style={{ color: "var(--muted)" }}>EXAMPLE REQUEST</div>
                      <CodeBlock code={`GET /api/file?path=%2Ftmp%2Fvideo.mp4&filename=my-video`} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Environment note */}
        <div className="mt-8 p-5 rounded-2xl"
          style={{ background: "rgba(251,191,36,0.05)", border: "1px solid rgba(251,191,36,0.15)" }}>
          <div className="flex items-start gap-3">
            <span style={{ color: "var(--amber)" }}>⚠</span>
            <div>
              <div className="font-display font-semibold text-sm mb-1" style={{ color: "var(--amber)" }}>
                Environment Variable Required
              </div>
              <p className="text-sm" style={{ color: "var(--dim)" }}>
                The transcription endpoint requires{" "}
                <code className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(251,191,36,0.1)", color: "var(--amber)" }}>
                  OPENAI_API_KEY
                </code>{" "}
                to be set in your <code className="font-mono text-xs">.env.local</code> file.
                Without it, download endpoints still function normally.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

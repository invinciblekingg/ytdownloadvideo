"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeatureTicker from "./components/FeatureTicker";
import FeaturesSection from "./components/FeaturesSection";
import HowItWorks from "./components/HowItWorks";
import ApiSection from "./components/ApiSection";
import DemoSection from "./components/DemoSection";
import UrlForm from "./components/UrlForm";
import DownloadButtons from "./components/DownloadButtons";
import TranscriptCard from "./components/TranscriptCard";
import LoadingOverlay from "./components/LoadingOverlay";
import ErrorMessage from "./components/ErrorMessage";
import Footer from "./components/Footer";

interface VideoData {
  videoPath: string;
  audioPath: string;
  title: string;
  thumbnail: string;
  duration: string;
  author: string;
}

type Stage = "idle" | "downloading" | "transcribing" | "done";

export default function Home() {
  const [stage, setStage] = useState<Stage>("idle");
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (url: string) => {
    setError("");
    setVideoData(null);
    setTranscript("");
    setStage("downloading");

    try {
      const dlRes = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const dlData = await dlRes.json();
      if (!dlRes.ok) throw new Error(dlData.error || "Failed to download video");

      setVideoData(dlData);
      setStage("transcribing");

      const trRes = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioPath: dlData.audioPath }),
      });
      const trData = await trRes.json();
      if (trRes.ok) setTranscript(trData.transcript);

      setStage("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setStage("idle");
    }
  };

  const loading = stage === "downloading";
  const transcribing = stage === "transcribing";

  return (
    <>
      {/* Noise overlay */}
      <div className="noise" />

      {/* Dot grid background */}
      <div className="fixed inset-0 dot-grid opacity-40 pointer-events-none" style={{ zIndex: 0 }} />

      <Navbar />

      <main className="relative" style={{ zIndex: 1 }}>
        {/* Hero */}
        <Hero />

        {/* Ticker band */}
        <FeatureTicker />

        {/* Features */}
        <FeaturesSection />

        {/* How it Works */}
        <HowItWorks />

        {/* API Docs */}
        <ApiSection />

        {/* Demo / CTA */}
        <DemoSection>
          <UrlForm onSubmit={handleSubmit} loading={loading} />

          {error && <ErrorMessage message={error} onDismiss={() => setError("")} />}

          {(loading || transcribing) && (
            <LoadingOverlay stage={loading ? "downloading" : "transcribing"} />
          )}

          {videoData && stage === "done" && (
            <>
              <DownloadButtons data={videoData} transcript={transcript} transcribing={false} />
              <TranscriptCard transcript={transcript} loading={false} />
            </>
          )}
        </DemoSection>

        <Footer />
      </main>
    </>
  );
}

import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "ytextract — Download & Transcribe YouTube Videos",
  description: "Download videos, rip audio, generate word-perfect AI transcripts.",
  openGraph: {
    title: "ytextract — Download & Transcribe YouTube Videos",
    description: "Download videos, rip audio, generate transcripts — all in one seamless workflow.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

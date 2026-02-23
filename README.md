# ytextract — YouTube Downloader & Transcriber

A premium, full-featured YouTube extraction app built with **Next.js 14**, GSAP animations, and OpenAI Whisper transcription.

## ✨ What's Included

- **Navbar** — Fixed glassmorphic navbar with scroll-aware styling, mobile menu, and GSAP entrance animation
- **Hero Section** — Full-screen hero with floating orb animations, spinning rings, and staggered content reveal
- **Feature Ticker** — Infinite scrolling marquee of features
- **Features Section** — 6-card grid with scroll-triggered GSAP animations
- **How It Works** — 3-step process with connector lines and scroll animations
- **API Documentation** — Full REST API reference with request/response examples, cURL snippets, params, and status codes
- **Demo Section** — Live URL input with download buttons, transcript viewer with search, and progress tracking
- **Footer** — Full link grid with live status indicator

## 🛠 Stack

- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + CSS variables
- **Animations**: GSAP 3 + ScrollTrigger
- **Fonts**: Cabinet Grotesk + Instrument Serif + Geist Mono
- **YouTube**: ytdl-core
- **Transcription**: OpenAI Whisper API

## 🚀 Quick Start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# Edit .env.local and add: OPENAI_API_KEY=your_key_here

# 3. Run
npm run dev
```

Open http://localhost:3000

## 🔌 API Reference

### POST /api/download
Downloads video + audio from a YouTube URL.

**Request:**
```json
{ "url": "https://youtube.com/watch?v=..." }
```

**Response:**
```json
{
  "videoPath": "/tmp/video-xxx.mp4",
  "audioPath": "/tmp/audio-xxx.mp3",
  "title": "Video Title",
  "thumbnail": "https://...",
  "duration": "3:45",
  "author": "Channel Name",
  "id": "uuid"
}
```

### POST /api/transcribe
Transcribes audio using OpenAI Whisper.

**Request:**
```json
{ "audioPath": "/tmp/audio-xxx.mp3" }
```

**Response:**
```json
{ "transcript": "Full transcript text..." }
```

### GET /api/file
Securely serves downloaded files.

```
GET /api/file?path=/tmp/video.mp4&filename=my-video
```

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | For transcription | OpenAI API key for Whisper |

## 📦 Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set `OPENAI_API_KEY` environment variable
4. Deploy

> **Note**: Large videos may exceed Vercel's 60s function timeout. Consider upgrading to a Pro plan or implementing background processing for production use.

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#03030a",
        surface: "#0a0a12",
        panel: "#0f0f1a",
        panel2: "#141422",
        border: "#1c1c2e",
        "border-bright": "#2a2a45",
        muted: "#404060",
        dim: "#6b6b90",
        text: "#e2e2f0",
        bright: "#f5f5ff",
        cyan: "#00e5ff",
        emerald: "#00ff9d",
        violet: "#a855f7",
        rose: "#ff4d6d",
        amber: "#fbbf24",
      },
    },
  },
  plugins: [],
};

export default config;

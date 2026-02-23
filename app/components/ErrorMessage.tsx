"use client";

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 mt-4"
      style={{ animation: "fadeUp 0.3s ease-out forwards" }}>
      <div className="flex items-start gap-3 px-5 py-4 rounded-xl"
        style={{ background: "rgba(255,77,109,0.07)", border: "1px solid rgba(255,77,109,0.2)" }}>
        <span className="text-lg shrink-0 mt-0.5" style={{ color: "var(--rose)" }}>⚠</span>
        <div className="flex-1">
          <div className="font-display font-semibold text-sm mb-1" style={{ color: "var(--rose)" }}>
            Something went wrong
          </div>
          <div className="text-sm" style={{ color: "var(--dim)" }}>{message}</div>
        </div>
        <button onClick={onDismiss} className="text-lg transition-colors hover:opacity-70 shrink-0"
          style={{ color: "var(--muted)" }}>✕</button>
      </div>
    </div>
  );
}

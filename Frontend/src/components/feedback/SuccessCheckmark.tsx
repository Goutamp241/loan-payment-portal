export function SuccessCheckmark() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Outer ripple rings */}
      <div className="absolute w-40 h-40 rounded-full bg-emerald-100 animate-[ping_2s_ease-out_1]" style={{ animationIterationCount: 1 }} />
      <div className="absolute w-32 h-32 rounded-full bg-emerald-100/60" />
      <div className="absolute w-28 h-28 rounded-full bg-emerald-50" />
      {/* Main circle */}
      <div className="relative w-24 h-24 rounded-full bg-emerald-500 shadow-xl shadow-emerald-200 flex items-center justify-center">
        <svg width="42" height="34" viewBox="0 0 42 34" fill="none" className="drop-shadow-sm">
          <path
            d="M3 17L15 29L39 3"
            stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="60"
            strokeDashoffset="0"
            style={{
              animation: "drawCheck 0.5s ease-out 0.1s both",
            }}
          />
        </svg>
      </div>
      <style>{`
        @keyframes drawCheck {
          from { stroke-dashoffset: 60; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

// ─── Confetti overlay ─────────────────────────────────────────────────────────

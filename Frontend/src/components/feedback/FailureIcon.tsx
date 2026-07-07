export function FailureIcon() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute w-40 h-40 rounded-full bg-red-50" />
      <div className="absolute w-32 h-32 rounded-full bg-red-100/60" />
      <div className="relative w-24 h-24 rounded-full bg-destructive shadow-xl shadow-red-200 flex items-center justify-center">
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
          <path d="M9 9l20 20M29 9L9 29" stroke="white" strokeWidth="4.5" strokeLinecap="round"
            style={{ animation: "drawX 0.4s ease-out 0.1s both", strokeDasharray: 40, strokeDashoffset: 0 }} />
        </svg>
      </div>
      <style>{`@keyframes drawX { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }`}</style>
    </div>
  );
}

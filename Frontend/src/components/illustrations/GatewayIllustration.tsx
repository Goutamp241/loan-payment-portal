interface GatewayIllustrationProps {
  done: boolean;
}

export function GatewayIllustration({ done }: GatewayIllustrationProps) {
  return (
    <div className="relative w-72 h-56 flex items-center justify-center select-none">
      {/* Outer soft glow rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-52 h-52 rounded-full bg-primary/4 animate-[ping_3s_ease-in-out_infinite]" />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 rounded-full bg-primary/6" />
      </div>

      <svg viewBox="0 0 288 224" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="w-72 h-56 relative z-10" aria-label="Secure payment gateway illustration" role="img">

        {/* ── Bank building (left) ── */}
        <g opacity="0.9">
          <rect x="12" y="80" width="64" height="68" rx="6" fill="white" stroke="#E2E8F0" strokeWidth="1.2" />
          {/* Pillars */}
          <rect x="18" y="92" width="8" height="44" rx="2" fill="#0F4C81" fillOpacity="0.12" />
          <rect x="30" y="92" width="8" height="44" rx="2" fill="#0F4C81" fillOpacity="0.12" />
          <rect x="42" y="92" width="8" height="44" rx="2" fill="#0F4C81" fillOpacity="0.12" />
          <rect x="54" y="92" width="8" height="44" rx="2" fill="#0F4C81" fillOpacity="0.12" />
          {/* Roof */}
          <path d="M8 82 L44 62 L80 82 Z" fill="#0F4C81" fillOpacity="0.15" stroke="#0F4C81" strokeOpacity="0.3" strokeWidth="1" />
          <rect x="38" y="58" width="12" height="6" rx="1" fill="#0F4C81" fillOpacity="0.4" />
          {/* Steps */}
          <rect x="8" y="144" width="72" height="6" rx="2" fill="#E2E8F0" />
          {/* Label */}
          <text x="44" y="160" textAnchor="middle" fill="#64748B" fontSize="7" fontWeight="600" fontFamily="Inter,sans-serif">ABC Bank</text>
        </g>

        {/* ── Encrypted connection line (middle) ── */}
        <g>
          {/* Dashes */}
          {[0,1,2,3,4].map((i) => (
            <rect key={i} x={84 + i * 14} y="110" width="8" height="3" rx="1.5"
              fill={i < 3 ? "#2563EB" : "#CBD5E1"} fillOpacity={i < 3 ? "0.7" : "0.5"} />
          ))}
          {/* Lock in middle of line */}
          <rect x="134" y="99" width="20" height="16" rx="4" fill="white" stroke="#2563EB" strokeWidth="1.2" />
          <path d="M139 99 L139 95 C139 92.2 149 92.2 149 95 L149 99" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" fill="none" />
          <circle cx="144" cy="107" r="2" fill="#2563EB" />
        </g>

        {/* ── 1Pay gateway (right) ── */}
        <g>
          <rect x="212" y="75" width="72" height="78" rx="10" fill="white" stroke="#2563EB" strokeWidth="1.5"
            strokeDasharray={done ? "0" : "4 3"} />
          {/* Shield icon */}
          <path d="M248 88 L264 95 L264 112 C264 122 248 128 248 128 C248 128 232 122 232 112 L232 95 Z"
            fill="#EFF6FF" stroke="#2563EB" strokeWidth="1.2" strokeLinejoin="round" />
          <path d="M241 108 L245 112 L256 101" stroke={done ? "#22C55E" : "#2563EB"} strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
          {/* Label */}
          <text x="248" y="143" textAnchor="middle" fill="#2563EB" fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif">1Pay</text>
          <text x="248" y="153" textAnchor="middle" fill="#64748B" fontSize="6.5" fontWeight="500" fontFamily="Inter,sans-serif">Secure Gateway</text>

          {/* Green connected ring when done */}
          {done && (
            <rect x="209" y="72" width="78" height="84" rx="12" fill="none" stroke="#22C55E" strokeWidth="2" strokeOpacity="0.6" />
          )}
        </g>

        {/* ── Decorative dots ── */}
        <circle cx="144" cy="48" r="3" fill="#0F4C81" fillOpacity="0.15" />
        <circle cx="144" cy="175" r="3" fill="#2563EB" fillOpacity="0.15" />
        <circle cx="60" cy="48" r="2" fill="#2563EB" fillOpacity="0.2" />
        <circle cx="232" cy="50" r="2" fill="#0F4C81" fillOpacity="0.2" />

        {/* ── Animated connection success ── */}
        {done && (
          <g>
            <circle cx="144" cy="112" r="18" fill="#22C55E" fillOpacity="0.12" />
            <circle cx="144" cy="112" r="12" fill="#22C55E" />
            <path d="M138 112 L142 116 L150 107" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </svg>
    </div>
  );
}

interface ProcessingIllustrationProps {
  activeStep: number;
  allDone: boolean;
  customerName?: string;
}

export function ProcessingIllustration({ activeStep, allDone, customerName }: ProcessingIllustrationProps) {
  const nodes = [
    { label: "Customer", sub: customerName ?? "Customer", icon: "👤", y: 0 },
    { label: "ABC Bank", sub: "Loan Portal", icon: "🏦", y: 1 },
    { label: "1Pay Gateway", sub: "Secure Transfer", icon: "🔒", y: 2 },
    { label: "Issuing Bank", sub: "Authorization", icon: "🏛", y: 3 },
    { label: "Payment Done", sub: "Confirmed", icon: "✅", y: 4 },
  ];

  return (
    <div className="relative flex items-center justify-center w-full max-w-[340px] mx-auto aspect-[17/10]">
      {/* Glow background */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/4 via-accent/5 to-primary/6" />

      <svg viewBox="0 0 340 200" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10" aria-label="Payment processing flow" role="img">

        {/* ── Node positions: evenly spaced horizontally ── */}
        {nodes.map((node, idx) => {
          const x = 34 + idx * 68;
          const cy = 80;
          const lit = allDone || idx <= activeStep;
          const active = idx === activeStep && !allDone;

          return (
            <g key={node.label}>
              {/* Connector line to next node */}
              {idx < nodes.length - 1 && (
                <g>
                  {/* Track */}
                  <line x1={x + 18} y1={cy} x2={x + 50} y2={cy}
                    stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
                  {/* Fill — progress */}
                  {lit && (
                    <line x1={x + 18} y1={cy} x2={x + 50} y2={cy}
                      stroke={allDone ? "#22C55E" : "#2563EB"} strokeWidth="2"
                      strokeLinecap="round" strokeDasharray="4 3"
                      className={active ? "animate-[dash_1.2s_linear_infinite]" : ""} />
                  )}
                  {/* Moving dot when segment is active */}
                  {active && (
                    <circle r="3" fill="#2563EB" opacity="0.8">
                      <animateMotion dur="0.9s" repeatCount="indefinite">
                        <mpath href={`#path-${idx}`} />
                      </animateMotion>
                    </circle>
                  )}
                  <path id={`path-${idx}`} d={`M${x + 18} ${cy} L${x + 50} ${cy}`} fill="none" />
                </g>
              )}

              {/* Node circle */}
              <circle cx={x} cy={cy} r={active ? 17 : 15}
                fill={allDone ? "#22C55E" : lit ? "#0F4C81" : "#F1F5F9"}
                stroke={allDone ? "#22C55E" : lit ? "#0F4C81" : "#E2E8F0"}
                strokeWidth={active ? 2.5 : 1.5}
                opacity={active ? 1 : lit ? 0.85 : 0.5}
              />

              {/* Pulse ring for active */}
              {active && (
                <circle cx={x} cy={cy} r="22" fill="none" stroke="#2563EB" strokeWidth="1.5" opacity="0.35">
                  <animate attributeName="r" values="17;24;17" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;0;0.4" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}

              {/* Icon text */}
              <text x={x} y={cy + 5} textAnchor="middle" fontSize="13">{node.icon}</text>

              {/* Label below */}
              <text x={x} y={cy + 28} textAnchor="middle" fill={lit ? "#0F172A" : "#94A3B8"}
                fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif">{node.label}</text>
              <text x={x} y={cy + 38} textAnchor="middle" fill="#94A3B8"
                fontSize="6.5" fontFamily="Inter,sans-serif">{node.sub}</text>
            </g>
          );
        })}

        {/* ── All done checkmark overlay ── */}
        {allDone && (
          <g>
            <circle cx="170" cy="160" r="14" fill="#22C55E" />
            <path d="M163 160 L168 165 L177 153" stroke="white" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
            <text x="170" y="183" textAnchor="middle" fill="#22C55E"
              fontSize="8" fontWeight="700" fontFamily="Inter,sans-serif">PAYMENT SUCCESSFUL</text>
          </g>
        )}
      </svg>

      {/* CSS for dash animation */}
      <style>{`@keyframes dash { to { stroke-dashoffset: -14; } }`}</style>
    </div>
  );
}

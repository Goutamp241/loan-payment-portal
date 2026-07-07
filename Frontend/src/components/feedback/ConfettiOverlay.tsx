/**
 * Animated confetti overlay shown on payment success.
 */

import { useMemo } from 'react';

export function ConfettiOverlay() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 48 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 1.5,
        dur: 2.5 + Math.random() * 1.5,
        color: ['#0F4C81', '#2563EB', '#22C55E', '#F59E0B', '#EC4899', '#8B5CF6'][i % 6],
        size: 6 + Math.random() * 8,
        rotate: Math.random() * 360,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden" aria-hidden>
      <svg width="100%" height="100%" className="absolute inset-0">
        {pieces.map((p) => (
          <rect
            key={p.id}
            x={`${p.x}%`}
            y="-20"
            width={p.size}
            height={p.size * 0.55}
            rx="1.5"
            fill={p.color}
            opacity="0.85"
            transform={`rotate(${p.rotate})`}
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to={`${(Math.random() - 0.5) * 120} 110vh`}
              dur={`${p.dur}s`}
              begin={`${p.delay}s`}
              fill="freeze"
            />
            <animate
              attributeName="opacity"
              from="0.9"
              to="0"
              dur={`${p.dur}s`}
              begin={`${p.delay}s`}
              fill="freeze"
            />
          </rect>
        ))}
      </svg>
    </div>
  );
}

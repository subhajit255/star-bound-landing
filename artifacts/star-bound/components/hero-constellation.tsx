import type { CSSProperties } from 'react';

const POINTS = [[28, 58], [92, 28], [158, 65], [230, 20], [300, 48], [365, 18]];

export function HeroConstellation() {
  return (
    <div className="hero-constellation" data-testid="hero-constellation-animation">
      <svg viewBox="0 0 400 90" role="img" aria-label="An illustration of freckles connecting into a constellation">
        <path className="hc-trail" d="M28 58 L92 28 L158 65 L230 20 L300 48 L365 18" pathLength="1" />
        {POINTS.map(([x, y], i) => (
          <g key={i} style={{ '--star-delay': `${i * 0.28}s` } as CSSProperties}>
            <circle className="hc-halo" cx={x} cy={y} r="11" />
            <circle className="hc-star" cx={x} cy={y} r="3.5" />
          </g>
        ))}
      </svg>
      <span>From freckles to constellations</span>
    </div>
  );
}
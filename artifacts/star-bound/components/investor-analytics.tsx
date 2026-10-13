'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type MetricItem = {
  id: string;
  target: number;
  decimals: number;
  suffix: string;
  label: string;
  description: string;
  trend: string;
  trendType: 'positive' | 'speed' | 'star' | 'shield';
};

const METRICS: MetricItem[] = [
  {
    id: 'downloads',
    target: 148000,
    decimals: 0,
    suffix: '+',
    label: 'App Downloads',
    description: 'Rapid organic adoption driven by viral TikTok and Instagram creator momentum.',
    trend: '+64% MoM',
    trendType: 'positive',
  },
  {
    id: 'scans',
    target: 2840000,
    decimals: 0,
    suffix: '+',
    label: 'Completed Scans',
    description: 'Instant on-device vision AI scans transforming freckles into celestial coordinates.',
    trend: '1.2s Latency',
    trendType: 'speed',
  },
  {
    id: 'registrations',
    target: 96500,
    decimals: 0,
    suffix: '+',
    label: 'User Registrations',
    description: 'Registered explorer accounts saving multi-body vaults and unlocking personal star lore.',
    trend: '65% Conversion',
    trendType: 'star',
  },
  {
    id: 'purchases',
    target: 3850,
    decimals: 0,
    suffix: '+',
    label: 'Purchases & Orders',
    description: 'Monetized pre-orders across Star Bound Plus tiers and laser-etched constellation jewelry.',
    trend: '£14.20 ARPU',
    trendType: 'shield',
  },
];

const INVESTOR_HIGHLIGHTS = [
  { label: 'Constellations Generated', target: 325000, decimals: 0, suffix: '+', hint: '88% social sharing rate' },
  { label: 'Cohort Retention (Day 7)', target: 72, decimals: 0, suffix: '%', hint: 'Top-decile consumer benchmark' },
  { label: 'On-Device Privacy', target: 100, decimals: 0, suffix: '%', hint: 'Zero raw images sent to cloud' },
  { label: 'Investment Status', text: 'Seed Stage', hint: 'Actively speaking with seed partners' },
];

/**
 * Animated number counter with ease-out cubic deceleration
 */
function CountNumber({
  target,
  decimals = 0,
  suffix = '',
  start = false,
  duration = 2000,
}: {
  target: number;
  decimals?: number;
  suffix?: string;
  start: boolean;
  duration?: number;
}) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!start) return;
    let animId: number;
    let startTime: number | null = null;

    const easeOutCubic = (x: number): number => 1 - Math.pow(1 - x, 3);

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = easeOutCubic(progress);
      setVal(eased * target);

      if (progress < 1) {
        animId = requestAnimationFrame(step);
      } else {
        setVal(target);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [start, target, duration]);

  const formatted =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.floor(val).toLocaleString('en-US');

  return (
    <span>
      {formatted}
      {suffix}
    </span>
  );
}

export function InvestorAnalytics({ preview = false }: { preview?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // Trigger counter when section enters viewport
  useEffect(() => {
    if (preview) {
      setHasStarted(true);
      return;
    }
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [preview]);

  // Background ambient starlight
  const bgStars = useMemo(() => {
    return Array.from({ length: 32 }, (_, i) => ({
      id: i,
      x: ((i * 37 + 13) % 100),
      y: ((i * 47 + 7) % 100),
      size: (i % 3 === 0 ? 2 : 1.2),
      opacity: 0.2 + (i % 5) * 0.15,
      delay: (i * 0.3) % 4,
    }));
  }, []);

  return (
    <section ref={sectionRef} className="analytics-section" id="traction" aria-labelledby="analytics-heading">
      {/* Ambient background effects */}
      <div className="analytics-glow" aria-hidden="true" />
      <div className="analytics-glow-secondary" aria-hidden="true" />

      <svg className="analytics-bg-stars" aria-hidden="true" viewBox="0 0 100 100" preserveAspectRatio="none">
        {bgStars.map((st) => (
          <circle
            key={st.id}
            cx={`${st.x}%`}
            cy={`${st.y}%`}
            r={st.size * 0.15}
            className="twinkle"
            style={{ animationDelay: `${st.delay}s`, opacity: st.opacity }}
            fill="#ffffff"
          />
        ))}
      </svg>

      <div className="wrap">
        {/* Section Header */}
        <div className="analytics-header">
          <div className="analytics-eyebrow" data-testid="badge-analytics-eyebrow">
            <span className="live-pulse" aria-hidden="true" />
            <span>Platform Traction &amp; Investor Analytics</span>
          </div>

          <h2 id="analytics-heading" className="analytics-title" data-testid="text-analytics-title">
            Traction that speaks in cosmic numbers.
          </h2>

          <p className="analytics-desc" data-testid="text-analytics-description">
            Early cohort engagement proving product-market fit across downloads, daily completed scans, active user
            registrations, and initial monetization pre-orders.
          </p>
        </div>

        {/* 4 Core Metric Cards */}
        <div className="analytics-grid" role="region" aria-label="Key performance metrics">
          {METRICS.map((metric) => {
            const isHovered = activeMetric === metric.id;

            return (
              <div
                key={metric.id}
                className={`analytics-card ${isHovered ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveMetric(metric.id)}
                onMouseLeave={() => setActiveMetric(null)}
                data-testid={`card-analytics-${metric.id}`}
              >
                <div className="card-ambient-light" aria-hidden="true" />

                {/* Top Row: Icon + Trend Pill */}
                <div className="card-top">
                  <div className={`card-icon-wrap icon-${metric.id}`}>
                    {metric.id === 'downloads' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    )}
                    {metric.id === 'scans' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
                        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
                        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
                        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
                        <line x1="12" y1="6" x2="12" y2="9" />
                        <line x1="12" y1="15" x2="12" y2="18" />
                      </svg>
                    )}
                    {metric.id === 'registrations' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                        <path d="M16 11l2 2 4-4" />
                      </svg>
                    )}
                    {metric.id === 'purchases' && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                        <path d="M3 6h18" />
                        <path d="M16 10a4 4 0 0 1-8 0" />
                      </svg>
                    )}
                  </div>

                  <span className={`card-tag tag-${metric.trendType}`}>
                    {metric.trendType === 'positive' && <span className="arrow-up" aria-hidden="true">▲</span>}
                    {metric.trendType === 'speed' && <span className="bolt" aria-hidden="true">⚡</span>}
                    {metric.trendType === 'star' && <span className="sparkle" aria-hidden="true">✦</span>}
                    {metric.trendType === 'shield' && <span className="shield-dot" aria-hidden="true">●</span>}
                    {metric.trend}
                  </span>
                </div>

                {/* Middle: Big Animated Stat & Labels */}
                <div className="card-content">
                  <div className="card-value" data-testid={`text-metric-val-${metric.id}`}>
                    <CountNumber
                      target={metric.target}
                      decimals={metric.decimals}
                      suffix={metric.suffix}
                      start={hasStarted}
                      duration={1900}
                    />
                  </div>
                  <h3 className="card-label">{metric.label}</h3>
                  <p className="card-desc">{metric.description}</p>
                </div>

                {/* Bottom: Custom Graphical Sparkline Visual */}
                <div className="card-visual" aria-hidden="true">
                  {metric.id === 'downloads' && (
                    <svg className="mini-chart" viewBox="0 0 220 54" fill="none">
                      <defs>
                        <linearGradient id="chartGradDownloads" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3fb68b" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3fb68b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 48 Q 45 42, 75 34 T 145 20 T 190 12 L 220 6"
                        stroke="#3fb68b"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 48 Q 45 42, 75 34 T 145 20 T 190 12 L 220 6 L 220 54 L 0 54 Z"
                        fill="url(#chartGradDownloads)"
                      />
                      <circle cx="220" cy="6" r="4" fill="#3fb68b" />
                      <circle cx="220" cy="6" r="8" fill="#3fb68b" opacity="0.3" className="pulse-circle" />
                    </svg>
                  )}

                  {metric.id === 'scans' && (
                    <svg className="mini-chart" viewBox="0 0 220 54" fill="none">
                      <defs>
                        <linearGradient id="chartGradScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#7a52e8" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#7a52e8" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 40 L 30 38 L 50 44 L 75 22 L 95 36 L 125 14 L 155 26 L 180 8 L 205 18 L 220 4"
                        stroke="#9d7cf4"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M0 40 L 30 38 L 50 44 L 75 22 L 95 36 L 125 14 L 155 26 L 180 8 L 205 18 L 220 4 L 220 54 L 0 54 Z"
                        fill="url(#chartGradScans)"
                      />
                      <circle cx="220" cy="4" r="4" fill="#9d7cf4" />
                    </svg>
                  )}

                  {metric.id === 'registrations' && (
                    <svg className="mini-chart" viewBox="0 0 220 54" fill="none">
                      <defs>
                        <linearGradient id="chartGradReg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f3c969" stopOpacity="0.35" />
                          <stop offset="100%" stopColor="#f3c969" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M0 46 C 40 44, 70 36, 110 28 C 150 20, 180 14, 220 8"
                        stroke="#f3c969"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M0 46 C 40 44, 70 36, 110 28 C 150 20, 180 14, 220 8 L 220 54 L 0 54 Z"
                        fill="url(#chartGradReg)"
                      />
                      <circle cx="220" cy="8" r="4" fill="#f3c969" />
                    </svg>
                  )}

                  {metric.id === 'purchases' && (
                    <div className="accuracy-progress-bar">
                      <div className="bar-labels">
                        <span>Target: £150K</span>
                        <span className="bar-val">£182K Projected</span>
                      </div>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width: hasStarted ? '100%' : '0%',
                            transition: 'width 2s cubic-bezier(0.16, 1, 0.3, 1)',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Investor Highlight Strip */}
        <div className="analytics-strip" data-testid="container-investor-strip">
          <div className="strip-badge">
            <span className="strip-sparkle">✦</span>
            <span>Key Diligence Highlights</span>
          </div>

          <div className="strip-items">
            {INVESTOR_HIGHLIGHTS.map((item, i) => (
              <div key={i} className="strip-item">
                <div className="strip-val-wrap">
                  <span className="strip-dot" aria-hidden="true" />
                  <strong className="strip-value">
                    {item.target !== undefined ? (
                      <CountNumber
                        target={item.target}
                        decimals={item.decimals ?? 0}
                        suffix={item.suffix ?? ''}
                        start={hasStarted}
                        duration={2200}
                      />
                    ) : (
                      item.text
                    )}
                  </strong>
                </div>
                <div className="strip-text">
                  <span className="strip-label">{item.label}</span>
                  <small className="strip-hint">{item.hint}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

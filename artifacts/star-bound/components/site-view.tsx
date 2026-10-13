'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import type { SiteContentInput } from '@workspace/api-client-react';
import { featureImage, storageUrl } from '../lib/media';
import { StarMark } from './brand-mark';
import { SiteNav, SiteFooter } from './site-chrome';
import { Roadmap } from './roadmap';
import { HeroVideo } from './hero-video';
import { InvestorAnalytics } from './investor-analytics';

type Props = { content: SiteContentInput; preview?: boolean };

export function Reveal({
  children,
  delay = 0,
  force,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  force?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(!!force);
  useEffect(() => {
    if (force) {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [force]);
  return (
    <div ref={ref} className={`reveal ${on ? 'in' : ''} ${className}`} style={delay ? { animationDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}

export { StarMark };

export function Stars() {
  const stars = useMemo(() => {
    let s = 7;
    const r = () => {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
    return Array.from({ length: 70 }, (_, i) => ({
      x: r() * 100,
      y: r() * 100,
      s: 0.6 + r() * 1.6,
      d: r() * 6,
      k: i,
    }));
  }, []);
  return (
    <svg className="stars" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 100">
      {stars.map((st) => (
        <circle
          key={st.k}
          cx={st.x}
          cy={st.y}
          r={st.s * 0.12}
          className="twinkle"
          style={{ animationDelay: `${st.d}s` }}
        />
      ))}
    </svg>
  );
}

export function Constellation() {
  const pts: [number, number][] = [
    [12, 78],
    [30, 52],
    [48, 62],
    [66, 30],
    [88, 18],
  ];
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  return (
    <svg className="constellation" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <path d={d} className="c-line" pathLength={1} />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="2.2" className="c-halo" style={{ animationDelay: `${i * 0.4}s` }} />
          <circle cx={p[0]} cy={p[1]} r="1" className="c-node" />
        </g>
      ))}
    </svg>
  );
}

export function Frame({ src, alt, label }: { src: string; alt: string; label?: string }) {
  return (
    <div className="frame">
      <div className="frame-bar">
        <i />
        <i />
        <i />
        <span>{label}</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="frame-img" />
    </div>
  );
}

export function SiteView({ content, preview = false }: Props) {
  const c = content;
  const [tab, setTab] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (preview) return;
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [preview]);

  const go = (_id: string) => (e: MouseEvent) => {
    if (preview) e.preventDefault();
  };

  const tabIndex = Math.min(tab, Math.max(c.features.length - 1, 0));
  const feat = c.features[tabIndex];

  const onTabKey = (e: KeyboardEvent) => {
    if (!c.features.length) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setTab((tabIndex + 1) % c.features.length);
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      setTab((tabIndex - 1 + c.features.length) % c.features.length);
  };

  return (
    <div className={`site ${preview ? 'is-preview' : ''}`} id="top">
      <SiteNav
        brand={c.brandName}
        cta={c.primaryCta}
        ctaHref="#tour"
        scrolled={scrolled}
        preview={preview}
        extra={[
          ...(c.features.length > 0 ? [{ href: '#tour', label: 'Product tour' }] : []),
          { href: '#traction', label: 'Traction' },
          { href: '#roadmap', label: 'Roadmap' },
        ]}
      />

      <main>
      <section className="hero">
        <Stars />
        <div className="hero-glow" />
        <div className="wrap hero-grid">
          <div className="hero-copy">
            {c.heroEyebrow && (
              <Reveal force>
                <span className="eyebrow" data-testid="text-hero-eyebrow">
                  <b /> {c.heroEyebrow}
                </span>
              </Reveal>
            )}
            <Reveal force delay={80}>
              <h1 data-testid="text-hero-title">{c.heroTitle}</h1>
            </Reveal>
            <Reveal force delay={160}>
              <p className="lead" data-testid="text-hero-description">
                {c.heroDescription}
              </p>
            </Reveal>
            <Reveal force delay={240}>
              <div className="cta-row">
                {c.primaryCta && (
                  <a href="#tour" className="btn btn-gold" onClick={go('tour')} data-testid="link-hero-primary">
                    {c.primaryCta}
                  </a>
                )}
                {c.secondaryCta && (
                  <a href="#traction" className="btn btn-ghost" onClick={go('traction')} data-testid="link-hero-secondary">
                    {c.secondaryCta}
                  </a>
                )}
              </div>
            </Reveal>
          </div>
          <Reveal force delay={200} className="hero-visual">
            <HeroVideo poster={storageUrl(c.heroImagePath) ?? undefined} />
          </Reveal>
        </div>
        <div className="hero-fade" />
      </section>

      <section className="proof" id="proof">
        <div className="wrap">
          <Reveal force={preview}>
            <div className="section-head">
              <h2 data-testid="text-proof-headline">{c.proofHeadline}</h2>
              <p data-testid="text-proof-description">{c.proofDescription}</p>
            </div>
          </Reveal>
          {c.metrics.length > 0 && (
            <div className="metrics">
              {c.metrics.map((m, i) => (
                <Reveal key={i} force={preview} delay={i * 90}>
                  <div className="metric" data-testid={`card-metric-${i}`}>
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {c.features.length > 0 && feat && (
        <section className="tour" id="tour">
          <div className="wrap">
            <Reveal force={preview}>
              <p className="kicker">Explore the product</p>
            </Reveal>
            <div className="tour-grid">
              <div className="tour-side">
                <div className="tabs" role="tablist" aria-label="Product tour" onKeyDown={onTabKey}>
                  {c.features.map((f, i) => (
                    <button
                      key={i}
                      role="tab"
                      aria-selected={i === tabIndex}
                      tabIndex={i === tabIndex ? 0 : -1}
                      className={`tab ${i === tabIndex ? 'on' : ''}`}
                      onClick={() => setTab(i)}
                      data-testid={`tab-feature-${i}`}
                    >
                      <span className="tab-n">{String(i + 1).padStart(2, '0')}</span>
                      <span className="tab-body">
                        <span className="tab-title">{f.title}</span>
                        <span className="tab-desc">{f.description}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="tour-stage">
                <div key={tabIndex} className="stage-anim">
                  <Frame
                    src={featureImage(feat.imagePath, tabIndex)}
                    alt={feat.title}
                    label={`${c.brandName} / ${feat.title}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <InvestorAnalytics preview={preview} />

      <Roadmap />

      <section className="closing">
        <div className="wrap">
          <Reveal force={preview}>
            <div className="closing-card">
              <Constellation />
              <h2 data-testid="text-closing-title">{c.closingTitle}</h2>
              <p data-testid="text-closing-description">{c.closingDescription}</p>
              {c.closingCta && (
                <a href="#top" className="btn btn-gold" onClick={go('top')} data-testid="link-closing-cta">
                  {c.closingCta}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      </main>

      <SiteFooter brand={c.brandName} preview={preview} />
    </div>
  );
}

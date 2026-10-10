'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StarMark } from './brand-mark';

const LINKS = [
  { href: '/features', label: 'Features' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/faq', label: 'FAQ' },
  { href: '/contact', label: 'Contact' },
];

export function SiteNav({
  brand,
  cta,
  ctaHref = '/contact?interest=demo',
  scrolled = true,
  preview = false,
  extra = [],
}: {
  brand: string;
  cta?: string;
  ctaHref?: string;
  scrolled?: boolean;
  preview?: boolean;
  extra?: { href: string; label: string }[];
}) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(scrolled);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);
  useEffect(() => setSolid(scrolled), [scrolled]);
  useEffect(() => {
    if (preview || scrolled !== true) return;
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [preview, scrolled]);
  const ctaIsAnchor = ctaHref.startsWith('#');
  const Brand = (
    <>
      <StarMark />
      <span>{brand}</span>
    </>
  );
  return (
    <header className={`nav ${solid || open ? 'nav-solid' : ''}`}>
      {path === '/' ? (
        <a href="#top" className="brand" data-testid="link-brand">{Brand}</a>
      ) : (
        <Link href="/" className="brand" data-testid="link-brand">{Brand}</Link>
      )}
      <nav className="nav-links" aria-label="Primary">
        {extra.map((l) => (
          <a key={l.href} href={l.href}>{l.label}</a>
        ))}
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} aria-current={path === l.href ? 'page' : undefined} data-testid={`link-nav-${l.label.toLowerCase()}`}>
            {l.label}
          </Link>
        ))}
      </nav>
      {cta &&
        (ctaIsAnchor ? (
          <a href={ctaHref} className="btn btn-gold btn-sm nav-cta" data-testid="link-nav-cta">{cta}</a>
        ) : (
          <Link href={ctaHref} className="btn btn-gold btn-sm nav-cta" data-testid="link-nav-cta">{cta}</Link>
        ))}
      {!cta && (
        <Link href="/contact?interest=demo" className="btn btn-gold btn-sm nav-cta" data-testid="link-nav-cta">
          Request a demo
        </Link>
      )}
      <button
        type="button"
        className="burger"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
        data-testid="button-menu"
      >
        <span /><span /><span />
      </button>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label="Mobile">
          <Link href="/">Home</Link>
          {extra.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={path === l.href ? 'page' : undefined}>{l.label}</Link>
          ))}
          <Link href="/contact?interest=demo" className="btn btn-gold">Request a demo</Link>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter({ brand, preview = false }: { brand: string; preview?: boolean }) {
  return (
    <footer className="foot site-foot">
      <div className="wrap">
        <div className="foot-cols">
          <div className="foot-about">
            <span className="brand"><StarMark size={22} /><span>{brand}</span></span>
            <p>A clear view of your model teams, quality scans and reports. Designed with UK organisations in mind.</p>
          </div>
          <nav aria-label="Explore">
            <h2>Explore</h2>
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/about">About</Link>
            <Link href="/pricing">Pricing</Link>
          </nav>
          <nav aria-label="Help and legal">
            <h2>Help and legal</h2>
            <Link href="/faq">FAQ</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Website terms</Link>
          </nav>
        </div>
        <div className="foot-row">
          <span>Prices and amounts on this website are shown in GBP (&pound;).</span>
          <img src="/logo.jpeg" alt="Logo" width={40} height={40} style={{ borderRadius: '6px', objectFit: 'cover' }} />
        </div>
      </div>
    </footer>
  );
}

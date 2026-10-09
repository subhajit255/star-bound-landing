import Link from 'next/link';
import type { WebsitePage } from '@workspace/api-client-react';
import { SiteFooter, SiteNav } from './site-chrome';
import { Roadmap } from './roadmap';
import { ContactForm } from './contact-form';
import { storageUrl } from '../lib/media';

function Body({ text }: { text: string }) {
  const paras = text.split(/\n{2,}/).filter((p) => p.trim());
  return (
    <>
      {paras.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

export function PageView({
  page,
  brand,
  updatedAt,
  interest,
}: {
  page: WebsitePage;
  brand: string;
  updatedAt: string;
  interest?: 'demo' | 'pricing' | 'general';
}) {
  const img = storageUrl(page.imagePath);
  const legal = page.slug === 'privacy' || page.slug === 'terms';
  const isFaq = page.slug === 'faq';
  const isContact = page.slug === 'contact';
  const isPricing = page.slug === 'pricing';
  return (
    <>
      <SiteNav brand={brand} />
      <main id="top">
        <section className="pg-hero">
          <div className="hero-glow" />
          <div className="wrap pg-hero-grid">
            <div>
              {page.eyebrow && (
                <span className="eyebrow">
                  <b />
                  {page.eyebrow}
                </span>
              )}
              <h1 data-testid={`text-page-title-${page.slug}`}>{page.title}</h1>
              {page.description && <p className="lead pg-lead">{page.description}</p>}
              {isPricing && (
                <div className="cta-row">
                  <Link href="/contact?interest=pricing" className="btn btn-gold">
                    Ask about pricing
                  </Link>
                </div>
              )}
            </div>
            {img && (
              <div className="pg-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt={page.title} data-testid="img-page" />
              </div>
            )}
          </div>
        </section>

        <div className={`wrap pg-body ${legal ? 'pg-legal' : ''} ${isContact ? 'pg-contact' : ''}`}>
          <div className="pg-sections">
            {isFaq ? (
              <div className="faq" data-testid="list-faq">
                {page.sections.map((s, i) => (
                  <details key={i} className="faq-item" open={i === 0}>
                    <summary>
                      <span>{s.title}</span>
                      <i aria-hidden="true" />
                    </summary>
                    <div className="faq-a">
                      <Body text={s.body} />
                    </div>
                  </details>
                ))}
              </div>
            ) : (
              page.sections.map((s, i) => (
                <section key={i} className={`pg-sec ${legal ? '' : 'pg-card'}`} data-testid={`section-${page.slug}-${i}`}>
                  {!legal && <span className="pg-num">{String(i + 1).padStart(2, '0')}</span>}
                  <h2>{s.title}</h2>
                  <div className="pg-text">
                    <Body text={s.body} />
                  </div>
                </section>
              ))
            )}
            {page.sections.length === 0 && !isContact && <p className="empty">No further details have been published for this page yet.</p>}
            {legal && (
              <p className="pg-updated">
                Last updated {new Date(updatedAt).toLocaleDateString('en-GB', { dateStyle: 'long' })}.
              </p>
            )}
          </div>
          {isContact && (
            <aside className="pg-form">
              <ContactForm initialInterest={interest} />
            </aside>
          )}
        </div>

        {page.slug === 'features' && <Roadmap />}

        {!isContact && !legal && (
          <section className="wrap pg-cta">
            <div className="pg-cta-card">
              <h2>Talk to the {brand} team</h2>
              <Link href="/contact?interest=demo" className="btn btn-gold">
                Request a demo
              </Link>
              <Link href="/contact?interest=general" className="btn btn-ghost">
                Send an enquiry
              </Link>
            </div>
          </section>
        )}
      </main>
      <SiteFooter brand={brand} />
    </>
  );
}

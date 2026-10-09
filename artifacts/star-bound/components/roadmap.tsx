import type { CSSProperties } from 'react';

type Status = 'Planned' | 'Research';

const ITEMS: { title: string; body: string; status: Status; phase: string }[] = [
  { phase: 'Foundations', status: 'Planned', title: 'Core user behaviour analysis', body: 'Understanding how people move through a scan, so the experience can be shaped around real habits rather than guesses.' },
  { phase: 'Foundations', status: 'Planned', title: 'Idempotent scan requests', body: 'Repeating a request, such as after a dropped connection, is intended to return the same result instead of creating duplicates.' },
  { phase: 'Foundations', status: 'Planned', title: 'Sensitive body area blurring', body: 'Intended to blur sensitive areas of an image before it is stored or shown. Design and testing are still ahead.' },
  { phase: 'Plans and access', status: 'Planned', title: 'Subscriptions', body: 'Subscription plans, shown in GBP. No payments are taken through this website today.' },
  { phase: 'Plans and access', status: 'Planned', title: 'Advertisement-supported tier', body: 'A possible lower-cost way in, supported by advertising. Not yet available.' },
  { phase: 'Plans and access', status: 'Planned', title: 'Premium tier', body: 'A premium option with more scans included or free each period. Allowances are not yet decided.' },
  { phase: 'Community', status: 'Planned', title: 'TikTok community beta testing', body: 'Inviting people from our TikTok community to try early versions and help shape them.' },
  { phase: 'Community', status: 'Planned', title: 'User feedback handling', body: 'A clear route for feedback to be gathered, read and acted on.' },
  { phase: 'Exploration', status: 'Research', title: 'Freckle-to-constellation detection', body: 'Research into how freckle patterns could be matched to constellations, including potential patent protection. Patentability requires specialist review; no patent status or outcome is claimed.' },
  { phase: 'Exploration', status: 'Planned', title: 'Scalability', body: 'Preparing for growth with more server capacity and distributed processing.' },
];

export function Roadmap({ heading = 'Product roadmap' }: { heading?: string }) {
  return (
    <section className="rm" id="roadmap" aria-labelledby="rm-title">
      <div className="wrap">
        <p className="kicker">Looking ahead</p>
        <h2 id="rm-title" className="rm-title">{heading}</h2>
        <p className="rm-intro">
          Our vision is to turn freckle patterns into constellations. These priorities are planned or under research, not available app features. Launch dates are not yet confirmed.
        </p>
        <ol className="rm-list">
          {ITEMS.map((it, i) => (
            <li
              key={it.title}
              className={`rm-item ${it.status === 'Research' ? 'rm-research' : ''}`}
              style={{ '--i': i } as CSSProperties}
              data-testid={`roadmap-item-${i}`}
            >
              <span className="rm-node" aria-hidden="true" />
              <div className="rm-card">
                <div className="rm-meta">
                  <span className="rm-phase">{it.phase}</span>
                  <span className="rm-tag">{it.status}</span>
                </div>
                <h3>{it.title}</h3>
                <p>{it.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="rm-note">Website information only. Scanning and payments are not available through this site.</p>
      </div>
    </section>
  );
}

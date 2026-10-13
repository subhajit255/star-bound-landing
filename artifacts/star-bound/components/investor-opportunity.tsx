'use client';

export function InvestorOpportunity() {
  return (
    <section className="opportunity-section" id="opportunity" aria-labelledby="opportunity-heading">
      <div className="opportunity-glow" aria-hidden="true" />

      <div className="wrap">
        <div className="section-head-center">
          <div className="analytics-eyebrow">
            <span className="live-pulse" aria-hidden="true" />
            <span>Market Opportunity &amp; Business Model</span>
          </div>

          <h2 id="opportunity-heading" className="opp-title">
            The $59B Convergence: Identity, Starlight &amp; Vision AI.
          </h2>

          <p className="opp-intro">
            Star Bound turns natural freckle patterns into meaningful celestial identity. By bridging viral social
            aesthetics with proprietary on-device computer vision, we unlock a massive consumer audience with
            high-margin monetization.
          </p>
        </div>

        {/* 3 Market Opportunity Cards */}
        <div className="opp-grid">
          <div className="opp-card">
            <div className="opp-card-badge">TAM: $12.8B</div>
            <div className="opp-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
              </svg>
            </div>
            <h3>Astrology &amp; Personal Identity</h3>
            <p>
              Over 84M monthly active consumers in the US and UK engage with astrology, birth charts, and self-expression apps.
              Star Bound bridges personal biology with celestial mapping to drive organic TikTok virality.
            </p>
            <div className="opp-metric">
              <strong>84M+</strong>
              <span>Target Consumer Reach</span>
            </div>
          </div>

          <div className="opp-card opp-highlight">
            <div className="opp-card-badge gold">TAM: $46.5B</div>
            <div className="opp-icon-circle gold">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12h5" />
                <path d="M17 12h5" />
                <path d="M12 2v5" />
                <path d="M12 17v5" />
                <circle cx="12" cy="12" r="7" />
              </svg>
            </div>
            <h3>Privacy-First Edge Vision AI</h3>
            <p>
              Zero server-side image processing costs. Proprietary on-device neural models map skin coordinates locally,
              guaranteeing 100% user privacy and delivering outstanding 92%+ gross margins on software subscriptions.
            </p>
            <div className="opp-metric">
              <strong>92%+</strong>
              <span>Software Gross Margin</span>
            </div>
          </div>

          <div className="opp-card">
            <div className="opp-card-badge">Commerce Potential</div>
            <div className="opp-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3>Multi-Tier Monetization</h3>
            <p>
              A diversified revenue flywheel combining viral freemium discovery, recurring digital subscriptions, and high-AOV
              custom physical merchandise like laser-engraved sterling silver constellation pendants.
            </p>
            <div className="opp-metric">
              <strong>£14.20</strong>
              <span>Projected Blended ARPU</span>
            </div>
          </div>
        </div>

        {/* The 3-Pillar Business Model Engine */}
        <div className="model-box">
          <div className="model-head">
            <h3>Three-Pronged Monetization Engine</h3>
            <p>Engineered for low customer acquisition costs and high lifetime value.</p>
          </div>

          <div className="model-columns">
            <div className="model-col">
              <div className="col-step">Tier 01</div>
              <h4>Free Viral Tier</h4>
              <ul className="model-list">
                <li>3 free on-device freckle scans</li>
                <li>Single constellation star matching</li>
                <li>Watermarked social export presets</li>
                <li>Engineered for TikTok &amp; IG virality</li>
              </ul>
              <span className="col-tag">Near-Zero Organic CAC</span>
            </div>

            <div className="model-col model-col-pro">
              <div className="col-step">Tier 02</div>
              <h4>Star Bound Plus</h4>
              <div className="col-price">£4.99 <span>/ month</span></div>
              <ul className="model-list">
                <li>Unlimited on-device scans</li>
                <li>Multi-body constellation stitching</li>
                <li>Full astronomical mythos &amp; lore library</li>
                <li>Seasonal skin pattern tracking</li>
              </ul>
              <span className="col-tag gold">Predictable ARR Engine</span>
            </div>

            <div className="model-col">
              <div className="col-step">Tier 03</div>
              <h4>Custom Celestial Goods</h4>
              <div className="col-price">£35 – £85 <span>AOV</span></div>
              <ul className="model-list">
                <li>Laser-engraved silver/gold star pendants</li>
                <li>Archival framed constellation art prints</li>
                <li>Zero-inventory print-on-demand fulfillment</li>
                <li>High gifting &amp; birthday conversion</li>
              </ul>
              <span className="col-tag">High-Margin Commerce</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

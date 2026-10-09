'use client';

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="gate" data-testid="error-page">
      <div className="gate-stars" />
      <div className="gate-card">
        <h1>This page could not load</h1>
        <p>The content service did not respond. Nothing has been lost. Please try again.</p>
        <button className="btn btn-gold" onClick={reset} data-testid="button-retry-page">
          Try again
        </button>
        <a href="/" className="gate-back">Back to the homepage</a>
      </div>
    </div>
  );
}

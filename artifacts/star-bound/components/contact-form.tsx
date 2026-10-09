'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSubmitEnquiry, type EnquiryInput } from '@workspace/api-client-react';

type Interest = EnquiryInput['interest'];
type Errors = Partial<Record<'name' | 'email' | 'company' | 'message' | 'privacyConsent', string>>;

const OPTIONS: { value: Interest; label: string }[] = [
  { value: 'demo', label: 'A product demo' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'general', label: 'Something else' },
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ initialInterest }: { initialInterest?: Interest }) {
  const submit = useSubmitEnquiry();
  const [v, setV] = useState({ name: '', email: '', company: '', message: '', website: '' });
  const [interest, setInterest] = useState<Interest>(initialInterest ?? 'general');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [done, setDone] = useState<string | null>(null);
  const [failure, setFailure] = useState<string | null>(null);

  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));

  function validate(): Errors {
    const e: Errors = {};
    const name = v.name.trim();
    if (name.length < 2) e.name = 'Enter your name (at least 2 characters).';
    else if (name.length > 120) e.name = 'Name must be 120 characters or fewer.';
    const email = v.email.trim();
    if (!EMAIL.test(email) || email.length > 254) e.email = 'Enter a valid email address.';
    if (v.company.trim().length > 180) e.company = 'Company must be 180 characters or fewer.';
    const m = v.message.trim();
    if (m.length < 10) e.message = 'Tell us a little more (at least 10 characters).';
    else if (m.length > 4000) e.message = 'Message must be 4000 characters or fewer.';
    if (!consent) e.privacyConsent = 'Please confirm you have read the privacy policy.';
    return e;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (submit.isPending) return;
    setFailure(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    submit.mutate(
      {
        data: {
          name: v.name.trim(),
          email: v.email.trim(),
          company: v.company.trim(),
          message: v.message.trim(),
          interest,
          privacyConsent: true,
          website: v.website,
        },
      },
      {
        onSuccess: (r) => setDone(r.message),
        onError: (err) => setFailure((err as Error).message || 'Your enquiry could not be sent.'),
      },
    );
  }

  if (done) {
    return (
      <div className="cf-done" role="status" data-testid="status-enquiry-success">
        <h2>Enquiry sent</h2>
        <p>{done}</p>
        <button
          type="button"
          className="btn btn-ghost-dark"
          data-testid="button-enquiry-reset"
          onClick={() => {
            setDone(null);
            setV({ name: '', email: '', company: '', message: '', website: '' });
            setConsent(false);
            submit.reset();
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <span className="cf-err" id={`err-${k}`} role="alert">
        {errors[k]}
      </span>
    ) : null;

  return (
    <form className="cf" onSubmit={onSubmit} noValidate data-testid="form-enquiry">
      <h2>Send an enquiry</h2>
      <div className="cf-two">
        <label className="cf-f">
          <span>Name</span>
          <input name="name" autoComplete="name" value={v.name} maxLength={120} onChange={(e) => set('name', e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'err-name' : undefined} data-testid="input-enquiry-name" />
          {err('name')}
        </label>
        <label className="cf-f">
          <span>Work email</span>
          <input name="email" type="email" autoComplete="email" value={v.email} maxLength={254} onChange={(e) => set('email', e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'err-email' : undefined} data-testid="input-enquiry-email" />
          {err('email')}
        </label>
      </div>
      <label className="cf-f">
        <span>Company <em>optional</em></span>
        <input name="company" autoComplete="organization" value={v.company} maxLength={180} onChange={(e) => set('company', e.target.value)} aria-invalid={!!errors.company} data-testid="input-enquiry-company" />
        {err('company')}
      </label>
      <label className="cf-f">
        <span>I am interested in</span>
        <select value={interest} onChange={(e) => setInterest(e.target.value as Interest)} data-testid="select-enquiry-interest">
          {OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="cf-f">
        <span>Message</span>
        <textarea name="message" rows={6} value={v.message} maxLength={4000} onChange={(e) => set('message', e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? 'err-message' : undefined} data-testid="input-enquiry-message" />
        {err('message')}
      </label>
      <div className="cf-hp" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" name="website" value={v.website} maxLength={200} onChange={(e) => set('website', e.target.value)} data-testid="input-enquiry-website" />
        </label>
      </div>
      <div className="cf-consent">
        <label>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-describedby={errors.privacyConsent ? 'err-privacyConsent' : undefined} data-testid="checkbox-enquiry-consent" />
          <span>
            I have read the <Link href="/privacy" target="_blank" data-testid="link-enquiry-privacy">privacy policy</Link> and agree that Star Bound may use these details to respond to my enquiry.
          </span>
        </label>
        {err('privacyConsent')}
      </div>
      {failure && (
        <div className="cf-fail" role="alert" data-testid="error-enquiry">
          <span>{failure}</span>
        </div>
      )}
      <button type="submit" className="btn btn-gold cf-submit" disabled={submit.isPending} data-testid="button-enquiry-submit">
        {submit.isPending ? 'Sending...' : failure ? 'Try again' : 'Send enquiry'}
      </button>
    </form>
  );
}

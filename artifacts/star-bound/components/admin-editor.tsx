'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetSiteContentQueryKey,
  useUpdateSiteContent,
  type SiteContent,
  type SiteContentInput,
} from '@workspace/api-client-react';
import { ImageField } from './image-field';
import { SiteView, StarMark } from './site-view';
import { PagesEditor } from './pages-editor';
import { EnquiryInbox } from './enquiry-inbox';

type Section = 'hero' | 'proof' | 'features' | 'workflow' | 'closing' | 'preview' | 'pages' | 'enquiries';

const NAV: { id: Section; label: string; hint: string }[] = [
  { id: 'hero', label: 'Hero', hint: 'First impression' },
  { id: 'proof', label: 'Overview and metrics', hint: 'Numbers and context' },
  { id: 'features', label: 'Product tour', hint: 'Tabs and screenshots' },
  { id: 'workflow', label: 'Workflow', hint: 'Step by step' },
  { id: 'closing', label: 'Closing', hint: 'Final call' },
  { id: 'preview', label: 'Live preview', hint: 'Unsaved draft' },
  { id: 'pages', label: 'Additional pages', hint: 'Features, pricing, legal' },
  { id: 'enquiries', label: 'Enquiries', hint: 'Contact form inbox' },
];

function toInput(c: SiteContent): SiteContentInput {
  return {
    brandName: c.brandName,
    heroEyebrow: c.heroEyebrow,
    heroTitle: c.heroTitle,
    heroDescription: c.heroDescription,
    primaryCta: c.primaryCta,
    secondaryCta: c.secondaryCta,
    heroImagePath: c.heroImagePath,
    proofHeadline: c.proofHeadline,
    proofDescription: c.proofDescription,
    metrics: c.metrics.map((m) => ({ value: m.value, label: m.label })),
    features: c.features.map((f) => ({ title: f.title, description: f.description, imagePath: f.imagePath })),
    workflowTitle: c.workflowTitle,
    steps: c.steps.map((s) => ({ title: s.title, description: s.description })),
    closingTitle: c.closingTitle,
    closingDescription: c.closingDescription,
    closingCta: c.closingCta,
  };
}

function Field({
  label,
  value,
  onChange,
  max,
  area,
  testId,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  max: number;
  area?: boolean;
  testId: string;
}) {
  return (
    <label className="field">
      <span className="fl">
        {label}
        <em className={value.length > max * 0.92 ? 'warn' : ''}>
          {value.length}/{max}
        </em>
      </span>
      {area ? (
        <textarea
          rows={3}
          maxLength={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          data-testid={`input-${testId}`}
        />
      ) : (
        <input maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} data-testid={`input-${testId}`} />
      )}
    </label>
  );
}

function move<T>(arr: T[], i: number, d: number): T[] {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const n = [...arr];
  [n[i], n[j]] = [n[j], n[i]];
  return n;
}

function ListHead({ title, count, onAdd, testId }: { title: string; count: number; onAdd: () => void; testId: string }) {
  return (
    <div className="listhead">
      <h3>
        {title} <span>{count}/4</span>
      </h3>
      <button type="button" className="ab ab-soft" disabled={count >= 4} onClick={onAdd} data-testid={`button-add-${testId}`}>
        Add
      </button>
    </div>
  );
}

function ItemTools({
  i,
  len,
  onMove,
  onRemove,
  testId,
}: {
  i: number;
  len: number;
  onMove: (d: number) => void;
  onRemove: () => void;
  testId: string;
}) {
  return (
    <div className="tools">
      <button type="button" className="ab ab-line" disabled={i === 0} onClick={() => onMove(-1)} data-testid={`button-up-${testId}-${i}`}>
        Up
      </button>
      <button type="button" className="ab ab-line" disabled={i === len - 1} onClick={() => onMove(1)} data-testid={`button-down-${testId}-${i}`}>
        Down
      </button>
      <button type="button" className="ab ab-danger" onClick={onRemove} data-testid={`button-delete-${testId}-${i}`}>
        Delete
      </button>
    </div>
  );
}

export function AdminEditor({
  content,
  onLogout,
  userLabel,
}: {
  content: SiteContent;
  onLogout: () => void;
  userLabel: string;
}) {
  const qc = useQueryClient();
  const update = useUpdateSiteContent();
  const [draft, setDraft] = useState<SiteContentInput>(() => toInput(content));
  const savedRef = useRef(JSON.stringify(toInput(content)));
  const [section, setSection] = useState<Section>('hero');
  const [justSaved, setJustSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState(content.updatedAt);

  const dirty = JSON.stringify(draft) !== savedRef.current;

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const set = <K extends keyof SiteContentInput>(k: K, v: SiteContentInput[K]) => {
    setJustSaved(false);
    setDraft((d) => ({ ...d, [k]: v }));
  };

  function save() {
    setSaveError(null);
    const body = JSON.stringify(draft);
    update.mutate(
      { data: draft },
      {
        onSuccess: (res) => {
          savedRef.current = body;
          setUpdatedAt(res.updatedAt);
          setJustSaved(true);
          qc.setQueryData(getGetSiteContentQueryKey(), res);
          void qc.invalidateQueries({ queryKey: getGetSiteContentQueryKey() });
        },
        onError: (e) => setSaveError((e as Error).message || 'The site could not be saved.'),
      },
    );
  }

  const saving = update.isPending;
  const status = saving ? 'Saving...' : saveError ? 'Save failed' : dirty ? 'Unsaved changes' : justSaved ? 'Saved and live' : 'All changes live';
  const tone = saving ? 'busy' : saveError ? 'bad' : dirty ? 'warn' : 'ok';

  return (
    <div className="admin">
      <aside className="side">
        <div className="side-brand">
          <StarMark size={34} />
          <div>
            <strong>Star Bound</strong>
            <small>Website admin</small>
          </div>
        </div>
        <p className="side-label">Page sections</p>
        <nav className="side-nav">
          {NAV.map((n) => (
            <button
              key={n.id}
              className={section === n.id ? 'on' : ''}
              onClick={() => setSection(n.id)}
              data-testid={`nav-${n.id}`}
            >
              <span>{n.label}</span>
              <small>{n.hint}</small>
            </button>
          ))}
        </nav>
        <div className="side-foot">
          <a href="/" className="side-link" data-testid="link-view-site">
            View public site
          </a>
          <div className="who">
            <span className="av">{userLabel.slice(0, 2).toUpperCase()}</span>
            <span className="who-name">{userLabel}</span>
          </div>
          <button className="side-link" onClick={onLogout} data-testid="button-logout">
            Log out
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="top">
          <div>
            <p className="crumb">Website / Content</p>
            <h1>{NAV.find((n) => n.id === section)?.label}</h1>
            <p className="sub">
              Edit the words and images investors see. Last published{' '}
              {new Date(updatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}.
            </p>
          </div>
          {section !== 'pages' && section !== 'enquiries' && <div className="top-actions">
            <span className={`chip chip-${tone}`} role="status" data-testid="status-save">
              <i /> {status}
            </span>
            <button className="ab ab-primary" disabled={!dirty || saving} onClick={save} data-testid="button-save">
              {saving ? 'Saving...' : 'Save and publish'}
            </button>
          </div>}
        </header>

        {saveError && (
          <div className="banner" role="alert" data-testid="error-save">
            <span>{saveError}</span>
            <button className="ab ab-line" onClick={save} data-testid="button-retry-save">
              Retry
            </button>
          </div>
        )}

        <div className="tabsbar">
          {NAV.map((n) => (
            <button key={n.id} className={section === n.id ? 'on' : ''} onClick={() => setSection(n.id)}>
              {n.label}
            </button>
          ))}
        </div>

        {section === 'hero' && (
          <div className="card stack">
            <Field label="Brand name" max={60} value={draft.brandName} onChange={(v) => set('brandName', v)} testId="brand-name" />
            <Field label="Eyebrow" max={100} value={draft.heroEyebrow} onChange={(v) => set('heroEyebrow', v)} testId="hero-eyebrow" />
            <Field label="Headline" max={160} area value={draft.heroTitle} onChange={(v) => set('heroTitle', v)} testId="hero-title" />
            <Field label="Description" max={500} area value={draft.heroDescription} onChange={(v) => set('heroDescription', v)} testId="hero-description" />
            <div className="two">
              <Field label="Primary button" max={60} value={draft.primaryCta} onChange={(v) => set('primaryCta', v)} testId="primary-cta" />
              <Field label="Secondary button" max={60} value={draft.secondaryCta} onChange={(v) => set('secondaryCta', v)} testId="secondary-cta" />
            </div>
            <ImageField
              label="Hero image"
              testId="hero-image"
              value={draft.heroImagePath}
              fallback="/previews/dashboard.png"
              onChange={(p) => set('heroImagePath', p)}
            />
          </div>
        )}

        {section === 'proof' && (
          <>
            <div className="card stack">
              <Field label="Headline" max={160} area value={draft.proofHeadline} onChange={(v) => set('proofHeadline', v)} testId="proof-headline" />
              <Field label="Description" max={500} area value={draft.proofDescription} onChange={(v) => set('proofDescription', v)} testId="proof-description" />
            </div>
            <div className="card stack">
              <ListHead title="Metrics" count={draft.metrics.length} testId="metric" onAdd={() => set('metrics', [...draft.metrics, { value: '', label: '' }])} />
              {draft.metrics.length === 0 && <p className="empty">No metrics. The section shows only the headline.</p>}
              {draft.metrics.map((m, i) => (
                <div className="item" key={i}>
                  <div className="two">
                    <Field label="Value" max={40} value={m.value} onChange={(v) => set('metrics', draft.metrics.map((x, j) => (j === i ? { ...x, value: v } : x)))} testId={`metric-value-${i}`} />
                    <Field label="Label" max={80} value={m.label} onChange={(v) => set('metrics', draft.metrics.map((x, j) => (j === i ? { ...x, label: v } : x)))} testId={`metric-label-${i}`} />
                  </div>
                  <ItemTools i={i} len={draft.metrics.length} testId="metric" onMove={(d) => set('metrics', move(draft.metrics, i, d))} onRemove={() => set('metrics', draft.metrics.filter((_, j) => j !== i))} />
                </div>
              ))}
            </div>
          </>
        )}

        {section === 'features' && (
          <div className="card stack">
            <ListHead title="Tour tabs" count={draft.features.length} testId="feature" onAdd={() => set('features', [...draft.features, { title: '', description: '', imagePath: null }])} />
            {draft.features.length === 0 && <p className="empty">No tour tabs. The product tour section is hidden.</p>}
            {draft.features.map((f, i) => (
              <div className="item" key={i}>
                <Field label={`Tab ${i + 1} title`} max={100} value={f.title} onChange={(v) => set('features', draft.features.map((x, j) => (j === i ? { ...x, title: v } : x)))} testId={`feature-title-${i}`} />
                <Field label="Description" max={320} area value={f.description} onChange={(v) => set('features', draft.features.map((x, j) => (j === i ? { ...x, description: v } : x)))} testId={`feature-description-${i}`} />
                <ImageField
                  label="Screenshot"
                  testId={`feature-image-${i}`}
                  value={f.imagePath}
                  fallback={['/previews/constellations.png', '/previews/dashboard.png', '/previews/reports.png', '/previews/content.png'][i % 4]}
                  onChange={(p) => set('features', draft.features.map((x, j) => (j === i ? { ...x, imagePath: p } : x)))}
                />
                <ItemTools i={i} len={draft.features.length} testId="feature" onMove={(d) => set('features', move(draft.features, i, d))} onRemove={() => set('features', draft.features.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
        )}

        {section === 'workflow' && (
          <div className="card stack">
            <Field label="Section title" max={160} area value={draft.workflowTitle} onChange={(v) => set('workflowTitle', v)} testId="workflow-title" />
            <ListHead title="Steps" count={draft.steps.length} testId="step" onAdd={() => set('steps', [...draft.steps, { title: '', description: '' }])} />
            {draft.steps.length === 0 && <p className="empty">No steps. The workflow section is hidden.</p>}
            {draft.steps.map((s, i) => (
              <div className="item" key={i}>
                <Field label={`Step ${i + 1} title`} max={100} value={s.title} onChange={(v) => set('steps', draft.steps.map((x, j) => (j === i ? { ...x, title: v } : x)))} testId={`step-title-${i}`} />
                <Field label="Description" max={320} area value={s.description} onChange={(v) => set('steps', draft.steps.map((x, j) => (j === i ? { ...x, description: v } : x)))} testId={`step-description-${i}`} />
                <ItemTools i={i} len={draft.steps.length} testId="step" onMove={(d) => set('steps', move(draft.steps, i, d))} onRemove={() => set('steps', draft.steps.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
        )}

        {section === 'closing' && (
          <div className="card stack">
            <Field label="Headline" max={160} area value={draft.closingTitle} onChange={(v) => set('closingTitle', v)} testId="closing-title" />
            <Field label="Description" max={500} area value={draft.closingDescription} onChange={(v) => set('closingDescription', v)} testId="closing-description" />
            <Field label="Button" max={60} value={draft.closingCta} onChange={(v) => set('closingCta', v)} testId="closing-cta" />
          </div>
        )}

        {/* Keep page drafts mounted when switching between admin sections. */}
        <div hidden={section !== 'pages'}><PagesEditor /></div>
        {section === 'enquiries' && <EnquiryInbox />}

        {section === 'preview' && <PreviewPane draft={draft} />}
      </main>
    </div>
  );
}

function PreviewPane({ draft }: { draft: SiteContentInput }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);
  const [h, setH] = useState(3000);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calc = () => setScale(Math.min(1, el.clientWidth / 1280));
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    const inner = innerRef.current;
    const ro2 = inner ? new ResizeObserver(() => setH(inner.offsetHeight)) : null;
    if (inner && ro2) ro2.observe(inner);
    return () => {
      ro.disconnect();
      ro2?.disconnect();
    };
  }, []);

  return (
    <div className="preview" ref={ref} data-testid="panel-preview">
      <div className="preview-note">Draft preview. Changes here are not public until you save.</div>
      <div className="preview-clip" style={{ height: h * scale }}>
        <div ref={innerRef} className="preview-inner" style={{ transform: `scale(${scale})` }}>
          <SiteView content={draft} preview />
        </div>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetWebsitePagesQueryKey,
  useGetWebsitePages,
  useUpdateWebsitePages,
  type WebsitePage,
} from '@workspace/api-client-react';
import { ImageField } from './image-field';

function Fld({ label, value, onChange, max, area, id }: { label: string; value: string; onChange: (v: string) => void; max: number; area?: boolean; id: string }) {
  return (
    <label className="field">
      <span className="fl">
        {label}
        <em className={value.length > max * 0.92 ? 'warn' : ''}>{value.length}/{max}</em>
      </span>
      {area ? (
        <textarea rows={area ? 4 : 1} maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} data-testid={`input-${id}`} />
      ) : (
        <input maxLength={max} value={value} onChange={(e) => onChange(e.target.value)} data-testid={`input-${id}`} />
      )}
    </label>
  );
}

export function PagesEditor() {
  const q = useGetWebsitePages({ query: { queryKey: getGetWebsitePagesQueryKey(), refetchOnWindowFocus: true } });
  if (q.isLoading) return <div className="card"><div className="boot-lines"><span /><span /><span /></div></div>;
  if (q.isError || !q.data) {
    return (
      <div className="banner" role="alert" data-testid="error-pages">
        <span>The additional pages could not load.</span>
        <button className="ab ab-line" onClick={() => q.refetch()} data-testid="button-retry-pages">Retry</button>
      </div>
    );
  }
  return <PagesForm initial={q.data.pages} updatedAt={q.data.updatedAt} />;
}

function PagesForm({ initial, updatedAt }: { initial: WebsitePage[]; updatedAt: string }) {
  const qc = useQueryClient();
  const update = useUpdateWebsitePages();
  const [pages, setPages] = useState<WebsitePage[]>(initial);
  const saved = useRef(JSON.stringify(initial));
  const [idx, setIdx] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stamp, setStamp] = useState(updatedAt);
  const dirty = JSON.stringify(pages) !== saved.current;
  const p = pages[idx];

  useEffect(() => {
    // Fresh server data may update a clean draft, but must not replace edits.
    if (dirty) return;
    saved.current = JSON.stringify(initial);
    setPages(initial);
    setStamp(updatedAt);
  }, [initial, updatedAt, dirty]);

  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const patch = (d: Partial<WebsitePage>) => {
    setMsg(null);
    setPages((a) => a.map((x, i) => (i === idx ? { ...x, ...d } : x)));
  };

  function save() {
    setError(null);
    const body = JSON.stringify(pages);
    update.mutate(
      { data: { pages } },
      {
        onSuccess: (res) => {
          saved.current = body;
          setStamp(res.updatedAt);
          setMsg('Saved and live.');
          qc.setQueryData(getGetWebsitePagesQueryKey(), res);
          void qc.invalidateQueries({ queryKey: getGetWebsitePagesQueryKey() });
        },
        onError: (e) => setError((e as Error).message || 'The pages could not be saved.'),
      },
    );
  }

  const setSection = (i: number, d: Partial<WebsitePage['sections'][number]>) =>
    patch({ sections: p.sections.map((s, j) => (j === i ? { ...s, ...d } : s)) });
  const moveSec = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= p.sections.length) return;
    const n = [...p.sections];
    [n[i], n[j]] = [n[j], n[i]];
    patch({ sections: n });
  };

  return (
    <>
      <div className="pe-bar">
        <p className="sub">Last published {new Date(stamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}.</p>
        <div className="top-actions">
          <span className={`chip chip-${update.isPending ? 'busy' : error ? 'bad' : dirty ? 'warn' : 'ok'}`} role="status" data-testid="status-pages-save">
            <i /> {update.isPending ? 'Saving...' : error ? 'Save failed' : dirty ? 'Unsaved changes' : msg ?? 'All changes live'}
          </span>
          <button className="ab ab-primary" disabled={!dirty || update.isPending} onClick={save} data-testid="button-save-pages">
            {update.isPending ? 'Saving...' : 'Save and publish pages'}
          </button>
        </div>
      </div>
      {error && (
        <div className="banner" role="alert" data-testid="error-save-pages">
          <span>{error}</span>
          <button className="ab ab-line" onClick={save} data-testid="button-retry-save-pages">Retry</button>
        </div>
      )}
      <div className="pe-tabs" role="tablist" aria-label="Pages">
        {pages.map((x, i) => (
          <button key={x.slug} role="tab" aria-selected={i === idx} className={i === idx ? 'on' : ''} onClick={() => setIdx(i)} data-testid={`tab-page-${x.slug}`}>
            /{x.slug}
          </button>
        ))}
      </div>
      <div className="card stack">
        <Fld id="page-eyebrow" label="Eyebrow" max={100} value={p.eyebrow} onChange={(v) => patch({ eyebrow: v })} />
        <Fld id="page-title" label="Title" max={160} area value={p.title} onChange={(v) => patch({ title: v })} />
        <Fld id="page-description" label="Description" max={600} area value={p.description} onChange={(v) => patch({ description: v })} />
        <Fld id="page-seo-title" label="SEO title" max={120} value={p.seoTitle} onChange={(v) => patch({ seoTitle: v })} />
        <Fld id="page-seo-description" label="SEO description" max={200} area value={p.seoDescription} onChange={(v) => patch({ seoDescription: v })} />
        <ImageField key={p.slug} label="Page image" testId={`page-image-${p.slug}`} value={p.imagePath} onChange={(path) => patch({ imagePath: path })} />
      </div>
      <div className="card stack">
        <div className="listhead">
          <h3>Sections <span>{p.sections.length}/12</span></h3>
          <button type="button" className="ab ab-soft" disabled={p.sections.length >= 12} onClick={() => patch({ sections: [...p.sections, { title: '', body: '' }] })} data-testid="button-add-section">
            Add section
          </button>
        </div>
        {p.sections.length === 0 && <p className="empty">No sections on this page.</p>}
        {p.sections.map((s, i) => (
          <div className="item" key={`${p.slug}-${i}`}>
            <Fld id={`section-title-${i}`} label={`Section ${i + 1} title`} max={160} value={s.title} onChange={(v) => setSection(i, { title: v })} />
            <Fld id={`section-body-${i}`} label="Body (blank line starts a new paragraph)" max={8000} area value={s.body} onChange={(v) => setSection(i, { body: v })} />
            <div className="tools">
              <button type="button" className="ab ab-line" disabled={i === 0} onClick={() => moveSec(i, -1)} data-testid={`button-up-section-${i}`}>Up</button>
              <button type="button" className="ab ab-line" disabled={i === p.sections.length - 1} onClick={() => moveSec(i, 1)} data-testid={`button-down-section-${i}`}>Down</button>
              <button type="button" className="ab ab-danger" onClick={() => patch({ sections: p.sections.filter((_, j) => j !== i) })} data-testid={`button-delete-section-${i}`}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

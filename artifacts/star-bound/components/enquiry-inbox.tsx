'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getListEnquiriesQueryKey, useDeleteEnquiry, useListEnquiries, type Enquiry } from '@workspace/api-client-react';

const LABEL = { demo: 'Demo', pricing: 'Pricing', general: 'General' } as const;

export function EnquiryInbox() {
  const qc = useQueryClient();
  const q = useListEnquiries({ query: {
    queryKey: getListEnquiriesQueryKey(), refetchOnWindowFocus: true, refetchInterval: 60_000,
  } });
  const del = useDeleteEnquiry();
  const [confirm, setConfirm] = useState<number | null>(null);
  const [delError, setDelError] = useState<string | null>(null);

  const rows: Enquiry[] = [...(q.data ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  function remove(id: number) {
    setDelError(null);
    del.mutate(
      { id },
      {
        onSuccess: () => {
          setConfirm(null);
          qc.setQueryData<Enquiry[]>(getListEnquiriesQueryKey(), (rows) => rows?.filter((r) => r.id !== id));
          void qc.invalidateQueries({ queryKey: getListEnquiriesQueryKey() });
        },
        onError: (e) => setDelError((e as Error).message || 'The enquiry could not be deleted.'),
      },
    );
  }

  return (
    <div className="inbox">
      <div className="pe-bar">
        <p className="sub">{q.data ? `${rows.length} enquir${rows.length === 1 ? 'y' : 'ies'}, newest first.` : 'Enquiries from the contact form.'}</p>
        <button className="ab ab-line" onClick={() => q.refetch()} disabled={q.isFetching} data-testid="button-refresh-enquiries">
          {q.isFetching ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>
      {delError && <div className="banner" role="alert" data-testid="error-delete-enquiry"><span>{delError}</span></div>}
      {q.isLoading && (
        <div className="card" data-testid="status-enquiries-loading"><div className="boot-lines"><span /><span /><span /></div></div>
      )}
      {q.isError && (
        <div className="banner" role="alert" data-testid="error-enquiries">
          <span>Enquiries could not load.</span>
          <button className="ab ab-line" onClick={() => q.refetch()} data-testid="button-retry-enquiries">Retry</button>
        </div>
      )}
      {q.data && rows.length === 0 && <p className="empty" data-testid="empty-enquiries">No enquiries yet. New messages from the contact page will appear here.</p>}
      {rows.map((r) => (
        <article className="card enq" key={r.id} data-testid={`card-enquiry-${r.id}`}>
          <header>
            <div>
              <h3>{r.name}</h3>
              <p>{r.company ? `${r.company} - ` : ''}{r.email}</p>
            </div>
            <div className="enq-meta">
              <span className="chip chip-busy">{LABEL[r.interest]}</span>
              <time dateTime={r.createdAt}>{new Date(r.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</time>
            </div>
          </header>
          <p className="enq-msg">{r.message}</p>
          <div className="tools">
            <a className="ab ab-primary" href={`mailto:${r.email}?subject=${encodeURIComponent('Your Star Bound enquiry')}`} data-testid={`link-reply-${r.id}`}>Reply by email</a>
            {confirm === r.id ? (
              <>
                <span className="enq-ask">Delete this enquiry and its contact details?</span>
                <button className="ab ab-danger" disabled={del.isPending} onClick={() => remove(r.id)} data-testid={`button-confirm-delete-${r.id}`}>
                  {del.isPending ? 'Deleting...' : 'Yes, delete'}
                </button>
                <button className="ab ab-line" onClick={() => setConfirm(null)} data-testid={`button-cancel-delete-${r.id}`}>Cancel</button>
              </>
            ) : (
              <button className="ab ab-danger" onClick={() => { setDelError(null); setConfirm(r.id); }} data-testid={`button-delete-enquiry-${r.id}`}>Delete</button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

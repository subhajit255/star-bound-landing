'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@workspace/replit-auth-web';
import {
  getGetAdminAccessQueryKey,
  getGetSiteContentQueryKey,
  useGetAdminAccess,
  useGetSiteContent,
  getListEnquiriesQueryKey,
} from '@workspace/api-client-react';
import { AdminEditor } from '../../components/admin-editor';
import { StarMark } from '../../components/site-view';

function Gate({ children, testId }: { children: React.ReactNode; testId: string }) {
  return (
    <div className="gate" data-testid={testId}>
      <div className="gate-stars" />
      <div className="gate-card">
        <StarMark size={44} />
        {children}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  const qc = useQueryClient();
  useEffect(() => {
    // Enquiries contain private contact details; do not retain them across identities.
    return () => { qc.removeQueries({ queryKey: getListEnquiriesQueryKey() }); };
  }, [qc, user?.id]);

  const access = useGetAdminAccess({
    query: { enabled: isAuthenticated, queryKey: getGetAdminAccessQueryKey() },
  });
  const allowed = isAuthenticated && access.data?.allowed === true;
  const content = useGetSiteContent({
    query: { enabled: allowed, queryKey: getGetSiteContentQueryKey() },
  });

  if (isLoading || (isAuthenticated && access.isLoading)) {
    return (
      <Gate testId="status-admin-loading">
        <div className="boot-lines">
          <span />
          <span />
          <span />
        </div>
      </Gate>
    );
  }

  if (!isAuthenticated) {
    return (
      <Gate testId="gate-login">
        <h1>Star Bound website admin</h1>
        <p>Log in to edit the copy and images on the public site. Nothing else in the product is managed here.</p>
        <button className="btn btn-gold" onClick={login} data-testid="button-login">
          Log in
        </button>
        <a href="/" className="gate-back">
          Back to the public site
        </a>
      </Gate>
    );
  }

  if (access.isError) {
    return (
      <Gate testId="error-access">
        <h1>Access could not be checked</h1>
        <p>Something went wrong while confirming your permissions.</p>
        <button className="btn btn-gold" onClick={() => access.refetch()} data-testid="button-retry-access">
          Try again
        </button>
      </Gate>
    );
  }

  if (!allowed) {
    return (
      <Gate testId="gate-denied">
        <h1>No editing access</h1>
        <p data-testid="text-access-message">
          {access.data?.message || 'This account is not allowed to edit the Star Bound website.'}
        </p>
        <button className="btn btn-ghost-dark" onClick={logout} data-testid="button-logout-denied">
          Log out
        </button>
        <a href="/" className="gate-back">
          Back to the public site
        </a>
      </Gate>
    );
  }

  if (content.isLoading) {
    return (
      <Gate testId="status-content-loading">
        <div className="boot-lines">
          <span />
          <span />
          <span />
        </div>
      </Gate>
    );
  }

  if (content.isError || !content.data) {
    return (
      <Gate testId="error-content">
        <h1>Content could not load</h1>
        <button className="btn btn-gold" onClick={() => content.refetch()} data-testid="button-retry-content">
          Try again
        </button>
      </Gate>
    );
  }

  const label = [user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'Admin';

  return <AdminEditor content={content.data} onLogout={logout} userLabel={label} />;
}

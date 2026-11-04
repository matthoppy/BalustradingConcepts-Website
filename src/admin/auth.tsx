/**
 * Who is signed in, and the API to talk to as them.
 *
 * Signing in sends the whole page to GitHub; the API finishes the sign-in,
 * sets an HttpOnly session cookie, and sends the browser back to /admin/auth,
 * which lands on the page that was wanted. With ?mock=1 the dashboard runs
 * on sample data instead, for working on it without a server.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ApiError, MOCK_KEY, createApi } from './api/client';
import { createMockApi } from './api/mock';
import type { AdminApi, Me } from './api/types';

interface AdminContextValue {
  api: AdminApi;
  user: Me | null;
  loading: boolean;
  error: string | null;
  mock: boolean;
  signIn: (returnPath: string) => void;
  signOut: () => Promise<void>;
  /** Read the session again, after the sign-in page lands. */
  recheck: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

/** What went wrong with a sign-in, in words. */
export function signInProblem(code: string | null | undefined, login?: string | null): string {
  const reasons: Record<string, string> = {
    'not-allowed': `That GitHub account (${login || 'unknown'}) is not on the list of people who can use this dashboard.`,
    'github-not-configured': 'The site has no GitHub app configured yet. See docs/ADMIN_DASHBOARD.md.',
    'bad-state': 'The sign-in link had expired or was not ours. Start again from the sign-in button.',
    'token-exchange': 'GitHub did not accept the sign-in. Check the client secret on the Pages project and try again.',
  };
  return reasons[code || ''] || 'Sign-in did not complete. Try again from the sign-in button.';
}

function detectMock(): boolean {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mock') === '1') {
      window.sessionStorage.setItem(MOCK_KEY, '1');
      return true;
    }
    if (params.get('mock') === '0') {
      window.sessionStorage.removeItem(MOCK_KEY);
      return false;
    }
    if (import.meta.env.VITE_ADMIN_MOCK === '1') return true;
    return window.sessionStorage.getItem(MOCK_KEY) === '1';
  } catch {
    return false;
  }
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [mock] = useState(detectMock);
  const api = useMemo(() => (mock ? createMockApi() : createApi()), [mock]);
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  /** Goes up when the sign-in page lands, so the session is checked again. */
  const [attempt, setAttempt] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .me()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setUser(null);
        if (!(e instanceof ApiError && e.status === 401)) setError(e instanceof Error ? e.message : String(e));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [api, attempt]);

  const signIn = useCallback(
    (returnPath: string) => {
      window.location.href = api.loginUrl(returnPath || location.pathname);
    },
    [api, location.pathname]
  );

  const value: AdminContextValue = {
    api,
    user,
    loading,
    error,
    mock,
    signIn,
    signOut: async () => {
      await api.logout();
      setUser(null);
    },
    recheck: () => setAttempt((n) => n + 1),
  };
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminContextValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin outside AdminProvider');
  return ctx;
}

/** The sign-in's return point: /admin/auth#ok=1&return=… or #error=… */
export function AuthCallback() {
  const navigate = useNavigate();
  const { recheck } = useAdmin();
  const [problem, setProblem] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    if (hash.get('ok') === '1') {
      const back = hash.get('return') || '/admin';
      recheck();
      navigate(back.startsWith('/admin') ? back : '/admin', { replace: true });
      return;
    }
    setProblem(signInProblem(hash.get('error'), hash.get('login')));
  }, [navigate, recheck]);

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      {problem ? (
        <>
          <h1 className="text-xl font-semibold">Could not sign you in</h1>
          <p className="mt-2 text-sm text-muted-foreground">{problem}</p>
          <a href="/admin" className="mt-6 inline-block text-sm font-medium underline underline-offset-4">
            Back to sign in
          </a>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">Signing you in…</p>
      )}
    </div>
  );
}

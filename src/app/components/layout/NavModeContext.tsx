import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type NavMode = 'new' | 'legacy';

const STORAGE_KEY = 'pass-nav-mode';
// A link like `?nav=legacy` (or `?nav=new`) forces that mode on load —
// lets someone share a specific nav state (e.g. "here's what the old nav
// looks like") without it depending on whatever the recipient's own
// localStorage already has set.
const QUERY_PARAM = 'nav';

function readModeFromQuery(): NavMode | null {
  if (typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get(QUERY_PARAM);
  return value === 'new' || value === 'legacy' ? value : null;
}

interface NavModeContextValue {
  mode: NavMode;
  toggle: () => void;
}

const NavModeContext = createContext<NavModeContextValue | null>(null);

/**
 * Lets users switch the whole app's chrome between the new side-nav + top-bar
 * layout and the legacy single top-bar layout — a way to avoid disrupting
 * anyone who prefers the old nav while the new one rolls out. Lives above the
 * router (see App.tsx) so every route's AppShell reads the same value.
 * Persisted to localStorage so navigating away/reloading doesn't silently
 * reset someone back to a layout they'd deliberately switched off.
 *
 * Defaults to "new" for everyone arriving cold. A `?nav=legacy`/`?nav=new`
 * query param overrides that (and whatever's already in localStorage) for
 * shareable links that need to open into a specific state on someone else's
 * browser — once resolved it's written straight into localStorage, so it
 * still sticks after the person clicks anywhere else in the app and the
 * query param itself falls away.
 */
export function NavModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<NavMode>(() => {
    if (typeof window === 'undefined') return 'new';
    return readModeFromQuery() ?? (window.localStorage.getItem(STORAGE_KEY) as NavMode) ?? 'new';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const toggle = () => setMode(m => (m === 'new' ? 'legacy' : 'new'));

  return <NavModeContext.Provider value={{ mode, toggle }}>{children}</NavModeContext.Provider>;
}

export function useNavMode(): NavModeContextValue {
  const ctx = useContext(NavModeContext);
  if (!ctx) throw new Error('useNavMode must be used within NavModeProvider');
  return ctx;
}

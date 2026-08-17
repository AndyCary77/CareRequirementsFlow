import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type Tab = 'outcomes' | 'tasks' | 'visits' | 'caregroups';

interface CareManagementContextType {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  backFn: { fn: () => void } | null;
  registerBack: (fn: () => void) => void;
  clearBack: () => void;
  /**
   * The active tab's "Add X" action, surfaced in the subnav's actions row
   * (alongside Print/Save) rather than inside the tab body — same
   * back-channel as backFn/registerBack, just for the opposite direction:
   * the tab owns the behaviour, the subnav owns where the button lives.
   * Only list views register one; detail views and tabs with nothing to add
   * (Visits, Care Groups) leave it null.
   */
  addFn: { label: string; fn: () => void } | null;
  registerAdd: (label: string, fn: () => void) => void;
  clearAdd: () => void;
  /**
   * The active detail view's "Delete X" action — same back-channel as
   * addFn/registerAdd, just for the opposite view. While a detail view is
   * open, it replaces the subnav's Print/Save entirely rather than sitting
   * alongside them, so a destructive action never reads as just another
   * routine one. Only detail views (Outcome/Task) register one; the list
   * views, Visits, and Care Groups leave it null.
   */
  deleteFn: { label: string; fn: () => void } | null;
  registerDelete: (label: string, fn: () => void) => void;
  clearDelete: () => void;
  /**
   * Ids of CareBridge-drafted outcomes/tasks a reviewer has accepted this
   * session. The underlying data ships with reviewed: false; useCareData
   * overlays this set on top so accepting is interactive without mutating the
   * mock data. Deliberately no bulk "accept all" — same reasoning as the
   * document draft flow, where accepting unread AI content is the risk the
   * review step exists to catch.
   */
  acceptedIds: Set<string>;
  accept: (id: string) => void;
  /** Ids of drafted outcomes/tasks a reviewer has discarded this session. useCareData drops these from the lists entirely, same immutable-mock-data approach as acceptedIds. */
  discardedIds: Set<string>;
  discard: (id: string) => void;
  /**
   * Whether anything in the plan has changed since the last Save — field
   * edits in a detail view (bubbled up via a single onChange on the form's
   * container, same trick either way), accepting/discarding a draft, or
   * deleting a record. Drives the subnav Save button's disabled state; reset
   * to false only when Save is actually clicked, not on navigating between
   * items, since unsaved edits on a different record are still unsaved.
   */
  dirty: boolean;
  setDirty: (dirty: boolean) => void;
}

const CareManagementContext = createContext<CareManagementContextType>({
  activeTab: 'outcomes',
  setActiveTab: () => {},
  backFn: null,
  registerBack: () => {},
  clearBack: () => {},
  addFn: null,
  registerAdd: () => {},
  clearAdd: () => {},
  deleteFn: null,
  registerDelete: () => {},
  clearDelete: () => {},
  acceptedIds: new Set(),
  accept: () => {},
  discardedIds: new Set(),
  discard: () => {},
  dirty: false,
  setDirty: () => {},
});

export function CareManagementProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<Tab>('outcomes');
  const [backFn, setBackFn] = useState<{ fn: () => void } | null>(null);
  const [addFn, setAddFn] = useState<{ label: string; fn: () => void } | null>(null);
  const [deleteFn, setDeleteFn] = useState<{ label: string; fn: () => void } | null>(null);
  const [acceptedIds, setAcceptedIds] = useState<Set<string>>(new Set());
  const [discardedIds, setDiscardedIds] = useState<Set<string>>(new Set());
  const [dirty, setDirty] = useState(false);

  const registerBack = useCallback((fn: () => void) => setBackFn({ fn }), []);
  const clearBack = useCallback(() => setBackFn(null), []);
  const registerAdd = useCallback((label: string, fn: () => void) => setAddFn({ label, fn }), []);
  const clearAdd = useCallback(() => setAddFn(null), []);
  const registerDelete = useCallback((label: string, fn: () => void) => setDeleteFn({ label, fn }), []);
  const clearDelete = useCallback(() => setDeleteFn(null), []);
  const accept = useCallback((id: string) => {
    setAcceptedIds(prev => new Set(prev).add(id));
    setDirty(true);
  }, []);
  const discard = useCallback((id: string) => {
    setDiscardedIds(prev => new Set(prev).add(id));
    setDirty(true);
  }, []);

  const value = useMemo(
    () => ({
      activeTab, setActiveTab, backFn, registerBack, clearBack, addFn, registerAdd, clearAdd,
      deleteFn, registerDelete, clearDelete, acceptedIds, accept, discardedIds, discard, dirty, setDirty,
    }),
    [
      activeTab, backFn, registerBack, clearBack, addFn, registerAdd, clearAdd,
      deleteFn, registerDelete, clearDelete, acceptedIds, accept, discardedIds, discard, dirty,
    ],
  );

  return <CareManagementContext.Provider value={value}>{children}</CareManagementContext.Provider>;
}

export function useCareManagement() {
  return useContext(CareManagementContext);
}

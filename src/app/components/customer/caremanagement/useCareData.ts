import { useMemo } from 'react';
import { useCustomer } from '../../../data/CustomerContext';
import { CARE_DATA, CARE_PLAN_DRAFTS } from './types';
import { useCareManagement } from './CareManagementContext';

const EMPTY = { tasks: [], outcomes: [], visits: [] };

/** Distinct `draftSource` values across a set of records, in first-seen order. */
function dedupeSources(items: { draftSource?: string }[]): string[] {
  const seen = new Set<string>();
  const sources: string[] = [];
  for (const item of items) {
    if (item.draftSource && !seen.has(item.draftSource)) {
      seen.add(item.draftSource);
      sources.push(item.draftSource);
    }
  }
  return sources;
}

/**
 * Returns the current customer's care-plan data. Names are uppercased to match
 * the constants the tabs previously imported directly, so consumers can simply
 * destructure `{ TASKS, OUTCOMES, VISITS }` at the top of a component.
 *
 * Anything the reviewer has accepted this session is overlaid as
 * `reviewed: true`, so the mock data stays immutable while acceptance still
 * behaves interactively. Anything discarded is dropped from the lists
 * entirely — same immutable-mock-data approach, just filtered instead of
 * overlaid, since a discarded suggestion has nothing left to display.
 */
export function useCareData() {
  const customer = useCustomer();
  const { acceptedIds, discardedIds, draftedOutcomesVisible, draftedTasksVisible } = useCareManagement();
  const data = CARE_DATA[customer.id] ?? EMPTY;
  // What CareBridge would draft from this customer's recordings, if anything.
  // It only joins the lists as the "Draft care plan" run reveals it, step by
  // step — before that the plan is genuinely empty.
  const draft = CARE_PLAN_DRAFTS[customer.id];

  return useMemo(() => {
    const applyAccepted = <T extends { id: string; reviewed?: boolean }>(items: T[]): T[] =>
      acceptedIds.size === 0
        ? items
        : items.map(item => (acceptedIds.has(item.id) ? { ...item, reviewed: true } : item));

    const notDiscarded = <T extends { id: string }>(items: T[]): T[] =>
      discardedIds.size === 0 ? items : items.filter(item => !discardedIds.has(item.id));

    const outcomes = notDiscarded(applyAccepted([
      ...data.outcomes,
      ...(draft && draftedOutcomesVisible ? draft.outcomes : []),
    ]));
    const tasks = notDiscarded(applyAccepted([
      ...data.tasks,
      ...(draft && draftedTasksVisible ? draft.tasks : []),
    ]));
    return {
      TASKS: tasks,
      OUTCOMES: outcomes,
      VISITS: data.visits,
      /** Drafted-but-unaccepted counts, for the draft banner and tab badges. */
      pending: {
        outcomes: outcomes.filter(o => o.reviewed === false).length,
        tasks: tasks.filter(t => t.reviewed === false).length,
      },
      /**
       * The recording(s) these drafts came from, if any are present —
       * deduped, in first-seen order. A plan can be built up from more than
       * one recording (an initial assessment plus a later review, say), each
       * tagging the records it drafted with its own `draftSource`, so this is
       * a list rather than a single string.
       */
      draftSources: dedupeSources([...outcomes, ...tasks]),
      /**
       * A care plan CareBridge could draft from this customer's recordings
       * that nobody has drafted yet — drives the "Draft care plan" offer on
       * the Outcomes/Tasks tabs. Null once the plan has content of its own.
       */
      availableDraft:
        draft && data.outcomes.length === 0 && data.tasks.length === 0
          ? { sources: dedupeSources([...draft.outcomes, ...draft.tasks]), outcomes: draft.outcomes.length, tasks: draft.tasks.length }
          : null,
    };
  }, [data, draft, draftedOutcomesVisible, draftedTasksVisible, acceptedIds, discardedIds]);
}

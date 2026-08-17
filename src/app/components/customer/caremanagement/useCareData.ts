import { useMemo } from 'react';
import { useCustomer } from '../../../data/CustomerContext';
import { CARE_DATA } from './types';
import { useCareManagement } from './CareManagementContext';

const EMPTY = { tasks: [], outcomes: [], visits: [] };

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
  const { acceptedIds, discardedIds } = useCareManagement();
  const data = CARE_DATA[customer.id] ?? EMPTY;

  return useMemo(() => {
    const applyAccepted = <T extends { id: string; reviewed?: boolean }>(items: T[]): T[] =>
      acceptedIds.size === 0
        ? items
        : items.map(item => (acceptedIds.has(item.id) ? { ...item, reviewed: true } : item));

    const notDiscarded = <T extends { id: string }>(items: T[]): T[] =>
      discardedIds.size === 0 ? items : items.filter(item => !discardedIds.has(item.id));

    const outcomes = notDiscarded(applyAccepted(data.outcomes));
    const tasks = notDiscarded(applyAccepted(data.tasks));
    return {
      TASKS: tasks,
      OUTCOMES: outcomes,
      VISITS: data.visits,
      /** Drafted-but-unaccepted counts, for the draft banner and tab badges. */
      pending: {
        outcomes: outcomes.filter(o => o.reviewed === false).length,
        tasks: tasks.filter(t => t.reviewed === false).length,
      },
      /** The recording these drafts came from, if any are present. */
      draftSource: [...outcomes, ...tasks].find(i => i.draftSource)?.draftSource,
    };
  }, [data, acceptedIds, discardedIds]);
}

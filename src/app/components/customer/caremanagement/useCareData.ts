import { useMemo } from 'react';
import { useCustomer } from '../../../data/CustomerContext';
import { getCompletedDocuments } from '../../../data/mock-documents';
import { CARE_DATA, CARE_PLAN_DRAFTS } from './types';
import { useCareManagement } from './CareManagementContext';

const EMPTY = { tasks: [], outcomes: [], visits: [] };

// "It makes sense to do this after enough assessments have been completed" —
// drafting from one lone signed form isn't really enough to summarise a
// plan from, so the offer only appears once there's a reasonable amount of
// completed assessment paperwork to draw on.
const MIN_COMPLETED_ASSESSMENTS_FOR_DRAFT = 2;

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
  const { acceptedIds, discardedIds, draftedOutcomesVisible, draftedTasksVisible, draftSourceDocuments } = useCareManagement();
  const data = CARE_DATA[customer.id] ?? EMPTY;
  // What CareBridge would draft from this customer's recordings, if anything.
  // It only joins the lists as the "Draft care plan" run reveals it, step by
  // step — before that the plan is genuinely empty.
  const draft = CARE_PLAN_DRAFTS[customer.id];
  const completedAssessments = getCompletedDocuments(customer.id).assessments;

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
       * The document(s)/recording(s) these drafts came from, if any are
       * present — deduped, in first-seen order. Prefers the documents the
       * reviewer actually picked in CarePlanDraftSourcePicker when there is
       * a picked set (so the banner says what was really chosen, for this
       * whole run at once — the picker doesn't do fine-grained per-field
       * sourcing), falling back to each record's own static `draftSource`
       * for a plan drafted the older, recording-based way (e.g. Edith's).
       */
      draftSources: draftSourceDocuments ?? dedupeSources([...outcomes, ...tasks]),
      /**
       * A care plan CareBridge could draft from this customer's completed
       * assessment documents that nobody has drafted yet — drives the
       * "Draft care plan" offer on the Outcomes/Tasks tabs. Null once the
       * plan has content of its own, or until enough assessments are
       * actually complete to draft anything meaningful from.
       */
      availableDraft:
        draft && data.outcomes.length === 0 && data.tasks.length === 0
          && completedAssessments.length >= MIN_COMPLETED_ASSESSMENTS_FOR_DRAFT
          ? {
              sources: draftSourceDocuments ?? dedupeSources([...draft.outcomes, ...draft.tasks]),
              outcomes: draft.outcomes.length,
              tasks: draft.tasks.length,
            }
          : null,
    };
  }, [data, draft, completedAssessments, draftedOutcomesVisible, draftedTasksVisible, draftSourceDocuments, acceptedIds, discardedIds]);
}

import { Eye, Check, Sparkles, X, Trash2 } from 'lucide-react';
import { StarSolidIcon, CalendarSolidIcon, TickSolidIcon, PlusSolidIcon, NutritionSolidIcon, HydrateSolidIcon } from '../../icons/CarePlanIcons';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel,
} from '../../ui/alert-dialog';
import type { TaskCategory } from './types';

export const inputClass = 'w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[rgb(154,38,214)] focus:ring-1 focus:ring-[rgb(154,38,214)]';
export const labelClass = 'block text-sm font-medium text-gray-700 mb-1.5';

export const CATEGORY_CONFIG: Record<TaskCategory, {
  bg: string; text: string; border: string; headerBg: string; circleBg: string; Icon: React.ComponentType<{ className?: string }>;
}> = {
  General:           { bg: 'bg-yellow-50',  text: 'text-yellow-800',  border: 'border-yellow-200', headerBg: 'bg-yellow-50',  circleBg: 'bg-yellow-200',  Icon: TickSolidIcon },
  Nutrition:         { bg: 'bg-[#edf7e9]',  text: 'text-[#2D5F1E]',   border: 'border-[#cce6c3]',  headerBg: 'bg-[#edf7e9]',  circleBg: 'bg-[#d5eccc]',  Icon: NutritionSolidIcon },
  Medications:       { bg: 'bg-red-50',     text: 'text-red-800',     border: 'border-red-200',    headerBg: 'bg-red-50',     circleBg: 'bg-red-200',     Icon: PlusSolidIcon },
  Hydration:         { bg: 'bg-cyan-50',    text: 'text-cyan-800',    border: 'border-cyan-200',   headerBg: 'bg-cyan-50',    circleBg: 'bg-cyan-200',    Icon: HydrateSolidIcon },
  'Outcome Tracking':{ bg: 'bg-orange-50',  text: 'text-orange-800',  border: 'border-orange-200', headerBg: 'bg-orange-50',  circleBg: 'bg-orange-200',  Icon: StarSolidIcon },
  Observations:      { bg: 'bg-purple-50',  text: 'text-purple-800',  border: 'border-purple-200', headerBg: 'bg-purple-50',  circleBg: 'bg-purple-200',  Icon: Eye },
};

export function EmptyTab({ label }: { label: string }) {
  return (
    <div className="bg-white rounded-lg border border-dashed border-gray-300 py-16 text-center">
      <p className="text-sm text-gray-500">No {label} yet</p>
      <p className="text-xs text-gray-400 mt-1">Nothing has been added for this customer.</p>
    </div>
  );
}

/** Accept control for a single drafted record. There is no bulk equivalent by design. */
export function AcceptButton({ onAccept }: { onAccept: () => void }) {
  return (
    <button
      type="button"
      onClick={e => { e.stopPropagation(); onAccept(); }}
      className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors cursor-pointer"
    >
      <Check className="w-3.5 h-3.5" /> Accept
    </button>
  );
}

/**
 * Discard control for a single drafted record, sitting next to Accept.
 * Discarding is permanent (there's no "undo" affordance anywhere else in the
 * plan for it to reappear from) so it goes behind a confirm step rather than
 * firing straight off the click.
 */
export function DiscardButton({ onDiscard, itemLabel }: { onDiscard: () => void; itemLabel: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          onClick={e => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-red-700 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" /> Discard
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={e => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard this {itemLabel}?</AlertDialogTitle>
          <AlertDialogDescription>
            CareBridge suggested this from a recording. Discarding it removes the suggestion for
            good — it won't be added to the care plan, and there's no way to bring it back once
            it's gone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Keep as draft</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDiscard}
            className="rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Discard
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Detail-view delete action. Lives in the subnav's actions row in place of
 * Print/Save while an Outcome or Task is open — a destructive action reads
 * clearer alone than mixed in with routine ones. Applies to any outcome or
 * task, drafted or already live, so the copy stays generic rather than
 * referencing CareBridge the way DiscardButton's does. Confirms first, same
 * reasoning as Discard: nothing else in the plan can bring it back.
 */
export function DeleteButton({ onDelete, itemLabel }: { onDelete: () => void; itemLabel: string }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap font-medium transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-red-500/50 rounded-full h-9 px-5 text-sm border-0 bg-red-50 text-red-700 hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4" />
          Delete {itemLabel}
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this {itemLabel.toLowerCase()}?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes it from the care plan for good — there's no way to bring it back once
            it's gone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="rounded-full bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * Accept/Discard strip for a single drafted record. Docks to whichever edge
 * of its white container borders the rest of the pending content — the
 * bottom of a list card, or the top of the detail/edit panel — so the same
 * "this is still a draft" treatment reads the same in both places instead of
 * the detail view inventing its own separate banner style.
 */
export function DraftActionBar({
  source, itemLabel, onAccept, onDiscard, edge = 'bottom',
}: {
  source?: string;
  itemLabel: string;
  onAccept: () => void;
  onDiscard: () => void;
  edge?: 'top' | 'bottom';
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 px-5 py-3 bg-amber-50 ${
        edge === 'bottom' ? 'border-t border-amber-200' : 'border-b border-amber-200'
      }`}
    >
      <span className="text-xs text-amber-800">
        {source ? `Drafted by CareBridge from ${source}` : 'Drafted by CareBridge'}
      </span>
      <div className="flex items-center gap-4">
        <AcceptButton onAccept={onAccept} />
        <DiscardButton onDiscard={onDiscard} itemLabel={itemLabel} />
      </div>
    </div>
  );
}

/**
 * CareBridge draft banner, shown above the list on each care-plan tab while
 * anything on it is still pending review. Same role as the "CareBridge Draft"
 * banner on a document: says where the content came from and how much is left
 * to review, without implying it's already part of the live plan.
 */
export function CarePlanDraftBanner({
  pendingOutcomes, pendingTasks, source, activeTab,
}: {
  pendingOutcomes: number;
  pendingTasks: number;
  source?: string;
  activeTab: 'outcomes' | 'tasks' | 'visits';
}) {
  const total = pendingOutcomes + pendingTasks;
  if (total === 0) return null;

  const onThisTab = activeTab === 'outcomes' ? pendingOutcomes : activeTab === 'tasks' ? pendingTasks : 0;
  const thisTabLabel = activeTab === 'outcomes' ? 'outcome' : 'task';

  return (
    <div className="rounded-lg border border-purple-200 bg-purple-50 px-4 py-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[rgb(154,38,214)]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-purple-900 flex items-center gap-2 flex-wrap">
            CareBridge draft care plan
            <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
              {total} to review
            </span>
          </p>
          <p className="text-sm text-purple-800 mt-0.5">
            {source
              ? <>Drafted from <strong>{source}</strong> — nothing here is part of the live care plan until you accept it.</>
              : <>Nothing here is part of the live care plan until you accept it.</>}
          </p>
          <p className="text-sm text-purple-800 mt-1.5">
            {pendingOutcomes} outcome{pendingOutcomes === 1 ? '' : 's'} · {pendingTasks} task{pendingTasks === 1 ? '' : 's'}
            {activeTab === 'visits'
              ? ' — visits come from the service agreement in Rostering, so none are drafted here.'
              : onThisTab === 0
                ? ` — none left on this tab.`
                : ` — ${onThisTab} ${thisTabLabel}${onThisTab === 1 ? '' : 's'} on this tab.`}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TaskBadge({ title, category }: { title: string; category: TaskCategory }) {
  const c = CATEGORY_CONFIG[category];
  const { Icon } = c;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border ${c.bg} ${c.text} ${c.border}`}>
      <Icon className="w-3 h-3" />
      {title}
    </span>
  );
}

export function VisitBadge({ title }: { title: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border bg-sky-50 text-sky-800 border-sky-200">
      <CalendarSolidIcon className="w-3 h-3 text-sky-600" />
      {title}
    </span>
  );
}

export function OutcomeBadge({ title }: { title: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-sm font-medium border text-amber-800" style={{ backgroundColor: '#feefdc', borderColor: '#fcd9a8' }}>
      <StarSolidIcon className="w-3 h-3 text-amber-600" />
      {title}
    </span>
  );
}

/**
 * `reviewed === false` means CareBridge drafted this and nobody has accepted
 * it yet — showing "Active" in that state is misleading, since it isn't part
 * of the live plan. Draft takes over the badge entirely rather than sitting
 * alongside it; it becomes a normal Active/Inactive badge the moment it's
 * accepted (reviewed flips to true, see useCareData).
 */
export function ActiveBadge({ status, reviewed }: { status: 'active' | 'inactive'; reviewed?: boolean }) {
  if (reviewed === false) {
    return (
      <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase border border-amber-300 bg-amber-100 text-amber-800">
        Draft
      </span>
    );
  }
  return status === 'active' ? (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded uppercase border"
      style={{ backgroundColor: '#D4EBC3', color: '#2D5F1E', borderColor: '#AFDB98' }}
    >
      Active
    </span>
  ) : (
    <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase border border-gray-300 bg-gray-100 text-gray-500">
      Inactive
    </span>
  );
}

/** Same Draft-overrides-everything rule as ActiveBadge, for the detail-view status control. */
export function StatusToggle({ value, reviewed }: { value: 'active' | 'inactive'; reviewed?: boolean }) {
  if (reviewed === false) {
    return (
      <div className="flex rounded-lg border border-gray-200 overflow-hidden w-full">
        <button className="flex-1 py-2.5 text-sm font-semibold uppercase bg-amber-100 text-amber-800 cursor-default">
          Draft
        </button>
        <button className="flex-1 py-2.5 text-sm font-semibold uppercase bg-white text-gray-300 cursor-default">
          Active
        </button>
        <button className="flex-1 py-2.5 text-sm font-semibold uppercase bg-white text-gray-300 cursor-default">
          Inactive
        </button>
      </div>
    );
  }
  return (
    <div className="flex rounded-lg border border-gray-200 overflow-hidden w-full">
      <button
        className={`flex-1 py-2.5 text-sm font-semibold uppercase transition-colors ${value === 'active' ? '' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
        style={value === 'active' ? { backgroundColor: '#D4EBC3', color: '#2D5F1E' } : undefined}
      >
        Active
      </button>
      <button
        className={`flex-1 py-2.5 text-sm font-semibold uppercase transition-colors ${value === 'inactive' ? 'bg-gray-100 text-gray-500' : 'bg-white text-gray-400 hover:bg-gray-50'}`}
      >
        Inactive
      </button>
    </div>
  );
}

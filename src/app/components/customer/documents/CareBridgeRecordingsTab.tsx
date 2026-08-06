import { Link } from 'react-router';
import { Mic, ChevronRight } from 'lucide-react';
import { useCustomer } from '../../../data/CustomerContext';
import { resolveRecordings } from '../CareBridgePage';
import { TabEmptyState } from '../TabEmptyState';

/**
 * Where every recording/transcript captured for this customer lives — one
 * row per CareBridge recording, styled like the Documents/Assessments list
 * (see DocumentList) but linking through to a duplicate of the transcript +
 * drafted content view (RecordingDocumentPage) so this flow can be demoed
 * without leaving the Documents section for the main CareBridge tab.
 */
export function CareBridgeRecordingsTab() {
  const customer = useCustomer();
  const recordings = resolveRecordings(customer.id);

  if (recordings.length === 0) {
    return <TabEmptyState label="recordings" />;
  }

  return (
    <div className="flex flex-col">
      {recordings.map(recording => (
        <Link
          key={recording.id}
          to={`/customers/${customer.id}/documents/recording/${recording.id}`}
          className="group grid grid-cols-[1fr_auto_20px] items-center gap-6 px-4 h-24 hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-transparent hover:border-l-[rgb(154,38,214)] border-b !border-b-gray-200 last:border-b-0"
        >
          {/* Title + subtitle */}
          <div className="flex items-start gap-2.5 min-w-0">
            <span className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <Mic className="w-3.5 h-3.5 text-[rgb(154,38,214)]" />
            </span>
            <div className="flex flex-col min-w-0">
              <span className="flex items-center gap-2">
                <span className="text-gray-900 font-bold text-base leading-snug truncate">
                  {recording.label}
                </span>
                {recording.isNew && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[rgb(154,38,214)] text-white flex-shrink-0">
                    New
                  </span>
                )}
              </span>
              <span className="text-gray-500 text-sm italic mt-0.5 truncate">
                {recording.recordingMeta}
              </span>
            </div>
          </div>

          {/* Focus document */}
          <div className="text-right hidden sm:block">
            <div className="text-gray-500 text-sm">Linked to: {recording.focusDocumentName}</div>
          </div>

          {/* Chevron */}
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[rgb(154,38,214)] transition-colors" />
        </Link>
      ))}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, History, Save, Printer, Trash2, Sparkles } from 'lucide-react';
import { Button } from '../../buttons/Button';
import { useCustomer } from '../../../data/CustomerContext';
import { CarePlanDocumentView } from '../CareBridgePage';
import { DocumentTabs } from './DocumentTabs';

/** The Assessments tab's click-through for "Customer Care and Support Plan" — reuses CareBridge's own Care Plan view. */
export function CarePlanDocumentPage() {
  const navigate = useNavigate();
  const customer = useCustomer();
  // Any edit inside the care plan form (which manages its own field state via
  // CareBridgeContext) bubbles a native change event up to this wrapper —
  // cheaper than threading a dirty flag through every field component.
  const [dirty, setDirty] = useState(false);

  return (
    // Matches the Documents/Assessments list and CustomerDetailsPage's two-column width.
    <div className="flex flex-col gap-4 max-w-[1280px] mx-auto">
      {/* Keeps the sub-nav visible (and "Assessments" active) on this
          click-through, rather than it disappearing once you drill in. */}
      <DocumentTabs activeTab="assessments" onTabChange={tab => navigate(`/customers/${customer.id}/documents?tab=${tab}`)} />

      <div className="flex items-center justify-between">
        <Button
          variant="tertiary"
          icon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(`/customers/${customer.id}/documents?tab=assessments`)}
        >
          Back
        </Button>
        <div className="flex items-center gap-3">
          <Button variant="tertiary" icon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>Print</Button>
          <Button variant="tertiary" icon={<Trash2 className="w-4 h-4" />}>Delete</Button>
          <Button icon={<Save className="w-4 h-4" />} disabled={!dirty} onClick={() => setDirty(false)}>Save</Button>
        </div>
      </div>

      {/* Same purple tint as the "CareBridge Assistant" header inside CareBridgePage. */}
      <div className="flex items-start gap-3 rounded-lg border border-purple-200 bg-purple-50 px-4 py-3">
        <div className="w-7 h-7 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4 text-[rgb(154,38,214)]" />
        </div>
        <div>
          <p className="text-lg font-semibold text-purple-900">CareBridge Draft</p>
          <p className="text-sm text-purple-800 mt-0.5">
            This draft has been generated from a recording — review the fields below and accept them to confirm
            they're correct before they're saved to the customer file.
          </p>
        </div>
      </div>

      <div className="flex items-center px-5 py-4 rounded-lg border border-gray-200 bg-white">
        <h2 className="text-xl font-semibold text-gray-900">Customer Care and Support Plan</h2>
      </div>

      <div>
        <Button variant="tertiary" icon={<History className="w-4 h-4" />}>History</Button>
      </div>

      <div onChange={() => setDirty(true)}>
        <CarePlanDocumentView />
      </div>
    </div>
  );
}

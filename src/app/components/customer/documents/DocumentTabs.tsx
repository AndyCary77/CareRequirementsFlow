import { SubnavTabs } from '../../tabs/SubnavTabs';
import { useCustomer } from '../../../data/CustomerContext';
import { resolveRecordings } from '../CareBridgePage';

interface DocumentTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function DocumentTabs({ activeTab, onTabChange }: DocumentTabsProps) {
  const customer = useCustomer();
  const newRecordingsCount = resolveRecordings(customer.id).filter(r => r.isNew).length;

  const tabs = [
    { id: 'enquiry', label: 'Enquiry' },
    { id: 'carebridge', label: 'Assessment Hero', badge: newRecordingsCount },
    { id: 'assessments', label: 'Assessments' },
    { id: 'documents', label: 'Documents' },
    { id: 'files', label: 'Files' },
  ];

  return (
    <SubnavTabs tabs={tabs} activeTab={activeTab} onChange={onTabChange} className="flex justify-center items-center gap-8" />
  );
}

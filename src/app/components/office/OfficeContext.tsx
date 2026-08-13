import { createContext, useContext, useState } from 'react';
import { MOCK_OFFICE, type OfficeDetails } from './officeMockData';

// Office-level tabs, matching the real tenant's tab bar (see the DOM sample
// supplied when the Tags/Details tabs were built). Only "Tags" and
// "Details" have real content — the rest still just placeholder.
export const OFFICE_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'documents', label: 'Documents' },
  { id: 'files', label: 'Files' },
  { id: 'groups', label: 'Care Groups' },
  { id: 'tags', label: 'Tags' },
  { id: 'roster', label: 'Roster Settings' },
  { id: 'settings', label: 'Settings and Permissions' },
];

interface OfficeContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  office: OfficeDetails;
  updateOffice: <K extends keyof OfficeDetails>(key: K, value: OfficeDetails[K]) => void;
  justSaved: boolean;
  handleSave: () => void;
}

const OfficeContext = createContext<OfficeContextType | null>(null);

/**
 * Lets the pinned OfficeSubnav (tabs + Save button, mounted via AppShell's
 * infoBar) and the page content underneath (TagsManagementPage /
 * OfficeDetailsPage) share the same tab and edit state, rather than the
 * subnav owning tabs and the page owning the form independently — same
 * shape as CareManagementContext/CarePlanDocumentProvider elsewhere in the
 * app, since this is the same "pinned top CTA row drives page content"
 * pattern.
 */
export function OfficeProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('tags');
  const [office, setOffice] = useState<OfficeDetails>(MOCK_OFFICE);
  const [justSaved, setJustSaved] = useState(false);

  const updateOffice = <K extends keyof OfficeDetails>(key: K, value: OfficeDetails[K]) => {
    setOffice(prev => ({ ...prev, [key]: value }));
    setJustSaved(false);
  };

  const handleSave = () => {
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 2500);
  };

  return (
    <OfficeContext.Provider value={{ activeTab, setActiveTab, office, updateOffice, justSaved, handleSave }}>
      {children}
    </OfficeContext.Provider>
  );
}

export function useOffice(): OfficeContextType {
  const ctx = useContext(OfficeContext);
  if (!ctx) throw new Error('useOffice must be used within OfficeProvider');
  return ctx;
}

import { useMemo, useState } from 'react';
import { Search, Tag as TagIcon } from 'lucide-react';
import { SubnavTabs } from '../tabs/SubnavTabs';
import { Button } from '../buttons/Button';
import { TAG_TYPE_GROUPS } from './tagsMockData';
import { TagTypeListItem } from './TagTypeListItem';

// Office-level tabs, matching the real tenant's tab bar (see the DOM sample
// supplied when this page was built). Only "Tags" has real content here —
// this page exists to prototype the Environment tag type banners below, not
// to rebuild the rest of the Office section.
const OFFICE_TABS = [
  { id: 'details', label: 'Details' },
  { id: 'checklists', label: 'Checklists' },
  { id: 'documents', label: 'Documents' },
  { id: 'files', label: 'Files' },
  { id: 'groups', label: 'Care Groups' },
  { id: 'tags', label: 'Tags' },
  { id: 'roster', label: 'Roster Settings' },
  { id: 'settings', label: 'Settings and Permissions' },
];

export function TagsManagementPage() {
  const [activeTab, setActiveTab] = useState('tags');
  const [queryInput, setQueryInput] = useState('');
  const [query, setQuery] = useState('');

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return TAG_TYPE_GROUPS;
    return TAG_TYPE_GROUPS.map(group => ({
      ...group,
      tagTypes: group.tagTypes.filter(
        t => t.name.toLowerCase().includes(q) || t.tags.some(tag => tag.name.toLowerCase().includes(q)),
      ),
    })).filter(group => group.tagTypes.length > 0);
  }, [query]);

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      {/* Breadcrumb — same size as the customer name title in CustomerInfoNav */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Office</h2>
      </div>

      {/* Office tabs */}
      <div className="border-b border-gray-200 mb-6">
        <SubnavTabs tabs={OFFICE_TABS} activeTab={activeTab} onChange={setActiveTab} className="flex justify-center gap-6" />
      </div>

      {activeTab !== 'tags' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 text-sm">
          {OFFICE_TABS.find(t => t.id === activeTab)?.label} — coming soon
        </div>
      ) : (
        <div className="space-y-6">
          {/* Search bar */}
          <form
            onSubmit={e => { e.preventDefault(); setQuery(queryInput); }}
            className="flex items-center gap-2 max-w-md"
          >
            <div className="relative flex-1">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="search"
                placeholder="Enter search terms here"
                value={queryInput}
                onChange={e => setQueryInput(e.target.value)}
                aria-label="Search"
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(154,38,214)] focus:border-transparent text-sm placeholder:text-gray-400"
              />
            </div>
            <Button type="submit" size="sm">Search</Button>
          </form>

          {/* Tags info */}
          <div className="flex items-start gap-4">
            <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <TagIcon className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Tag Types &amp; Tags</h3>
              <p className="text-sm text-gray-500 max-w-3xl">
                Tags can be used to assign custom attributes to your customers and employees. Tag types group your
                tags — once configured, tags will be available within filters throughout PASS to help you target
                and match your customers and employees in ways that suit your delivery of care.
              </p>
            </div>
          </div>

          {/* Tag type groups */}
          {filteredGroups.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400 text-sm">
              No tag types match “{query}”.
            </div>
          ) : (
            filteredGroups.map(group => (
              <div key={group.heading}>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">{group.heading}</h4>
                <ul className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                  {group.tagTypes.map(tagType => (
                    <TagTypeListItem
                      key={tagType.id}
                      tagType={tagType}
                      to={tagType.id === 'environment' ? '/office/tags/environment' : undefined}
                    />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

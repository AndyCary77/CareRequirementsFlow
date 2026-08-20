import type { FormField } from '../CareBridgePage';

// "What Is Important To Me" — content taken from a real example of this
// assessment form. Every field starts blank; WIITM_FIELD_VALUES below is
// what a linked recording drafts in, matching the fields the real example
// actually had answers for — several required fields (the "Communication
// methods" ones) go unanswered even once drafted, same as the source.
export const WIITM_FIELDS_BLANK: FormField[] = [
  { id: 'living_arrangements', label: 'My living arrangements', type: 'text' },
  { id: 'relationships', label: 'Family and important relationships', type: 'text' },
  { id: 'life_routines', label: 'How I like to live my life (routines, habits etc)', type: 'text' },
  { id: 'important_places', label: 'Places and events that are important in my life', type: 'text' },
  { id: 'religious_preferences', label: 'Religious and cultural preferences', type: 'text' },
  { id: 'social_activities', label: 'Social activities, hobbies, things I like to do', type: 'text' },
  { id: 'pets', label: 'Pets (mine and visiting pets)', type: 'text' },
  { id: 'safety_support', label: 'Support I need for my safety and for the safety of those around me', type: 'text' },
  { id: 'concerns', label: 'My concerns or difficulties and the impact that these have upon me', type: 'text' },
  { id: 'other_important_info', label: 'Other important information about me', type: 'text' },
  { id: 'sight_support', label: 'How I would like you to support me', type: 'text' },
  { id: 'hearing_support', label: 'How I would like you to support me', type: 'text' },
  { id: 'body_language_support', label: 'How I would like you to support me', type: 'text' },
  { id: 'orientation_support', label: 'When and how to offer support', type: 'text' },
  { id: 'self_awareness_support', label: 'When and how to offer support', type: 'text' },
  { id: 'memory_support', label: 'When and how to offer support', type: 'text' },
  { id: 'daily_living_support', label: 'When and how to offer support', type: 'text' },
  { id: 'health_treatments_support', label: 'When and how to offer support', type: 'text' },
  { id: 'finances_support', label: 'When and how to offer support', type: 'text' },
  { id: 'othersupport', label: 'When and how to offer support', type: 'text' },
  {
    id: 'allergies_unrelated_to_nhm',
    label: 'Allergies not related to nutrition and hydration or medication. Please refer to medication or nutrition and hydration assessment forms',
    type: 'textarea',
  },
];

// `transcriptIndex` is this field's answer line in EDITH_WIITM_TRANSCRIPT
// (CareBridgePage.tsx) — the question immediately precedes it — so "Check
// transcript" can jump straight to where each value was drafted from.
const WIITM_FIELD_DRAFT_DATA: Record<string, { value: string; transcriptIndex: number }> = {
  living_arrangements: { value: 'I live with my husband and my son.', transcriptIndex: 1 },
  relationships: { value: 'I live with my husband and my son, but I have a daughter who lives elsewhere.', transcriptIndex: 3 },
  life_routines: { value: 'I wake up at about 10:00 a.m. and then I have some breakfast and then I go for a walk, and then I have a little lunch, and then I watch some telly, then I have some dinner, and then I go to sleep.', transcriptIndex: 5 },
  important_places: { value: 'I always celebrate my birthday and for my birthday, I always go to the Air Museum.', transcriptIndex: 7 },
  religious_preferences: { value: "I always was Christian, but in later years I've become a little bit more agnostic. I don't really know anything.", transcriptIndex: 9 },
  social_activities: { value: 'I do bowls and I like to play tennis.', transcriptIndex: 11 },
  pets: { value: "No, I don't like pets. I have allergies.", transcriptIndex: 13 },
  safety_support: { value: "No support really. I have a walking stick, but I don't need any support.", transcriptIndex: 15 },
  concerns: { value: "It's just general ageing really. I just can't move as well as I used to.", transcriptIndex: 17 },
  other_important_info: { value: 'Not really. Just a simple woman.', transcriptIndex: 19 },
  allergies_unrelated_to_nhm: { value: 'I have allergies (in the context of not liking pets).', transcriptIndex: 21 },
};

/** What a linked recording drafts in — same fields, un-reviewed, everything else stays blank. */
export const WIITM_FIELDS_DRAFT: FormField[] = WIITM_FIELDS_BLANK.map(field => {
  const draft = WIITM_FIELD_DRAFT_DATA[field.id];
  if (!draft) return field;
  return { ...field, value: draft.value, reviewed: false, sourceLines: [{ index: draft.transcriptIndex, highlight: draft.value }] };
});

/**
 * Same content as WIITM_FIELDS_DRAFT, but as an already-completed document
 * rather than a pending CareBridge draft — used for Vera, whose WIITM is
 * being shown filled in without the recording/review framing (see the note
 * on her Assessments list entry and Care and Support Plan). `reviewed: true`
 * with no `sourceLines` drops the Check transcript/Accept row entirely,
 * same mechanism as asCompletedDocument in CareBridgePage.tsx.
 */
export const WIITM_FIELDS_COMPLETE: FormField[] = WIITM_FIELDS_BLANK.map(field => {
  const draft = WIITM_FIELD_DRAFT_DATA[field.id];
  if (!draft) return field;
  return { ...field, value: draft.value, reviewed: true };
});

// The page-layout groups this single-section document is actually broken
// into — a heading, an optional sub-heading, and the field(s) (if any) that
// follow it, in source order. FormFieldsView is called once per group with
// fields, so each group with drafted content gets its own "accept all".
export interface WiitmGroup {
  heading?: string;
  subheading?: string;
  fieldIds: string[];
}

export const WIITM_GROUPS: WiitmGroup[] = [
  { heading: 'What is important to me', fieldIds: [] },
  {
    subheading: 'What you need to know and do to respect my lifestyle choices in respect to:',
    fieldIds: [
      'living_arrangements', 'relationships', 'life_routines', 'important_places', 'religious_preferences',
      'social_activities', 'pets', 'safety_support', 'concerns', 'other_important_info',
    ],
  },
  { heading: 'Communication methods', fieldIds: [] },
  { subheading: 'Sight (include glasses and any other aids)', fieldIds: ['sight_support'] },
  { subheading: 'Hearing (include hearing aids, voice levels)', fieldIds: ['hearing_support'] },
  { subheading: 'Body language (include sign language and any other aids)', fieldIds: ['body_language_support'] },
  { heading: 'Support to make my own decisions', fieldIds: [] },
  { subheading: 'Orientation', fieldIds: ['orientation_support'] },
  { subheading: 'Self-awareness', fieldIds: ['self_awareness_support'] },
  { subheading: 'Memory', fieldIds: ['memory_support'] },
  { subheading: 'Daily living (what to wear/eat/do)', fieldIds: ['daily_living_support'] },
  { subheading: 'Health treatments', fieldIds: ['health_treatments_support'] },
  { subheading: 'Finances', fieldIds: ['finances_support'] },
  { subheading: 'Other', fieldIds: ['othersupport'] },
  { fieldIds: ['allergies_unrelated_to_nhm'] },
];

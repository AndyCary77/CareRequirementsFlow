/**
 * Vera Bramwell's demo content is Edith Caldwell's assessment re-skinned —
 * same clinical story (fall, fractured hip, arthritis, lives alone and means
 * to stay that way), told about a different person in a different town with a
 * son rather than a daughter, a different assessor, later dates and a
 * different blood-pressure tablet.
 *
 * Done as a text substitution over Edith's datasets rather than a second
 * hand-written copy: the two need to stay structurally identical (same
 * sections, same transcript line indexes behind every "Check transcript"
 * link, same outcome/task cross-references), and hand-maintaining a parallel
 * copy of several hundred lines of mock prose is how those quietly drift
 * apart. Substitutions are ordered — the specific phrases run before the bare
 * names they contain.
 */
const SUBSTITUTIONS: [RegExp, string][] = [
  // Names. "Susan"/"Alison" run last of their group so possessives
  // ("Susan's") are picked up by the bare-name rule rather than needing
  // their own entry.
  [/Edith/g, 'Vera'],
  [/Caldwell/g, 'Bramwell'],
  [/Susan \(Daughter\)/g, 'Paul (Son)'],
  [/daughter Susan/g, 'son Paul'],
  [/Daughter Susan/g, 'Son Paul'],
  [/Susan/g, 'Paul'],
  [/her daughter/g, 'her son'],
  [/Her daughter/g, 'Her son'],
  [/\bdaughter\b/g, 'son'],
  [/\bDaughter\b/g, 'Son'],
  [/Alison \(Assessor\)/g, 'Bernadette (Assessor)'],
  [/Alison Mercer/g, 'Bernadette Shaw'],
  [/Alison/g, 'Bernadette'],
  [/07712 660145/g, '07845 220918'],
  [/07712 660 145/g, '07845 220 918'],

  // Place — Vera is in Tamworth, so her local office guide leads with it.
  [/Lichfield & Tamworth/g, 'Tamworth & Lichfield'],
  [/Lichfield/g, 'Tamworth'],

  // Small details that make her a distinct person rather than a rename:
  // longer in the house, a different day and venue for the group she wants
  // to get back to, and a different antihypertensive.
  [/thirty years/g, 'forty years'],
  [/Tuesday/g, 'Thursday'],
  [/church hall/g, 'community centre'],
  [/amlodipine/g, 'ramipril'],
  [/Amlodipine/g, 'Ramipril'],

  // Dates — her assessment is a month after Edith's, so the plan it drafts
  // starts a month later too.
  [/7 Jul 2026/g, '4 Aug 2026'],
  [/13\/07\/2026/g, '10/08/2026'],
  [/21 Jul 2026/g, '11 Aug 2026'],
];

export function veraText(text: string): string {
  return SUBSTITUTIONS.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);
}

/**
 * Deep-copies plain data (the mock arrays/objects in types.ts and
 * CareBridgePage.tsx), rewriting every string it contains. Only ever applied
 * to plain JSON-ish data — no React elements, class instances or functions.
 */
export function veraise<T>(value: T): T {
  if (typeof value === 'string') return veraText(value) as unknown as T;
  if (Array.isArray(value)) return value.map(item => veraise(item)) as unknown as T;
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, v]) => [key, veraise(v)])) as T;
  }
  return value;
}

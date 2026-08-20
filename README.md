
  # Enhanced Service Agreement Tagging

  This is a code bundle for Enhanced Service Agreement Tagging. The original project is available at https://www.figma.com/design/3CCNHdq3tzbPiqehsNLARf/Enhanced-Service-Agreement-Tagging.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

## Session changes (2026-08-20)

Summary of interactive edits made during a local dev session:

- Dialog overlay: changed scrim to semi-transparent (`bg-black/40 backdrop-blur-sm`) so background remains visible.
- Checkbox styles: Radix checkbox checked state styled with app purple and white check icon.
- Care Management: added blue info banner above draft stepper; `CarePlanDraftSourcePicker` now starts with no selection.
- Accepted state visuals: `ActiveBadge` shows "Accepted" with a tick and darker green borders for accepted items; outcome/task cards updated.
- Landing page: added link `Care Management — Create Draft from Assessments — Vera Bramwell` and renamed Edith link to `Care Management — Drafted State — Edith Caldwell`.
- Visit start time leeway:
  - Replaced `Earliest start` / `Latest end` inputs with a single `leewayMins` numeric input (5min steps), defaulting to 15 minutes.
  - Summary view now shows `Leeway: X mins (Range: HH:MM — HH:MM)`; shows `(prev day)` / `(next day)` when range crosses midnight.
  - Edit slideout shows updated blue banner and leeway tooltip: "This leeway is used by our automated scheduling features".
  - `Time critical` checkbox sets `leewayMins` to `0` (input remains editable).
- Service Agreement data: added `leewayMins` to sample `VisitData` and wired slideout edits to persist in-memory so the summary updates immediately.
- Rostering anchors: added fragment ids and hash handling for `#care-requirements` and `#service-agreement` so sections are linkable.

Files modified (high-level):
- src/app/components/ui/dialog.tsx
- src/app/components/ui/checkbox.tsx
- src/app/components/customer/caremanagement/shared.tsx
- src/app/components/customer/ServiceAgreementPage.tsx
- src/app/components/customer/VisitEditSlideout.tsx
- src/app/components/LandingPage.tsx
- src/app/components/customer/rostering/RosteringLayout.tsx

If you'd like, I can:

- Commit these changes and open a PR locally.
- Run the dev server and open the affected pages for a visual check.
- Add more detailed notes or screenshots to this README entry.

  
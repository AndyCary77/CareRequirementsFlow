/**
 * Android's system navigation bar — the 3-button variant (back, home,
 * recents). Android only: iOS has no equivalent persistent bar, just the
 * home indicator that shows on the lock screen.
 *
 * This is the structural difference that matters most between the two
 * platforms in this flow. On iOS, back is purely an in-app affair (the
 * header arrow). On Android it's a system-level action that exists on
 * every screen whether the app draws an affordance or not — so the ◁ here
 * is wired to the same handler as the in-app header back, which is what
 * makes "what does back do on this screen?" reviewable rather than
 * theoretical.
 */
export default function SystemNavBar({ onBack }) {
  return (
    <div className="sys-nav">
      <button
        type="button"
        className="sys-nav-btn"
        onClick={onBack}
        disabled={!onBack}
        aria-label="Back"
      >
        {/* Android's back triangle */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 4.5v15a1 1 0 01-1.6.8l-10-7.5a1 1 0 010-1.6l10-7.5a1 1 0 011.6.8z" />
        </svg>
      </button>
      <button type="button" className="sys-nav-btn" aria-label="Home">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      </button>
      <button type="button" className="sys-nav-btn" aria-label="Recent apps">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <rect x="3.5" y="3.5" width="17" height="17" rx="2" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      </button>
    </div>
  )
}

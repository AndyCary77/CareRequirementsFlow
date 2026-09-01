import { usePlatform } from './platform'

/* ── iOS ─────────────────────────────────────────────────────── */

const IosIcons = () => (
  <>
    <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
      <rect x="0" y="4" width="3" height="8" rx="0.5"/>
      <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5"/>
      <rect x="9" y="1" width="3" height="11" rx="0.5"/>
      <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3"/>
    </svg>
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 2.4C10.5 2.4 12.7 3.5 14.2 5.2L15.8 3.4C13.8 1.3 11 0 8 0 5 0 2.2 1.3.2 3.4l1.6 1.8C3.3 3.5 5.5 2.4 8 2.4z" opacity="0.3"/>
      <path d="M8 5C9.7 5 11.2 5.7 12.3 6.8L13.9 5C12.3 3.5 10.3 2.5 8 2.5 5.7 2.5 3.7 3.5 2.1 5l1.6 1.8C4.8 5.7 6.3 5 8 5z"/>
      <circle cx="8" cy="10" r="2"/>
    </svg>
    <svg width="26" height="13" viewBox="0 0 26 13" fill="currentColor">
      <rect x="0.5" y="0.5" width="21" height="12" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.4"/>
      <rect x="1.5" y="1.5" width="19" height="10" rx="2" opacity="0.9"/>
      <path d="M23 4.5v4a2 2 0 000-4z" opacity="0.5"/>
    </svg>
  </>
)

/* ── Android ─────────────────────────────────────────────────── */

// Android puts notification icons immediately right of the clock (iOS has
// no equivalent — notifications never appear in its status bar).
const AndroidNotifIcons = () => (
  <span className="status-notif-icons">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4.2l-8 4.8-8-4.8V6l8 4.8L20 6v2.2z"/>
    </svg>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22a2 2 0 002-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
    </svg>
  </span>
)

const AndroidIcons = () => (
  <>
    {/* Android's signal triangle, wifi fan and upright battery — all
        visually distinct from the iOS set above. */}
    <svg width="15" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 22h20V2L2 22z"/>
    </svg>
    <svg width="15" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21l10.5-13.1A16.6 16.6 0 0012 4C7.9 4 4.2 5.4 1.5 7.9L12 21z"/>
    </svg>
    <svg width="12" height="15" viewBox="0 0 14 22" fill="currentColor">
      <path d="M9 0H5v1.6H3.2A1.2 1.2 0 002 2.8v18A1.2 1.2 0 003.2 22h7.6a1.2 1.2 0 001.2-1.2v-18a1.2 1.2 0 00-1.2-1.2H9V0z"/>
    </svg>
  </>
)

/**
 * `recording` shows Android's green microphone privacy indicator (12+),
 * which the OS displays whenever an app has the mic open. There's no iOS
 * equivalent in this position, so the flag is ignored there — it's a real
 * platform behaviour, not decoration, and it's exactly the kind of thing
 * this flow needs to show since it records in the background.
 */
export default function StatusBar({ recording = false, recordingTime }) {
  const [platform] = usePlatform()
  const android = platform === 'android'
  return (
    <div className="status-bar">
      <span className="status-left">
        <span className="status-time">9:41</span>
        {android && <AndroidNotifIcons />}
      </span>

      {/* The centred hardware cut-out: a hole-punch camera on Android, the
          Dynamic Island on iOS — which additionally carries a compact Live
          Activity while recording. */}
      {android
        ? <span className="status-punch-hole" aria-hidden="true" />
        : (
          <span className={`status-island${recording ? ' status-island--live' : ''}`} aria-hidden="true">
            {recording && (
              <>
                <span className="status-island-dot" />
                <span className="status-island-timer">{recordingTime}</span>
              </>
            )}
          </span>
        )
      }
      <div className="status-icons">
        {android && recording && (
          <span className="status-mic-indicator" title="Microphone in use">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3zm7-3a7 7 0 01-6 6.92V22h-2v-3.08A7 7 0 015 12h2a5 5 0 0010 0h2z"/>
            </svg>
          </span>
        )}
        {android ? <AndroidIcons /> : <IosIcons />}
      </div>
    </div>
  )
}

import { useSyncExternalStore } from 'react'

// Which mobile platform the prototypes are dressed as. PASS ships both an
// iOS and an Android app; the flow itself is identical, but the platform
// chrome around it (status bar, system nav, app-bar alignment, dialogs,
// and — the one genuinely different screen — how a background recording
// surfaces on the lock screen) is not.
//
// The choice lives in localStorage rather than component state because the
// flow spans separate standalone pages (customer-documents → carebridge)
// joined by a real `window.location.href` navigation, so React state and
// context are both wiped in between. localStorage survives that.

const STORAGE_KEY = 'pass-proto-platform'
export const PLATFORMS = ['ios', 'android']
const DEFAULT_PLATFORM = 'ios'

const isValid = (p) => PLATFORMS.includes(p)

/**
 * Current platform. A `?platform=ios|android` query param wins and is
 * persisted, so a link can force a platform and it still sticks as the
 * reviewer moves on through the flow.
 */
export function getPlatform() {
  const fromUrl = new URLSearchParams(window.location.search).get('platform')
  if (isValid(fromUrl)) {
    try { localStorage.setItem(STORAGE_KEY, fromUrl) } catch {}
    return fromUrl
  }
  let stored = null
  try { stored = localStorage.getItem(STORAGE_KEY) } catch {}
  return isValid(stored) ? stored : DEFAULT_PLATFORM
}

// Every usePlatform() consumer re-renders on a switch. Needed because the
// toggle lives in PhoneFrame while the components that branch on markup
// (StatusBar, AppHeader, LockScreen, the dialogs) are scattered elsewhere
// in the tree — without this they'd keep their stale iOS markup until the
// next unrelated render.
const listeners = new Set()
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn) }

export function setPlatform(platform) {
  if (!isValid(platform)) return
  try { localStorage.setItem(STORAGE_KEY, platform) } catch {}
  applyPlatform()
  listeners.forEach(fn => fn())
}

/**
 * Stamps `data-platform` on <html> so android.css can key off it. Call this
 * at the top of each main.jsx, BEFORE ReactDOM renders — doing it in an
 * effect instead would paint the iOS chrome first and visibly flash.
 */
export function applyPlatform() {
  const platform = getPlatform()
  document.documentElement.dataset.platform = platform
  return platform
}

/**
 * For the handful of places where Android needs genuinely different markup
 * rather than different CSS — the status bar, the app-bar spacer, the lock
 * screen, the alert dialogs.
 */
export function usePlatform() {
  const platform = useSyncExternalStore(subscribe, getPlatform)
  return [platform, setPlatform]
}

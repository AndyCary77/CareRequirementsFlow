import { usePlatform, PLATFORMS } from './platform'

const LABELS = { ios: 'iOS', android: 'Android' }

/**
 * Dev-facing segmented control under the phone frame — switches the whole
 * prototype between iOS and Android chrome in place, so the flow only ever
 * needs one set of links. Sits bottom-centre to clear the existing
 * bottom-left "← Prototypes" link. Rendered by PhoneFrame, so every app
 * using it picks the toggle up without touching its own markup.
 */
export default function PlatformToggle() {
  const [platform, setPlatform] = usePlatform()
  return (
    <div className="platform-toggle" role="group" aria-label="Prototype platform">
      {PLATFORMS.map(p => (
        <button
          key={p}
          type="button"
          className={`platform-toggle-btn${platform === p ? ' is-active' : ''}`}
          aria-pressed={platform === p}
          onClick={() => setPlatform(p)}
        >
          {LABELS[p]}
        </button>
      ))}
    </div>
  )
}

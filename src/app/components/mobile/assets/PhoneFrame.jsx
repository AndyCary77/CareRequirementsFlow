import { usePlatform } from './platform'
import PlatformToggle from './PlatformToggle'
import SystemNavBar from './SystemNavBar'

/**
 * The device shell every mobile prototype sits in.
 *
 * `onSystemBack` is Android-only: it wires the system nav bar's ◁ to
 * whatever "back" means on the current screen. Apps that don't pass it
 * still get the bar (it's always present on a real device), just inert.
 */
export default function PhoneFrame({ children, onSystemBack }) {
  const [platform] = usePlatform()
  return (
    <div className="phone-wrap">
      <div className="phone-frame">
        {children}
        {platform === 'android' && <SystemNavBar onBack={onSystemBack} />}
      </div>
      <PlatformToggle />
    </div>
  )
}

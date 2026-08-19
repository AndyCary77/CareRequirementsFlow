import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavMode, type NavMode } from './NavModeContext';
import { useEdgeAwareTooltip } from '../../hooks/useEdgeAwareTooltip';
import './styles/nav-mode-toggle.css';

// Must match the CSS transition duration below — the actual mode switch
// (and the resulting unmount/remount of the whole shell) is deferred until
// after this, so there's something on screen to animate in the meantime.
const SLIDE_MS = 180;

/**
 * A real switch — track + sliding knob — rather than a button whose label
 * changes, so it reads as a setting being flipped rather than an action.
 * Reads as a single feature switch: on/right/coloured while the new nav is
 * active, off/left/grey while on the legacy nav — the ordinary toggle
 * convention, so it doesn't need explaining.
 *
 * `current` is which mode *this* bar represents (TopNav is always "new",
 * the legacy Header is always "legacy"). `variant` picks the colour scheme
 * for whichever bar it's sitting on: "light" for the new top bar's white
 * background, "dark" for the legacy bar's solid purple — which also gets a
 * rounded border around the whole control, setting it apart as its own
 * chip rather than blending into the bar the way the plain "light" one can
 * against its already-white background.
 *
 * Copy avoids "nav"/"UI" jargon in favour of plain, concrete wording — this
 * app's user base is often not especially IT-literate. The legacy side is
 * framed as an invitation ("New!") since for most people this switch is the
 * first they'll even hear of the new layout; the new side is a plain,
 * neutral escape hatch ("Back to classic") rather than a second pitch.
 * "New!" is deliberately terse — feedback that the fuller "Try new look"
 * crowded the legacy bar — the tooltip still carries the fuller
 * explanation. Custom-rendered rather than the native `title`, which has a
 * noticeable show-delay.
 */
export function NavModeToggle({ variant, current }: { variant: 'light' | 'dark'; current: NavMode }) {
  const { toggle } = useNavMode();
  const restingOn = current === 'new';
  // Flips the knob locally first so the slide is actually visible, then
  // triggers the real mode change (which unmounts this whole bar) once
  // the animation has had time to play.
  const [flipping, setFlipping] = useState(false);
  const isOn = flipping ? !restingOn : restingOn;

  const label = current === 'new' ? 'Back to classic' : 'New!';
  const description =
    current === 'new'
      ? 'Go back to the old top navigation'
      : 'Try a new, cleaner side navigation bar';

  const handleClick = () => {
    setFlipping(true);
    window.setTimeout(toggle, SLIDE_MS);
  };

  // Same custom-tooltip approach as the side nav/top bar's own icons —
  // positioned from the trigger's own rect, portaled to <body>, shows
  // instantly instead of waiting on the browser's native title delay.
  // Edge-aware since this control sits at the very end of the bar, right
  // where a naive centered tooltip would run off the screen.
  const { anchor, pos, boxRef, show: showTip, hide: hideTip } = useEdgeAwareTooltip<HTMLButtonElement>();

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={description}
        onClick={() => {
          hideTip();
          handleClick();
        }}
        onMouseEnter={showTip}
        onMouseLeave={hideTip}
        disabled={flipping}
        className={`nav-mode-toggle nav-mode-toggle--${variant}`}
      >
        <span className="nav-mode-toggle-label">{label}</span>
        <span className="nav-mode-toggle-track">
          <span className="nav-mode-toggle-thumb" />
        </span>
      </button>
      {anchor &&
        createPortal(
          <div
            ref={boxRef}
            className="nav-mode-toggle-tooltip"
            style={{
              top: anchor.top,
              left: pos ? pos.left : anchor.center,
              transform: pos ? 'none' : 'translateX(-50%)',
              visibility: pos ? 'visible' : 'hidden',
              ['--arrow-left' as string]: pos ? `${pos.arrowLeft}px` : '50%',
            }}
          >
            {description}
          </div>,
          document.body,
        )}
    </>
  );
}

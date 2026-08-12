import { useLayoutEffect, useRef, useState } from 'react';

// How far the tooltip box must stay from the viewport edge, and how far the
// arrow must stay from either of the box's own rounded corners once the box
// itself has been nudged off-center to avoid clipping.
const EDGE_PADDING = 8;
const ARROW_INSET = 12;

interface Anchor {
  top: number;
  center: number;
}

export interface TooltipPosition {
  top: number;
  /** The box's own left edge, in viewport px — not a center point. */
  left: number;
  /** Where the arrow sits *within* the box, in px from the box's left edge. */
  arrowLeft: number;
}

/**
 * Positions a portaled tooltip below its trigger, horizontally centered —
 * unless that would run it off the right (or left) edge of the screen, in
 * which case the box slides back on-screen while the arrow stays pointing
 * at the trigger. Needed because every "far right of the bar" control
 * (avatar, PASSgenius, the nav-mode switch) is exactly where naive
 * center-under-trigger positioning clips against the viewport edge.
 *
 * Two-phase: on show, the trigger's rect is known immediately, but the
 * tooltip's own rendered width isn't until it's actually in the DOM — so
 * the first render is centered-but-invisible (via `ready: false`), then a
 * layout effect measures the real box and settles on a clamped position.
 */
export function useEdgeAwareTooltip<T extends HTMLElement = HTMLElement>() {
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const [pos, setPos] = useState<TooltipPosition | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const show = (e: React.MouseEvent<T>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setAnchor({ top: Math.round(r.bottom + 8), center: Math.round(r.left + r.width / 2) });
    setPos(null);
  };
  const hide = () => {
    setAnchor(null);
    setPos(null);
  };

  useLayoutEffect(() => {
    if (!anchor || !boxRef.current) return;
    const width = boxRef.current.offsetWidth;
    const maxLeft = Math.max(window.innerWidth - width - EDGE_PADDING, EDGE_PADDING);
    const idealLeft = anchor.center - width / 2;
    const left = Math.min(Math.max(idealLeft, EDGE_PADDING), maxLeft);
    const arrowLeft = Math.min(Math.max(anchor.center - left, ARROW_INSET), Math.max(width - ARROW_INSET, ARROW_INSET));
    setPos({ top: anchor.top, left, arrowLeft });
  }, [anchor]);

  return { anchor, pos, boxRef, show, hide };
}

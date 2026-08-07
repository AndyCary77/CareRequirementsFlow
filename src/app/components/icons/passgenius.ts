/**
 * The PASSgenius mark is embedded via <object> (needs its own document
 * context so its internal <style>/<script> animation runs — see
 * passgenius-purple.svg). That means the parent page can't trigger its
 * hover animation with CSS alone; this dispatches a real mouseenter/
 * mouseleave into the embedded SVG's own document so its existing hover
 * listeners run exactly as they do when hovering the mark directly —
 * lets a wrapping panel forward its own hover into the icon.
 */
export function triggerPassGeniusHover(el: HTMLObjectElement | null, hovering: boolean) {
  const doc = el?.contentDocument ?? (el as (HTMLObjectElement & { getSVGDocument?: () => Document }) | null)?.getSVGDocument?.();
  const svg = doc?.getElementById('animated-logo');
  svg?.dispatchEvent(new MouseEvent(hovering ? 'mouseenter' : 'mouseleave', { bubbles: true }));
}

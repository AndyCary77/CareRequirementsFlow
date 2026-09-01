import { useEffect, useRef } from 'react'

/**
 * A back-handler stack, so Android's system back pops exactly one layer per
 * press instead of collapsing several at once.
 *
 * Deliberately shaped like Android's own OnBackPressedDispatcher: each
 * dismissible layer registers a callback with an `enabled` flag, the
 * dispatcher walks them newest-first, and the first one that handles the
 * press consumes it. Modelling it this way rather than as one big
 * per-screen conditional means a nested sheet doesn't need to know
 * anything about the screen it's sitting on — which is the actual reason
 * the naive version collapsed the drawer and its whole section together.
 */

const handlers = []

/**
 * Runs the topmost registered handler. A handler returning `false` declines
 * the press and lets the next one down try. `fallback` runs only if nothing
 * consumed it — i.e. the app is at its root.
 */
export function handleSystemBack(fallback) {
  for (let i = handlers.length - 1; i >= 0; i--) {
    if (handlers[i]() !== false) return true
  }
  fallback?.()
  return false
}

/**
 * Register `handler` as the back action while `enabled` is true.
 *
 * The handler is held in a ref so an inline arrow function doesn't
 * re-register on every render — only the `enabled` transition pushes or
 * pops, which is what keeps stack order matching the order layers actually
 * opened in.
 */
export function useBackHandler(enabled, handler) {
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!enabled) return
    const fn = () => ref.current()
    handlers.push(fn)
    return () => {
      const i = handlers.indexOf(fn)
      if (i > -1) handlers.splice(i, 1)
    }
  }, [enabled])
}

import { useReducedMotion } from "framer-motion";
import type { Transition, Variants } from "framer-motion";

/**
 * Material 3 Expressive motion.
 * Spatial springs (with bounce) drive position / size / shape changes.
 * Effects springs (no bounce) drive opacity / color changes.
 * Expressed via framer-motion's bounce / visualDuration form.
 */
export const spatial = {
  /** small, snappy spatial changes — chips, tabs, indicators */
  fast: { type: "spring", bounce: 0.4, visualDuration: 0.15 } as Transition,
  /** default expressive spatial — cards, FAB, list items */
  default: { type: "spring", bounce: 0.3, visualDuration: 0.35 } as Transition,
  /** large surfaces — dialogs, sheets, hero (gentle overshoot) */
  slow: { type: "spring", bounce: 0.2, visualDuration: 0.5 } as Transition,
};

export const effects = {
  /** quick opacity / color */
  fast: { type: "spring", bounce: 0, visualDuration: 0.1 } as Transition,
  /** default opacity / color */
  default: { type: "spring", bounce: 0, visualDuration: 0.2 } as Transition,
  /** slow opacity / color fade */
  slow: { type: "spring", bounce: 0, visualDuration: 0.35 } as Transition,
};

/**
 * Backwards-compatible alias object so existing imports keep working.
 * fast → spatial.fast, default/spatial → spatial.default, emphasized → spatial.slow.
 */
export const spring = {
  fast: spatial.fast,
  default: spatial.default,
  spatial: spatial.default,
  emphasized: spatial.slow,
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -2, transition: spatial.default },
  tap: { scale: 0.985, transition: spatial.fast },
};

export const dialogMotion: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: spatial.default },
  exit: { opacity: 0, scale: 0.96, y: 4, transition: effects.fast },
};

export const fabMotion: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: spatial.default },
  tap: { scale: 0.92, transition: spatial.fast },
};

/** spring used by the sliding tab/segmented indicator (shared layoutId) */
export const indicatorSpring = spatial.default;

/** list/grid stagger for cards appearing */
export const listItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: spatial.default },
};

/** press shape-morph — scale + radius squeeze on tap */
export const shapeMorph: Variants = {
  rest: { scale: 1, borderRadius: "var(--radius-lg)" },
  press: {
    scale: 0.97,
    borderRadius: "var(--radius-md)",
    transition: spatial.fast,
  },
};

/**
 * Hook: returns a transition that collapses to an instant when the user
 * prefers reduced motion. Safe for SSR (wraps framer-motion's hook).
 */
export function useMotionTransition(transition: Transition): Transition {
  const reduce = useReducedMotion();
  return reduce ? { duration: 0 } : transition;
}

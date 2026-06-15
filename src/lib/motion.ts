import type { Transition, Variants } from "framer-motion";

/**
 * Material 3 Expressive motion — springy, slightly overshooting curves.
 * Centralized so every component pulls from the same physics.
 */
export const spring = {
  /** fast & snappy — chip / tab selection, small state changes */
  fast: { type: "spring", stiffness: 700, damping: 30, mass: 0.6 } as Transition,
  /** default expressive — card hover/press, FAB */
  default: { type: "spring", stiffness: 450, damping: 28, mass: 0.8 } as Transition,
  /** spatial — dialogs / sheets / larger surfaces (gentle overshoot) */
  spatial: { type: "spring", stiffness: 320, damping: 26, mass: 0.9 } as Transition,
  /** emphasized — FAB morph / hero (more overshoot) */
  emphasized: { type: "spring", stiffness: 280, damping: 22, mass: 1 } as Transition,
};

export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.01, y: -2, transition: spring.default },
  tap: { scale: 0.985, transition: spring.fast },
};

export const dialogMotion: Variants = {
  initial: { opacity: 0, scale: 0.92, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0, transition: spring.spatial },
  exit: { opacity: 0, scale: 0.96, y: 4, transition: { duration: 0.12 } },
};

export const fabMotion: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.05, transition: spring.default },
  tap: { scale: 0.92, transition: spring.fast },
};

/** spring used by the sliding tab/segmented indicator (shared layoutId) */
export const indicatorSpring = spring.fast;

/** list/grid stagger for cards appearing */
export const listItem: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: spring.default },
};

"use client"

import * as React from "react"
import { motion, useReducedMotion } from "framer-motion"

import { cn } from "@/lib/utils"

export interface LoadingIndicatorProps
  extends Omit<React.ComponentProps<"div">, "children"> {
  /** Overall diameter in px. */
  size?: number
}

// M3 Expressive loading indicator: a continuously rotating container holding
// two primary shapes that morph their corner radius and scale on a loop.
// Falls back to a single pulsing dot when reduced motion is requested.
function LoadingIndicator({
  size = 48,
  className,
  style,
  ...props
}: LoadingIndicatorProps) {
  const reduce = useReducedMotion()
  const shape = Math.round(size * 0.62)

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "text-primary relative inline-flex items-center justify-center",
        className
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {reduce ? (
        <span
          className="bg-primary block rounded-full"
          style={{ width: shape, height: shape }}
        />
      ) : (
        <motion.div
          className="relative flex items-center justify-center"
          style={{ width: size, height: size }}
          animate={{ rotate: 360 }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        >
          <motion.span
            className="bg-primary absolute"
            style={{ width: shape, height: shape }}
            animate={{
              borderRadius: ["38%", "50%", "30%", "38%"],
              scale: [1, 0.78, 1, 1],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.42, 1.4, 0.58, 1],
            }}
          />
          <motion.span
            className="bg-primary/35 absolute"
            style={{ width: shape, height: shape }}
            animate={{
              borderRadius: ["50%", "32%", "46%", "50%"],
              scale: [0.7, 1, 0.7, 0.7],
              rotate: [360, 240, 120, 0],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: [0.42, 1.4, 0.58, 1],
            }}
          />
        </motion.div>
      )}
    </div>
  )
}

export { LoadingIndicator }

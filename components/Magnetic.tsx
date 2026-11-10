"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

type MagneticProps = {
  children: React.ReactNode;
  // how far the element follows the pointer, as a share of the pointer's offset
  strength?: number;
  className?: string;
};

// pulls its child toward the pointer and springs back when the pointer leaves
const Magnetic = ({ children, strength = 0.3, className }: MagneticProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 200, damping: 14, mass: 0.4 };
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  const handleMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    // the padding widens the area that attracts the pointer; the negative margin keeps layout unchanged
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("-m-3 inline-block p-3", className)}
    >
      <motion.div style={{ x: springX, y: springY }}>{children}</motion.div>
    </div>
  );
};

export default Magnetic;

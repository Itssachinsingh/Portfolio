"use client";

import { useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

import { cn } from "@/lib/utils";

type TiltCardProps = {
  children: React.ReactNode;
  // maximum tilt in degrees
  max?: number;
  className?: string;
  // match the child's corner radius so the glare doesn't spill past it
  glareClassName?: string;
};

// tilts toward the pointer in 3D, with a highlight that follows it like light on glass
const TiltCard = ({
  children,
  max = 7,
  className,
  glareClassName,
}: TiltCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const spring = { stiffness: 150, damping: 18, mass: 0.5 };
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);
  const glareOpacity = useSpring(0, spring);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(var(--mist) / 0.35), transparent 55%)`;

  const handleMove = (e: React.PointerEvent) => {
    if (reduceMotion || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * max * 2);
    rotateX.set(-(py - 0.5) * max * 2);
    glareX.set(px * 100);
    glareY.set(py * 100);
    glareOpacity.set(1);
  };

  const reset = () => {
    rotateX.set(0);
    rotateY.set(0);
    glareOpacity.set(0);
  };

  return (
    // events live on the untilted wrapper so the moving card can't jitter its own hit area
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      className={cn("[perspective:1000px]", className)}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative"
      >
        {children}
        <motion.div
          aria-hidden="true"
          style={{ background: glare, opacity: glareOpacity }}
          className={cn(
            "pointer-events-none absolute inset-0 mix-blend-soft-light",
            glareClassName
          )}
        />
      </motion.div>
    </div>
  );
};

export default TiltCard;

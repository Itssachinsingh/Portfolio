"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// Elements opt into a label with data-cursor="View"; any link or button just grows the ring.
const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    // touch screens have no cursor, and a trailing cursor is motion some people opt out of
    if (!finePointer || reduceMotion) return;

    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    const pos = { x: -100, y: -100 };
    const ring = { x: -100, y: -100 };
    let shown = false;
    let frame = 0;

    const loop = () => {
      // the dot sticks to the pointer while the ring trails behind it
      ring.x += (pos.x - ring.x) * 0.18;
      ring.y += (pos.y - ring.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`;
      }
      frame = requestAnimationFrame(loop);
    };

    const handleMove = (e: PointerEvent) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!shown) {
        // start the ring on the pointer instead of flying in from the corner
        ring.x = pos.x;
        ring.y = pos.y;
        shown = true;
        setVisible(true);
      }
    };

    const handleOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest(
        "[data-cursor], a, button"
      );
      setHovering(Boolean(target));
      setLabel(target?.getAttribute("data-cursor") || null);
    };

    const handleLeave = () => {
      shown = false;
      setVisible(false);
    };
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerover", handleOver);
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("pointerup", handleUp);
    document.documentElement.addEventListener("pointerleave", handleLeave);
    frame = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className={cn(
            "absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-out",
            hovering
              ? "scale-[1.75] border-signal/70 bg-signal/10"
              : "border-mist/40",
            label && "scale-50 opacity-0",
            pressed && "scale-75"
          )}
        />
        <div
          className={cn(
            "absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-signal px-4 py-2 font-code text-[11px] font-semibold uppercase tracking-wider text-ink shadow-lg shadow-signal/20 transition-all duration-300 ease-out",
            label ? "scale-100 opacity-100" : "scale-50 opacity-0",
            pressed && label && "scale-90"
          )}
        >
          {label}
        </div>
      </div>
      <div ref={dotRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className={cn(
            "h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal transition-opacity duration-200",
            (label || hovering) && "opacity-0"
          )}
        />
      </div>
    </div>
  );
};

export default Cursor;

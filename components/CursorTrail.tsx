"use client";

import { useEffect, useRef, useState } from "react";

import { palette } from "@/lib/themes";

// Gold sparks that peel off the pointer as it moves. The faster the movement, the more
// sparks; each one is flung back along the path, drifts down a little and burns out.

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  size: number;
};

const MAX_SPARKS = 220;
// px of pointer travel per spark, and the most sparks a single move event can spawn
const SPACING = 5;
const MAX_PER_MOVE = 8;
const DRAG = 0.94; // per 16ms frame
const GRAVITY = 0.00035; // px per ms²

const CursorTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (finePointer && !reduceMotion) setEnabled(true);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!enabled || !canvas || !ctx) return;

    const sparks: Spark[] = [];
    const last = { x: 0, y: 0, t: 0, set: false };
    let frame = 0;
    let prevTime = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const draw = (time: number) => {
      const dt = Math.min(time - prevTime, 50);
      prevTime = time;
      const drag = Math.pow(DRAG, dt / 16);

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      const accent = palette.current.signal;

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.age += dt;
        if (s.age >= s.life) {
          sparks.splice(i, 1);
          continue;
        }
        s.vx *= drag;
        s.vy = s.vy * drag + GRAVITY * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const t = s.age / s.life;
        // bright for most of its life, then a quick fade; a little flicker keeps it alive
        const alpha = (1 - t * t) * (0.75 + Math.random() * 0.25);
        const r = s.size * (1 - t * 0.6);
        // white-hot when fresh, settling into the accent colour
        const heat = (1 - t) * 0.65;
        const [hr, hg, hb] = accent.map((c) => Math.round(c + (255 - c) * heat));

        ctx.fillStyle = `rgba(${accent.join(", ")}, ${alpha * 0.18})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r * 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${hr}, ${hg}, ${hb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // stop the loop once every spark has burnt out; the next move restarts it
      frame = sparks.length ? requestAnimationFrame(draw) : 0;
      if (!frame) ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    };

    const handleMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const now = performance.now();
      if (!last.set) {
        Object.assign(last, { x: e.clientX, y: e.clientY, t: now, set: true });
        return;
      }

      const dx = e.clientX - last.x;
      const dy = e.clientY - last.y;
      const dist = Math.hypot(dx, dy);
      const elapsed = Math.max(now - last.t, 8);
      const count = Math.min(MAX_PER_MOVE, Math.floor(dist / SPACING));

      for (let i = 0; i < count && sparks.length < MAX_SPARKS; i++) {
        // spread the sparks along the segment so fast moves leave a continuous trail
        const along = (i + Math.random()) / count;
        const angle = Math.random() * Math.PI * 2;
        const kick = 0.02 + Math.random() * 0.06;
        sparks.push({
          x: last.x + dx * along,
          y: last.y + dy * along,
          vx: (-dx / elapsed) * 0.12 + Math.cos(angle) * kick,
          vy: (-dy / elapsed) * 0.12 + Math.sin(angle) * kick - 0.02,
          age: 0,
          life: 600 + Math.random() * 600,
          size: 1 + Math.random() * 1.6,
        });
      }

      // only advance the anchor once we've used the distance, so slow moves still add up
      if (count > 0) Object.assign(last, { x: e.clientX, y: e.clientY, t: now });

      if (!frame && sparks.length) {
        prevTime = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    const handleLeave = () => {
      last.set = false;
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("resize", resize);
    document.documentElement.addEventListener("pointerleave", handleLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("resize", resize);
      document.documentElement.removeEventListener("pointerleave", handleLeave);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[99] h-full w-full"
    />
  );
};

export default CursorTrail;

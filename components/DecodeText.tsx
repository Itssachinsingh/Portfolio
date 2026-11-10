"use client";

import { Fragment, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789$€£¥₹#%&+=<>/";
// ms between one letter settling and the next
const STAGGER = 32;
// ms every letter spends scrambling before the sweep reaches it
const LEAD = 260;

type DecodeTextProps = {
  text: string;
  // seconds before the sweep starts
  delay?: number;
  className?: string;
  // styles the scrambling glyphs, e.g. a mono font
  glyphClassName?: string;
};

const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

// letters scramble like a terminal readout, then settle left to right
const DecodeText = ({
  text,
  delay = 0,
  className,
  glyphClassName,
}: DecodeTextProps) => {
  // null means settled: render plain text so kerning and selection behave normally
  const [elapsed, setElapsed] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const total = LEAD + text.length * STAGGER;
    let frame = 0;
    let start: number | null = null;

    const tick = (now: number) => {
      if (start === null) start = now + delay * 1000;
      const ms = now - start;
      if (ms > total) {
        setElapsed(null);
        return;
      }
      // quantised so glyphs flicker at ~25fps and React skips the frames in between
      setElapsed(Math.max(0, Math.floor(ms / 40) * 40));
      frame = requestAnimationFrame(tick);
    };

    setElapsed(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, delay, reduceMotion]);

  if (elapsed === null) return <span className={className}>{text}</span>;

  let index = 0;
  const words = text.split(" ");

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={w}>
            {/* keep each word unbreakable so lines don't rewrap mid-animation */}
            <span className="inline-block whitespace-nowrap">
              {Array.from(word).map((char) => {
                const i = index++;
                const settled = elapsed >= LEAD + i * STAGGER;
                return (
                  <span key={i} className="relative inline-block">
                    {/* the real letter holds the space so nothing shifts while glyphs swap */}
                    <span className={settled ? undefined : "opacity-0"}>
                      {char}
                    </span>
                    {!settled && (
                      <span
                        className={cn(
                          "absolute inset-0 flex items-center justify-center",
                          glyphClassName
                        )}
                      >
                        {randomGlyph()}
                      </span>
                    )}
                  </span>
                );
              })}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </span>
  );
};

export default DecodeText;

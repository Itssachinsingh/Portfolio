"use client";

// A palette tab on the left edge. Clicking it slides out a column of swatches;
// it folds away again when the pointer leaves, on Escape, or on a tap elsewhere.

import { useEffect, useRef, useState } from "react";
import { Palette } from "lucide-react";

import { cn } from "@/lib/utils";
import { STORAGE_KEY, THEMES, applyTheme } from "@/lib/themes";

// width of the tab that stays visible while the panel is closed
const TAB_WIDTH = 44;

const ThemeSwitcher = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(THEMES[0].id);

  const choose = (id: string) => {
    const theme = THEMES.find((t) => t.id === id) ?? THEMES[0];
    applyTheme(theme);
    setActive(theme.id);
    try {
      localStorage.setItem(STORAGE_KEY, theme.id);
    } catch {}
  };

  // the boot script in app/layout.tsx already set the saved colours; sync the canvases and the UI
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {}
    const theme = THEMES.find((t) => t.id === saved);
    if (theme) {
      applyTheme(theme);
      setActive(theme.id);
    }
  }, []);

  // touch screens never fire mouseleave, so a tap outside or Escape closes it too
  useEffect(() => {
    if (!open) return;
    const handleDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", handleDown);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const current = THEMES.find((t) => t.id === active) ?? THEMES[0];

  return (
    // below the custom cursor (z-99/100) so the cursor always draws on top, above the nav (z-50)
    <div
      ref={rootRef}
      onMouseLeave={() => setOpen(false)}
      className="fixed left-0 top-1/2 z-[60] flex items-center transition-transform duration-300 ease-out"
      style={{
        transform: `translate(${open ? "0px" : `calc(-100% + ${TAB_WIDTH}px)`}, -50%)`,
      }}
    >
      <div
        id="theme-panel"
        aria-hidden={!open}
        className="flex flex-col items-center gap-2.5 rounded-r-2xl border border-l-0 border-white/10 bg-ink-100/90 px-3 py-4 shadow-2xl backdrop-blur"
      >
        <span className="font-code text-[10px] uppercase tracking-wider text-mist-100">
          {current.name}
        </span>
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            tabIndex={open ? 0 : -1}
            onClick={() => choose(theme.id)}
            aria-label={`Use the ${theme.name} palette`}
            aria-pressed={theme.id === active}
            title={theme.name}
            className={cn(
              "h-7 w-7 shrink-0 rounded-full border-2 transition-transform hover:scale-110",
              theme.id === active ? "scale-110 border-mist" : "border-transparent"
            )}
            style={{
              background: `linear-gradient(135deg, rgb(${theme.signal.join(" ")}) 55%, rgb(${theme.ink[3].join(" ")}) 55%)`,
            }}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="theme-panel"
        aria-label={open ? "Close colour themes" : "Change colour theme"}
        title="Colour theme"
        // pulses while closed so visitors spot it; holds still on hover, when open,
        // and for anyone who has asked their system for reduced motion
        className={cn(
          "-ml-px flex h-11 items-center justify-center rounded-r-xl border border-l-0 border-white/10 bg-ink-100/90 text-signal shadow-xl backdrop-blur transition-colors hover:bg-ink-200",
          !open && "motion-safe:animate-beacon hover:animate-none"
        )}
        style={{ width: TAB_WIDTH }}
      >
        <Palette className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
};

export default ThemeSwitcher;

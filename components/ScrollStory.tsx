"use client";

import { useRef } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";
import RequestMap from "./RequestMap";
import { STAGE_CENTER_Y, TIMELINE } from "./storyTimeline";

const CAPTIONS = [
  {
    range: [0, 0.27],
    title: "The web never sits still.",
    body: "These are simulated requests between cities. Click the map to send one, or scroll to follow a single request.",
  },
  {
    range: [0.27, 0.52],
    title: "A visitor in Dubai opens a page.",
    body: "Their request crosses the world to an API I built.",
  },
  {
    range: [0.56, 1],
    title: "It comes back as an interface.",
    body: "Database, API and UI. I build every layer, end to end.",
  },
];

const DataLayer = () => (
  <pre className="whitespace-pre font-code text-[11px] leading-6 text-mist-200 sm:text-xs">
    <code>
      {"{\n"}
      {"  "}
      <span className="text-mist">&quot;title&quot;</span>:{" "}
      <span className="text-signal-soft">&quot;Pulse&quot;</span>,{"\n"}
      {"  "}
      <span className="text-mist">&quot;stack&quot;</span>: [
      <span className="text-signal-soft">&quot;React&quot;</span>],{"\n"}
      {"  "}
      <span className="text-mist">&quot;live&quot;</span>:{" "}
      <span className="text-signal">true</span>
      {"\n}"}
    </code>
  </pre>
);

const ApiLayer = () => (
  <pre className="whitespace-pre font-code text-[11px] leading-6 text-mist-200 sm:text-xs">
    <code>
      <span className="text-mist">app</span>.<span className="text-signal">get</span>(
      <span className="text-signal-soft">&quot;/projects&quot;</span>, async (_, res) =&gt; {"{\n"}
      {"  "}res.<span className="text-signal">json</span>(await{" "}
      <span className="text-mist">Project</span>.<span className="text-signal">find</span>());
      {"\n});"}
    </code>
  </pre>
);

const InterfaceLayer = () => (
  <div className="rounded-xl border border-white/[0.08] bg-ink-200 p-3">
    <div
      className="h-14 rounded-lg bg-cover bg-top sm:h-20"
      style={{ backgroundImage: "url(/pulse-music.png)" }}
    />
    <div className="mt-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-mist">
          Pulse
        </p>
        <p className="font-code text-[11px] text-mist-200">React</p>
      </div>
      <span className="inline-flex flex-none items-center gap-1 rounded-full bg-signal px-3 py-1 text-xs font-semibold text-ink">
        Open
        <ArrowUpRight className="h-3 w-3" />
      </span>
    </div>
  </div>
);

const LAYERS = [
  {
    id: "data",
    label: "Database",
    tech: "MongoDB",
    content: <DataLayer />,
    from: { x: -260, y: 140, rotate: -10 },
  },
  {
    id: "api",
    label: "API",
    tech: "Express",
    content: <ApiLayer />,
    from: { x: 0, y: 300, rotate: 8 },
  },
  {
    id: "ui",
    label: "Interface",
    tech: "Next.js",
    content: <InterfaceLayer />,
    from: { x: 260, y: 140, rotate: 12 },
  },
];

const LayerCard = ({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) => {
  const layer = LAYERS[index];
  const start = TIMELINE.layers[index];
  const range = [start, start + 0.1];
  const x = useTransform(progress, range, [layer.from.x, 0]);
  const y = useTransform(progress, range, [layer.from.y, 0]);
  const rotate = useTransform(progress, range, [layer.from.rotate, 0]);
  const scale = useTransform(progress, range, [0.85, 1]);
  const opacity = useTransform(progress, [start, start + 0.04], [0, 1]);
  const blur = useTransform(progress, range, [6, 0]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  // the interface card lights up once the response has come back
  const isLast = index === LAYERS.length - 1;
  const highlight = useTransform(progress, [...TIMELINE.settle], [0, 1]);

  return (
    <motion.div
      style={{ x, y, rotate, scale, opacity, filter }}
      className="relative rounded-2xl border border-white/10 bg-ink-100/90 p-4 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-5"
    >
      <div className="mb-3 flex items-center justify-between font-code text-[11px]">
        <span className="uppercase tracking-[0.18em] text-signal">
          0{index + 1} · {layer.label}
        </span>
        <span className="text-mist-200">{layer.tech}</span>
      </div>
      {layer.content}
      {isLast && (
        <motion.div
          style={{ opacity: highlight }}
          className="pointer-events-none absolute -inset-px rounded-2xl ring-2 ring-signal shadow-[0_0_40px_rgb(var(--signal)/0.35)]"
        />
      )}
    </motion.div>
  );
};

// arrows between the cards light up in turn as the response travels back out
const Connector = ({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) => {
  const start = TIMELINE.settle[0] + index * 0.025;
  const lit = useTransform(progress, [start, start + 0.03], [0, 1]);
  // appear only once the last card has landed
  const landed = TIMELINE.layers[LAYERS.length - 1] + 0.08;
  const visible = useTransform(progress, [landed, landed + 0.03], [0, 1]);

  return (
    <div
      className="absolute top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
      style={{ left: `${((index + 1) / LAYERS.length) * 100}%` }}
    >
      <motion.div
        style={{ opacity: visible }}
        className="relative flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-ink-200 text-mist-200"
      >
        <ArrowRight className="h-4 w-4" />
        <motion.div
          style={{ opacity: lit }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-signal text-ink shadow-[0_0_24px_rgb(var(--signal)/0.6)]"
        >
          <ArrowRight className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const Stack = ({ progress }: { progress: MotionValue<number> }) => {
  const [settleStart, settleEnd] = TIMELINE.settle;
  const chipOpacity = useTransform(
    progress,
    [settleStart + 0.04, settleEnd + 0.04],
    [0, 1]
  );
  const chipY = useTransform(
    progress,
    [settleStart + 0.04, settleEnd + 0.04],
    [12, 0]
  );

  return (
    <div
      className="pointer-events-none absolute left-1/2 w-[min(1040px,92vw)] -translate-x-1/2 -translate-y-1/2"
      style={{ top: `${STAGE_CENTER_Y * 100}%` }}
    >
      <div className="relative grid items-stretch gap-3 lg:grid-cols-3 lg:gap-12">
        {LAYERS.map((layer, i) => (
          <LayerCard key={layer.id} index={i} progress={progress} />
        ))}
        {LAYERS.slice(1).map((layer, i) => (
          <Connector key={layer.id} index={i} progress={progress} />
        ))}
      </div>
      <motion.div
        style={{ opacity: chipOpacity, y: chipY }}
        className={cn(
          "absolute -top-4 right-4 flex items-center gap-1.5 rounded-full bg-signal px-3 py-1.5",
          "font-code text-[11px] font-semibold text-ink shadow-lg shadow-signal/30"
        )}
      >
        <Check className="h-3.5 w-3.5" />
        200 OK · rendered
      </motion.div>
    </div>
  );
};

const Caption = ({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) => {
  const caption = CAPTIONS[index];
  const [start, end] = caption.range;
  const first = index === 0;
  const last = index === CAPTIONS.length - 1;
  const input = first
    ? [0, end - 0.04, end]
    : last
    ? [start, start + 0.04, 1]
    : [start, start + 0.04, end - 0.04, end];
  const opacity = useTransform(
    progress,
    input,
    first ? [1, 1, 0] : last ? [0, 1, 1] : [0, 1, 1, 0]
  );
  const y = useTransform(
    progress,
    input,
    first ? [0, 0, -24] : last ? [24, 0, 0] : [24, 0, 0, -24]
  );

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0">
      <p className="font-code text-xs uppercase tracking-[0.2em] text-signal">
        0{index + 1} / 0{CAPTIONS.length}
      </p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-mist sm:text-3xl md:text-4xl">
        {caption.title}
      </h3>
      <p className="mt-3 max-w-md leading-relaxed text-mist-100">
        {caption.body}
      </p>
    </motion.div>
  );
};

const ProgressRail = ({ progress }: { progress: MotionValue<number> }) => (
  <div className="absolute right-8 top-1/2 hidden h-40 w-px -translate-y-1/2 bg-white/10 lg:block">
    <motion.div
      style={{ scaleY: progress }}
      className="h-full w-full origin-top bg-signal"
    />
  </div>
);

// motion-sensitive visitors get the same content as a still map and three short paragraphs
const StaticStory = () => (
  <section id="story" className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
    <RequestMap />
    <ol className="mt-12 grid gap-10 md:grid-cols-3">
      {CAPTIONS.map((caption, i) => (
        <li key={caption.title}>
          <p className="font-code text-xs uppercase tracking-[0.2em] text-signal">
            0{i + 1} / 0{CAPTIONS.length}
          </p>
          <h3 className="mt-3 text-xl font-semibold tracking-tight text-mist">
            {caption.title}
          </h3>
          <p className="mt-2 leading-relaxed text-mist-100">{caption.body}</p>
        </li>
      ))}
    </ol>
  </section>
);

const ScrollStory = () => {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  // a light spring makes the story glide with the scroll instead of stepping with each wheel tick
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    mass: 0.4,
  });

  if (reduceMotion) return <StaticStory />;

  return (
    <section
      ref={ref}
      id="story"
      aria-label="How a web request becomes an interface"
      className="relative h-[340vh]"
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_100%)]">
          <RequestMap progress={progress} className="absolute inset-0 aspect-auto" />
        </div>

        {/* shades the map behind the captions; sits under the cards so it never dims them */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/80 via-ink/30 to-transparent" />

        <Stack progress={progress} />

        <div className="pointer-events-none absolute inset-x-0 bottom-10 mx-auto w-full max-w-6xl px-5 sm:bottom-14 sm:px-8">
          <div className="relative h-44 max-w-xl">
            {CAPTIONS.map((caption, i) => (
              <Caption key={caption.title} index={i} progress={progress} />
            ))}
          </div>
        </div>

        <ProgressRail progress={progress} />
      </div>
    </section>
  );
};

export default ScrollStory;

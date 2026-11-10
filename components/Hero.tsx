import { ArrowRight, Github, Linkedin } from "lucide-react";

import { profile } from "@/data";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import TiltCard from "./TiltCard";
import DecodeText from "./DecodeText";
import { Accent } from "./Primitives";

// shown as a JSON API response, a nod to the kind of work in the headline
const profileFields: [string, string | string[]][] = [
  ["role", profile.role],
  ["focus", ["web apps", "APIs", "interactive UI"]],
  ["stack", ["Next.js", "TypeScript", "Node.js", "MongoDB"]],
  ["location", profile.location],
  ["timezone", profile.timezone],
];

const JsonValue = ({ value }: { value: string | string[] }) => {
  if (typeof value === "string") {
    return <span className="text-signal-soft">&quot;{value}&quot;</span>;
  }

  return (
    <>
      [
      {value.map((item, i) => (
        <span key={item}>
          <span className="text-signal-soft">&quot;{item}&quot;</span>
          {i < value.length - 1 && ", "}
        </span>
      ))}
      ]
    </>
  );
};

const ProfileCard = () => (
  <div className="rounded-2xl border border-white/[0.08] bg-ink-100/80 shadow-2xl shadow-black/50 backdrop-blur-xl">
    <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3 font-code text-xs">
      <span className="flex items-center gap-2">
        <span className="rounded bg-signal/15 px-1.5 py-0.5 font-semibold text-signal">
          GET
        </span>
        <span className="text-mist-100">/api/sachin</span>
      </span>
      <span className="text-signal">200 OK</span>
    </div>
    <pre className="whitespace-pre-wrap break-words p-5 font-code text-[12.5px] leading-7 text-mist-200 sm:text-[13px]">
      <code>
        {"{\n"}
        {/* hanging indent so a wrapped value lines up under its key instead of the left edge */}
        {profileFields.map(([key, value], i) => (
          <span key={key} className="block pl-[4ch] [text-indent:-2ch]">
            <span className="text-mist">&quot;{key}&quot;</span>:{" "}
            <JsonValue value={value} />
            {i < profileFields.length - 1 && ","}
          </span>
        ))}
        {"}"}
      </code>
    </pre>
  </div>
);

const Hero = () => {
  return (
    <section
      id="top"
      className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 md:pt-40 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div>
        <Reveal>
          <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-ink-100/60 px-3 py-1 font-code text-xs text-mist-100 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-signal" />
            {profile.role} · {profile.location}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.04em] text-mist sm:text-6xl lg:text-7xl">
            <DecodeText
              text="I build full-stack web apps that"
              glyphClassName="font-code text-[0.55em] font-normal text-signal"
            />{" "}
            <Accent>
              <DecodeText
                text="feel alive."
                delay={0.45}
                glyphClassName="font-code text-[0.5em] not-italic text-signal-soft"
              />
            </Accent>
          </h1>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-mist-100 sm:text-lg">
            Hi, I&apos;m Sachin. I build web apps end to end: the data model,
            typed APIs and interfaces that feel fast and alive. Next.js and
            TypeScript on the front, Node.js and MongoDB on the back.
          </p>
        </Reveal>

        <Reveal delay={0.24}>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-signal-soft"
              >
                See my work
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#contact"
                className="inline-flex items-center rounded-full border border-white/[0.12] px-6 py-3 text-sm font-semibold text-mist transition-colors hover:border-white/30"
              >
                Get in touch
              </a>
            </Magnetic>
            <div className="flex items-center gap-1 sm:ml-2">
              <Magnetic strength={0.45}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  data-cursor="GitHub"
                  className="block rounded-full p-3 text-mist-100 transition-colors hover:text-signal"
                >
                  <Github className="h-5 w-5" />
                </a>
              </Magnetic>
              <Magnetic strength={0.45}>
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  data-cursor="LinkedIn"
                  className="block rounded-full p-3 text-mist-100 transition-colors hover:text-signal"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.3}>
        <TiltCard glareClassName="rounded-2xl">
          <ProfileCard />
        </TiltCard>
      </Reveal>
    </section>
  );
};

export default Hero;

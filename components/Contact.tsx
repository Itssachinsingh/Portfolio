import { Download, Github, Linkedin, Mail } from "lucide-react";

import { profile } from "@/data";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import CopyEmail from "./CopyEmail";
import { Accent } from "./Primitives";

const Contact = () => {
  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-5 pb-10 pt-20 sm:px-8 md:pt-28"
    >
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-100/80 px-6 py-16 text-center backdrop-blur-sm sm:px-12 md:py-24">
          <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-[36rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/20 blur-3xl" />

          <p className="font-code text-xs uppercase tracking-[0.2em] text-signal">
            05 / Contact
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.035em] text-mist sm:text-5xl md:text-6xl">
            Hiring a full-stack developer?{" "}
            <Accent>Let&apos;s talk.</Accent>
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-mist-100">
            Email me, or grab my resume for the full picture.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic className="max-w-full">
              <a
                href={`mailto:${profile.email}`}
                data-cursor="Email"
                className="inline-flex h-12 max-w-full items-center gap-2 rounded-full bg-signal px-6 text-sm font-semibold text-ink transition-colors hover:bg-signal-soft"
              >
                <Mail className="h-4 w-4 flex-none" />
                <span className="truncate">{profile.email}</span>
              </a>
            </Magnetic>
            <Magnetic strength={0.45}>
              <CopyEmail email={profile.email} />
            </Magnetic>
            <Magnetic>
              <a
                href={profile.resume}
                download="Sachin_Singh_Resume.pdf"
                data-cursor="Download"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/[0.12] px-6 text-sm font-semibold text-mist transition-colors hover:border-white/30"
              >
                <Download className="h-4 w-4" />
                Resume
              </a>
            </Magnetic>
          </div>

          <div className="mt-8 flex justify-center gap-2">
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

      <footer className="mt-10 flex flex-col items-center justify-between gap-2 font-code text-xs text-mist-200 sm:flex-row">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <p>
          {profile.location} · {profile.timezone}
        </p>
      </footer>
    </section>
  );
};

export default Contact;

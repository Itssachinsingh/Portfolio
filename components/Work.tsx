import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { personalProjects, professionalProjects } from "@/data";
import Reveal from "./Reveal";
import Magnetic from "./Magnetic";
import TiltCard from "./TiltCard";
import { Accent, Chips, Container, SectionHeading } from "./Primitives";

type Project = (typeof professionalProjects)[number];
type PersonalProject = (typeof personalProjects)[number];

const BrowserFrame = ({ project }: { project: Project }) => (
  <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-ink-200 shadow-2xl shadow-black/50">
    <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-2.5">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>
      {project.link && (
        <span className="truncate font-code text-[11px] text-mist-200">
          {new URL(project.link).host}
        </span>
      )}
    </div>
    {/* zero width and height let the screenshot keep its own shape instead of being cropped to fit */}
    <Image
      src={project.img}
      alt={`Screenshot of ${project.title}`}
      width={0}
      height={0}
      sizes="(min-width: 1024px) 520px, 100vw"
      className="h-auto w-full"
    />
  </div>
);

const FeaturedCard = ({
  project,
  reverse,
}: {
  project: Project;
  reverse: boolean;
}) => (
  <article className="group grid overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-100/70 backdrop-blur-sm transition-colors duration-300 hover:border-signal/30 lg:grid-cols-2">
    <div className={cn("flex flex-col p-7 sm:p-10", reverse && "lg:order-2")}>
      <p className="font-code text-xs text-signal">{project.label}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-tight text-mist sm:text-3xl">
        {project.title}
      </h3>
      <p className="mt-4 leading-relaxed text-mist-100">{project.summary}</p>
      {project.role && (
        <p className="mt-4 text-sm text-mist-100">
          <span className="text-mist-200">My role: </span>
          {project.role}
        </p>
      )}

      <ul className="mt-6 space-y-3">
        {project.points.map((point) => (
          <li
            key={point}
            className="flex gap-3 text-sm leading-relaxed text-mist-100"
          >
            <span className="mt-2 h-1 w-1 flex-none rounded-full bg-signal" />
            {point}
          </li>
        ))}
      </ul>
      {project.footnote && (
        <p className="mt-5 text-xs text-mist-200">{project.footnote}</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-8">
        {project.stack.length > 0 && <Chips items={project.stack} />}
        {project.link && (
          <Magnetic>
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-signal transition-colors hover:text-signal-soft"
            >
              Visit live site
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </Magnetic>
        )}
      </div>
    </div>

    <div
      className={cn(
        "flex items-center border-t border-white/[0.06] bg-gradient-to-br from-signal/[0.12] via-transparent to-transparent p-6 sm:p-10 lg:border-t-0",
        reverse ? "lg:order-1 lg:border-r" : "lg:border-l"
      )}
    >
      <TiltCard className="w-full" glareClassName="rounded-xl">
        {project.link ? (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            data-cursor="Visit"
            aria-label={`Visit ${project.title}`}
            className="block"
          >
            <BrowserFrame project={project} />
          </a>
        ) : (
          <BrowserFrame project={project} />
        )}
      </TiltCard>
    </div>
  </article>
);

const CategoryHeading = ({
  title,
  count,
  intro,
}: {
  title: string;
  count: number;
  intro: string;
}) => (
  <div className="flex flex-col gap-2 border-b border-white/[0.06] pb-5 sm:flex-row sm:items-end sm:justify-between">
    <h3 className="flex items-baseline gap-3 text-2xl font-semibold tracking-tight text-mist sm:text-3xl">
      {title}
      <span className="font-code text-sm font-normal text-signal">
        0{count}
      </span>
    </h3>
    <p className="max-w-md text-sm text-mist-100">{intro}</p>
  </div>
);

const PersonalCardBody = ({ project }: { project: PersonalProject }) => (
  <>
    {/* as wide as the widest screenshot, so narrower ones only lose a little at the bottom, never the sides */}
    <div className="relative aspect-[2/1] overflow-hidden border-b border-white/[0.06]">
      <Image
        src={project.img}
        alt={`Screenshot of ${project.title}`}
        fill
        sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold tracking-tight text-mist transition-colors group-hover:text-signal">
          {project.title}
        </h4>
        {project.link && (
          <ArrowUpRight className="h-5 w-5 flex-none text-mist-200 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-mist-100">
        {project.des}
      </p>
      {project.note && (
        <p className="mt-3 text-xs leading-relaxed text-mist-200">
          {project.note}
        </p>
      )}
      {project.stack.length > 0 && (
        <Chips items={project.stack} className="mt-auto pt-5" />
      )}
    </div>
  </>
);

const PersonalCard = ({ project }: { project: PersonalProject }) => {
  const className =
    "group flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-ink-100/70 backdrop-blur-sm transition-colors duration-300 hover:border-signal/30";

  // only cards with somewhere to go get a link and the "Open" cursor
  return project.link ? (
    <a
      href={project.link}
      target="_blank"
      rel="noreferrer"
      data-cursor="Open"
      className={className}
    >
      <PersonalCardBody project={project} />
    </a>
  ) : (
    <div className={className}>
      <PersonalCardBody project={project} />
    </div>
  );
};

const Work = () => {
  return (
    <Container id="work">
      <Reveal>
        <SectionHeading
          index="01"
          label="Selected work"
          title={
            <>
              Products I&apos;ve <Accent>shipped</Accent>
            </>
          }
          intro="Products I've built professionally, followed by the projects I build on my own time."
        />
      </Reveal>

      <Reveal className="mt-16">
        <CategoryHeading
          title="Professional"
          count={professionalProjects.length}
          intro="Payments products I've built at bepay money."
        />
      </Reveal>
      <div className="mt-8 space-y-8">
        {professionalProjects.map((project, i) => (
          <Reveal key={project.id}>
            <FeaturedCard project={project} reverse={i % 2 === 1} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-24">
        <CategoryHeading
          title="Personal"
          count={personalProjects.length}
          intro="Side projects I build to learn and try ideas out."
        />
      </Reveal>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {personalProjects.map((project, i) => (
          <li key={project.title}>
            <Reveal delay={i * 0.08} className="h-full">
              <PersonalCard project={project} />
            </Reveal>
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default Work;

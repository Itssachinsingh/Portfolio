import { cn } from "@/lib/utils";
import { experience } from "@/data";
import Reveal from "./Reveal";
import { Accent, Chips, Container, SectionHeading } from "./Primitives";

const Experience = () => {
  return (
    <Container id="experience">
      <Reveal>
        <SectionHeading
          index="02"
          label="Experience"
          title={
            <>
              Where I&apos;ve <Accent>worked</Accent>
            </>
          }
        />
      </Reveal>

      <ol className="mt-14 border-b border-white/[0.06]">
        {experience.map((job, i) => (
          <li key={job.company} className="border-t border-white/[0.06]">
            <Reveal
              delay={i * 0.08}
              className="grid gap-3 py-8 md:grid-cols-[220px_1fr] md:gap-10"
            >
              <p
                className={cn(
                  "flex items-center gap-2 font-code text-xs text-mist-200 md:pt-1.5",
                  job.current && "text-signal"
                )}
              >
                {job.current && (
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                )}
                {job.period}
              </p>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-mist">
                  {job.role}
                  <span className="text-mist-200"> · </span>
                  <span className="text-mist-100">{job.company}</span>
                </h3>
                <p className="mt-3 max-w-2xl leading-relaxed text-mist-100">
                  {job.des}
                </p>
                <Chips items={job.stack} className="mt-5" />
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </Container>
  );
};

export default Experience;

import { stackGroups } from "@/data";
import Reveal from "./Reveal";
import { Accent, Container, SectionHeading } from "./Primitives";

const Stack = () => {
  return (
    <Container id="stack">
      <Reveal>
        <SectionHeading
          index="03"
          label="Stack"
          title={
            <>
              Tools I <Accent>reach for</Accent>
            </>
          }
          intro="What I use day to day, across the interface, the API and the database."
        />
      </Reveal>

      <Reveal delay={0.1}>
        {/* the 1px gap over a lighter background draws the dividers between cells */}
        <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
          {stackGroups.map((group) => (
            <div key={group.title} className="bg-ink-100/95 p-7 sm:p-8">
              <p className="font-code text-xs uppercase tracking-[0.2em] text-signal">
                {group.title}
              </p>
              <ul className="mt-6 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="text-mist">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </Container>
  );
};

export default Stack;

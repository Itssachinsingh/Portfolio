import { approach } from "@/data";
import Reveal from "./Reveal";
import { Accent, Container, SectionHeading } from "./Primitives";

const Approach = () => {
  return (
    <Container id="approach">
      <Reveal>
        <SectionHeading
          index="04"
          label="Approach"
          title={
            <>
              From idea to <Accent>production</Accent>
            </>
          }
          intro="How I take a feature from a rough brief to something running in front of users."
        />
      </Reveal>

      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {approach.map((item, i) => (
          <Reveal key={item.step} delay={i * 0.1}>
            <div className="border-t border-signal/40 pt-6">
              <span className="font-accent text-5xl italic text-signal">
                {item.step}
              </span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-mist">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-mist-100">{item.des}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Container>
  );
};

export default Approach;

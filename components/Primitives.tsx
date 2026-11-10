import { cn } from "@/lib/utils";

export const Container = ({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    id={id}
    className={cn(
      "mx-auto w-full max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8 md:py-28",
      className
    )}
  >
    {children}
  </section>
);

// the italic serif phrase used for emphasis inside headings
export const Accent = ({ children }: { children: React.ReactNode }) => (
  <span className="font-accent text-[1.08em] font-normal italic tracking-normal text-signal">
    {children}
  </span>
);

export const SectionHeading = ({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  intro?: string;
}) => (
  <div className="max-w-2xl">
    <p className="font-code text-xs uppercase tracking-[0.2em] text-signal">
      {index} / {label}
    </p>
    <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-mist sm:text-4xl md:text-5xl">
      {title}
    </h2>
    {intro && (
      <p className="mt-4 leading-relaxed text-mist-100 sm:text-lg">{intro}</p>
    )}
  </div>
);

export const Chips = ({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) => (
  <ul className={cn("flex flex-wrap gap-2", className)}>
    {items.map((item) => (
      <li
        key={item}
        className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 font-code text-[11px] text-mist-100"
      >
        {item}
      </li>
    ))}
  </ul>
);

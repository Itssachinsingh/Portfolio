"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Compass, Rocket } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Understand & Plan",
    icon: Compass,
    des: "I start with the problem, the users and the constraints, then turn them into a clear plan: data model, API contracts and UI flows, before any code is written.",
    tags: ["Requirements", "System design", "API contracts"],
  },
  {
    step: "02",
    title: "Build in Small Steps",
    icon: Code2,
    des: "I build features end to end in small, reviewable pieces, with typed APIs, reusable components and tests, and share progress early so feedback arrives while changes are cheap.",
    tags: ["Next.js", "TypeScript", "Node.js"],
  },
  {
    step: "03",
    title: "Ship & Improve",
    icon: Rocket,
    des: "I ship through CI/CD, watch real usage and errors after launch, and keep improving performance, security and the user experience.",
    tags: ["CI/CD", "Monitoring", "Performance"],
  },
];

const Approach = () => {
  return (
    <section className="w-full py-20">
      <h1 className="heading">
        My <span className="text-purple">approach</span>
      </h1>
      <p className="text-center text-white-100 mt-4 md:text-lg">
        How I take a feature from idea to production.
      </p>

      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="group relative overflow-hidden rounded-3xl border border-white/[0.1] p-8 transition-colors duration-300 hover:border-purple/40"
              style={{
                background:
                  "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
              }}
            >
              {/* soft glow on hover */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple/20 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {/* large faded step number */}
              <span className="pointer-events-none absolute right-6 top-4 select-none text-7xl font-bold text-white/[0.04]">
                {item.step}
              </span>

              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple/20 bg-purple/10 text-purple">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-semibold tracking-widest text-purple">
                  STEP {item.step}
                </span>
              </div>

              <h2 className="mt-6 text-2xl font-bold text-white">
                {item.title}
              </h2>
              <p className="mt-3 leading-relaxed text-white-100">{item.des}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1 text-xs text-white-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Approach;

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MessagesSquare, ClipboardList, Rocket, LineChart, LifeBuoy } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const steps = [
  {
    icon: MessagesSquare,
    num: "01",
    title: "Audit & Strategy",
    desc: "We analyze your current bottlenecks, sales funnels, and digital presence — then build a channel-by-channel blueprint with measurable KPIs.",
  },
  {
    icon: ClipboardList,
    num: "02",
    title: "Execution Planning",
    desc: "Full roadmap scoped with timelines, deliverables, and resource allocation. Zero ambiguity before a single dollar is spent.",
  },
  {
    icon: Rocket,
    num: "03",
    title: "Full-Scale Launch",
    desc: "Creative, copy, campaigns, and code shipped in days — not months. Design, ads, and automations deployed with precision.",
  },
  {
    icon: LineChart,
    num: "04",
    title: "Optimization",
    desc: "Weekly testing loops and data-driven iterations that compound gains month over month — squeezing maximum ROI.",
  },
  {
    icon: LifeBuoy,
    num: "05",
    title: "Long-Term Support",
    desc: "We stay your growth partner — not a one-off project. Ongoing management, reporting, and strategic evolution.",
  },
];

export function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" className="border-y border-white/5 bg-black/15" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <span className="text-xs uppercase tracking-widest text-primary">How We Work</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 leading-tight">
            A proven 5-step engine for predictable growth
          </h2>
          <p className="mt-5 text-white/60 leading-relaxed">
            Our systematic approach removes guesswork. Every engagement follows the same battle-tested
            framework — customized for your goals.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line — desktop */}
          {/* <div className="hidden lg:block absolute top-12 left-[4.5rem] right-[4.5rem] h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" /> */}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 28 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55, ease: smoothEase }}
                className="relative glass rounded-2xl p-6 border border-white/8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 group"
              >
                {/* Step number watermark */}
                <div className="absolute top-4 right-5 font-display font-extrabold text-5xl leading-none text-primary/15 select-none group-hover:text-primary/25 transition-colors duration-300">
                  {step.num}
                </div>

                {/* Icon */}
                <div className="relative h-10 w-10 rounded-xl bg-primary/12 border border-primary/20 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
                  <step.icon className="h-5 w-5" />
                </div>

                <h3 className="font-display font-bold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

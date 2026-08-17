import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, Layers, Network, Zap, Globe, DollarSign, Clock } from "lucide-react";

const pillars = [
  {
    icon: Layers,
    title: "One Agency for All Needs",
    desc: "Stop juggling vendors. Every digital service under one trusted roof — saving you time, money, and coordination overhead.",
  },
  {
    icon: Network,
    title: "Specialist Expert Network",
    desc: "A vetted network of professionals across every digital discipline — creators, developers, marketers, and AI engineers.",
  },
  {
    icon: Zap,
    title: "Modern Tech & AI-Powered",
    desc: "Cutting-edge tooling and AI woven into every workflow — giving you an unfair advantage over competitors.",
  },
  {
    icon: Globe,
    title: "Global Growth Focus",
    desc: "Strategies built to scale across borders and markets — from Dhaka to international audiences.",
  },
  {
    icon: DollarSign,
    title: "Affordable & Transparent",
    desc: "Competitive, upfront pricing with no hidden fees. Every taka spent is accounted for with measurable output.",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    desc: "Campaigns launched in days, not months. We ship fast without compromising on quality.",
  },
];

const checkpoints = [
  "Customized business solutions",
  "Affordable & scalable pricing",
  "Transparent workflow & reporting",
  "Fast communication — always on",
  "Premium quality service delivery",
  "Long-term growth partnership",
];

export function WhyUsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="border-y border-white/5 bg-black/15" ref={ref}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-14"
        >
          <span className="text-xs uppercase tracking-widest text-primary">Why NJ Multi Agency</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 leading-tight">
            A partner built around your growth
          </h2>
          <p className="mt-5 text-white/60 leading-relaxed">
            We don't just deliver projects — we engineer long-term, scalable digital success for
            every client we work with.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              className="glass rounded-2xl p-6 border border-white/8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/12 border border-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="font-display font-bold text-base mb-2">{p.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Checkpoints */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="glass rounded-2xl p-6 sm:p-8 border border-white/8"
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {checkpoints.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.65 + i * 0.07, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-white/70"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

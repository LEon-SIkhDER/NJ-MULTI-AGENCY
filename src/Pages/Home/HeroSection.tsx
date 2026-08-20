import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value: number) =>
    suffix === "+" ? `${Math.round(value)}+` : `${Math.round(value)}${suffix}`
  );
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut", delay: 0.6 });
    const unsubscribe = rounded.on("change", (value) => setDisplay(value));

    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, to]);

  return <span>{display}</span>;
}

const stats = [
  { prefix: "", value: 100, suffix: "+", label: "Campaigns Executed" },
  { prefix: "৳", value: 50, suffix: "L+", label: "Revenue Generated" },
  { prefix: "", value: 150, suffix: "+", label: "Websites / Month" },
  { prefix: "", value: 500, suffix: "+", label: "Ads / Month" },
];

const words = ["Scale", "Grow", "Lead", "Rise"];

function WordCycler() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIdx((current) => (current + 1) % words.length), 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <span key={idx} className="inline-block text-[var(--primary)]">
      <motion.span
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.4 }}
        className="inline-block"
      >
        {words[idx]}
      </motion.span>
    </span>
  );
}

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-orb absolute -right-[10%] -top-[15%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.14)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] left-[-8%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.07)_0%,transparent_70%)]" />

        <svg
          className="absolute inset-0 h-full w-full opacity-[0.025]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container relative z-[1] pb-24 pt-32">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div className="max-w-[700px]">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[var(--primary-border)] bg-[var(--primary-dim)] px-4 py-1.5"
            >
              <Sparkles className="h-[13px] w-[13px] text-[var(--primary)]" />
              <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--primary)]">
                Full-Stack Digital & AI Agency
              </span>
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--primary)] animate-[pulse-ring_2s_ease-in-out_infinite]" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="font-display mb-2 text-[clamp(2.8rem,6vw,5.5rem)] font-extrabold leading-[1.04] tracking-normal text-[var(--text)]"
            >
              We Help You <WordCycler />
              <br />
              <span className="text-[0.72em] font-bold text-[var(--text-muted)]">
                in the Digital World.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="font-display mb-5 text-[1.05rem] font-bold uppercase tracking-[0.06em] text-[var(--primary)]"
            >
              NJ Multi Agency Group
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="mb-10 max-w-xl text-[1.05rem] leading-[1.75] text-[var(--text-muted)]"
            >
              A result-oriented digital powerhouse helping Bangladeshi and international businesses
              scale through AI, ads, design, and development - all from one trusted partner.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3.5"
            >
              <a href="#contact" className="btn-primary">
                Book Free Consultation
                <ArrowRight className="h-[15px] w-[15px]" />
              </a>
              <Link to="/services" className="btn-ghost">
                Explore Services
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="hidden w-[300px] shrink-0 grid-cols-2 gap-3.5 lg:grid"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.88 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65 + index * 0.1, duration: 0.45 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="relative cursor-default overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] px-4 py-5 text-center"
              >
                <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-[var(--radius)] bg-[var(--primary)]" />
                <div className="font-display mb-1.5 text-[1.65rem] font-extrabold leading-none text-[var(--text)]">
                  {stat.prefix}
                  <Counter to={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[var(--text-faint)]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-12 grid grid-cols-2 gap-3 lg:hidden"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="relative overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 text-center"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 bg-[var(--primary)]" />
              <div className="font-display text-2xl font-extrabold text-[var(--text)]">
                {stat.prefix}
                {stat.value}
                {stat.suffix}
              </div>
              <div className="mt-1 text-[0.65rem] uppercase tracking-[0.07em] text-[var(--text-faint)]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

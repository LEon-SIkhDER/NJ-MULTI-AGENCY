import { type ComponentType, useRef } from "react";
import { motion, useInView } from "framer-motion";
import MarqueeImport, { type MarqueeProps } from "react-fast-marquee";

const Marquee = (
  (MarqueeImport as unknown as { default?: ComponentType<MarqueeProps> }).default ??
  MarqueeImport
) as ComponentType<MarqueeProps>;

const brands = ["NORTH", "VERTEX", "AURUM", "KAIROS", "MONO/X", "STELLAR", "APEX", "NOVUS", "CIPHER"];

const stats = [
  { value: "100+", label: "Campaigns", sub: "Successfully executed" },
  { value: "৳50L+", label: "Revenue", sub: "Generated for clients" },
  { value: "500+", label: "Ads/Month", sub: "Live campaigns running" },
];

export function SocialProofStrip() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className="overflow-hidden border-y border-[var(--border)] bg-[var(--surface)] py-14"
    >
      <div className="relative mb-12 overflow-hidden">
        <div className="absolute inset-y-0 left-0 z-2 w-20 bg-gradient-to-r from-[var(--surface)] to-transparent" />
        <div className="absolute inset-y-0 right-0 z-2 w-20 bg-gradient-to-l from-[var(--surface)] to-transparent" />


        <Marquee speed={50} gradient={false} autoFill>
          {brands.map((brand) => (
            <span
              key={brand}
              className="mx-7 shrink-0 font-display text-xs font-bold uppercase tracking-[0.22em] text-[var(--text-faint)]"
            >
              {brand}
            </span>
          ))}
        </Marquee>

        <p className="absolute left-1/2 top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[var(--surface)] px-3 py-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[var(--text-faint)]">
          Trusted by ambitious brands
        </p>
      </div>

      <div className="container">
        <div className="grid overflow-hidden rounded-[var(--radius)] bg-[var(--border)] gap-px [grid-template-columns:repeat(auto-fit,minmax(160px,1fr))]">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.12, duration: 0.5 }}
              className="bg-[var(--surface)] px-8 py-6 text-center"
            >
              <div className="font-display mb-1 text-3xl font-extrabold leading-none text-[var(--text)]">
                {stat.value}
              </div>
              <div className="mb-1 text-[0.78rem] font-semibold text-[var(--primary)]">
                {stat.label}
              </div>
              <div className="text-[0.7rem] text-[var(--text-faint)]">{stat.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

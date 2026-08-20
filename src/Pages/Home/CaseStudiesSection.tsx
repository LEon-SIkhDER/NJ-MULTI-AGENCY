import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, Store } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const caseStudies = [
  {
    icon: Store,
    tag: "Fashion E-Commerce",
    title: "৳15 Lakhs in 3 Months",
    result: "499%",
    resultLabel: "Revenue Growth",
    desc: "Generated ৳15 Lakhs in revenue for a local apparel brand within 3 months using data-driven Facebook Ads strategy with precise audience segmentation and creative testing.",
    metrics: [
      { label: "Revenue Generated", value: "৳15L+" },
      { label: "Timeframe", value: "3 Months" },
      { label: "Platform", value: "Facebook Ads" },
    ],
  },
  {
    icon: TrendingUp,
    tag: "Hospitality & Local Business",
    title: "499% Customer Growth",
    result: "499%",
    resultLabel: "Footfall Increase",
    desc: "Scaled a local restaurant's footfall and online orders by 499% via hyper-local SEO, Google Business Profile optimization, and geo-targeted video ad campaigns.",
    metrics: [
      { label: "Footfall Growth", value: "499%" },
      { label: "Online Orders", value: "↑ Massively" },
      { label: "Channels", value: "SEO + Video Ads" },
    ],
  },
];

export function CaseStudiesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="case-studies" className="container mx-auto px-5 sm:px-8 py-24 lg:py-32" ref={ref}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <span className="text-xs uppercase tracking-widest text-primary">Featured Case Studies</span>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 leading-tight">
          Real results for real businesses
        </h2>
        <p className="mt-5 text-white/60 leading-relaxed">
          Our work is measured in outcomes — revenue generated, customers acquired, and businesses
          transformed.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {caseStudies.map((cs, i) => (
          <motion.div
            key={cs.title}
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.15, duration: 0.6, ease: smoothEase }}
            className="relative glass rounded-3xl p-8 border border-white/8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1.5 overflow-hidden group"
          >
            {/* BG glow */}
            <div className="absolute top-0 right-0 h-48 w-48 bg-primary/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/15 transition-all duration-500" />

            {/* Tag & icon */}
            <div className="relative flex items-start gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary shrink-0">
                <cs.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                  {cs.tag}
                </span>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl mt-1 leading-tight">
                  {cs.title}
                </h3>
              </div>
            </div>

            {/* Desc */}
            <p className="relative text-sm text-white/60 leading-relaxed mb-7">{cs.desc}</p>

            {/* Metrics row */}
            <div className="relative grid grid-cols-3 gap-3 ">
              {cs.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-xl bg-white/4 border border-white/8 p-3 text-center  flex flex-col items-center justify-center"
                >
                  <div className="font-display font-extrabold text-base text-gradient-red ">
                    {m.value}
                  </div>
                  <div className="text-[9px] uppercase tracking-wider text-white/40 mt-1 leading-tight ">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

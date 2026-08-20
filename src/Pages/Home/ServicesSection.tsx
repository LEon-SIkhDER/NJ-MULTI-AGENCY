import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Bot,
  Code2,
  Share2,
  Megaphone,
  Film,
  ShoppingCart,
  Palette,
  Search,
  Package,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const services = [
  {
    icon: Bot,
    title: "AI & Automation",
    desc: "Custom AI workflows, agents, avatars, and full system automation — engineered to compound output and slash operational costs.",
    highlight: "From $30",
    badge: "Most Popular",
  },
  {
    icon: Code2,
    title: "Website & App Dev",
    desc: "Landing pages, business websites, web apps, and full e-commerce storefronts built to convert.",
    highlight: "From $20",
    badge: null,
  },
  {
    icon: Share2,
    title: "Social Media Management",
    desc: "Full strategy, content creation, and community management for compounding organic reach.",
    highlight: "From $50/mo",
    badge: null,
  },
  {
    icon: Megaphone,
    title: "Paid Ads & Performance",
    desc: "Facebook, Google, and cross-platform ad campaigns with transparent management fees and optimal dollar rates.",
    highlight: "From $10 fee",
    badge: null,
  },
  {
    icon: Film,
    title: "Creative Studio & Video",
    desc: "Short-form and long-form edits, AI UGC, YouTube thumbnails, and studio production shoots.",
    highlight: "From $3",
    badge: null,
  },
  {
    icon: ShoppingCart,
    title: "E-Commerce Solutions",
    desc: "Shopify & WooCommerce storefronts engineered for revenue, with product sourcing and photo editing.",
    highlight: "From $30",
    badge: null,
  },
  {
    icon: Palette,
    title: "Branding & Design",
    desc: "Complete brand identity systems — logo, palette, typography, packaging — built to last.",
    highlight: "From $5",
    badge: null,
  },
  {
    icon: Search,
    title: "SEO & Local SEO",
    desc: "Own organic search in your city and niche. Google Business Profile optimisation included.",
    highlight: "From $10",
    badge: null,
  },
  {
    icon: Package,
    title: "Product Sourcing",
    desc: "Global product sourcing from China and worldwide markets with end-to-end packaging design.",
    highlight: "Negotiable",
    badge: null,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const card = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: smoothEase } },
};

export function ServicesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="container mx-auto px-5 sm:px-8 py-24 lg:py-32" ref={ref}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mb-14"
      >
        <span className="text-xs uppercase tracking-widest text-primary">Core Services</span>
        <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 leading-tight">
          Everything you need to grow — in one place
        </h2>
        <p className="mt-5 text-white/60 leading-relaxed">
          From AI automation and paid ads to web development and creative production — a complete
          digital toolkit delivered by domain specialists.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {services.map((s) => (
          <motion.div
            key={s.title}
            variants={card}
            className="group relative glass rounded-2xl p-6 border border-white/8 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent),0_10px_40px_-10px_color-mix(in_oklab,var(--primary)_40%,transparent)] cursor-default"
          >
            {s.badge && (
              <span className="absolute top-4 right-4 text-[9px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30 rounded-full px-2.5 py-0.5">
                {s.badge}
              </span>
            )}
            <div className="h-11 w-11 rounded-xl bg-primary/12 border border-primary/25 flex items-center justify-center text-primary mb-5 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
              <s.icon className="h-5 w-5" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">{s.title}</h3>
            <p className="text-sm text-white/55 leading-relaxed mb-5">{s.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-primary bg-primary/10 rounded-md px-2.5 py-1">
                {s.highlight}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="mt-10 text-center"
      >
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-white transition-colors group"
        >
          View full pricing & all services
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </section>
  );
}

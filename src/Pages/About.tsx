import { useState, useRef, useEffect } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Link } from "react-router";
import {
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Target,
  Eye,
  Bot,
  Code2,
  Share2,
  Megaphone,
  Film,
  ShoppingCart,
  ArrowRight,
  Mail,
  Phone,
  MessageCircle,
  Smartphone,
  Zap,
  Globe,
  ChevronRight,
  HeartHandshake,
  Users,
} from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

function AnimatedCounter({ to, suffix = "", prefix = "" }: { to: number; suffix?: string; prefix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (value: number) => `${prefix}${Math.round(value)}${suffix}`);
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const controls = animate(count, to, { duration: 2, ease: "easeOut", delay: 0.2 });
    const unsubscribe = rounded.on("change", (value) => setDisplay(value));
    return () => {
      controls.stop();
      unsubscribe();
    };
  }, [count, rounded, to, prefix, suffix]);

  return <span>{display}</span>;
}

const stats = [
  { value: 100, suffix: "+", prefix: "", label: "Successful Campaigns", sub: "Proven Track Record" },
  { value: 50, suffix: "L+", prefix: "৳", label: "Client Revenue", sub: "Generated Across Brands" },
  { value: 150, suffix: "+", prefix: "", label: "Websites / Month", sub: "Monthly Delivery Capacity" },
  { value: 500, suffix: "+", prefix: "", label: "Ad Campaigns / Month", sub: "Managed & Optimized" },
];

const coreServices = [
  {
    icon: Bot,
    title: "AI & System Automation",
    badge: "Next-Gen AI",
    desc: "Custom AI workflows, autonomous agents (Hermes, OpenClaw, n8n), and AI avatar video pipelines to supercharge business efficiency.",
  },
  {
    icon: Code2,
    title: "Web & E-Commerce Dev",
    badge: "Speed & Scale",
    desc: "High-converting landing pages, robust web applications, and full-featured Shopify / WooCommerce stores built for peak performance.",
  },
  {
    icon: Megaphone,
    title: "Performance Paid Ads",
    badge: "High ROAS",
    desc: "Targeted Meta & Google Ad campaigns engineered with full-funnel architectures to maximize return on advertising spend.",
  },
  {
    icon: Share2,
    title: "Social Media & Branding",
    badge: "Brand Identity",
    desc: "Complete visual identity, content strategy, copy, and hyper-local SEO optimization to dominate local search rankings.",
  },
  {
    icon: Film,
    title: "Creative Video Studio",
    badge: "Viral Content",
    desc: "Retention-optimized short-form edits (Reels/TikTok/Shorts), click-worthy thumbnails, and full-scale studio video production.",
  },
  {
    icon: ShoppingCart,
    title: "Sourcing & Packaging",
    badge: "Global Logistics",
    desc: "Direct product sourcing across China & global markets, custom packaging die-line design, and marketplace-ready photo editing.",
  },
];

const teamMembers = [
  {
    name: "Arifa Sultana Akhi",
    // role: "Operations & Client Success",
    image: "/Arifa Sultana Akhi.jpg",
    // bio: "Leading cross-functional project delivery, resource management, and client account growth.",
  },
  {
    name: "Jhumu Akther",
    // role: "Brand & Creative Direction",
    image: "/Jhumu Khan.jpg",
    // bio: "Crafting visual brand identities, conversion-focused design systems, and viral social assets.",
  },
  {
    name: "Rafi Mondol",
    // role: "Full-Stack & AI Systems",
    image: "/RAFI MONDOL.jpg",
    // bio: "Building performant web applications, AI automation pipelines, and robust integrations.",
  },
  {
    name: "Md Khairul Islam",
    // role: "Media Buying & Growth",
    image: "/Md Khairul Islam.png",
    // bio: "Optimizing high-ROAS paid media funnels, performance analytics, and local search dominance.",
  },
];

const caseHighlights = [
  {
    badge: "E-Commerce Scale",
    title: "৳15 Lakhs in 3 Months",
    metric: "৳15L+",
    metricLabel: "Client Revenue Generated",
    desc: "Scaled a local apparel and fashion brand from scratch to ৳15 Lakhs in revenue using laser-targeted Meta ad funnels and conversion-rate optimization.",
  },
  {
    badge: "Hospitality & Local Growth",
    title: "499% Customer & Order Surge",
    metric: "+499%",
    metricLabel: "Footfall & Order Increase",
    desc: "Dramatically boosted footfall and direct orders for a dining restaurant through hyper-local SEO, Google Business Profile dominance, and viral video promotions.",
  },
];

const workSteps = [
  {
    step: "01",
    title: "Audit & Strategy",
    desc: "In-depth review of your current bottlenecks, target audience, and sales funnels to construct a high-ROI roadmap.",
  },
  {
    step: "02",
    title: "Full-Stack Execution",
    desc: "Rapid deployment of custom AI automations, responsive web experiences, high-converting ad creatives, and branding.",
  },
  {
    step: "03",
    title: "Iterative Optimization",
    desc: "Relentless performance tracking, A/B testing, and data-driven scaling to compound your business returns over time.",
  },
];

const paymentMethods = [
  { name: "bKash", type: "Mobile Banking (BD)" },
  { name: "Nagad", type: "Mobile Banking (BD)" },
  { name: "Direct Bank Transfer", type: "Domestic & International Wire" },
];

const About = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const teamRef = useRef(null);
  const casesRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true });
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });
  const servicesInView = useInView(servicesRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const casesInView = useInView(casesRef, { once: true, margin: "-80px" });
  const processInView = useInView(processRef, { once: true, margin: "-80px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  return (
    <div className="relative min-h-screen overflow-hidden bg-(--bg) text-(--text)">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="animate-orb absolute -top-[10%] right-[5%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.15)_0%,transparent_70%)]" />
        <div className="absolute top-[35%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.08)_0%,transparent_70%)]" />
        <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.09)_0%,transparent_70%)]" />
        <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="about-grid" width="64" height="64" patternUnits="userSpaceOnUse">
              <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </div>

      <div className="relative z-10">
        {/* ================= 1. HERO SECTION ================= */}
        <section className="container mx-auto px-5 sm:px-8 pt-28 pb-14 lg:pt-36 lg:pb-18" ref={heroRef}>
          <div className="max-w-4xl mx-auto text-center">
            {/* Agency Location & Established Badge */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-2 rounded-full glass border border-white/10 text-xs sm:text-sm text-white/80 mb-6"
            >
              <div className="flex items-center gap-1.5 text-(--primary) font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                <span>NJ MULTI AGENCY GROUP</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1 text-white/60">
                <MapPin className="h-3.5 w-3.5 text-(--primary)" />
                <span>Mirpur, Dhaka</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1 text-white/60">
                <Calendar className="h-3.5 w-3.5 text-(--primary)" />
                <span>Est. 2023</span>
              </div>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.15, duration: 0.6, ease: smoothEase }}
              className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.15] text-white"
            >
              Your Success, <span className="text-gradient-red">Our Mission.</span>
            </motion.h1>

            {/* Subheading / Bangla Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.55 }}
              className="mt-6 text-base sm:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed"
            >
              এক ছাদের নিচে সম্পূর্ণ ডিজিটাল ও কৃত্রিম বুদ্ধিমত্তা (AI) সমাধান — empowering Bangladeshi and
              international businesses with result-driven digital infrastructure, creative production, and revenue-focused marketing.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <a
                href="https://wa.me/8801338107600?text=Hi%20NJ%20Multi%20Agency,%20I%20would%20like%20to%20discuss%20a%20project"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_-8px_var(--primary-glow)] hover:shadow-[0_0_40px_-6px_var(--primary-glow)] transition-all duration-300 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Chat on WhatsApp</span>
              </a>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-xl glass border border-white/10 px-7 py-3.5 text-sm font-semibold text-white/90 hover:text-white hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span>Explore Services & Pricing</span>
                <ChevronRight className="h-4 w-4 text-(--primary)" />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ================= 2. STATS STRIP ================= */}
        <section className="container mx-auto px-5 sm:px-8 py-6" ref={statsRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {stats.map((item, idx) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="glass rounded-2xl p-6 sm:p-7 border border-white/8 text-center relative overflow-hidden group hover:border-(--primary-border) transition-all duration-300"
              >
                <div className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-gradient-red mb-1">
                  {statsInView ? (
                    <AnimatedCounter to={item.value} suffix={item.suffix} prefix={item.prefix} />
                  ) : (
                    `${item.prefix}0${item.suffix}`
                  )}
                </div>
                <div className="font-display font-bold text-sm sm:text-base text-white mt-1">{item.label}</div>
                <div className="text-[11px] sm:text-xs text-white/50 mt-0.5">{item.sub}</div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* ================= 3. AGENCY STORY, MISSION & VISION ================= */}
        <section className="container mx-auto px-5 sm:px-8 py-16 lg:py-24" ref={storyRef}>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Story Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, ease: smoothEase }}
              className="lg:col-span-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-(--primary-dim) border border-(--primary-border) text-xs font-semibold text-(--primary) uppercase tracking-wider mb-4">
                <span>Who We Are</span>
              </div>
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
                Architecting modern digital ecosystems since 2023.
              </h2>
              <p className="mt-5 text-white/70 text-sm sm:text-base leading-relaxed">
                Founded in Mirpur, Dhaka in 2023, <strong className="text-white">NJ Multi Agency Group</strong> was built to solve a critical market challenge: businesses having to manage fragmented vendors for AI, design, web development, and media buying.
              </p>
              <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
                We consolidated full-spectrum digital expertise under one unified roof. Today, our multidisciplinary team deploys cutting-edge AI automations, engineers high-converting storefronts, and drives scalable revenue for domestic and global brands.
              </p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 border border-white/8">
                  <div className="flex items-center gap-2.5 text-white font-semibold text-sm mb-1">
                    <Globe className="h-4 w-4 text-(--primary)" />
                    <span>Global & Local Reach</span>
                  </div>
                  <p className="text-xs text-white/55">Strategies tailored for Bangladeshi growth & international markets.</p>
                </div>
                <div className="glass rounded-xl p-4 border border-white/8">
                  <div className="flex items-center gap-2.5 text-white font-semibold text-sm mb-1">
                    <Zap className="h-4 w-4 text-(--primary)" />
                    <span>Rapid Execution</span>
                  </div>
                  <p className="text-xs text-white/55">Campaigns and websites shipped in record time with zero compromise.</p>
                </div>
              </div>
            </motion.div>

            {/* Mission & Vision Cards Right Column */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.15, ease: smoothEase }}
              className="lg:col-span-6 space-y-6"
            >
              {/* Mission Card */}
              <div className="glass rounded-2xl p-7 border border-white/8 relative overflow-hidden hover:border-(--primary-border) transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) shrink-0 group-hover:bg-(--primary) group-hover:text-white transition-colors duration-300">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-(--primary)">Our Mission</span>
                    <h3 className="font-display font-bold text-xl text-white mt-1 mb-2">Empowering Client Revenue & Scale</h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      To deliver high-impact, transparent, and ROI-centric digital solutions that eliminate operational friction, increase brand authority, and turn visitors into long-term customers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className="glass rounded-2xl p-7 border border-white/8 relative overflow-hidden hover:border-(--primary-border) transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) shrink-0 group-hover:bg-(--primary) group-hover:text-white transition-colors duration-300">
                    <Eye className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest font-bold text-(--primary)">Our Vision</span>
                    <h3 className="font-display font-bold text-xl text-white mt-1 mb-2">The Benchmark Multi-Agency in South Asia</h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      To be recognized globally as the most dependable and tech-forward multi-agency powerhouse — setting new standards in AI automation, digital marketing, and full-stack software delivery.
                    </p>
                  </div>
                </div>
              </div>

              {/* Commitment strip */}
              <div className="glass rounded-xl p-5 border border-white/8 flex items-center gap-3.5">
                <HeartHandshake className="h-6 w-6 text-(--primary) shrink-0" />
                <div className="text-xs sm:text-sm text-white/80">
                  <strong className="text-white">Radical Transparency:</strong> 100% upfront pricing, structured 50/50 payment terms, and measurable KPI reporting.
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================= 4. CORE TEAM & OPERATIONS (BALANCED PRESENTATION) ================= */}
        <section className="container mx-auto px-5 sm:px-8 py-10" ref={teamRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="glass rounded-3xl p-7 sm:p-10 border border-white/8 relative overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-(--primary-dim) border border-(--primary-border) text-xs font-semibold text-(--primary) uppercase tracking-wider mb-2.5">
                  <Users className="h-3.5 w-3.5" />
                  <span>Key Project Leads</span>
                </div>
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  Core Specialists Behind Every Project
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-white/50 max-w-sm">
                Direct communication, agile execution, and end-to-end accountability for every client engagement.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {teamMembers.map((member, idx) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 16 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/8 hover:border-(--primary-border) p-4 transition-all duration-300 group flex flex-col justify-between"
                >
                  <div>
                    {/* Portrait Photo Container */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden mb-3.5 bg-white/5 border border-white/10">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            member.name
                          )}&background=c43448&color=ffffff&size=256`;
                        }}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    </div>

                    <h4 className="font-display font-bold text-base text-white group-hover:text-(--primary) transition-colors">
                      {member.name}
                    </h4>
                    <div className="text-xs font-medium text-(--primary) mt-0.5">{member.role}</div>
                    <p className="text-[11px] text-white/50 mt-2 leading-relaxed">{member.bio}</p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                    <span>NJ Multi Agency</span>
                    <span className="text-emerald-400/80 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ================= 5. WHAT WE DO (FULL-STACK ECOSYSTEM) ================= */}
        <section className="container mx-auto px-5 sm:px-8 py-16" ref={servicesRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold">Everything Under One Roof</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-3 text-white">
              End-to-End Capabilities
            </h2>
            <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
              From initial AI process automation to full-funnel media buying and product packaging, we power every phase of modern brand growth.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((service, idx) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 24 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="glass rounded-2xl p-6 border border-white/8 hover:border-(--primary-border) transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-11 w-11 rounded-xl bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) group-hover:bg-(--primary) group-hover:text-white transition-colors duration-300">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/70">
                        {service.badge}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-(--primary) transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{service.desc}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to="/services"
                      className="text-xs font-semibold text-(--primary) hover:text-white transition-colors inline-flex items-center gap-1 group/link"
                    >
                      <span>View Pricing</span>
                      <ChevronRight className="h-3.5 w-3.5 group-link-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ================= 6. CASE STUDIES & RESULTS ================= */}
        <section className="container mx-auto px-5 sm:px-8 py-16" ref={casesRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={casesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl border border-white/8 p-8 sm:p-12 relative overflow-hidden"
          >
            <div className="max-w-3xl mb-10">
              <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold">Proven Results</span>
              <h2 className="font-display font-extrabold text-2xl sm:text-4xl text-white mt-2">
                Real Numbers, Real Business Impact
              </h2>
              <p className="mt-3 text-white/60 text-sm leading-relaxed">
                We believe in quantifiable returns. Here is a snapshot of what our data-first execution delivers:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {caseHighlights.map((c, i) => (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={casesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.15 + i * 0.1, duration: 0.5 }}
                  className="rounded-2xl bg-white/[0.03] border border-white/8 p-6 sm:p-7 hover:border-(--primary-border) transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-(--primary-dim) text-(--primary) border border-(--primary-border) px-2.5 py-0.5 rounded-full">
                      {c.badge}
                    </span>
                    <div className="text-right">
                      <div className="font-display font-extrabold text-2xl text-gradient-red">{c.metric}</div>
                      <div className="text-[10px] text-white/40">{c.metricLabel}</div>
                    </div>
                  </div>
                  <h3 className="font-display font-bold text-lg text-white mb-2">{c.title}</h3>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{c.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ================= 7. OUR 3-STEP WORK PROCESS ================= */}
        <section className="container mx-auto px-5 sm:px-8 py-16 lg:py-24" ref={processRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold">How We Work</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-3 text-white">
              A Streamlined 3-Step Methodology
            </h2>
            <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed">
              No endless back-and-forth. Just clear milestones, fast turnaround, and continuous optimization.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workSteps.map((ws, i) => (
              <motion.div
                key={ws.step}
                initial={{ opacity: 0, y: 24 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.55 }}
                className="glass rounded-2xl p-7 border border-white/8 relative overflow-hidden group hover:border-(--primary-border) transition-all duration-300"
              >
                <div className="font-display font-extrabold text-4xl text-(--primary)/30 group-hover:text-(--primary) transition-colors duration-300 mb-3">
                  {ws.step}
                </div>
                <h3 className="font-display font-bold text-xl text-white mb-2">{ws.title}</h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">{ws.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Payment Terms strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-8 glass rounded-2xl p-6 sm:p-8 border border-white/8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-(--primary) mb-1">Standard Payment Terms</div>
              <h4 className="font-display font-bold text-base sm:text-lg text-white">50% Advance + 50% Upon Project Completion</h4>
              <p className="text-xs text-white/55 mt-1">Flexible retainers and milestone agreements available for long-term projects.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {paymentMethods.map((pm) => (
                <div key={pm.name} className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white/80">
                  <Smartphone className="h-3.5 w-3.5 text-(--primary)" />
                  <span>{pm.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ================= 8. CALL TO ACTION (CTA) ================= */}
        <section className="container mx-auto px-5 sm:px-8 pt-8 pb-24" ref={ctaRef}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: smoothEase }}
            className="relative glass rounded-3xl p-10 sm:p-16 text-center overflow-hidden border border-white/10"
          >
            {/* Glow Orbs */}
            <div className="absolute top-0 right-0 h-72 w-72 bg-(--primary)/15 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-56 w-56 bg-(--primary)/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative max-w-3xl mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) mx-auto mb-6">
                <TrendingUp className="h-7 w-7" />
              </div>

              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight text-white">
                Ready to take your business to the next level?
              </h2>

              <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Whether you need custom AI agents, a high-converting website, or scalable ad campaigns, NJ Multi Agency Group is ready to build with you.
              </p>

              {/* Direct Info */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-white/70">
                <a
                  href="mailto:nj.multi.agency.official@proton.me"
                  className="inline-flex items-center gap-2 hover:text-(--primary) transition-colors"
                >
                  <Mail className="h-4 w-4 text-(--primary)" />
                  <span>nj.multi.agency.official@proton.me</span>
                </a>
                <span className="hidden sm:inline text-white/20">•</span>
                <a
                  href="https://wa.me/8801338107600"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-(--primary) transition-colors"
                >
                  <Phone className="h-4 w-4 text-(--primary)" />
                  <span>+880 1338-107600</span>
                </a>
                <span className="hidden sm:inline text-white/20">•</span>
                <div className="inline-flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4 text-(--primary)" />
                  <span>Mirpur, Dhaka, Bangladesh</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <a
                  href="https://wa.me/8801338107600?text=Hello%20NJ%20Multi%20Agency,%20I'd%20like%20to%20get%20a%20free%20strategy%20consultation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-(--primary) px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_-8px_var(--primary-glow)] hover:shadow-[0_0_40px_-6px_var(--primary-glow)] transition-all duration-300 hover:-translate-y-0.5 group"
                >
                  <span>Start Your Growth Journey</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 rounded-xl glass border border-white/10 px-8 py-4 text-sm font-semibold text-white hover:border-white/25 transition-all duration-300 hover:-translate-y-0.5"
                >
                  <span>View All Services</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default About;


import { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    Bot,
    Code2,
    Share2,
    Megaphone,
    Film,
    ShoppingCart,
    CheckCircle2,
    ArrowRight,
    Mail,
    Phone,
    Smartphone,
    Building2,
    Award,
    ChevronRight,
    ShieldCheck,
    Cpu,
} from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

interface ServiceItem {
    name: string;
    price: string;
    badge?: string;
    note?: string;
    features?: string[];
}

interface ServiceCategory {
    id: string;
    title: string;
    subtitle: string;
    icon: typeof Bot;
    tagline: string;
    items: ServiceItem[];
}

const serviceCategories: ServiceCategory[] = [
    {
        id: "ai-automation",
        title: "AI & Automation Solutions",
        subtitle: "Smart workflows, AI agents & system automation",
        icon: Bot,
        tagline: "Compound output, reduce human overhead, and automate revenue operations.",
        items: [
            {
                name: "Custom AI Automations",
                price: "$30 – $50",
                note: "One-time | Maintenance: $15/month",
                features: ["Custom workflow architecture", "CRM & lead sync integration", "Error tracking & monthly maintenance available"],
            },
            {
                name: "AI Agents & Assistants",
                price: "Tailored Setup",
                badge: "Hermes, OpenClaw, n8n",
                note: "Tailored Setup Available",
                features: ["Autonomous multi-agent execution", "n8n / Hermes / OpenClaw setup", "Custom memory & knowledge base embedding"],
            },
            {
                name: "AI Avatars & Founder Video Automation",
                price: "From $300/mo",
                badge: "High ROI",
                note: "Monthly scaling package",
                features: ["Hyper-realistic AI cloned avatar", "Automated multilingual voiceovers", "High-volume social video pipeline"],
            },
            {
                name: "AI Apps & System Development",
                price: "Starting $50",
                note: "Full custom architecture",
                features: ["Custom LLM integration", "Internal dashboards & portals", "API connectors & database setup"],
            },
        ],
    },
    {
        id: "web-dev",
        title: "Website, App & E-Commerce Development",
        subtitle: "High-performance websites, web applications & stores",
        icon: Code2,
        tagline: "Fast, responsive, and conversion-optimized digital experiences.",
        items: [
            {
                name: "Landing Pages & Basic Portfolios",
                price: "$20",
                features: ["Modern responsive design", "Lightning-fast loading speed", "Call-to-action & lead capture optimization"],
            },
            {
                name: "Business Websites",
                price: "$30",
                features: ["Multi-page brand presence", "Contact & booking forms", "SEO-ready architecture & fast performance"],
            },
            {
                name: "Web Applications",
                price: "$40",
                features: ["Custom interactive logic", "Backend & database integration", "Authentication & role management"],
            },
            {
                name: "Full-Featured E-Commerce Stores",
                price: "$30 – $100",
                badge: "Shopify / WooCommerce",
                features: ["Complete store configuration", "Payment gateways (bKash/Nagad/Stripe)", "Cart, checkout & inventory management"],
            },
        ],
    },
    {
        id: "social-branding",
        title: "Social Media Management & Branding",
        subtitle: "Organic reach, visual identity & local SEO growth",
        icon: Share2,
        tagline: "Build trust, engage audiences, and dominate local search rankings.",
        items: [
            {
                name: "Standard Package",
                price: "$50/mo",
                features: ["Strategic content calendar", "Regular post design & copy", "Audience engagement & performance monitoring"],
            },
            {
                name: "Premium Full-Business Package",
                price: "$100/mo",
                badge: "Complete Growth",
                features: ["Multi-platform daily management", "Shorts/Reels video strategy", "In-depth analytics & competitor auditing"],
            },
            {
                name: "Complete Brand Identity Package",
                price: "$5 – $50",
                features: ["Logo design & brand guidelines", "Color palettes & typography hierarchy", "Social banners & brand asset kit"],
            },
            {
                name: "Local SEO & Google Business Profile Optimization",
                price: "$10 – $50",
                badge: "Rank Local",
                features: ["Google Maps & GBP optimization", "Local citation building", "Review acquisition & local keyword rank"],
            },
            {
                name: "Content Writing & Blogging",
                price: "Market Rates",
                note: "Competitive Market Rates",
                features: ["SEO-optimized articles & copy", "Conversion-focused copywriting", "Brand voice alignment"],
            },
        ],
    },
    {
        id: "paid-media",
        title: "Paid Media & Performance Marketing",
        subtitle: "Data-driven ad campaigns that maximize ROAS",
        icon: Megaphone,
        tagline: "Transparent management fees with proven revenue-generating funnels.",
        items: [
            {
                name: "Ad Budget up to $100/month",
                price: "$10 fee",
                note: "Management Fee",
                features: ["Campaign setup & audience targeting", "Creative testing & ad copy", "Weekly performance review"],
            },
            {
                name: "Ad Budget up to $300/month",
                price: "$20 fee",
                note: "Management Fee",
                features: ["A/B audience testing & retargeting", "Pixel & conversion tracking", "Bi-weekly optimization loops"],
            },
            {
                name: "Ad Budget up to $500/month",
                price: "$30 fee",
                note: "Management Fee",
                features: ["Full funnel architecture (Top, Mid, Bottom)", "Dynamic retargeting & lookalikes", "ROAS & margin optimization"],
            },
            {
                name: "Ad Budget up to $1,000/month",
                price: "$100 fee",
                badge: "Scale Pro",
                note: "Management Fee",
                features: ["Dedicated media buyer", "Daily bid & budget adjustments", "Custom dashboard & granular attribution"],
            },
            {
                name: "USD Ad Rate (Without Retainer)",
                price: "৳140 – ৳150",
                badge: "Transparent Rate",
                note: "Per USD loaded into ad accounts",
                features: ["No hidden conversion fees", "Direct dollar card top-up", "Applicable for standalone ad spends"],
            },
        ],
    },
    {
        id: "creative-video",
        title: "Creative Studio & Video Production",
        subtitle: "High-converting edits, thumbnails & studio production",
        icon: Film,
        tagline: "Engage viewers with snappy edits, viral hooks, and polished visuals.",
        items: [
            {
                name: "YouTube Thumbnails",
                price: "$3 – $5",
                note: "Per design",
                features: ["High CTR visual concepts", "Custom typography & cutout effects", "Multiple revisions"],
            },
            {
                name: "Short-Form Video Editing (<1 min)",
                price: "$5",
                note: "Per video (Reels, TikTok, Shorts)",
                features: ["Dynamic subtitles & sound effects", "Pacing & trend-aligned retention hooks", "Color grading & stickers"],
            },
            {
                name: "Mid-Length Video Editing (<5 mins)",
                price: "$10",
                note: "Per video",
                features: ["Multi-cam / B-roll syncing", "Custom lower thirds & audio mixing", "Story pacing & transitions"],
            },
            {
                name: "Long-Form Video Editing",
                price: "$10 – $15",
                note: "Per video (Podcasts, Vlogs, Tutorials)",
                features: ["Comprehensive storytelling edit", "Noise removal & audio mastering", "Chapter markers & thumbnail bundle available"],
            },
            {
                name: "AI UGC & Promotional Video Ads",
                price: "$15 – $50",
                badge: "Viral Format",
                note: "High-converting UGC video format",
                features: ["AI-generated presenter or UGC actors", "High-converting scriptwriting", "Product showcase overlays"],
            },
            {
                name: "Studio Video Shoot & Production",
                price: "৳4,000 – ৳25,000",
                badge: "On-Location / Studio",
                note: "Full production team & gear",
                features: ["Professional cinema camera & lighting", "Director, mic setup & sound capture", "Full post-production suite included"],
            },
        ],
    },
    {
        id: "ecommerce-sourcing",
        title: "E-Commerce Sourcing & Design Services",
        subtitle: "Global product sourcing, custom packaging & photo styling",
        icon: ShoppingCart,
        tagline: "From manufacturer sourcing to store-ready product visual presentation.",
        items: [
            {
                name: "Global Product Sourcing",
                price: "Negotiable",
                badge: "China & Worldwide",
                note: "Factory negotiation & verification",
                features: ["Direct factory vetting in China / globally", "Sample inspection & shipping quotes", "B2B supplier pricing negotiation"],
            },
            {
                name: "Product Packaging & Label Design",
                price: "$5 – $100",
                features: ["Print-ready die-line vector packaging", "Premium box, pouch & bottle label design", "3D mockup visual renders"],
            },
            {
                name: "Product Photo Editing / Background Removal",
                price: "$0.50 – $2.00",
                note: "Per image",
                features: ["Clipping path & pure white background", "Natural shadow generation & reflection", "High-res marketplace ready (Amazon/Daraz)"],
            },
        ],
    },
];

const paymentMethods = [
    { name: "bKash", icon: Smartphone, type: "Mobile Banking (Bangladesh)" },
    { name: "Nagad", icon: Smartphone, type: "Mobile Banking (Bangladesh)" },
    { name: "Direct Bank Transfer", icon: Building2, type: "Domestic & International Wire" },
];

const paymentTermsList = [
    "50% Upfront advance payment to initiate work",
    "50% upon final delivery and project approval",
    "Custom terms available based on project scope and retainer agreement",
    "All pricing clearly stated with zero hidden surprises",
];

const Services = () => {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const servicesRef = useRef(null);
    const paymentRef = useRef(null);
    const contactRef = useRef(null);

    const servicesInView = useInView(servicesRef, { once: true, margin: "-80px" });
    const paymentInView = useInView(paymentRef, { once: true, margin: "-80px" });
    const contactInView = useInView(contactRef, { once: true, margin: "-80px" });

    const filteredCategories = activeTab === "all"
        ? serviceCategories
        : serviceCategories.filter((cat) => cat.id === activeTab);

    return (
        <div className="relative min-h-screen overflow-hidden bg-(--bg) text-(--text)">
            {/* Background Ambient Glows */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <div className="animate-orb absolute -top-[12%] right-[5%] h-[550px] w-[550px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.15)_0%,transparent_70%)]" />
                <div className="absolute top-[35%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.08)_0%,transparent_70%)]" />
                <div className="absolute bottom-[10%] right-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,hsl(352_58%_49%_/_0.09)_0%,transparent_70%)]" />
                <svg className="absolute inset-0 h-full w-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="services-grid" width="64" height="64" patternUnits="userSpaceOnUse">
                            <path d="M 64 0 L 0 0 0 64" fill="none" stroke="white" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#services-grid)" />
                </svg>
            </div>

            <div className="relative z-10">
                {/* ================= HERO SECTION ================= */}


                {/* ================= SERVICES & PRICING SECTION ================= */}
                <section id="services-grid-section" className="container mx-auto px-5 sm:px-8 py-5 lg:py-10" ref={servicesRef}>
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mb-12"
                    >
                        <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold">Services & Transparent Pricing</span>
                        <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-3 leading-tight text-white">
                            End-to-End Solutions Tailored to Scale
                        </h2>
                        <p className="mt-4 text-(--text-muted) leading-relaxed text-sm sm:text-base">
                            Clear rates, modular packages, and transparent delivery with zero surprise costs. Choose individual services or bundle them for complete business execution.
                        </p>
                    </motion.div>

                    {/* Interactive Filter Tabs */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex flex-wrap gap-2 mb-12 pb-2 border-b border-white/8"
                    >
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === "all"
                                    ? "bg-(--primary) text-white shadow-[0_0_20px_-5px_var(--primary-glow)]"
                                    : "bg-white/4 text-white/70 hover:bg-white/8 hover:text-white border border-white/8"
                                }`}
                        >
                            All Services (6)
                        </button>
                        {serviceCategories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = activeTab === cat.id;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveTab(cat.id)}
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${isActive
                                            ? "bg-(--primary) text-white shadow-[0_0_20px_-5px_var(--primary-glow)]"
                                            : "bg-white/4 text-white/70 hover:bg-white/8 hover:text-white border border-white/8"
                                        }`}
                                >
                                    <Icon className="h-3.5 w-3.5" />
                                    <span>{cat.title.split("&")[0]}</span>
                                </button>
                            );
                        })}
                    </motion.div>

                    {/* Categories & Cards Grid */}
                    <div className="space-y-16">
                        <AnimatePresence mode="wait">
                            {filteredCategories.map((category, catIndex) => {
                                const CategoryIcon = category.icon;
                                return (
                                    <motion.div
                                        key={category.id}
                                        initial={{ opacity: 0, y: 24 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -16 }}
                                        transition={{ duration: 0.5, delay: catIndex * 0.08 }}
                                        className="relative"
                                    >
                                        {/* Category Title Bar */}
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/8">
                                            <div className="flex items-center gap-3.5">
                                                <div className="h-11 w-11 rounded-xl bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) shrink-0">
                                                    <CategoryIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className="text-xs font-bold text-(--primary) uppercase tracking-wider">0{catIndex + 1}.</span>
                                                        <h3 className="font-display text-xl sm:text-2xl font-bold text-white">{category.title}</h3>
                                                    </div>
                                                    <p className="text-xs sm:text-sm text-(--text-muted) mt-0.5">{category.tagline}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Cards Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                            {category.items.map((item, itemIdx) => (
                                                <motion.div
                                                    key={item.name}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.4, delay: itemIdx * 0.06 }}
                                                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                                    className="glass relative rounded-2xl p-6 border border-white/8 hover:border-(--primary-border) transition-all duration-300 flex flex-col justify-between group"
                                                >
                                                    <div>
                                                        {/* Top Badge & Price */}
                                                        <div className="flex items-start justify-between gap-3 mb-4">
                                                            <div className="flex-1">
                                                                {item.badge && (
                                                                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-(--primary-dim) text-(--primary) border border-(--primary-border) rounded-full px-2.5 py-0.5 mb-2">
                                                                        {item.badge}
                                                                    </span>
                                                                )}
                                                                <h4 className="font-display font-bold text-base sm:text-lg text-white leading-snug group-hover:text-(--primary) transition-colors">
                                                                    {item.name}
                                                                </h4>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <div className="font-display font-extrabold text-lg sm:text-xl text-gradient-red whitespace-nowrap">
                                                                    {item.price}
                                                                </div>
                                                                {item.note && (
                                                                    <div className="text-[10px] text-(--text-muted) max-w-[120px] text-right mt-0.5">
                                                                        {item.note}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Features List */}
                                                        {item.features && item.features.length > 0 && (
                                                            <ul className="space-y-2 my-4 pt-3 border-t border-white/5">
                                                                {item.features.map((feat) => (
                                                                    <li key={feat} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                                                                        <CheckCircle2 className="h-3.5 w-3.5 text-(--primary) shrink-0 mt-0.5" />
                                                                        <span>{feat}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}
                                                    </div>

                                                    {/* Action Button */}
                                                    <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between">
                                                        <a
                                                            href={`https://wa.me/8801338107600?text=Hi%20NJ%20Multi%20Agency,%20I'm%20interested%20in%20your%20service:%20${encodeURIComponent(item.name)}%20(${encodeURIComponent(item.price)})`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-semibold text-(--primary) hover:text-white transition-colors inline-flex items-center gap-1.5 group/btn"
                                                        >
                                                            <span>Order via WhatsApp</span>
                                                            <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
                                                        </a>
                                                        <a
                                                            href="#contact"
                                                            onClick={() => setSelectedService(item.name)}
                                                            className="text-[11px] text-white/40 hover:text-white transition-colors"
                                                        >
                                                            Inquire
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </section>









                {/* ================= PAYMENT TERMS & ACCEPTED METHODS ================= */}
                <section className="container mx-auto px-5 sm:px-8 py-5 lg:py-10" ref={paymentRef}>
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={paymentInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="glass rounded-3xl border border-white/8 p-8 sm:p-12 relative overflow-hidden"
                    >
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            <div>
                                <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold">Transparent Terms</span>
                                <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white mt-2 mb-4">
                                    Flexible Payment Milestones
                                </h2>
                                <ul className="space-y-3">
                                    {paymentTermsList.map((term) => (
                                        <li key={term} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80">
                                            <CheckCircle2 className="h-4 w-4 text-(--primary) shrink-0 mt-0.5" />
                                            <span>{term}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="space-y-3">
                                <span className="text-xs uppercase tracking-widest text-white/40 font-semibold block mb-2">Accepted Payment Methods</span>
                                {paymentMethods.map((pm) => {
                                    const Icon = pm.icon;
                                    return (
                                        <div key={pm.name} className="flex items-center gap-3.5 p-3.5 rounded-xl bg-(--surface) border border-white/8">
                                            <div className="h-9 w-9 rounded-lg bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) shrink-0">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <div className="text-xs sm:text-sm font-semibold text-white">{pm.name}</div>
                                                <div className="text-[10px] text-(--text-muted)">{pm.type}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* ================= GET IN TOUCH / CONTACT ================= */}
                <section id="contact" className="container mx-auto px-5 sm:px-8 py-5 lg:py-10" ref={contactRef}>
                    <div className="grid lg:grid-cols-2 gap-14 items-start">
                        {/* Left Column: Direct Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -28 }}
                            animate={contactInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.65, ease: smoothEase }}
                        >
                            <span className="text-xs uppercase tracking-widest text-(--primary) font-semibold">Get In Touch</span>
                            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl mt-3 leading-tight mb-5 text-white">
                                Let's scale your business together.
                            </h2>
                            <p className="text-(--text-muted) leading-relaxed mb-8 text-sm sm:text-base">
                                Have a question or ready to launch? Reach out to our team via Email, WhatsApp, or drop a quick inquiry below.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-3.5 mb-8">
                                {/* Email Card */}
                                <a
                                    href="mailto:nj.multi.agency.official@proton.me"
                                    className="glass rounded-xl p-4 flex items-center gap-3.5 border border-white/8 hover:border-(--primary-border) transition-all duration-300 hover:-translate-y-0.5 group"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) shrink-0 group-hover:bg-(--primary) group-hover:text-white transition-colors">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] uppercase tracking-widest text-white/40">Official Email</div>
                                        <div className="text-xs sm:text-sm text-white font-medium truncate mt-0.5">
                                            nj.multi.agency.official@proton.me
                                        </div>
                                    </div>
                                </a>

                                {/* Phone / WhatsApp Card */}
                                <a
                                    href="https://wa.me/8801338107600"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="glass rounded-xl p-4 flex items-center gap-3.5 border border-white/8 hover:border-(--primary-border) transition-all duration-300 hover:-translate-y-0.5 group"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-(--primary-dim) border border-(--primary-border) flex items-center justify-center text-(--primary) shrink-0 group-hover:bg-(--primary) group-hover:text-white transition-colors">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-[10px] uppercase tracking-widest text-white/40">Phone / WhatsApp</div>
                                        <div className="text-xs sm:text-sm text-white font-medium truncate mt-0.5">
                                            +880 1338-107600
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2.5 text-xs text-white/70">
                                    <ShieldCheck className="h-4 w-4 text-(--primary)" />
                                    <span>Free Initial Consultation & Strategy Audit</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-white/70">
                                    <Cpu className="h-4 w-4 text-(--primary)" />
                                    <span>AI-Driven Automation & Rapid Execution</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-white/70">
                                    <Award className="h-4 w-4 text-(--primary)" />
                                    <span>Transparent Pricing — Bangladeshi & Global Clients</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Inquiry Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 28 }}
                            animate={contactInView ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.65, delay: 0.15, ease: smoothEase }}
                        >
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const target = e.target as HTMLFormElement;
                                    const name = (target.elements.namedItem("name") as HTMLInputElement)?.value || "";
                                    const service = (target.elements.namedItem("service") as HTMLInputElement)?.value || "";
                                    const message = (target.elements.namedItem("message") as HTMLTextAreaElement)?.value || "";
                                    const text = `Hello NJ Multi Agency, My name is ${name}. I am looking for: ${service}. Message: ${message}`;
                                    window.open(`https://wa.me/8801338107600?text=${encodeURIComponent(text)}`, "_blank");
                                }}
                                className="glass rounded-2xl border border-white/8 p-6 sm:p-8 space-y-4"
                            >
                                <h3 className="font-display font-bold text-lg text-white mb-2">Send a Quick Inquiry</h3>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="Your Name"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-(--primary)"
                                    />
                                    <input
                                        required
                                        name="contactInfo"
                                        type="text"
                                        placeholder="Email or Phone Number"
                                        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-(--primary)"
                                    />
                                </div>
                                <input
                                    name="service"
                                    type="text"
                                    defaultValue={selectedService || ""}
                                    placeholder="Service needed (e.g. AI Automations, Web Dev, Ads)"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-(--primary)"
                                />
                                <textarea
                                    name="message"
                                    rows={4}
                                    placeholder="Tell us about your project requirements or budget..."
                                    className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-(--primary)"
                                />
                                <button
                                    type="submit"
                                    className="w-full rounded-xl bg-(--primary) py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_-8px_var(--primary-glow)] hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <span>Inquire via WhatsApp & Email</span>
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Services;
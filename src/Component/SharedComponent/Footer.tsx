import { Link } from "react-router";
import {
    Mail,
    Phone,
    MapPin,
    MessageCircle,
    ArrowUpRight,
    Sparkles,
    Globe
} from "lucide-react";
import Logo from "../Logo";

const CONTACT_INFO = {
    email: "njmultiagency@gmail.com",
    phone: "+8801338107600",
    whatsappUrl: "https://wa.me/8801338107600",
    location: "Dhaka, Bangladesh",
};

const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services & Pricing", href: "/services" },
    { label: "Work Process", href: "/process" },
    { label: "Case Studies", href: "#case-studies" },
    { label: "Join as Freelancer", href: "/auth" },
];

const serviceLinks = [
    { label: "AI & System Automation", href: "#services" },
    { label: "Website & App Development", href: "#services" },
    { label: "Paid Ads & Performance", href: "#services" },
    { label: "Social Media Management", href: "#services" },
    { label: "Creative Studio & Video", href: "#services" },
    { label: "E-Commerce & Shopify", href: "#services" },
];

const socialLinks = [
    {
        name: "Facebook",
        href: "https://facebook.com",
        svg: (
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
        ),
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com",
        svg: (
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
        ),
    },
    {
        name: "Instagram",
        href: "https://instagram.com",
        svg: (
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
        ),
    },
    {
        name: "Global",
        href: "#",
        svg: <Globe className="h-4 w-4" />,
    },
];

const Footer = () => {
    return (
        <footer className="relative border-t border-white/10 bg-[hsl(222,16%,6%)] text-white overflow-hidden">
            {/* Subtle background ambient red glow */}
            <div
                className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[700px] h-[250px] rounded-full blur-[120px] opacity-20"
                style={{ background: "radial-gradient(circle, #c43448 0%, transparent 70%)" }}
            />

            <div className="container mx-auto px-5 sm:px-8 pt-16 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">

                    {/* Brand & Mission Column */}
                    <div className="lg:col-span-4 flex flex-col justify-between">
                        <div>
                            <Logo />
                            <p className="mt-4 text-sm text-white/60 leading-relaxed max-w-sm">
                                NJ Multi Agency Group is your all-in-one digital growth partner. From custom AI systems and high-converting websites to ROI-driven advertising campaigns.
                            </p>

                            {/* Status Badge */}
                            <div className="inline-flex items-center gap-2 mt-5 px-3 py-1.5 rounded-full bg-[#c43448]/10 border border-[#c43448]/25 text-xs text-white/80">
                                <span className="h-2 w-2 rounded-full bg-[#c43448] animate-pulse" />
                                <span>Taking on new high-impact clients</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-8 flex items-center gap-3">
                            {socialLinks.map((s) => (
                                <a
                                    key={s.name}
                                    href={s.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={s.name}
                                    className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-[#c43448] hover:border-[#c43448] transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {s.svg}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Navigation Links */}
                    <div className="lg:col-span-2 sm:col-span-1">
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-4 font-sans">
                            Navigation
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    {link.href.startsWith("#") ? (
                                        <a
                                            href={link.href}
                                            className="text-white/70 hover:text-white transition-colors flex items-center gap-1 group"
                                        >
                                            <span>{link.label}</span>
                                        </a>
                                    ) : (
                                        <Link
                                            to={link.href}
                                            className="text-white/70 hover:text-white transition-colors flex items-center gap-1 group"
                                        >
                                            <span>{link.label}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Core Services Links */}
                    <div className="lg:col-span-3 sm:col-span-1">
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-4 font-sans">
                            Core Services
                        </h3>
                        <ul className="space-y-2.5 text-sm">
                            {serviceLinks.map((service) => (
                                <li key={service.label}>
                                    <a
                                        href={service.href}
                                        className="text-white/70 hover:text-white transition-colors flex items-center justify-between group"
                                    >
                                        <span>{service.label}</span>
                                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#c43448]" />
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact / Office Column */}
                    <div className="lg:col-span-3">
                        <h3 className="text-xs uppercase tracking-widest font-semibold text-white/40 mb-4 font-sans">
                            Direct Contact
                        </h3>
                        <div className="space-y-3.5 text-sm *:items-center">
                            <a
                                href={`mailto:${CONTACT_INFO.email}`}
                                className="flex items-start gap-3 text-white/70 hover:text-white transition-colors group"
                            >
                                <div className="mt-0.5 h-7 w-7 rounded-md bg-[#c43448]/15 border border-[#c43448]/30 flex items-center justify-center text-[#c43448] shrink-0 group-hover:bg-[#c43448] group-hover:text-white transition-colors">
                                    <Mail className="h-3.5 w-3.5" />
                                </div>
                                <span className="truncate">{CONTACT_INFO.email}</span>
                            </a>

                            <a
                                href={`tel:${CONTACT_INFO.phone}`}
                                className="flex items-start gap-3 text-white/70 hover:text-white transition-colors group"
                            >
                                <div className="mt-0.5 h-7 w-7 rounded-md bg-[#c43448]/15 border border-[#c43448]/30 flex items-center justify-center text-[#c43448] shrink-0 group-hover:bg-[#c43448] group-hover:text-white transition-colors">
                                    <Phone className="h-3.5 w-3.5" />
                                </div>
                                <span>+880 1338-107600</span>
                            </a>

                            <a
                                href={CONTACT_INFO.whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-start gap-3 text-white/70 hover:text-white transition-colors group"
                            >
                                <div className="mt-0.5 h-7 w-7 rounded-md bg-[#c43448]/15 border border-[#c43448]/30 flex items-center justify-center text-[#c43448] shrink-0 group-hover:bg-[#c43448] group-hover:text-white transition-colors">
                                    <MessageCircle className="h-3.5 w-3.5" />
                                </div>
                                <span>WhatsApp: +880 1338-107600</span>
                            </a>

                            <div className="flex items-start gap-3 text-white/60">
                                <div className="mt-0.5 h-7 w-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/50 shrink-0">
                                    <MapPin className="h-3.5 w-3.5" />
                                </div>
                                <span>{CONTACT_INFO.location}</span>
                            </div>
                        </div>

                        {/* Quick CTA Box */}
                        <div className="mt-6 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col gap-2.5">
                            <div className="flex items-center gap-2 text-xs font-semibold text-white">
                                <Sparkles className="h-3.5 w-3.5 text-[#c43448]" />
                                <span>Ready to start a project?</span>
                            </div>
                            <a
                                href="#contact"
                                className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-[#c43448] hover:shadow-[0_0_20px_-4px_#c43448] transition-all duration-300"
                            >
                                Get Free Consultation
                            </a>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright & Terms */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/45">
                    <p>© {new Date().getFullYear()} NJ Multi Agency Group. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-white/80 transition-colors cursor-pointer">Privacy Policy</span>
                        <span className="hover:text-white/80 transition-colors cursor-pointer">Terms of Service</span>
                        <span className="text-[#c43448] font-medium">Your Success, Our Mission.</span>
                    </div>
                </div>
            </div>

            <h1 className="font-[mr_dafoe]  text-center opacity-5 select-none ">Leon Sikhder.</h1>
        </footer>
    );
};

export default Footer;

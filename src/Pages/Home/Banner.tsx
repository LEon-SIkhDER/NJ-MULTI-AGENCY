import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

const Banner = () => {
    return (
        <div>
            <section className="relative overflow-hidden">
                <div className="container mx-auto px-5 sm:px-8 pt-20 pb-24 lg:pt-32 lg:pb-36">
                    <div className="max-w-4xl">
                        <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-widest text-white/70 mb-8">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                            One Agency · Unlimited Digital Solutions
                        </span>
                        <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-gradient-red">
                            Your Gateway to<br />Global Growth.
                        </h1>
                        <p className="mt-8 text-lg sm:text-xl text-white/70 max-w-2xl leading-relaxed">
                            NJ Multi-Agency Group is a premium multi-service digital agency
                            helping businesses, entrepreneurs, startups, e-commerce brands
                            and creators win in the digital economy — all under one trusted
                            platform.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-4">
                            <a
                                href="#contact"
                                className="inline-flex items-center gap-2 rounded-md bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground hover-glow"
                            >
                                Book A Free Consultation <ArrowRight className="h-4 w-4" />
                            </a>
                            <Link
                                to="/services"
                                className="inline-flex items-center gap-2 rounded-md border border-white/15 px-7 py-4 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
                            >
                                Explore Services
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Banner;

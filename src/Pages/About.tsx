import { motion, useInView } from "framer-motion";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useRef } from "react";

const smoothEase = [0.22, 1, 0.36, 1] as const;


const About = () => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });

    return (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 pb-10 mt-16" ref={ref}>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: smoothEase }}
                className="relative glass rounded-3xl p-10 sm:p-16 text-center overflow-hidden border border-white/8"
            >
                {/* Glow */}
                <div className="absolute top-0 right-0 h-72 w-72 bg-primary/12 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 h-56 w-56 bg-primary/8 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <div className="relative">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={inView ? { scale: 1, opacity: 1 } : {}}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="h-14 w-14 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6"
                    >
                        <TrendingUp className="h-7 w-7" />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 16 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight max-w-4xl mx-auto"
                    >
                        A globally recognised digital ecosystem — every essential service from a single trusted
                        source.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mt-6 font-display font-bold text-primary text-lg tracking-wide"
                    >
                        Your Success, Our Mission.
                    </motion.p>

                    <motion.a
                        href="#contact"
                        initial={{ opacity: 0, y: 8 }}
                        animate={inView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.65, duration: 0.5 }}
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-sm font-semibold text-white shadow-[0_0_30px_-8px_var(--primary-glow)] hover:shadow-[0_0_40px_-6px_var(--primary-glow)] transition-all duration-300 hover:-translate-y-0.5 group"
                    >
                        Start Your Growth Journey
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </motion.a>
                </div>
            </motion.div>
        </section>
    );
};

export default About;
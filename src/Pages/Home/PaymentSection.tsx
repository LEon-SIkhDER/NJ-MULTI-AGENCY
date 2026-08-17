import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CreditCard, Smartphone, Building2, CheckCircle2, ArrowRight } from "lucide-react";

const paymentMethods = [
  { icon: Smartphone, name: "bKash", desc: "Mobile banking" },
  { icon: Smartphone, name: "Nagad", desc: "Mobile banking" },
  { icon: Building2, name: "Bank Transfer", desc: "Direct bank wire" },
];

const terms = [
  "50% advance payment to begin work",
  "50% upon project delivery",
  "Custom terms available for larger projects",
  "All prices listed in USD unless noted",
  "৳140 – ৳150 per USD (without retainer)",
];

export function PaymentSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-24 lg:py-32" ref={ref}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-8 sm:p-12 border border-white/8 overflow-hidden relative"
      >
        {/* Background accent */}
        <div className="absolute -bottom-20 -right-20 h-64 w-64 bg-primary/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative grid md:grid-cols-2 gap-12 items-start">
          {/* Left — payment methods */}
          <div>
            <span className="text-xs uppercase tracking-widest text-primary">Payment Terms</span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl mt-3 leading-tight mb-8">
              Simple, flexible <br />payment options
            </h2>

            <div className="space-y-3 mb-8">
              {paymentMethods.map((pm, i) => (
                <motion.div
                  key={pm.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.45 }}
                  className="flex items-center gap-3 rounded-xl bg-white/4 border border-white/8 px-4 py-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/20 flex items-center justify-center text-primary">
                    <pm.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{pm.name}</div>
                    <div className="text-xs text-white/45">{pm.desc}</div>
                  </div>
                  <CheckCircle2 className="ml-auto h-4 w-4 text-primary/60" />
                </motion.div>
              ))}
            </div>

            <div className="rounded-xl bg-primary/10 border border-primary/20 p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-4 w-4 text-primary" />
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">USD Rate</span>
              </div>
              <p className="text-sm text-white/70">
                <span className="font-bold text-white">৳140 – ৳150</span> per USD (without long-term retainer)
              </p>
            </div>
          </div>

          {/* Right — terms */}
          <div>
            <span className="text-xs uppercase tracking-widest text-white/40 block mb-6">Standard Terms</span>
            <ul className="space-y-3 mb-8">
              {terms.map((term, i) => (
                <motion.li
                  key={term}
                  initial={{ opacity: 0, x: 16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.45 }}
                  className="flex items-start gap-3 text-sm text-white/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {term}
                </motion.li>
              ))}
            </ul>
            <motion.a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:shadow-[0_0_30px_-8px_var(--primary-glow)] transition-all duration-300 hover:-translate-y-0.5 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              Discuss Your Project
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

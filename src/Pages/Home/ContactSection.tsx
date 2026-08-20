import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const CONTACT = {
  email: "njmultiagency@gmail.com",
  phone: "+8801338107600",
  whatsappUrl: "https://wa.me/8801338107600",
  location: "Dhaka, Bangladesh",
};

const contactCards = [
  {
    icon: Mail,
    label: "Email",
    value: CONTACT.email,
    href: `mailto:${CONTACT.email}`,
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+880 1338-107600",
    href: `tel:${CONTACT.phone}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+880 1338-107600",
    href: CONTACT.whatsappUrl,
    external: true,
  },
  {
    icon: MapPin,
    label: "Location",
    value: CONTACT.location,
    href: null,
  },
];

const bullets = [
  "Free consultation & business analysis",
  "Custom strategy & tailored roadmap",
  "Transparent pricing — no surprises",
];

export function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="container mx-auto px-5 sm:px-8 py-24 lg:py-32" ref={ref}>
      <div className="grid lg:grid-cols-2 gap-14 items-start">
        {/* Left — info */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: smoothEase }}
        >
          <span className="text-xs uppercase tracking-widest text-primary">Get In Touch</span>
          <h2 className="font-display font-extrabold text-4xl sm:text-5xl mt-3 leading-tight mb-5">
            Let's build your<br />success together.
          </h2>
          <p className="text-white/60 leading-relaxed mb-6">
            Tell us where you are and where you want to go. We'll respond within 24 hours with a
            no-obligation breakdown of the fastest path to growth.
          </p>

          <ul className="space-y-3 mb-10">
            {bullets.map((b, i) => (
              <motion.li
                key={b}
                initial={{ opacity: 0, x: -12 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="flex items-start gap-3 text-sm text-white/65"
              >
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                {b}
              </motion.li>
            ))}
          </ul>

          {/* Contact cards grid */}
          <div className="grid sm:grid-cols-2 gap-3">
            {contactCards.map((card, i) => {
              const inner = (
                <>
                  <div className="h-9 w-9 rounded-lg bg-primary/12 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <card.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-widest text-white/40">{card.label}</div>
                    <div className="text-sm text-white/85 truncate mt-0.5">{card.value}</div>
                  </div>
                </>
              );

              const cls =
                "glass rounded-xl p-4 flex items-center gap-3 border border-white/8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-0.5";

              return (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.35 + i * 0.09, duration: 0.45 }}
                >
                  {card.href ? (
                    <a
                      href={card.href}
                      className={cls}
                      target={card.external ? "_blank" : undefined}
                      rel={card.external ? "noreferrer" : undefined}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={cls}>{inner}</div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.15, ease: smoothEase }}
        >
          <form className="glass rounded-2xl border border-white/8 p-6 sm:p-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/50"
                name="name"
                placeholder="Your name"
                type="text"
              />
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/50"
                name="email"
                placeholder="Email address"
                type="email"
              />
            </div>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/50"
              name="service"
              placeholder="Service you need"
              type="text"
            />
            <textarea
              className="min-h-36 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:border-primary/50"
              name="message"
              placeholder="Tell us about your project"
            />
            <button
              className="w-full rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_-8px_var(--primary-glow)]"
              type="submit"
            >
              Send Message
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import type { SiteContent } from "@/lib/content";

type Props = {
  cta: SiteContent["cta"];
  contact: SiteContent["contact"];
};

export default function CTA({ cta, contact }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const tel = contact.phone.replace(/[^0-9+]/g, "");

  return (
    <section id="contact" ref={ref} className="py-20 bg-primary-500 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-16 -right-16 w-72 h-72 bg-primary-400 rounded-full opacity-40" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-primary-600 rounded-full opacity-30" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{cta.title}</h2>
          <p className="text-primary-100 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            {cta.subtitle}
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-12">
            <a
              href="/app"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-white text-primary-600 font-semibold hover:bg-primary-50 transition-colors text-sm"
            >
              {cta.primaryCta}
              <ArrowRight size={16} />
            </a>
            <a
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors text-sm border border-primary-400"
            >
              <MessageCircle size={16} />
              {cta.lineCta}
            </a>
          </div>

          <div className="flex flex-wrap gap-6 justify-center text-primary-100">
            <a
              href={contact.lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm hover:text-white transition-colors"
            >
              <MessageCircle size={15} />
              {contact.lineId}
            </a>
            <a
              href={`tel:${tel}`}
              className="flex items-center gap-2 text-sm hover:text-white transition-colors"
            >
              <Phone size={15} />
              {contact.phone}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

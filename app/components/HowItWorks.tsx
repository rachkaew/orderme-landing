"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ScanQrCode, ShoppingCart, CheckCheck } from "lucide-react";
import type { SiteContent } from "@/lib/content";

const icons = [ScanQrCode, ShoppingCart, CheckCheck];

export default function HowItWorks({ content }: { content: SiteContent["howItWorks"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" ref={ref} className="py-20 bg-primary-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3 block">
            {content.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{content.title}</h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">{content.subtitle}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-px bg-primary-200" />

          {content.steps.map((s, i) => {
            const Icon = icons[i % icons.length];
            const step = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-200">
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-primary-500 text-primary-600 text-[10px] font-bold flex items-center justify-center">
                    {step}
                  </span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-500 mb-2">
                  ฝั่ง{s.role}
                </span>
                <h3 className="font-semibold text-gray-900 mb-2 text-base">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">{s.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

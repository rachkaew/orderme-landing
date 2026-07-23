"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageCircle,
  GitBranch,
  QrCode,
  Zap,
  Clock,
  Smartphone,
} from "lucide-react";
import type { SiteContent } from "@/lib/content";

const icons = [MessageCircle, GitBranch, QrCode, Zap, Clock, Smartphone];
const colors = [
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-green-50 text-green-600",
  "bg-yellow-50 text-yellow-600",
  "bg-rose-50 text-rose-600",
  "bg-primary-50 text-primary-600",
];

export default function Features({ content }: { content: SiteContent["features"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-20 bg-white">
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
          <p className="text-gray-500 max-w-xl mx-auto text-base">{content.subtitle}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 bg-white hover:bg-primary-50/30 transition-all duration-200"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colors[i % colors.length]}`}
                >
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

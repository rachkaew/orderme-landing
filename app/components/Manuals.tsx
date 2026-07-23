"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Download, FileText } from "lucide-react";
import type { SiteContent } from "@/lib/content";

type Props = {
  section: SiteContent["manualsSection"];
  manuals: SiteContent["manuals"];
};

export default function Manuals({ section, manuals }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  if (manuals.length === 0) return null;

  return (
    <section id="manuals" ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3 block">
            {section.eyebrow}
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">{section.subtitle}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-3">
          {manuals.map((m, i) => (
            <motion.a
              key={m.id}
              href={`/api/manuals/${encodeURIComponent(m.id)}`}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.05 * i }}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-primary-50/40 hover:bg-primary-50 px-4 py-4 transition-colors"
            >
              <div className="w-11 h-11 rounded-xl bg-white border border-primary-100 flex items-center justify-center text-primary-600">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{m.title}</p>
                <p className="text-xs text-gray-400 truncate">{m.originalName}</p>
              </div>
              <Download size={18} className="text-primary-500 shrink-0" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

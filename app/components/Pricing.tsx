"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";
import type { SiteContent } from "@/lib/content";

export default function Pricing({ content }: { content: SiteContent["pricing"] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" ref={ref} className="py-20 bg-white">
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

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {content.plans.map((plan, i) => {
            const ctaStyle = plan.highlight
              ? "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-200"
              : "border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? "bg-primary-500 text-white ring-2 ring-primary-500 ring-offset-2"
                    : "bg-white border border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-gray-900 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      แนะนำ
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <p
                    className={`text-sm font-semibold mb-1 ${
                      plan.highlight ? "text-primary-100" : "text-gray-500"
                    }`}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-end gap-1 mb-2">
                    {plan.price === "ฟรี" || plan.price === "ติดต่อ" ? (
                      <p
                        className={`text-3xl font-bold ${
                          plan.highlight ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {plan.price}
                      </p>
                    ) : (
                      <p
                        className={`text-3xl font-bold ${
                          plan.highlight ? "text-white" : "text-gray-900"
                        }`}
                      >
                        ฿{plan.price}
                      </p>
                    )}
                    <p
                      className={`text-sm mb-1 ${
                        plan.highlight ? "text-primary-200" : "text-gray-400"
                      }`}
                    >
                      /{plan.period}
                    </p>
                  </div>
                  <p className={`text-sm ${plan.highlight ? "text-primary-100" : "text-gray-500"}`}>
                    {plan.desc}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check
                        size={15}
                        className={`flex-shrink-0 ${
                          plan.highlight ? "text-primary-200" : "text-primary-500"
                        }`}
                      />
                      <span className={plan.highlight ? "text-white" : "text-gray-700"}>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={plan.name === "Enterprise" ? "#contact" : "/app"}
                  className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-colors ${ctaStyle}`}
                >
                  {plan.cta}
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "ฟรี",
    period: "ตลอดไป",
    desc: "เหมาะสำหรับร้านเล็กที่เพิ่งเริ่มต้น",
    cta: "เริ่มใช้งาน",
    ctaStyle: "border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600",
    highlight: false,
    features: [
      "1 สาขา",
      "เมนูไม่จำกัด",
      "ออเดอร์สูงสุด 100 รายการ/เดือน",
      "แชทออเดอร์",
      "QR Code ชำระเงิน",
      "PWA บนมือถือ",
    ],
  },
  {
    name: "Pro",
    price: "990",
    period: "บาท/เดือน",
    desc: "สำหรับร้านที่ต้องการระบบครบครัน",
    cta: "ทดลองฟรี 30 วัน",
    ctaStyle: "bg-primary-500 text-white hover:bg-primary-600 shadow-lg shadow-primary-200",
    highlight: true,
    features: [
      "หลายสาขา (ไม่จำกัด)",
      "ออเดอร์ไม่จำกัด",
      "Export รายงาน Excel",
      "Analytics ยอดขาย",
      "จัดการพนักงาน",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "ติดต่อ",
    period: "เราเพื่อราคาพิเศษ",
    desc: "สำหรับแฟรนไชส์หรือแบรนด์ขนาดใหญ่",
    cta: "ติดต่อทีมงาน",
    ctaStyle: "border border-gray-200 text-gray-700 hover:border-primary-300 hover:text-primary-600",
    highlight: false,
    features: [
      "ทุกอย่างใน Pro",
      "Custom branding",
      "SLA การันตี uptime",
      "On-premise option",
      "Dedicated support",
      "Training & onboarding",
    ],
  },
];

export default function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3 block">
            ราคา
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            เลือกแพ็กเกจที่ใช่
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            ไม่มีค่าธรรมเนียมแอบแฝง ยกเลิกได้ทุกเมื่อ ย้ายแพ็กเกจได้ตลอด
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
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

              {/* Plan name + price */}
              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${plan.highlight ? "text-primary-100" : "text-gray-500"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  {plan.price === "ฟรี" || plan.price === "ติดต่อ" ? (
                    <p className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                      {plan.price}
                    </p>
                  ) : (
                    <>
                      <p className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                        ฿{plan.price}
                      </p>
                    </>
                  )}
                  <p className={`text-sm mb-1 ${plan.highlight ? "text-primary-200" : "text-gray-400"}`}>
                    /{plan.period}
                  </p>
                </div>
                <p className={`text-sm ${plan.highlight ? "text-primary-100" : "text-gray-500"}`}>
                  {plan.desc}
                </p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <Check
                      size={15}
                      className={`flex-shrink-0 ${plan.highlight ? "text-primary-200" : "text-primary-500"}`}
                    />
                    <span className={plan.highlight ? "text-white" : "text-gray-700"}>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={plan.name === "Enterprise" ? "#contact" : "/app"}
                className={`w-full py-3 rounded-xl text-center text-sm font-semibold transition-colors ${plan.ctaStyle}`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

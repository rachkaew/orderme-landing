"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ScanQrCode, ShoppingCart, CheckCheck } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: ScanQrCode,
    title: "สแกน QR หรือเปิดลิงก์",
    desc: "ร้านแชร์ลิงก์หรือ QR Code ให้ลูกค้า เปิดผ่านเบราว์เซอร์ได้เลยโดยไม่ต้องโหลดอะไร",
    role: "ลูกค้า",
  },
  {
    step: "02",
    icon: ShoppingCart,
    title: "เลือกเมนู → แชทสั่ง → แนบ location",
    desc: "เลือกเมนูที่ชอบ ใส่ตัวเลือก แล้วส่งออเดอร์ผ่านแชท พร้อมแนบตำแหน่งที่อยู่ได้เลย",
    role: "ลูกค้า",
  },
  {
    step: "03",
    icon: CheckCheck,
    title: "ร้านยืนยัน → QR จ่าย → รับอาหาร",
    desc: "ร้านรับออเดอร์ ส่ง QR ชำระเงิน ยืนยันการโอน แล้วทำอาหารส่งให้ทันที",
    role: "ร้านค้า",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" ref={ref} className="py-20 bg-primary-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3 block">
            วิธีใช้งาน
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ง่ายมาก แค่ 3 ขั้นตอน
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            ตั้งค่าร้านภายใน 10 นาที ลูกค้าสั่งอาหารได้ทันทีโดยไม่ต้องดาวน์โหลดอะไรเพิ่ม
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* connector line (desktop) */}
          <div className="hidden md:block absolute top-14 left-1/6 right-1/6 h-px bg-primary-200" />

          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                {/* Step circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-500 flex items-center justify-center shadow-lg shadow-primary-200">
                    <Icon size={28} className="text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white border-2 border-primary-500 text-primary-600 text-[10px] font-bold flex items-center justify-center">
                    {s.step}
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

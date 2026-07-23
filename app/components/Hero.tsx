"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Smartphone, MessageCircle, CheckCircle } from "lucide-react";
import type { SiteContent } from "@/lib/content";

const chatBubbles = [
  { from: "customer", text: "สวัสดีค่ะ ขอก๋วยเตี๋ยวเส้นใหญ่ น้ำใส ไม่เผ็ด 1 ชาม" },
  { from: "menu", text: "🍜 ก๋วยเตี๋ยวเส้นใหญ่น้ำใส — 65 บาท\nเพิ่มเข้าตะกร้าแล้ว ✓" },
  { from: "customer", text: "แนบที่อยู่ด้วยนะคะ 📍" },
  { from: "menu", text: "รับออเดอร์แล้ว! ชำระเงินผ่าน QR ได้เลยค่ะ 💳" },
];

function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
      className="relative"
    >
      <div className="relative mx-auto w-64 md:w-72">
        <div className="rounded-[2.5rem] border-4 border-gray-800 bg-gray-800 shadow-2xl overflow-hidden">
          <div className="bg-gray-800 flex justify-center pt-2 pb-1">
            <div className="w-20 h-5 bg-black rounded-full" />
          </div>
          <div className="bg-primary-50 min-h-[480px] flex flex-col">
            <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">O</span>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900">OrderMe</p>
                <p className="text-[10px] text-green-500">● ออนไลน์</p>
              </div>
            </div>
            <div className="flex-1 px-3 py-3 flex flex-col gap-2 overflow-hidden">
              {chatBubbles.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: b.from === "customer" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.3, duration: 0.4 }}
                  className={`flex ${b.from === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-[10px] leading-relaxed whitespace-pre-line ${
                      b.from === "customer"
                        ? "bg-primary-200 text-primary-900 rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                    }`}
                  >
                    {b.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="bg-white px-3 py-2 flex items-center gap-2 border-t border-gray-100">
              <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5">
                <span className="text-[10px] text-gray-400">พิมพ์ข้อความ...</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-primary-500 flex items-center justify-center">
                <ArrowRight size={12} className="text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gray-800 flex justify-center py-2">
            <div className="w-24 h-1 bg-gray-600 rounded-full" />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="absolute -right-6 top-16 bg-white rounded-2xl shadow-lg px-3 py-2 border border-gray-100 flex items-center gap-2"
        >
          <CheckCircle size={14} className="text-green-500" />
          <span className="text-xs font-semibold text-gray-700">รับออเดอร์แล้ว!</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.1, duration: 0.4 }}
          className="absolute -left-6 bottom-24 bg-white rounded-2xl shadow-lg px-3 py-2 border border-gray-100 flex items-center gap-2"
        >
          <Smartphone size={14} className="text-primary-500" />
          <span className="text-xs font-semibold text-gray-700">ติดตั้งเป็น PWA</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Hero({ content }: { content: SiteContent["hero"] }) {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-primary-50 via-white to-white flex items-center pt-20 pb-12 overflow-hidden">
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-40 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-50 rounded-full blur-3xl opacity-60" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {content.badges.map((b) => (
                <span
                  key={b}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-primary-100 text-primary-700"
                >
                  {b}
                </span>
              ))}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-5"
            >
              {content.titleLine1}
              <br />
              <span className="text-primary-500">{content.titleHighlight}</span>
              <br />
              {content.titleLine3}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-gray-500 leading-relaxed mb-8 max-w-md"
            >
              {content.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <a
                href="/app"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors text-sm shadow-lg shadow-primary-200"
              >
                {content.primaryCta}
                <ArrowRight size={16} />
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm border border-gray-200"
              >
                <Play size={14} className="text-primary-500" />
                {content.secondaryCta}
              </a>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-xs text-gray-400 flex items-center gap-1.5"
            >
              <MessageCircle size={13} className="text-primary-400" />
              {content.trustLine}
            </motion.p>
          </div>

          <div className="flex justify-center md:justify-end">
            <PhoneMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

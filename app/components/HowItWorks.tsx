"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import type { SiteContent } from "@/lib/content";

/** แผ่นภาพ 4 คอลัมน์ × 3 แถว */
function Scene({
  col,
  row,
  className = "",
}: {
  col: number;
  row: number;
  className?: string;
}) {
  const x = (col / 3) * 100;
  const y = (row / 2) * 100;
  return (
    <div
      className={`bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url(/illustrations/orderme-journey.png)",
        backgroundSize: "400% 300%",
        backgroundPosition: `${x}% ${y}%`,
      }}
      aria-hidden
    />
  );
}

/** คอลัมน์ภาพที่สื่อแต่ละขั้น: เปิดเมนู / สั่ง / รับอาหาร */
const stepScenes = [
  { col: 0, row: 0 },
  { col: 3, row: 0 },
  { col: 3, row: 1 },
];

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

        <div className="grid md:grid-cols-3 gap-8 relative mb-16">
          <div className="hidden md:block absolute top-20 left-[16%] right-[16%] h-px bg-primary-200" />

          {content.steps.map((s, i) => {
            const scene = stepScenes[i % stepScenes.length];
            const step = String(i + 1).padStart(2, "0");
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.15 }}
                className="flex flex-col items-center text-center"
              >
                <div className="relative mb-5">
                  <Scene
                    col={scene.col}
                    row={scene.row}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl shadow-md shadow-primary-100 ring-2 ring-white"
                  />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary-500 text-white text-[11px] font-bold flex items-center justify-center shadow">
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

        {/* แผ่นภาพรวมเส้นทางลูกค้า */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="max-w-3xl mx-auto"
        >
          <p className="text-center text-sm font-medium text-primary-600 mb-4">
            จากเปิดแอป → สั่ง → จ่าย → รับอาหาร → ให้ดาว
          </p>
          <div className="rounded-3xl overflow-hidden border border-primary-100 bg-white shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/illustrations/orderme-journey.png"
              alt="เส้นทางใช้งาน OrderMe ตั้งแต่เลือกเมนูจนถึงให้คะแนน"
              className="w-full h-auto"
              width={1024}
              height={1024}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

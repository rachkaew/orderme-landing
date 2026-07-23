"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  MessageCircle,
  GitBranch,
  QrCode,
  Zap,
  Clock,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "สั่งผ่านแชทสไตล์ LINE",
    desc: "ลูกค้าคุ้นเคยอยู่แล้ว ไม่ต้องเรียนรู้ใหม่ เปิดลิงก์ก็สั่งได้ทันที",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: GitBranch,
    title: "รองรับหลายสาขา",
    desc: "จัดการทุกสาขาจากระบบเดียว แยกเมนูและออเดอร์ตามสาขาอัตโนมัติ",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: QrCode,
    title: "QR Code ชำระเงิน",
    desc: "สร้าง QR พร้อมเพย์ได้อัตโนมัติ ลูกค้าสแกนจ่ายได้ทันที ไม่ต้องรอทอน",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Zap,
    title: "Realtime ทุกการเคลื่อนไหว",
    desc: "ออเดอร์ใหม่แจ้งเตือนทันที ลูกค้าเห็นสถานะการทำอาหารแบบ live",
    color: "bg-yellow-50 text-yellow-600",
  },
  {
    icon: Clock,
    title: "ประวัติการสั่งซื้อ",
    desc: "ลูกค้าดูประวัติย้อนหลัง สั่งซ้ำเมนูโปรดได้ในคลิกเดียว",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Smartphone,
    title: "ติดตั้งเป็น PWA ได้",
    desc: "ลูกค้าเพิ่มลงหน้าจอมือถือได้เลย ไม่ต้องขึ้น App Store ไม่ต้อง review",
    color: "bg-primary-50 text-primary-600",
  },
];

export default function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-primary-500 mb-3 block">
            ฟีเจอร์
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            ทุกอย่างที่ร้านอาหารต้องการ
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-base">
            ออกแบบมาเพื่อร้านอาหารไทยโดยเฉพาะ ใช้งานง่าย ตั้งค่าเร็ว ไม่ต้องมีทีม IT
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-primary-200 bg-white hover:bg-primary-50/30 transition-all duration-200"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${f.color}`}>
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

import { MessageCircle } from "lucide-react";

const links = {
  ผลิตภัณฑ์: ["ฟีเจอร์", "ราคา", "Changelog", "Roadmap"],
  บริษัท: ["เกี่ยวกับเรา", "บล็อก", "ติดต่อ"],
  ช่วยเหลือ: ["คู่มือการใช้งาน", "FAQ", "สนับสนุน"],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-primary-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">O</span>
              </div>
              <span className="font-bold text-white text-lg">
                Order<span className="text-primary-400">Me</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              ระบบรับออเดอร์ผ่านแชทสำหรับร้านอาหาร
              ออกแบบมาเพื่อร้านไทยโดยเฉพาะ
            </p>
            <a
              href="https://line.me"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              <MessageCircle size={14} />
              @orderme.th
            </a>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <p className="text-white text-sm font-semibold mb-4">{category}</p>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm hover:text-white transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 OrderMe. สงวนลิขสิทธิ์</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">นโยบายความเป็นส่วนตัว</a>
            <a href="#" className="hover:text-white transition-colors">ข้อกำหนดการใช้งาน</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { PhoneCall, MessageCircle, MapPin, Clock, Facebook, Map } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-extrabold text-red-600 mb-4">__BRAND_NAME__</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง
              ถึงที่รวดเร็วทันใจ โดยช่างผู้เชี่ยวชาญ
            </p>
            <div className="flex items-center gap-2 mt-4 text-slate-400 text-sm">
              <Clock className="w-4 h-4 text-red-400" />
              <span>เปิดให้บริการตลอด 24 ชั่วโมง</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-slate-400 text-sm">
              <MapPin className="w-4 h-4 text-red-400" />
              <span>ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ</span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-4">บริการของเรา</h4>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>
                <Link href="/battery-replacement" className="hover:text-red-400 transition-colors">
                  เปลี่ยนแบตเตอรี่รถยนต์
                </Link>
              </li>
              <li>
                <Link href="/check-price" className="hover:text-red-400 transition-colors">
                  เช็คราคาแบตเตอรี่
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-red-400 transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">ติดต่อเรา</h4>
            <div className="space-y-3">
              <Link
                href="tel:__PHONE__"
                className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors"
              >
                <PhoneCall className="w-5 h-5 text-red-400" />
                <span>โทรศัพท์ __PHONE__</span>
              </Link>
              <Link
                href="__LINE_URL__"
                target="_blank"
                className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-[#00B900]" />
                <span>LINE __LINE_ID__</span>
              </Link>
              <Link
                href="__FACEBOOK_URL__"
                target="_blank"
                className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#1877F2]" />
                <span>Facebook __BRAND_NAME__</span>
              </Link>
              <Link
                href="__GOOGLE_MAP_URL__"
                target="_blank"
                className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors"
              >
                <Map className="w-5 h-5 text-red-400" />
                <span>Google Maps ดูแผนที่ร้าน</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-sm">
          © {new Date().getFullYear()} __BRAND_NAME__. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

import { Metadata } from "next";
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd } from "@/lib/seo";
import BatteryChecker from "@/components/BatteryChecker";
import Link from "next/link";
import { PhoneCall, MessageCircle, Clock, Shield, Zap, Award, Search, MapPin, Facebook, Map } from "lucide-react";

const PAGE_TITLE = "เช็ครุ่นแบตเตอรี่รถยนต์ ค้นหาแบตเตอรี่ที่เหมาะสมตามรุ่นรถ | __BRAND_NAME__";
const PAGE_DESC =
  "เช็ครุ่นแบตเตอรี่รถยนต์ที่เหมาะสมสำหรับรถคุณ ทุกยี่ห้อ Toyota Honda Mazda Nissan พร้อมสเปก แอมป์ CCA และขั้วแบตเตอรี่ บริการเปลี่ยนถึงที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  keywords: [
    "เช็ครุ่นแบตเตอรี่รถยนต์",
    "แบตเตอรี่รถยนต์รุ่นไหนดี",
    "เปลี่ยนแบตเตอรี่รถยนต์",
    "แบตเตอรี่ Toyota",
    "แบตเตอรี่ Honda",
    "แบตเตอรี่ Mazda",
    "แบตเตอรี่ Nissan",
    "เปลี่ยนแบตเตอรี่ถึงที่",
    "แบตเตอรี่รถยนต์",
    "แบตเตอรี่ GS",
    "แบตเตอรี่ FB",
    "แบตเตอรี่ Panasonic",
    "บริการเปลี่ยนแบตเตอรี่ 24 ชั่วโมง",
  ],
  alternates: {
    canonical: "/check-price",
  },
  openGraph: {
    title: PAGE_TITLE,
    description: PAGE_DESC,
    url: `${SITE_CONFIG.url}/check-price`,
    type: "website",
    siteName: SITE_CONFIG.siteName,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "เช็ครุ่นแบตเตอรี่รถยนต์ - __BRAND_NAME__",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESC,
    images: [SITE_CONFIG.ogImage],
  },
};

export default function CheckPricePage() {
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "หน้าแรก", url: SITE_CONFIG.url },
    { name: "เช็ครุ่นแบตเตอรี่รถยนต์", url: `${SITE_CONFIG.url}/check-price` },
  ]);

  const webPageJsonLd = generateWebPageJsonLd(
    PAGE_TITLE,
    PAGE_DESC,
    "/check-price"
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "แบตเตอรี่รถยนต์ควรเปลี่ยนทุกกี่ปี?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "โดยทั่วไปแบตเตอรี่มีอายุใช้งาน 1.5 - 3 ปี ขึ้นอยู่กับสภาพการใช้งานและยี่ห้อของแบตเตอรี่ หากสังเกตว่าสตาร์ทรถช้าลง ควรตรวจเช็คทันที",
        },
      },
      {
        "@type": "Question",
        name: "เปลี่ยนแบตเตอรี่นอกสถานที่ใช้เวลากี่นาที?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "การเปลี่ยนแบตเตอรี่ใช้เวลาเพียง 15 - 30 นาที พร้อมตรวจเช็คระบบไฟฟ้าให้ฟรี ช่างจะเดินทางถึงที่ภายใน 30 นาทีหลังจากยืนยันออเดอร์",
        },
      },
      {
        "@type": "Question",
        name: "แบตเตอรี่ MF, EFB, AGM ต่างกันอย่างไร?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "MF (Maintenance Free) คือแบตทั่วไปไม่ต้องเติมน้ำ, EFB (Enhanced Flooded) ทนทานกว่า MF เหมาะกับรถที่มีระบบ Start-Stop, AGM (Absorbed Glass Mat) ทนทานที่สุด เหมาะกับรถหรูหรือรถที่ใช้อุปกรณ์ไฟฟ้ามาก",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <div className="min-h-screen bg-white">
        {/* ── Hero Section ── */}
        <section className="relative overflow-hidden bg-slate-950 pt-8 pb-12 sm:pt-12 sm:pb-16 md:pt-16 md:pb-24 px-4">
          <div className="absolute top-0 left-0 w-64 h-64 md:w-[500px] md:h-[500px] bg-red-600/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 md:w-[400px] md:h-[400px] bg-red-400/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

          <div className="max-w-5xl mx-auto relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-red-600/10 border border-red-600/20 text-red-400 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full mb-4 sm:mb-5 tracking-widest uppercase">
              <Search className="w-3 h-3" />
              เช็ครุ่นแบตเตอรี่รถยนต์
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 md:mb-4 leading-tight px-2">
              ค้นหาแบตเตอรี่ที่เหมาะสมสำหรับรถคุณ
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-2 mb-6 md:mb-8">
              เลือกรถยนต์ของคุณ เพื่อดูแบตเตอรี่ขนาดที่เหมาะสม พร้อมสเปก CCA และแอมป์
              เรามีบริการเปลี่ยนถึงที่ ฟรีค่าแรง ทั่วห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
              {[
                { icon: <Clock className="w-3.5 h-3.5" />, label: "ถึงที่ใน 30 นาที" },
                { icon: <Shield className="w-3.5 h-3.5" />, label: "รับประกัน 1-2 ปี" },
                { icon: <Zap className="w-3.5 h-3.5" />, label: "เปลี่ยนฟรีค่าแรง" },
                { icon: <Award className="w-3.5 h-3.5" />, label: "แบตแท้ 100%" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-1.5 text-white/60 text-[10px] sm:text-xs font-medium">
                  <div className="text-red-400">{b.icon}</div>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Checker Section ── */}
        <section className="relative -mt-6 sm:-mt-8 z-20 px-4 max-w-5xl mx-auto">
          <BatteryChecker />
        </section>

        {/* ── CTA Bottom ── */}
        <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-red-600 via-red-600 to-red-700 relative overflow-hidden mt-16">
          <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 md:mb-4 leading-tight">
              ต้องการให้ช่างประเมินแบตเตอรี่ให้?
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-6 md:mb-8 max-w-xl mx-auto">
              ทีมช่างผู้เชี่ยวชาญพร้อมให้คำปรึกษาฟรี ส่งรูปรถหรือแบตเตอรี่เดิมผ่านไลน์
              เพื่อให้เราประเมินขนาดและแจ้งราคาให้ทราบทันที
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href={`tel:${SITE_CONFIG.phone}`}
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-red-700 font-bold text-sm md:text-base h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all shadow-lg"
              >
                <PhoneCall className="w-4 h-4 md:w-5 md:h-5" />
                โทร {SITE_CONFIG.phoneFormatted}
              </Link>
              <Link
                href={SITE_CONFIG.lineUrl}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 border border-white/40 text-white font-bold text-sm md:text-base h-12 md:h-14 px-6 md:px-8 rounded-xl md:rounded-2xl transition-all"
              >
                <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                แอดไลน์ {SITE_CONFIG.lineId}
              </Link>
            </div>
          </div>
        </section>

        {/* ── Contact Section ── */}
        <section id="contact" className="py-10 md:py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 text-center mb-2">
              ติดต่อเรา
            </h2>
            <p className="text-slate-500 text-sm text-center mb-8">
              __BRAND_NAME__ พร้อมให้บริการเปลี่ยนแบตเตอรี่ถึงที่ 24 ชั่วโมง
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="tel:__PHONE__"
                className="flex items-center gap-4 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl p-5 transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <PhoneCall className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">โทรศัพท์</div>
                  <div className="text-red-600 font-semibold">__PHONE__</div>
                </div>
              </Link>
              <Link
                href="__LINE_URL__"
                target="_blank"
                className="flex items-center gap-4 bg-slate-50 hover:bg-green-50 border border-slate-200 hover:border-green-200 rounded-xl p-5 transition-all group"
              >
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <MessageCircle className="w-6 h-6 text-[#00B900]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">LINE</div>
                  <div className="text-[#00B900] font-semibold">__LINE_ID__</div>
                </div>
              </Link>
              <Link
                href="__FACEBOOK_URL__"
                target="_blank"
                className="flex items-center gap-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl p-5 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 group-hover:bg-blue-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <Facebook className="w-6 h-6 text-[#1877F2]" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Facebook</div>
                  <div className="text-[#1877F2] font-semibold">__BRAND_NAME__</div>
                </div>
              </Link>
              <Link
                href="__GOOGLE_MAP_URL__"
                target="_blank"
                className="flex items-center gap-4 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl p-5 transition-all group"
              >
                <div className="w-12 h-12 bg-red-100 group-hover:bg-red-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                  <Map className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">Google Maps</div>
                  <div className="text-red-600 font-semibold">ดูแผนที่ร้าน</div>
                </div>
              </Link>
            </div>
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                <MapPin className="w-4 h-4 text-red-400" />
                <span>บริการพื้นที่: ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ Schema Section ── */}
        <section className="py-10 md:py-16 px-4 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 text-center mb-6 md:mb-8">
              คำถามที่พบบ่อยเกี่ยวกับแบตเตอรี่รถยนต์
            </h2>
            <div className="space-y-2.5 md:space-y-3">
              {[
                {
                  q: "แบตเตอรี่รถยนต์ควรเปลี่ยนทุกกี่ปี?",
                  a: "โดยทั่วไปแบตเตอรี่มีอายุใช้งาน 1.5 - 3 ปี ขึ้นอยู่กับสภาพการใช้งานและยี่ห้อของแบตเตอรี่ หากสังเกตว่าสตาร์ทรถช้าลง ระบบไฟในรถทำงานผิดปกติ หรือมีคราบขี้เกลือเกาะที่ขั้วแบตเตอรี่ ควรตรวจเช็คทันที",
                },
                {
                  q: "เปลี่ยนแบตเตอรี่นอกสถานที่ใช้เวลากี่นาที?",
                  a: "การเปลี่ยนแบตเตอรี่ใช้เวลาเพียง 15 - 30 นาที พร้อมตรวจเช็คระบบไฟฟ้าให้ฟรี ช่างจะเดินทางถึงที่ภายใน 30 นาทีหลังจากยืนยันออเดอร์",
                },
                {
                  q: "แบตเตอรี่ MF, EFB, AGM ต่างกันอย่างไร?",
                  a: "MF (Maintenance Free) คือแบตทั่วไปไม่ต้องเติมน้ำ, EFB (Enhanced Flooded) ทนทานกว่า MF และคายไฟได้ดีกว่า เหมาะกับรถที่มีระบบ Start-Stop หรือรถที่มีอุปกรณ์ไฟฟ้ามาก, AGM (Absorbed Glass Mat) ทนทานที่สุด จ่ายไฟเสถียรสุด เหมาะกับรถยุโรปหรู",
                },
                {
                  q: "ขั้ว L (ซ้าย) กับขั้ว R (ขวา) ต่างกันอย่างไร?",
                  a: "เมื่อหันหน้าเข้าหาขั้วแบตเตอรี่ หากขั้วบวก (+) อยู่ฝั่งซ้ายคือขั้ว L หากอยู่ฝั่งขวาคือขั้ว R การเลือกซื้อต้องใช้ขั้วให้ตรงกับรุ่นรถเดิม มิฉะนั้นสายไฟรถอาจจะยาวไม่พอที่จะต่อเข้ากับขั้วแบตเตอรี่ได้",
                }
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white rounded-xl md:rounded-2xl border border-slate-200 hover:border-red-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-semibold text-slate-800 hover:text-red-600 transition-colors select-none list-none text-sm md:text-base">
                    <span className="pr-3">{faq.q}</span>
                    <div className="flex-shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg md:rounded-xl bg-red-50 group-open:bg-red-600 flex items-center justify-center transition-all">
                      <svg
                        className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600 group-open:text-white group-open:rotate-45 transition-all duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  </summary>
                  <div className="px-4 md:px-5 pb-4 md:pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-3 md:pt-4 text-xs md:text-sm">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Extra padding for sticky bar on mobile */}
        <div className="h-20 md:h-0" />
      </div>
    </>
  );
}

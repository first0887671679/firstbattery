import { ensureBrandMigration } from "@/lib/auto-migrate-brand";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG, generateFAQJsonLd, generateBreadcrumbJsonLd, generateWebPageJsonLd } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import {
  PhoneCall, MessageCircle, Battery, BatteryCharging, Clock, Shield,
  ThumbsUp, Zap, MapPin, Star, Sparkles, CheckCircle2,
  Wrench, LocateFixed, BadgeCheck, Timer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";

const HeroSlider = nextDynamic(() => import("@/components/HeroSlider"));
const BatteryChecker = nextDynamic(() => import("@/components/BatteryChecker"));
const AnimateOnScroll = nextDynamic(() => import("@/components/AnimateOnScroll"));

export const revalidate = 60;

export const metadata: Metadata = {
  title: "PORNPISIT BATTERY | เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม.",
  description: "บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง ถึงที่ภายใน 30 นาที ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ โทรเลย 0996731296",
  alternates: { canonical: "/" },
};

// ─── Icon Maps ────────────────────────────────────────────────────────────────
const iconMap: Record<string, React.ReactNode> = {
  Battery:         <Battery className="w-7 h-7" />,
  BatteryCharging: <BatteryCharging className="w-7 h-7" />,
  Clock:           <Clock className="w-7 h-7" />,
  Shield:          <Shield className="w-7 h-7" />,
  Zap:             <Zap className="w-7 h-7" />,
  ThumbsUp:        <ThumbsUp className="w-7 h-7" />,
  Star:            <Star className="w-7 h-7" />,
  CheckCircle2:    <CheckCircle2 className="w-7 h-7" />,
  Wrench:          <Wrench className="w-7 h-7" />,
  MapPin:          <MapPin className="w-7 h-7" />,
  LocateFixed:     <LocateFixed className="w-7 h-7" />,
  BadgeCheck:      <BadgeCheck className="w-7 h-7" />,
  Timer:           <Timer className="w-7 h-7" />,
  Sparkles:        <Sparkles className="w-7 h-7" />,
};

const whyUsIconMap: Record<string, React.ReactNode> = {
  Clock:           <Clock className="w-10 h-10 text-red-500" />,
  Zap:             <Zap className="w-10 h-10 text-red-500" />,
  Shield:          <Shield className="w-10 h-10 text-red-500" />,
  ThumbsUp:        <ThumbsUp className="w-10 h-10 text-red-500" />,
  Star:            <Star className="w-10 h-10 text-red-500" />,
  Battery:         <Battery className="w-10 h-10 text-red-500" />,
  BatteryCharging: <BatteryCharging className="w-10 h-10 text-red-500" />,
  CheckCircle2:    <CheckCircle2 className="w-10 h-10 text-red-500" />,
  BadgeCheck:      <BadgeCheck className="w-10 h-10 text-red-500" />,
  MapPin:          <MapPin className="w-10 h-10 text-red-500" />,
  Timer:           <Timer className="w-10 h-10 text-red-500" />,
  LocateFixed:     <LocateFixed className="w-10 h-10 text-red-500" />,
};

function parseJson(str: string): Record<string, any> {
  try { return JSON.parse(str); } catch { return {}; }
}

function getAspectStyle(ratio?: string): React.CSSProperties {
  if (!ratio || ratio === "free") return { aspectRatio: "16/9" };
  const normalized = ratio.replace(":", "/");
  return { aspectRatio: normalized };
}

function getSection(sections: any[], type: string) {
  return sections.find((s: any) => s.type === type && s.isActive);
}

export default async function Home() {
  // Auto-migrate DB brand data on first request
  await ensureBrandMigration();

  let homePage = null;
  try {
    homePage = await (prisma as any).page.findUnique({
      where: { slug: "home", isActive: true },
      include: { sections: { where: { isActive: true }, orderBy: { order: "asc" } } },
    });
  } catch {
    // DB unreachable during build — render with fallbacks
  }

  const sections = homePage?.sections || [];

  // ── Parse relevant sections ─────────────────────────────────────────────────
  const heroSection     = getSection(sections, "hero");
  const heroData        = heroSection ? parseJson(heroSection.content) : {};
  const gallerySection  = getSection(sections, "gallery");
  const galleryData     = gallerySection ? parseJson(gallerySection.content) : {};
  const faqSection      = getSection(sections, "faq");
  const faqData         = faqSection ? parseJson(faqSection.content) : {};
  const faqItems        = Array.isArray(faqData.items) ? faqData.items : [];
  const contactSection  = getSection(sections, "contact");
  const contactData     = contactSection ? parseJson(contactSection.content) : {};

  // ── Fallback values ─────────────────────────────────────────────────────────
  const phone   = contactData.phone   || "0996731296";
  const lineId  = contactData.lineId  || "@398kyxfq";
  const lineUrl = contactData.lineUrl || "https://lin.ee/OBB86S4";

  const heroHeading     = heroData.heading     || "แบตหมด?";
  const heroSubheading  = heroData.subheading  || "เราถึงที่คุณใน 30 นาที";
  const heroDescription = heroData.description || "บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง\nช่างผู้เชี่ยวชาญพร้อมออกให้บริการทันที";
  const heroPhoneUrl    = heroData.phoneUrl    || "tel:0996731296";
  const heroLineUrl     = heroData.lineUrl     || "https://lin.ee/OBB86S4";
  const heroImage       = heroSection?.imageUrl || "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1920&auto=format&fit=crop";

  // ── JSON-LD ─────────────────────────────────────────────────────────────────
  const faqs = faqItems.map((f: any) => ({ question: f.question || "", answer: f.answer || "" }));
  const faqJsonLd        = generateFAQJsonLd(faqs);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([{ name: "หน้าแรก", url: SITE_CONFIG.url }]);
  const webPageJsonLd    = generateWebPageJsonLd(
    "บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง",
    SITE_CONFIG.description,
    "/"
  );

  /* ═══════════════════════════════════════════════════════════════════════════
     Section Renderer — Single-Service Battery Landing Page
  ══════════════════════════════════════════════════════════════════════════════ */
  const renderSection = (section: any) => {
    const data = parseJson(section.content);
    const type = section.type;

    /* ═══════ HERO ═══════ */
    if (type === "hero") {
      let heroSlides: any[] = [];
      if (Array.isArray(data.slides) && data.slides.length > 0) {
        heroSlides = data.slides;
      } else {
        heroSlides = [{
          heading:         data.heading     || heroHeading,
          subheading:      data.subheading  || heroSubheading,
          description: data.description || heroDescription,
          phoneUrl: data.phoneUrl || heroPhoneUrl,
          lineUrl: data.lineUrl || heroLineUrl,
          imageUrl: section.imageUrl || heroImage,
          textAlign: "center",
          overlayOpacity: 55,
        }];
      }
      return (
        <HeroSlider
          key={section.id}
          slides={heroSlides}
          autoSlide={data.autoSlide !== false}
          intervalMs={data.intervalMs || 5000}
        />
      );
    }

    /* ═══════════════════ SERVICES — Single Battery Service ═══════════════════ */
    if (type === "services") {
      // Benefits: use DB data.benefits[] if available, otherwise use defaults
      const benefits: string[] = Array.isArray(data.benefits) && data.benefits.length > 0
        ? data.benefits
        : [
            "ช่างออกนอกสถานที่ภายใน 30 นาที ไม่ต้องเข็นรถ",
            "บริการทุกวัน 24 ชั่วโมง ไม่เว้นวันหยุด",
            "แบตเตอรี่แท้คุณภาพสูง มียี่ห้อให้เลือกหลากหลาย",
            "ราคาโปร่งใส ไม่มีค่าใช้จ่ายแอบแฝง รับประกัน 1 ปี",
            "ช่างผ่านการฝึกอบรม มีประสบการณ์กว่า 10 ปี",
          ];

      return (
        <section key={section.id} id="services" className="relative overflow-hidden bg-neutral-950 py-20 md:py-32 px-4">
          {/* Background */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-red-600/[0.05] rounded-full blur-3xl -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-red-500/[0.03] rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* ── Badge ── */}
            <div className="flex justify-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2.5 bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-5 py-2 rounded-full tracking-[0.2em] uppercase">
                <BatteryCharging className="w-3.5 h-3.5" />
                บริการของเรา
              </div>
            </div>

            {/* ── Main Content: 2-col on desktop ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center mb-16 md:mb-24">
              {/* Left — Text */}
              <div>
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-5">
                  {section.title || "เปลี่ยนแบตเตอรี่"}
                  <span className="block text-red-500 mt-1">{data.subtitle || "นอกสถานที่ ถึงที่คุณ"}</span>
                </h2>
                <p className="text-neutral-400 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
                  {data.description || "ไม่ต้องลากรถ ไม่ต้องหาอู่ เพียงโทรหาเรา ช่างจะออกไปเปลี่ยนแบตเตอรี่ให้ถึงที่คุณทันที ไม่ว่าจะเป็นที่บ้าน ที่ทำงาน หรือกลางถนน"}
                </p>

                {/* Benefits list */}
                <ul className="space-y-3 mb-10">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-600/15 border border-red-500/30 flex items-center justify-center mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />
                      </div>
                      <span className="text-neutral-300 text-sm md:text-base leading-snug">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href={`tel:${phone}`}
                    className="inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-500 active:scale-[0.97] text-white font-bold text-base h-14 px-8 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(220,38,38,0.5)] hover:shadow-[0_8px_30px_-4px_rgba(220,38,38,0.65)] sm:hover:-translate-y-0.5">
                    <PhoneCall className="w-5 h-5" />โทรเรียกช่างด่วน
                  </Link>
                  <Link href={lineUrl} target="_blank"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#06C755] hover:bg-[#05b34b] active:scale-[0.97] text-white font-bold text-base h-14 px-8 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(6,199,85,0.35)] sm:hover:-translate-y-0.5">
                    <MessageCircle className="w-5 h-5" />แอดไลน์ส่งพิกัด
                  </Link>
                </div>
              </div>

              {/* Right — Visual Card */}
              <div className="relative">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-red-600/10 rounded-3xl blur-2xl scale-110" />
                <div className="relative bg-black border border-neutral-800/60 rounded-3xl p-8 md:p-10 overflow-hidden hover:border-red-500/30 transition-colors duration-500">
                  {/* Top accent line */}
                  <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

                  {/* Big icon */}
                  <div className="flex justify-center mb-8">
                    <div className="relative w-24 h-24 rounded-3xl bg-red-600/10 border border-red-500/20 flex items-center justify-center">
                      <BatteryCharging className="w-12 h-12 text-red-500" />
                      <div className="absolute inset-0 rounded-3xl animate-pulse bg-red-600/5" />
                    </div>
                  </div>

                  {/* Service name */}
                  <h3 className="text-center text-xl md:text-2xl font-black text-white mb-2">เปลี่ยนแบตเตอรี่รถยนต์</h3>
                  <p className="text-center text-red-400 font-semibold text-sm mb-8">บริการนอกสถานที่ · 24 ชั่วโมง</p>

                  {/* Mini stats */}
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "30 นาที", label: "ถึงที่เฉลี่ย", icon: <Timer className="w-4 h-4" /> },
                      { value: "24 ชม.",  label: "เปิดบริการ",  icon: <Clock className="w-4 h-4" /> },
                      { value: "1,000+",  label: "คันที่บริการ", icon: <BatteryCharging className="w-4 h-4" /> },
                      { value: "1 ปี",    label: "รับประกัน",   icon: <BadgeCheck className="w-4 h-4" /> },
                    ].map((s) => (
                      <div key={s.value} className="bg-neutral-900/80 border border-neutral-800/60 rounded-2xl p-4 text-center hover:border-red-500/30 transition-colors duration-300">
                        <div className="flex justify-center mb-1.5 text-red-500">{s.icon}</div>
                        <p className="text-xl font-black text-red-500 leading-none mb-1">{s.value}</p>
                        <p className="text-neutral-500 text-[11px]">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Bottom accent */}
                  <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
                </div>
              </div>
            </div>

            {/* ── Service Areas ── */}
            <div className="bg-black border border-neutral-800/50 rounded-2xl md:rounded-3xl p-7 md:p-10 text-center hover:border-red-500/20 transition-colors duration-300">
              <div className="inline-flex items-center gap-2.5 bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-5 py-2 rounded-full mb-5 tracking-[0.2em] uppercase">
                <MapPin className="w-3.5 h-3.5" />
                พื้นที่ให้บริการ
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
                ครอบคลุม<span className="text-red-400">ใจกลางกรุงเทพฯ</span>
              </h3>
              <p className="text-neutral-400 text-sm md:text-base mb-6 max-w-xl mx-auto">
                ช่างออกนอกสถานที่ได้ทุกจุดในเขตพื้นที่ด้านล่างนี้
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"].map((area) => (
                  <span key={area} className="bg-neutral-900 text-neutral-300 text-xs md:text-sm font-medium px-4 py-2 rounded-full border border-neutral-800 hover:border-red-500/40 hover:bg-red-600/5 hover:text-white transition-all duration-300 cursor-default">
                    <MapPin className="w-3 h-3 inline-block mr-1.5 text-red-400" />{area}
                  </span>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Link href={`tel:${phone}`}
                  className="inline-flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-500 active:scale-[0.97] text-white font-bold text-base h-14 px-8 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(220,38,38,0.5)] hover:shadow-[0_8px_30px_-4px_rgba(220,38,38,0.6)]">
                  <PhoneCall className="w-5 h-5" />โทรเรียกช่างด่วน
                </Link>
                <Link href={lineUrl} target="_blank"
                  className="inline-flex items-center justify-center gap-2.5 bg-[#06C755] hover:bg-[#05b34b] active:scale-[0.97] text-white font-bold text-base h-14 px-8 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(6,199,85,0.35)]">
                  <MessageCircle className="w-5 h-5" />แอดไลน์ส่งพิกัด
                </Link>
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ BATTERY CHECKER ═══════ */
    if (type === "battery-checker") {
      return (
        <section key={section.id} className="relative overflow-hidden bg-black py-16 md:py-28 px-4">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.04),transparent_70%)]" />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-10 md:mb-14">
              <div className="inline-flex items-center gap-2.5 bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-5 py-2 rounded-full mb-5 tracking-[0.2em] uppercase">
                <Battery className="w-3.5 h-3.5" />
                เช็ครุ่นแบต
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-3">
                {data.heading || section.title || "แบตเตอรี่รุ่นไหน"}
                <span className="block text-red-400">{data.subheading || "เหมาะกับรถคุณ?"}</span>
              </h3>
              <p className="text-neutral-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
                {data.description || "เลือกยี่ห้อและรุ่นรถเพื่อดูแบตเตอรี่ที่เหมาะสม พร้อมราคาโดยประมาณ"}
              </p>
            </div>
            <BatteryChecker showDropdown={data.showDropdown !== false} showBrandGrid={data.showBrandGrid !== false} />
          </div>
        </section>
      );
    }

    /* ═══════════════════ CTA BANNER ═══════════════════ */
    if (type === "cta-banner") {
      const ctaPhone = data.phone || phone;
      const ctaLineUrl = data.lineUrl || lineUrl;
      return (
        <section key={section.id} className="relative overflow-hidden bg-black py-14 md:py-24 px-4">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="relative rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-br from-red-950/40 via-neutral-950 to-neutral-950">
              {/* Glow effects */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
              <div className="absolute bottom-0 left-0 w-60 h-60 bg-red-600/5 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />

              <div className="relative z-10 px-6 py-10 md:px-12 md:py-14 flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/25 text-red-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-wider uppercase">
                    <Zap className="w-3.5 h-3.5" />
                    {data.badge || "พร้อมออกให้บริการทันที"}
                  </div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-3">
                    {data.heading || "แบตหมด? อย่ารอช้า —"}<br className="hidden sm:block" />
                    <span className="text-red-400"> {data.headingSub || "โทรหาเราได้ทันที"}</span>
                  </h3>
                  <p className="text-neutral-400 text-sm md:text-base leading-relaxed mb-4">
                    {data.description || "ช่างผู้เชี่ยวชาญออกนอกสถานที่ภายใน 30 นาที · บริการ 24 ชั่วโมง"}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {(Array.isArray(data.badges) && data.badges.length > 0 ? data.badges : [
                      "✓ ออกนอกสถานที่",
                      "✓ ช่างมีประสบการณ์",
                      "✓ ราคาโปร่งใส",
                    ]).map((badge: string) => (
                      <span key={badge} className="text-xs text-neutral-400 bg-neutral-900/80 border border-neutral-800 px-3 py-1.5 rounded-full">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto md:min-w-[240px]">
                  <Link
                    href={`tel:${ctaPhone}`}
                    className="group/btn flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-500 active:scale-[0.97] text-white font-bold rounded-2xl px-8 py-4 h-14 transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(220,38,38,0.5)] text-base"
                  >
                    <PhoneCall className="w-5 h-5 transition-transform group-hover/btn:rotate-12" />
                    <span>โทรด่วน {ctaPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</span>
                  </Link>
                  <Link
                    href={ctaLineUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn flex items-center justify-center gap-2.5 bg-[#06C755] hover:bg-[#05b84d] active:scale-[0.97] text-white font-bold rounded-2xl px-8 py-4 h-14 transition-all duration-300 shadow-[0_8px_25px_-8px_rgba(6,199,85,0.35)] text-base"
                  >
                    <MessageCircle className="w-5 h-5 transition-transform group-hover/btn:scale-110" />
                    <span>ติดต่อ LINE</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }

    /* ═══════════════════ GALLERY ═══════════════════ */
    if (type === "gallery") {
      const images = Array.isArray(data.images) ? data.images : [];
      return <Showcase key={section.id} images={images} />;
    }

    /* ═══════════════════ WHY US ═══════════════════ */
    if (type === "why-us") {
      const items = Array.isArray(data.items) ? data.items : [];
      return (
        <section key={section.id} id="why-us" className="py-20 md:py-32 px-4 relative overflow-hidden">
          {/* Red gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-700 to-red-900" />
          {/* Pattern overlay */}
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`, backgroundSize: '28px 28px' }} />
          {/* Glow orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.04] rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-black/10 rounded-full translate-y-1/2 -translate-x-1/3" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="text-center mb-12 md:mb-20">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-[11px] font-bold px-5 py-2 rounded-full mb-5 tracking-[0.2em] uppercase border border-white/20">
                {data.badge || "Why Choose Us"}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 md:mb-5 leading-[1.1] tracking-tight px-2">
                {section.title || "ทำไมต้องเลือกเรา?"}
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-sm md:text-lg leading-relaxed px-2">
                {data.subtitle || "เรามุ่งมั่นให้บริการที่ดีที่สุด เพื่อให้คุณกลับมาใช้รถได้อย่างมั่นใจ"}
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {items.map((item: any, idx: number) => (
                <div key={idx} className="group bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl md:rounded-3xl p-5 md:p-8 text-center backdrop-blur-sm transition-all duration-500 sm:hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.2)]">
                  <div className="w-14 h-14 md:w-18 md:h-18 mx-auto bg-white/15 rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:bg-white/25 group-hover:scale-110 transition-all duration-500 text-white [&>svg]:w-7 [&>svg]:h-7 md:[&>svg]:w-10 md:[&>svg]:h-10">
                    {whyUsIconMap[item.icon || "Star"] || whyUsIconMap.Star}
                  </div>
                  <h3 className="text-sm md:text-lg font-bold text-white mb-2 md:mb-3 leading-snug">{item.title}</h3>
                  <p className="text-white/60 text-xs md:text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════════════════ TESTIMONIALS ═══════════════════ */
    if (type === "testimonials") {
      const items = Array.isArray(data.items) ? data.items : [];
      return <Testimonials key={section.id} items={items.map((t: any) => ({
        name: t.name || "",
        role: t.role || "",
        avatar: t.avatar || "https://i.pravatar.cc/120",
        rating: t.rating || 5,
        content: t.content || "",
      }))} />;
    }

    /* ═══════════════════ FAQ ═══════════════════ */
    if (type === "faq") {
      const items = Array.isArray(data.items) ? data.items : [];
      return (
        <section key={section.id} id="faq" className="py-20 md:py-32 px-4 bg-neutral-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(220,38,38,0.03),transparent_70%)]" />
          <div className="max-w-3xl mx-auto relative z-10">
            <div className="text-center mb-10 md:mb-16">
              <div className="inline-flex items-center gap-2.5 bg-red-600/10 border border-red-500/20 text-red-400 text-[11px] font-bold px-5 py-2 rounded-full mb-5 tracking-[0.2em] uppercase">
                FAQ
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-4 px-2 leading-[1.1] tracking-tight">
                {section.title || "คำถามที่พบบ่อย"}
              </h2>
              <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base px-2">
                {data.subtitle || "ข้อสงสัยเกี่ยวกับบริการเปลี่ยนแบตเตอรี่นอกสถานที่"}
              </p>
            </div>
            <div className="space-y-3">
              {items.map((faq: any, idx: number) => (
                <details key={idx} className="group bg-neutral-900/80 rounded-2xl border border-neutral-800/60 hover:border-red-500/30 overflow-hidden transition-all duration-300 hover:shadow-[0_4px_20px_-6px_rgba(220,38,38,0.1)]">
                  <summary className="flex items-center justify-between cursor-pointer p-5 md:p-6 font-semibold text-white hover:text-red-400 transition-colors select-none list-none text-sm md:text-base">
                    <span className="pr-4">{faq.question}</span>
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-red-600/10 group-open:bg-red-600 flex items-center justify-center transition-all duration-300">
                      <svg className="w-4 h-4 text-red-400 group-open:text-white group-open:rotate-45 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                    </div>
                  </summary>
                  <div className="px-5 md:px-6 pb-5 md:pb-6 text-neutral-400 leading-relaxed border-t border-neutral-800/50 pt-4 text-sm">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ CONTACT ═══════ */
    if (type === "contact") {
      const cPhone  = data.phone   || phone;
      const cLine   = data.lineUrl || lineUrl;
      const cLineId = data.lineId  || lineId;
      return (
        <section key={section.id} id="contact" className="py-20 md:py-36 px-4 bg-black relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] md:w-[1000px] md:h-[1000px] bg-red-600/[0.07] rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-700/[0.04] rounded-full blur-3xl" />

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-red-600/15 border border-red-500/25 text-red-300 text-[11px] font-bold px-5 py-2 rounded-full mb-6 tracking-[0.2em] uppercase">
              <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              {data.badge || "พร้อมให้บริการ 24/7"}
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mb-4 md:mb-6 leading-[1.05] tracking-tight px-2">
              {data.heading || "แบตหมด?"}<br />
              <span className="text-red-500">{data.headingSub || "โทรเลย!"}</span>
            </h2>
            <p className="text-neutral-400 text-base md:text-xl mb-8 md:mb-12 max-w-lg mx-auto leading-relaxed px-2">
              {data.description || "ช่างออกนอกสถานที่ภายใน 30 นาที บริการ 24 ชั่วโมงทุกวัน ไม่เว้นวันหยุด"}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch justify-center gap-4 max-w-xl mx-auto">
              <Link href={`tel:${cPhone}`}
                className="group flex-1 flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 active:scale-[0.97] text-white font-black text-lg md:text-2xl h-16 md:h-[72px] px-6 md:px-10 rounded-2xl transition-all duration-300 shadow-[0_12px_50px_-8px_rgba(220,38,38,0.55)] hover:shadow-[0_16px_60px_-8px_rgba(220,38,38,0.7)] sm:hover:-translate-y-1">
                <PhoneCall className="w-6 h-6 md:w-7 md:h-7 shrink-0 transition-transform group-hover:rotate-12" />
                {cPhone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
              </Link>

              <Link href={cLine} target="_blank"
                className="group flex-1 flex items-center justify-center gap-3 bg-[#06C755] hover:bg-[#05b34b] active:scale-[0.97] text-white font-bold text-lg md:text-2xl h-16 md:h-[72px] px-6 md:px-10 rounded-2xl transition-all duration-300 shadow-[0_8px_30px_-8px_rgba(6,199,85,0.35)] sm:hover:-translate-y-1">
                <MessageCircle className="w-6 h-6 md:w-7 md:h-7 shrink-0 transition-transform group-hover:scale-110" />
                แอดไลน์: {cLineId}
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-5 md:gap-8 mt-10 md:mt-14">
              {(Array.isArray(data.trustSignals) && data.trustSignals.length > 0 ? data.trustSignals : [
                { icon: "MapPin",  label: "ออกนอกสถานที่ทุกพื้นที่" },
                { icon: "Clock",   label: "บริการ 24 ชั่วโมง" },
                { icon: "Shield",  label: "รับประกันคุณภาพ" },
              ]).map((t: any, i: number) => {
                const TrustIcon: Record<string, React.ReactNode> = {
                  MapPin: <MapPin className="w-4 h-4" />, Clock: <Clock className="w-4 h-4" />,
                  Shield: <Shield className="w-4 h-4" />, Star: <Star className="w-4 h-4" />,
                  Zap: <Zap className="w-4 h-4" />, ThumbsUp: <ThumbsUp className="w-4 h-4" />,
                  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
                };
                return (
                  <div key={i} className="flex items-center gap-2 text-neutral-400 text-xs md:text-sm">
                    <div className="text-red-400">{TrustIcon[t.icon] || TrustIcon.Star}</div>
                    {t.label}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════ TEXT ═══════ */
    if (type === "text") {
      return (
        <section key={section.id} className="py-16 md:py-28 px-4 bg-neutral-950">
          <div className="max-w-4xl mx-auto">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 md:mb-6 text-center px-2">{section.title}</h2>
            )}
            <div className="text-neutral-300 leading-relaxed text-sm md:text-lg whitespace-pre-line">
              {data.body || ""}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════════════════ IMAGE ═══════════════════ */
    if (type === "image") {
      return (
        <section key={section.id} className="py-12 md:py-20 px-4 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 md:mb-6 px-2">{section.title}</h2>
            )}
            {section.imageUrl && (
              <div className="relative w-full rounded-2xl overflow-hidden" style={getAspectStyle(data.imageRatio)}>
                <Image src={section.imageUrl} alt={data.alt || section.title || ""} fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 90vw, 896px" />
              </div>
            )}
            {data.caption && <p className="text-neutral-400 mt-4 text-sm md:text-base">{data.caption}</p>}
          </div>
        </section>
      );
    }

    /* ═══════════════════ TEXT-IMAGE ═══════════════════ */
    if (type === "text-image") {
      const pos = data.imagePosition || "right";
      const isImageLeft = pos === "left";
      const isVertical = pos === "top" || pos === "bottom";
      const isTop = pos === "top";

      return (
        <section key={section.id} className="py-16 md:py-28 px-4 bg-neutral-950">
          <div className="max-w-6xl mx-auto">
            {section.title && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-5 md:mb-8 text-center px-2">{section.title}</h2>
            )}
            <div className={`flex ${isVertical ? "flex-col" : "flex-col md:flex-row"} gap-5 md:gap-8 items-center`}>
              {(isImageLeft || isTop) && section.imageUrl && (
                <div className={`${isVertical ? "w-full" : "w-full md:w-1/2"} relative rounded-2xl overflow-hidden`} style={getAspectStyle(data.imageRatio)}>
                  <Image src={section.imageUrl} alt={section.title || ""} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
              )}
              <div className={`${isVertical ? "w-full" : "w-full md:w-1/2"} text-neutral-300 leading-relaxed text-sm md:text-lg whitespace-pre-line`}>
                {data.body || ""}
              </div>
              {(!isImageLeft && !isTop) && section.imageUrl && (
                <div className={`${isVertical ? "w-full" : "w-full md:w-1/2"} relative rounded-2xl overflow-hidden`} style={getAspectStyle(data.imageRatio)}>
                  <Image src={section.imageUrl} alt={section.title || ""} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
                </div>
              )}
            </div>
          </div>
        </section>
      );
    }

    /* ═══════════════════ HEADER (skip — in layout) ═══════════════════ */
    if (type === "header") {
      return null;
    }

    /* ═══════════════════ SUB-HEADER ═══════════════════ */
    if (type === "sub-header") {
      const bgColors: Record<string, string> = {
        orange: "bg-gradient-to-r from-red-800 via-red-600 to-red-800",
        blue: "bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-700",
        green: "bg-gradient-to-r from-emerald-600 via-green-500 to-emerald-600",
        red: "bg-gradient-to-r from-red-700 via-rose-600 to-red-700",
        slate: "bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800",
        black: "bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950",
      };
      const bgClass = bgColors[data.bgColor || "orange"] || bgColors.orange;
      return (
        <div key={section.id} className={`${bgClass} relative overflow-hidden`}>
          <div className="absolute inset-0 bg-[linear-gradient(105deg,transparent_40%,rgba(255,255,255,0.06)_50%,transparent_60%)]" />
          <div className="relative max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 py-1.5 sm:py-2.5 px-3 sm:px-4 text-[10px] sm:text-sm font-medium text-white whitespace-nowrap overflow-hidden">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/50" />
              <span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-white/80" />
            </span>
            <span className="truncate min-w-0">{data.text || ""}</span>
            {data.linkUrl && data.linkLabel && (
              <Link
                href={data.linkUrl}
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 font-bold px-2.5 sm:px-3 py-0.5 rounded-full transition-all text-[10px] sm:text-xs flex-shrink-0"
              >
                {data.linkLabel}
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      );
    }

    /* ═══════════════════ FOOTER (skip — in layout) ═══════════════════ */
    if (type === "footer") {
      return null;
    }

    /* ═══════════════════ CUSTOM ═══════════════════ */
    if (type === "custom") {
      return (
        <section key={section.id} className="py-16 px-4 bg-black">
          <div className="max-w-6xl mx-auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content || "") }} />
        </section>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {sections.map((section: any) => {
        const rendered = renderSection(section);
        if (!rendered) return null;
        const sData = parseJson(section.content);
        const noAnimate = ["header", "sub-header", "footer"].includes(section.type);
        if (noAnimate || !sData.animation || sData.animation === "none") return rendered;
        return (
          <AnimateOnScroll
            key={`anim-${section.id}`}
            animation={sData.animation}
            speed={sData.animationSpeed || "normal"}
            delay={sData.animationDelay || 0}
          >
            {rendered}
          </AnimateOnScroll>
        );
      })}
    </div>
  );
}

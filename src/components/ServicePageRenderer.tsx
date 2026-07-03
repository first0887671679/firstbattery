import Link from "next/link";
import Image from "next/image";
import { PhoneCall, MessageCircle, Clock, Shield, CheckCircle, AlertTriangle, Wrench, Zap, MapPin, Phone, Facebook, Navigation, CalendarDays, Camera, Sparkles, Sun, Battery } from "lucide-react";
import { SITE_CONFIG } from "@/lib/seo";

/* ─── Icon mapping from string → component ─── */
const ICON_MAP: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-8 h-8 text-red-600" />,
  Shield: <Shield className="w-8 h-8 text-red-600" />,
  CheckCircle: <CheckCircle className="w-8 h-8 text-red-600" />,
  AlertTriangle: <AlertTriangle className="w-5 h-5 text-amber-500" />,
  Wrench: <Wrench className="w-8 h-8 text-red-600" />,
  Zap: <Zap className="w-8 h-8 text-red-600" />,
  Battery: <Battery className="w-8 h-8 text-red-600" />,
  Sun: <Sun className="w-8 h-8 text-red-600" />,
  Sparkles: <Sparkles className="w-8 h-8 text-red-600" />,
  Camera: <Camera className="w-8 h-8 text-red-600" />,
  MapPin: <MapPin className="w-6 h-6 text-red-600" />,
  Phone: <Phone className="w-8 h-8 text-red-600" />,
  PhoneCall: <PhoneCall className="w-5 h-5" />,
  MessageCircle: <MessageCircle className="w-5 h-5" />,
  Navigation: <Navigation className="w-4 h-4 text-red-600" />,
  CalendarDays: <CalendarDays className="w-10 h-10 md:w-12 md:h-12 text-red-600" />,
  Facebook: <Facebook className="w-8 h-8 text-[#1877F2]" />,
};

const ICON_SMALL: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />,
  Wrench: <Wrench className="w-6 h-6 text-red-600" />,
  Shield: <Shield className="w-6 h-6 text-red-600" />,
  CheckCircle: <CheckCircle className="w-6 h-6 text-red-600" />,
  Zap: <Zap className="w-6 h-6 text-red-500" />,
  Camera: <Camera className="w-5 h-5 text-red-600" />,
  MessageCircle: <MessageCircle className="w-5 h-5 text-red-600" />,
  Clock: <Clock className="w-4 h-4 text-red-600" />,
  Navigation: <Navigation className="w-4 h-4 text-red-600" />,
};

function getIcon(name: string, size: "normal" | "small" = "normal") {
  const map = size === "small" ? ICON_SMALL : ICON_MAP;
  return map[name] || null;
}

interface Section {
  id: string;
  type: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

interface ServicePageRendererProps {
  sections: Section[];
  slug: string;
  breadcrumbLabel: string;
}

export default function ServicePageRenderer({ sections, slug, breadcrumbLabel }: ServicePageRendererProps) {
  return (
    <div className="min-h-screen bg-white">
      {sections.map((section) => {
        const data = safeJsonParse(section.content);
        const type = section.type;

        if (type === "hero") return <HeroSection key={section.id} data={data} imageUrl={section.imageUrl} breadcrumbLabel={breadcrumbLabel} slug={slug} />;
        if (type === "why-us") return <WhyUsSection key={section.id} data={data} title={section.title} />;
        if (type === "info") return <InfoSection key={section.id} data={data} title={section.title} />;
        if (type === "areas") return <AreasSection key={section.id} data={data} title={section.title} />;
        if (type === "cta-bottom") return <CtaBottomSection key={section.id} data={data} />;
        if (type === "contact-channels") return <ContactChannelsSection key={section.id} data={data} title={section.title} />;
        if (type === "map") return <MapSection key={section.id} data={data} title={section.title} />;
        if (type === "hours") return <HoursSection key={section.id} data={data} title={section.title} />;
        if (type === "text") return <TextSection key={section.id} data={data} title={section.title} />;
        if (type === "image") return <ImageSection key={section.id} data={data} title={section.title} imageUrl={section.imageUrl} />;
        if (type === "text-image") return <TextImageSection key={section.id} data={data} title={section.title} imageUrl={section.imageUrl} />;
        return null;
      })}

      <div className="h-20 md:h-0" />
    </div>
  );
}

function safeJsonParse(str: string): Record<string, any> {
  try { return JSON.parse(str || "{}"); } catch { return {}; }
}

/* ═══════════════════════════════════════════════════
   SECTION RENDERERS
   ═══════════════════════════════════════════════════ */

function HeroSection({ data, imageUrl, breadcrumbLabel, slug }: { data: any; imageUrl: string | null; breadcrumbLabel: string; slug: string }) {
  const slide = Array.isArray(data.slides) && data.slides.length > 0 ? data.slides[0] : null;
  const heading = slide?.heading || data.heading || "";
  const description = slide?.description || data.description || "";
  const heroImageUrl = slide?.imageUrl || data.imageUrl || imageUrl || "";
  const ctaPhone = data.ctaPhoneLabel || "โทรเรียกช่างด่วน";
  const ctaLine = data.ctaLineLabel || "แอดไลน์ส่งพิกัด";
  const overlayOpacity = slide?.overlayOpacity ?? 45;

  return (
    <section className="relative overflow-hidden min-h-[520px] sm:min-h-[560px] md:min-h-[620px] flex items-center justify-center">
      {/* ─── Background Image ─── */}
      {heroImageUrl ? (
        <>
          <Image
            src={heroImageUrl}
            alt={heading.replace(/<[^>]*>/g, "") || breadcrumbLabel}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, rgba(15,23,42,${overlayOpacity / 100}), rgba(15,23,42,${Math.min(overlayOpacity + 25, 95) / 100}))` }} />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      )}

      {/* ─── Decorative Elements ─── */}
      <div className="absolute top-0 left-0 w-72 h-72 md:w-[600px] md:h-[600px] bg-red-600/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-56 h-56 md:w-[500px] md:h-[500px] bg-red-400/8 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* ─── Content ─── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 py-14 sm:py-16 md:py-20 text-center">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6 md:mb-8">
          <ol className="inline-flex items-center gap-2 text-xs sm:text-sm bg-white/10 backdrop-blur-md rounded-full px-4 py-1.5 border border-white/10">
            <li><Link href="/" className="text-white/60 hover:text-red-400 transition-colors">หน้าแรก</Link></li>
            <li className="text-white/30">/</li>
            <li className="text-red-400 font-medium">{breadcrumbLabel}</li>
          </ol>
        </nav>

        {/* Heading */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white mb-5 md:mb-6 leading-[1.25] tracking-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.3)]"
          dangerouslySetInnerHTML={{ __html: heading }}
        />

        {/* Description */}
        {description && (
          <div className="max-w-2xl mx-auto mb-8 md:mb-10">
            <p
              className="text-white/75 text-sm sm:text-base md:text-lg leading-relaxed drop-shadow-sm"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8 md:mb-10">
          <Link
            href={`tel:${SITE_CONFIG.phone}`}
            className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-400 hover:to-red-600 active:scale-[0.97] text-white font-bold text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 rounded-2xl transition-all duration-200 shadow-[0_8px_32px_rgba(220,38,38,0.4)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.5)]"
          >
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 group-hover:animate-pulse" />
            {ctaPhone}
          </Link>
          <Link
            href={SITE_CONFIG.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-2.5 bg-[#06C755] hover:bg-[#05b84d] active:scale-[0.97] text-white font-bold text-base sm:text-lg h-14 sm:h-16 px-8 sm:px-10 rounded-2xl transition-all duration-200 shadow-[0_8px_32px_rgba(6,199,85,0.35)] hover:shadow-[0_12px_40px_rgba(6,199,85,0.45)]"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            {ctaLine}
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
          {[
            { icon: <Clock className="w-4 h-4 text-red-400" />, text: "บริการ 24 ชม." },
            { icon: <Shield className="w-4 h-4 text-red-400" />, text: "ช่างมืออาชีพ" },
            { icon: <Zap className="w-4 h-4 text-red-400" />, text: "ถึงไว 30 นาที" },
          ].map((badge, i) => (
            <div key={i} className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/10 text-xs sm:text-sm text-white/80">
              {badge.icon}
              <span>{badge.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Bottom gradient fade ─── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}

function WhyUsSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "";
  const items: { icon: string; title: string; desc: string }[] = data.items || [];
  if (items.length === 0) return null;
  const bgColor = data.bgColor || "bg-white";

  return (
    <section className={`py-14 md:py-24 px-4 ${bgColor}`}>
      <div className="max-w-5xl mx-auto">
        {heading && (
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 text-center mb-10 md:mb-14"
              dangerouslySetInnerHTML={{ __html: heading }} />
        )}
        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(items.length, 3)} gap-5 md:gap-8`}>
          {items.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-red-200 transition-all hover:shadow-lg">
              <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
                {getIcon(item.icon) || <CheckCircle className="w-8 h-8 text-red-600" />}
              </div>
              <h3 className="text-base md:text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "";
  const description = data.description || "";
  const items: { icon?: string; text?: string; step?: string; title?: string; desc?: string }[] = data.items || [];
  const layout = data.layout || "steps"; // "steps" | "list" | "cards" | "two-column"
  const bgColor = data.bgColor || "bg-slate-50";

  return (
    <section className={`py-14 md:py-24 px-4 ${bgColor}`}>
      <div className="max-w-4xl mx-auto">
        {heading && (
          <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 text-center mb-6 md:mb-8"
              dangerouslySetInnerHTML={{ __html: heading }} />
        )}
        {description && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
            <p className="text-slate-700 text-sm md:text-base leading-relaxed mb-6"
               dangerouslySetInnerHTML={{ __html: description }} />
            {items.length > 0 && layout === "steps" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {items.map((s, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-50 rounded-xl p-4">
                    <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step || idx + 1}</span>
                    <div className="flex items-center gap-2">
                      {s.icon && getIcon(s.icon, "small")}
                      <span className="text-sm font-medium text-slate-700">{s.text || s.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {items.length > 0 && layout === "cards" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-red-50 rounded-xl p-4">
                    <div className="flex-shrink-0">{getIcon(item.icon || "CheckCircle", "small")}</div>
                    <div>
                      {item.title && <p className="text-sm font-bold text-slate-900">{item.title}</p>}
                      {item.desc && <p className="text-xs text-slate-600">{item.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {!description && items.length > 0 && layout === "list" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 bg-white rounded-xl p-4 md:p-5 border border-slate-200">
                <div className="flex-shrink-0 mt-0.5">{getIcon(item.icon || "AlertTriangle", "small")}</div>
                <p className="text-slate-700 text-sm md:text-base">{item.text || item.title}</p>
              </div>
            ))}
          </div>
        )}
        {!description && items.length > 0 && layout === "two-column" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {items.map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 hover:border-red-200 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                    {getIcon(item.icon || "Zap", "small")}
                  </div>
                  {item.title && <h3 className="text-lg md:text-xl font-bold text-slate-900">{item.title}</h3>}
                </div>
                {item.desc && (
                  <ul className="space-y-2">
                    {item.desc.split("\n").filter(Boolean).map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                        {line}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {!description && items.length > 0 && layout === "steps" && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-10 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {items.map((s, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-red-50 rounded-xl p-4">
                  <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">{s.step || idx + 1}</span>
                  <span className="text-sm font-medium text-slate-700">{s.text || s.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AreasSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "";
  const description = data.description || "";
  const areas: string[] = data.areas || [];
  const bgColor = data.bgColor || "bg-white";

  return (
    <section className={`py-14 md:py-20 px-4 ${bgColor}`}>
      <div className="max-w-4xl mx-auto text-center">
        {heading && (
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 mb-4"
              dangerouslySetInnerHTML={{ __html: heading }} />
        )}
        {description && (
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 max-w-2xl mx-auto">{description}</p>
        )}
        {areas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {areas.map((area) => (
              <span key={area} className="bg-slate-100 text-slate-700 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200">
                {area}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CtaBottomSection({ data }: { data: any }) {
  const heading = data.heading || "";
  const description = data.description || "";
  const ctaPhoneLabel = data.ctaPhoneLabel || "โทรเรียกช่างด่วน";
  const ctaLineLabel = data.ctaLineLabel || "แอดไลน์ส่งพิกัด";

  return (
    <section className="py-12 md:py-20 px-4 bg-gradient-to-br from-red-600 via-red-600 to-red-700 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="max-w-3xl mx-auto text-center relative z-10">
        {heading && <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white mb-3 md:mb-4">{heading}</h2>}
        {description && <p className="text-white/80 text-sm md:text-base mb-6 md:mb-8 max-w-xl mx-auto">{description}</p>}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href={`tel:${SITE_CONFIG.phone}`} className="inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 active:scale-95 text-red-700 font-bold text-base h-14 px-8 rounded-2xl transition-all shadow-lg">
            <PhoneCall className="w-5 h-5" />
            {ctaPhoneLabel}
          </Link>
          <Link href={SITE_CONFIG.lineUrl} target="_blank" className="inline-flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 active:scale-95 border border-white/40 text-white font-bold text-base h-14 px-8 rounded-2xl transition-all">
            <MessageCircle className="w-5 h-5" />
            {ctaLineLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function ContactChannelsSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "ช่องทางการติดต่อ";
  const channels: { type: string; label: string; sublabel: string; value: string; href: string }[] = data.channels || [
    { type: "phone", label: "โทรศัพท์", sublabel: "สายด่วน 24 ชม.", value: SITE_CONFIG.phoneFormatted, href: `tel:${SITE_CONFIG.phone}` },
    { type: "line", label: "Line Official", sublabel: "ส่งโลเคชั่น / รูปประเมินราคา", value: SITE_CONFIG.lineId, href: SITE_CONFIG.lineUrl },
    { type: "facebook", label: "Facebook Page", sublabel: "ติดตามข่าวสาร / โปรโมชั่น", value: "__BRAND_NAME__", href: SITE_CONFIG.facebook },
  ];

  const colorMap: Record<string, { border: string; bg: string; bgHover: string; text: string; icon: React.ReactNode }> = {
    phone: { border: "hover:border-red-300", bg: "bg-red-50", bgHover: "group-hover:bg-red-600", text: "text-red-600", icon: <Phone className="w-8 h-8 text-red-600 group-hover:text-white transition-colors" /> },
    line: { border: "hover:border-green-300", bg: "bg-green-50", bgHover: "group-hover:bg-[#06C755]", text: "text-[#06C755]", icon: <MessageCircle className="w-8 h-8 text-[#06C755] group-hover:text-white transition-colors" /> },
    facebook: { border: "hover:border-blue-300", bg: "bg-blue-50", bgHover: "group-hover:bg-[#1877F2]", text: "text-[#1877F2]", icon: <Facebook className="w-8 h-8 text-[#1877F2] group-hover:text-white transition-colors" /> },
  };

  return (
    <section className="py-14 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 text-center mb-10 md:mb-14">{heading}</h2>}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8">
          {channels.map((ch, idx) => {
            const c = colorMap[ch.type] || colorMap.phone;
            return (
              <Link key={idx} href={ch.href} target={ch.type !== "phone" ? "_blank" : undefined} className={`group bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100 ${c.border} transition-all hover:shadow-xl text-center`}>
                <div className={`w-16 h-16 ${c.bg} rounded-2xl flex items-center justify-center mx-auto mb-5 ${c.bgHover} group-hover:scale-110 transition-all`}>
                  {c.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{ch.label}</h3>
                <p className={`text-xs ${c.text} font-semibold mb-3`}>{ch.sublabel}</p>
                <p className={`text-2xl md:text-3xl font-black ${c.text}`}>{ch.value}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MapSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "แผนที่พื้นที่ให้บริการ";
  const description = data.description || "";

  return (
    <section className="py-14 md:py-24 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 text-center mb-4 md:mb-6">{heading}</h2>}
        {description && <p className="text-slate-600 text-sm md:text-base text-center max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed">{description}</p>}
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d62000!2d${SITE_CONFIG.geo.longitude}!3d${SITE_CONFIG.geo.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth`}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="แผนที่พื้นที่ให้บริการ __BRAND_NAME__"
            className="w-full"
          />
        </div>
      </div>
    </section>
  );
}

function HoursSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "เวลาทำการ";
  const days = data.days || ["จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส.", "อา."];
  const hoursLabel = data.hoursLabel || "ตลอด 24 ชั่วโมง";
  const daysLabel = data.daysLabel || "ทุกวัน จันทร์ - อาทิตย์";
  const note = data.note || "มีทีมช่างสแตนด์บายกะกลางคืน";

  return (
    <section className="py-14 md:py-24 px-4 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {heading && <h2 className="text-xl sm:text-2xl md:text-4xl font-black text-slate-900 text-center mb-10 md:mb-14">{heading}</h2>}
        <div className="bg-white rounded-2xl p-6 md:p-10 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-red-50 rounded-2xl flex items-center justify-center flex-shrink-0">
              <CalendarDays className="w-10 h-10 md:w-12 md:h-12 text-red-600" />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="mb-4">
                <p className="text-sm text-slate-500 font-medium mb-1">วันให้บริการ</p>
                <p className="text-xl md:text-2xl font-black text-slate-900">{daysLabel}</p>
              </div>
              <div className="mb-4">
                <p className="text-sm text-slate-500 font-medium mb-1">เวลาให้บริการ</p>
                <p className="text-xl md:text-2xl font-black text-red-600">{hoursLabel}</p>
              </div>
              {note && (
                <div className="flex items-center justify-center md:justify-start gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full w-fit mx-auto md:mx-0">
                  <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-semibold">{note}</span>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {days.map((day: string) => (
                <div key={day} className="text-center">
                  <div className="bg-red-600 text-white text-xs md:text-sm font-bold py-2 md:py-3 rounded-xl">{day}</div>
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1">24 ชม.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TextSection({ data, title }: { data: any; title: string | null }) {
  const heading = data.heading || title || "";
  const body = data.body || "";
  return (
    <section className="py-14 md:py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {heading && <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 md:mb-6 text-center px-2">{heading}</h2>}
        {body && <div className="text-gray-600 leading-relaxed text-sm md:text-lg whitespace-pre-line">{body}</div>}
      </div>
    </section>
  );
}

function ImageSection({ data, title, imageUrl }: { data: any; title: string | null; imageUrl: string | null }) {
  const heading = data.heading || title || "";
  const src = imageUrl || data.imageUrl || "";
  if (!src) return null;
  return (
    <section className="py-14 md:py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {heading && <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 md:mb-6 px-2">{heading}</h2>}
        <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: data.imageRatio?.replace(":", "/") || "16/9" }}>
          <Image src={src} alt={data.alt || heading || ""} fill className="object-cover" sizes="(max-width:640px) 100vw, (max-width:1024px) 90vw, 896px" />
        </div>
      </div>
    </section>
  );
}

function TextImageSection({ data, title, imageUrl }: { data: any; title: string | null; imageUrl: string | null }) {
  const heading = data.heading || title || "";
  const body = data.body || "";
  const src = imageUrl || data.imageUrl || "";
  const pos = data.imagePosition || "right";
  return (
    <section className="py-14 md:py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        {heading && <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 md:mb-8 text-center px-2">{heading}</h2>}
        <div className={`flex flex-col md:flex-row gap-5 md:gap-8 items-center`}>
          {pos === "left" && src && (
            <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden" style={{ aspectRatio: data.imageRatio?.replace(":", "/") || "16/9" }}>
              <Image src={src} alt={heading || ""} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          )}
          <div className="w-full md:w-1/2 text-gray-600 leading-relaxed text-sm md:text-lg whitespace-pre-line">{body}</div>
          {pos !== "left" && src && (
            <div className="w-full md:w-1/2 relative rounded-xl overflow-hidden" style={{ aspectRatio: data.imageRatio?.replace(":", "/") || "16/9" }}>
              <Image src={src} alt={heading || ""} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

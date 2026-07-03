import type { Metadata, Viewport } from "next";
import { cache } from "react";
import { Prompt, Sarabun } from "next/font/google";
import Script from 'next/script'
import { SITE_CONFIG, generateLocalBusinessJsonLd, generateWebSiteJsonLd } from "@/lib/seo";
import { prisma } from "@/lib/prisma";
import DynamicNavbar from "@/components/DynamicNavbar";
import StickyBottomBar from "@/components/StickyBottomBar";
import ClientShell from "@/components/ClientShell";
import "./globals.css";

export const revalidate = 60;
export const dynamic = "force-dynamic";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["thai", "latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#dc2626",
};

const getSiteSettings = cache(async () => {
  try {
    const settings = await (prisma as any).siteSettings.findUnique({
      where: { id: "singleton" },
    });
    return settings || { allowGoogleIndex: true, allowAiCrawl: true };
  } catch {
    return { allowGoogleIndex: true, allowAiCrawl: true };
  }
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const allowIndex = settings.allowGoogleIndex;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      template: '%s | PORNPISIT BATTERY บริการแบตเตอรี่ 24 ชม.',
      default: 'PORNPISIT BATTERY บริการแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง | เปลี่ยนแบตถึงที่',
    },
    description: SITE_CONFIG.description,
    keywords: SITE_CONFIG.keywords,
    authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: true,
    },
    alternates: {
      canonical: "/",
      languages: {
        "th-TH": "/",
      },
    },
    openGraph: {
      title: 'PORNPISIT BATTERY บริการแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง',
      description: SITE_CONFIG.shortDescription,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      type: 'website',
      images: [
        {
          url: SITE_CONFIG.ogImage,
          width: 1200,
          height: 630,
          alt: 'PORNPISIT BATTERY - บริการแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PORNPISIT BATTERY บริการแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง',
      description: SITE_CONFIG.shortDescription,
      images: [SITE_CONFIG.ogImage],
    },
    robots: {
      index: allowIndex,
      follow: allowIndex,
      googleBot: {
        index: allowIndex,
        follow: allowIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    manifest: "/manifest.json",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    category: "automotive",
  };
}

// Helper to parse JSON safely
function parseJson(str: string): Record<string, any> {
  try { return JSON.parse(str); } catch { return {}; }
}

// Cached DB queries — deduplicated across the same render pass
const getHomePageData = cache(async () => {
  try {
    const homePage = await (prisma as any).page.findUnique({
      where: { slug: "home" },
      include: { sections: { where: { isActive: true }, orderBy: { order: "asc" } } },
    });
    const allPages = await (prisma as any).page.findMany({
      select: { slug: true, isActive: true },
    });
    return { homePage, allPages };
  } catch {
    return { homePage: null, allPages: [] };
  }
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch global header/footer from home page sections (cached per render)
  const { homePage, allPages } = await getHomePageData();
  const sections = homePage?.sections || [];

  // Build a Set of inactive page slugs for quick lookup
  const inactiveSlugs = new Set(
    allPages.filter((p: any) => !p.isActive).map((p: any) => p.slug)
  );

  // Find header and footer sections
  const headerSection = sections.find((s: any) => s.type === "header");
  const footerSection = sections.find((s: any) => s.type === "footer");

  const headerData = headerSection ? parseJson(headerSection.content) : {};
  const footerData = footerSection ? parseJson(footerSection.content) : {};

  // Filter navbar links: remove links to inactive pages
  const rawLinks: any[] = Array.isArray(headerData.links) ? headerData.links : [];
  const filteredLinks = rawLinks
    .map((link: any) => {
      // If the link has children (dropdown), filter children too
      if (Array.isArray(link.children)) {
        const filteredChildren = link.children.filter((child: any) => {
          const slug = child.href?.replace(/^\//, "").replace(/\/$/, "");
          if (!slug || slug === "#" || slug.startsWith("tel:") || slug.startsWith("http")) return true;
          return !inactiveSlugs.has(slug);
        });
        // Keep parent only if it has visible children
        if (filteredChildren.length === 0 && link.href && link.href !== "#") {
          const parentSlug = link.href.replace(/^\//, "").replace(/\/$/, "");
          if (inactiveSlugs.has(parentSlug)) return null;
        }
        return { ...link, children: filteredChildren };
      }
      // Flat link: check if corresponding page is inactive
      const slug = link.href?.replace(/^\//, "").replace(/\/$/, "");
      if (!slug || slug === "#" || slug.startsWith("tel:") || slug.startsWith("http")) return link;
      if (inactiveSlugs.has(slug)) return null;
      return link;
    })
    .filter(Boolean);

  const localBusinessJsonLd = generateLocalBusinessJsonLd();
  const webSiteJsonLd = generateWebSiteJsonLd();

  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://i.pravatar.cc" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <Script id="gtm-head" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-WV4QJSQM');`}
        </Script>
      </head>
      <body
        className={`${prompt.variable} ${sarabun.variable} antialiased overflow-x-hidden w-full flex flex-col min-h-screen`}
      >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-WV4QJSQM"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />

        <ClientShell
          navbar={
            headerSection ? (
              <DynamicNavbar
                brandName={headerData.brandName || "PORNPISIT BATTERY"}
                brandSub={headerData.brandSub || "บริการแบตเตอรี่ 24 ชม."}
                logoUrl={headerSection.imageUrl || ""}
                phone={headerData.phone || "0996731296"}
                phoneLabel={headerData.phoneLabel || "โทรด่วน"}
                lineUrl={headerData.lineUrl || "https://lin.ee/OBB86S4"}
                lineLabel={headerData.lineLabel || "Line"}
                links={filteredLinks}
                logoSize={headerData.logoSize || 44}
                logoSizeMobile={headerData.logoSizeMobile || 32}
                navbarHeight={headerData.navbarHeight || 64}
                navbarHeightMobile={headerData.navbarHeightMobile || 52}
                navBgColor={headerData.navBgColor || "#0a0a0a"}
                navTextColor={headerData.navTextColor || "#a3a3a3"}
                navAccentColor={headerData.navAccentColor || "#dc2626"}
              />
            ) : null
          }
          footer={
            footerSection ? (() => {
              const ftBg = footerData.footerBgColor || "#0a0a0a";
              const ftText = footerData.footerTextColor || "#737373";
              const ftAccent = footerData.footerAccentColor || "#dc2626";
              return (
              <footer className="relative overflow-hidden" style={{ backgroundColor: ftBg, color: ftText }}>
                {/* Decorative top border */}
                <div className="h-1" style={{ background: `linear-gradient(to right, ${ftAccent}, ${ftAccent}88, ${ftAccent})` }} />

                {/* Decorative orbs */}
                <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full blur-3xl pointer-events-none" style={{ backgroundColor: `${ftAccent}08` }} />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-64 md:h-64 rounded-full blur-2xl pointer-events-none" style={{ backgroundColor: `${ftAccent}06` }} />

                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-6 md:pb-8 relative z-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-8 md:gap-10 mb-8 md:mb-12">

                    {/* Brand column */}
                    <div className="sm:col-span-2 md:col-span-4">
                      <div className="flex items-center gap-2.5 md:gap-3 mb-4 md:mb-5">
                        <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${ftAccent}, ${ftAccent}cc)`, boxShadow: `0 4px 14px ${ftAccent}40` }}>
                          <span className="text-white font-black text-base md:text-lg">P</span>
                        </div>
                        <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                          {footerData.brandName || "PORNPISIT BATTERY"}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm leading-relaxed mb-4 md:mb-5" style={{ color: ftText }}>{footerData.description || ""}</p>

                      {/* Info pills */}
                      <div className="space-y-2">
                        {footerData.openHours && (
                          <div className="inline-flex items-center gap-2 md:gap-2.5 rounded-xl px-3 md:px-3.5 py-1.5 md:py-2 text-xs md:text-sm" style={{ backgroundColor: `${ftText}10`, border: `1px solid ${ftText}15` }}>
                            <svg className="w-4 h-4 flex-shrink-0" style={{ color: ftAccent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span style={{ color: `${ftText}dd` }}>{footerData.openHours}</span>
                          </div>
                        )}
                        {footerData.area && (
                          <div className="flex items-center gap-2 md:gap-2.5 rounded-xl px-3 md:px-3.5 py-1.5 md:py-2 text-xs md:text-sm" style={{ backgroundColor: `${ftText}10`, border: `1px solid ${ftText}15` }}>
                            <svg className="w-4 h-4 flex-shrink-0" style={{ color: ftAccent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span style={{ color: `${ftText}dd` }}>{footerData.area}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Services column */}
                    {Array.isArray(footerData.serviceLinks) && footerData.serviceLinks.length > 0 && (
                      <div className="md:col-span-4">
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-3 md:mb-5" style={{ color: `${ftText}88` }}>บริการของเรา</h4>
                        <ul className="space-y-2">
                          {footerData.serviceLinks.map((link: any, idx: number) => (
                            <li key={idx}>
                              <a
                                href={link.href || "#"}
                                className="flex items-center gap-2 transition-colors text-sm group"
                                style={{ color: ftText }}
                              >
                                <svg className="w-3.5 h-3.5 flex-shrink-0 transition-colors" style={{ color: `${ftAccent}80` }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                                {link.label}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact column */}
                    <div className="sm:col-span-2 md:col-span-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest mb-3 md:mb-5" style={{ color: `${ftText}88` }}>ติดต่อเรา</h4>
                      <div className="space-y-3">
                        {footerData.phone && (
                          <a
                            href={`tel:${footerData.phone}`}
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors" style={{ backgroundColor: `${ftAccent}15`, border: `1px solid ${ftAccent}25` }}>
                              <svg className="w-4 h-4" style={{ color: ftAccent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs" style={{ color: `${ftText}88` }}>โทรศัพท์</div>
                              <div className="text-white font-semibold text-sm transition-colors">
                                {footerData.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                              </div>
                            </div>
                          </a>
                        )}
                        {footerData.lineUrl && (
                          <a
                            href={footerData.lineUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-9 h-9 bg-[#06C755]/10 border border-[#06C755]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#06C755]/20 transition-colors">
                              <svg className="w-4 h-4 text-[#06C755]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs" style={{ color: `${ftText}88` }}>LINE</div>
                              <div className="text-white font-semibold text-sm group-hover:text-[#06C755] transition-colors">
                                {footerData.lineId || "@398kyxfq"}
                              </div>
                            </div>
                          </a>
                        )}
                        {footerData.facebook && (
                          <a
                            href={footerData.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-9 h-9 bg-[#1877F2]/10 border border-[#1877F2]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#1877F2]/20 transition-colors">
                              <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs" style={{ color: `${ftText}88` }}>Facebook</div>
                              <div className="text-white font-semibold text-sm group-hover:text-[#1877F2] transition-colors">
                                {footerData.brandName || "PORNPISIT BATTERY"}
                              </div>
                            </div>
                          </a>
                        )}
                        {footerData.googleMap && (
                          <a
                            href={footerData.googleMap}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 group"
                          >
                            <div className="w-9 h-9 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-colors">
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <div>
                              <div className="text-xs" style={{ color: `${ftText}88` }}>Google Maps</div>
                              <div className="text-white font-semibold text-sm group-hover:text-red-400 transition-colors">
                                ดูแผนที่ร้าน
                              </div>
                            </div>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="pt-4 md:pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3" style={{ borderTop: `1px solid ${ftText}15` }}>
                    <p className="text-[10px] sm:text-xs" style={{ color: `${ftText}88` }}>
                      © {new Date().getFullYear()} {footerData.copyright || "PORNPISIT BATTERY. All rights reserved."}
                    </p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] sm:text-xs" style={{ color: `${ftText}88` }}>พร้อมให้บริการ 24 ชั่วโมง</span>
                    </div>
                  </div>
                </div>
              </footer>
              );
            })() : null
          }
          stickyBar={
            <StickyBottomBar
              phone={headerData.phone || "0996731296"}
              phoneLabel={headerData.stickyPhoneLabel || headerData.phoneLabel || "โทรเรียกช่าง"}
              lineUrl={headerData.lineUrl || "https://lin.ee/OBB86S4"}
              lineLabel={headerData.stickyLineLabel || headerData.lineLabel || "แอดไลน์"}
            />
          }
        >
          {children}
        </ClientShell>
      </body>
    </html>
  );
}

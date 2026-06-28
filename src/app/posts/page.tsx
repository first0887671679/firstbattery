import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PhoneCall, MessageCircle, Battery, Wrench, Lightbulb, PenTool,
  Clock, Shield, ThumbsUp, Zap, MapPin, Star, CircleDot, Sparkles,
  FileText, Calendar, User, ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import DynamicNavbar from "@/components/DynamicNavbar";
import HeroSlider from "@/components/HeroSlider";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import StickyBottomBar from "@/components/StickyBottomBar";
import Showcase from "@/components/Showcase";
import Testimonials from "@/components/Testimonials";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  let postsPage = null;
  try {
    postsPage = await (prisma as any).page.findUnique({ where: { slug: "posts", isActive: true } });
  } catch {
    // DB unreachable during build
  }
  const seoTitle = postsPage?.seoTitle || postsPage?.title || "บทความ / ข่าวสาร";
  const seoDesc = postsPage?.seoDescription || "บทความ ข่าวสาร ความรู้เกี่ยวกับการดูแลรักษารถยนต์ จาก PORNPISIT BATTERY";
  return {
    title: seoTitle,
    description: seoDesc,
    alternates: { canonical: "/posts" },
    openGraph: {
      title: postsPage?.ogTitle || seoTitle,
      description: postsPage?.ogDescription || seoDesc,
      url: `${SITE_CONFIG.url}/posts`,
      type: "website",
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: "PORNPISIT BATTERY บทความ" }],
    },
    twitter: {
      card: "summary_large_image",
      title: postsPage?.ogTitle || seoTitle,
      description: postsPage?.ogDescription || seoDesc,
      images: [SITE_CONFIG.ogImage],
    },
  };
}

// ─── Helpers (same as home page.tsx) ───

const iconMap: Record<string, React.ReactNode> = {
  Battery: <Battery className="w-12 h-12 text-red-600" />,
  Wrench: <Wrench className="w-12 h-12 text-red-600" />,
  Lightbulb: <Lightbulb className="w-12 h-12 text-red-600" />,
  PenTool: <PenTool className="w-12 h-12 text-red-600" />,
  Shield: <Shield className="w-12 h-12 text-red-600" />,
  Clock: <Clock className="w-12 h-12 text-red-600" />,
  Zap: <Zap className="w-12 h-12 text-red-600" />,
  ThumbsUp: <ThumbsUp className="w-12 h-12 text-red-600" />,
  Star: <Star className="w-12 h-12 text-red-600" />,
  CircleDot: <CircleDot className="w-12 h-12 text-red-600" />,
  Sparkles: <Sparkles className="w-12 h-12 text-red-600" />,
};

const whyUsIconMap: Record<string, React.ReactNode> = {
  Clock: <Clock className="w-10 h-10 text-red-600" />,
  Zap: <Zap className="w-10 h-10 text-red-600" />,
  Shield: <Shield className="w-10 h-10 text-red-600" />,
  ThumbsUp: <ThumbsUp className="w-10 h-10 text-red-600" />,
  Star: <Star className="w-10 h-10 text-red-600" />,
};

function getServiceIconKey(service: { title?: string; href?: string; icon?: string }) {
  const title = (service.title || "").toLowerCase();
  const href = (service.href || "").toLowerCase();

  if (href.includes("mobile-tire-repair") || title.includes("ปะยาง") || title.includes("ยาง")) {
    return "CircleDot";
  }

  if (href.includes("battery-replacement") || title.includes("แบต")) {
    return "Battery";
  }

  if (href.includes("alternator-starter") || title.includes("ไดชาร์จ") || title.includes("ไดสตาร์ท")) {
    return "Wrench";
  }

  if (href.includes("car-polishing") || title.includes("ขัดสี") || title.includes("ลบรอย") || title.includes("ขัดไฟหน้า")) {
    return "Sparkles";
  }

  return service.icon || "Battery";
}

function parseJson(str: string): Record<string, any> {
  try { return JSON.parse(str); } catch { return {}; }
}

function getAspectStyle(ratio?: string): React.CSSProperties {
  if (!ratio || ratio === "free") return { aspectRatio: "16/9" };
  const normalized = ratio.replace(":", "/");
  return { aspectRatio: normalized };
}

// ─── Section Renderer ───

function renderSection(section: any) {
  const data = parseJson(section.content);
  const type = section.type;

  if (type === "hero") {
    let heroSlides: any[] = [];
    if (Array.isArray(data.slides) && data.slides.length > 0) {
      heroSlides = data.slides;
    } else {
      heroSlides = [{
        heading: data.heading || "",
        subheading: data.subheading || "",
        description: data.description || "",
        phoneUrl: data.phoneUrl || "",
        lineUrl: data.lineUrl || "",
        imageUrl: section.imageUrl || "",
        textAlign: "center",
        overlayOpacity: 30,
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

  if (type === "header") {
    return (
      <DynamicNavbar
        key={section.id}
        brandName={data.brandName || "PORNPISIT BATTERY"}
        brandSub={data.brandSub || ""}
        logoUrl={section.imageUrl || ""}
        phone={data.phone || "0996731296"}
        phoneLabel={data.phoneLabel || "โทรด่วน"}
        lineUrl={data.lineUrl || "https://lin.ee/OBB86S4"}
        lineLabel={data.lineLabel || "Line"}
        links={Array.isArray(data.links) ? data.links : []}
      />
    );
  }

  if (type === "sub-header") {
    const bgColors: Record<string, string> = {
      orange: "bg-red-600", blue: "bg-blue-600", green: "bg-green-600",
      red: "bg-red-600", slate: "bg-slate-700", black: "bg-black",
    };
    const bgClass = bgColors[data.bgColor || "orange"] || "bg-red-600";
    return (
      <div key={section.id} className={`${bgClass} text-white py-2 px-4 text-center text-xs sm:text-sm`}>
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3">
          <span>{data.text || ""}</span>
          {data.linkUrl && data.linkLabel && (
            <Link href={data.linkUrl} className="font-bold underline underline-offset-2 hover:opacity-80">
              {data.linkLabel}
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (type === "services") {
    const items = Array.isArray(data.items) ? data.items : [];
    return (
      <section key={section.id} className="py-14 md:py-28 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-14">
            <span className="text-red-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">Our Services</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 px-2">{section.title || "บริการของเรา"}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((svc: any, idx: number) => (
              <Link href={svc.href || "#"} key={idx} className="group">
                <Card className="hover:shadow-xl transition-all duration-300 border-t-4 border-t-red-600 h-full flex flex-col sm:group-hover:-translate-y-1">
                  <CardHeader className="flex-grow-0 pb-2 p-4 md:p-6">
                    <div className="mb-3 md:mb-4 flex justify-center [&>svg]:w-10 [&>svg]:h-10 md:[&>svg]:w-12 md:[&>svg]:h-12">{iconMap[getServiceIconKey(svc)] || iconMap.Battery}</div>
                    <CardTitle className="text-base md:text-lg text-center leading-snug">{svc.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow p-4 md:p-6 pt-0">
                    <CardDescription className="text-center text-sm md:text-base text-gray-500">{svc.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === "gallery") {
    const images = Array.isArray(data.images) ? data.images : [];
    return <Showcase key={section.id} images={images} />;
  }

  if (type === "why-us") {
    const items = Array.isArray(data.items) ? data.items : [];
    return (
      <section key={section.id} className="py-14 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 px-2">{section.title || "ทำไมต้องเลือกเรา?"}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
            {items.map((item: any, idx: number) => (
              <div key={idx} className="text-center p-3 md:p-6">
                <div className="w-14 h-14 md:w-20 md:h-20 mx-auto bg-red-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-5 [&>svg]:w-7 [&>svg]:h-7 md:[&>svg]:w-10 md:[&>svg]:h-10">
                  {whyUsIconMap[item.icon || "Star"] || whyUsIconMap.Star}
                </div>
                <h3 className="text-sm md:text-xl font-bold text-gray-900 mb-1 md:mb-3 leading-snug">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed text-xs md:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === "testimonials") {
    const items = Array.isArray(data.items) ? data.items : [];
    return <Testimonials key={section.id} items={items.map((t: any) => ({
      name: t.name || "", role: t.role || "", avatar: t.avatar || "https://i.pravatar.cc/120",
      rating: t.rating || 5, content: t.content || "",
    }))} />;
  }

  if (type === "faq") {
    const items = Array.isArray(data.items) ? data.items : [];
    return (
      <section key={section.id} className="py-14 md:py-28 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mt-2 mb-4 px-2">{section.title || "คำถามที่พบบ่อย"}</h2>
          </div>
          <div className="space-y-2.5 md:space-y-4">
            {items.map((faq: any, idx: number) => (
              <details key={idx} className="group bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                <summary className="flex items-center justify-between cursor-pointer p-4 md:p-5 font-semibold text-gray-900 hover:text-red-600 transition-colors text-sm md:text-base">
                  <span className="pr-3">{faq.question}</span>
                  <span className="ml-2 md:ml-4 text-red-600 transition-transform group-open:rotate-45 text-xl md:text-2xl leading-none flex-shrink-0">+</span>
                </summary>
                <div className="px-4 md:px-5 pb-4 md:pb-5 text-gray-600 leading-relaxed text-xs md:text-base">{faq.answer}</div>
              </details>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (type === "contact") {
    return (
      <section key={section.id} className="py-14 md:py-28 px-4 bg-red-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-3 md:mb-4 px-2">{data.heading || "ติดต่อเรา"}</h2>
          <p className="text-sm md:text-lg opacity-90 mb-6 md:mb-10 max-w-xl mx-auto px-2">{data.description || ""}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mb-6 md:mb-10">
            {data.phone && (
              <Button size="lg" variant="secondary" className="text-red-700 font-bold text-sm md:text-base h-12 md:h-14 px-6 md:px-8" asChild>
                <Link href={`tel:${data.phone}`}>
                  <PhoneCall className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  {data.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
                </Link>
              </Button>
            )}
            {data.lineUrl && (
              <Button size="lg" className="bg-white/20 hover:bg-white/30 border-2 border-white text-white font-bold text-sm md:text-base h-12 md:h-14 px-6 md:px-8" asChild>
                <Link href={data.lineUrl} target="_blank">
                  <MessageCircle className="mr-2 w-4 h-4 md:w-5 md:h-5" />
                  Line: {data.lineId || "@398kyxfq"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (type === "text") {
    return (
      <section key={section.id} className="py-14 md:py-28 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          {section.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 md:mb-6 text-center px-2">{section.title}</h2>}
          <div className="text-gray-600 leading-relaxed text-sm md:text-lg whitespace-pre-line">{data.body || ""}</div>
        </div>
      </section>
    );
  }

  if (type === "image") {
    return (
      <section key={section.id} className="py-10 md:py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          {section.title && <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4 md:mb-6 px-2">{section.title}</h2>}
          {section.imageUrl && (
            <div className="relative w-full rounded-xl overflow-hidden" style={getAspectStyle(data.imageRatio)}>
              <Image 
                src={section.imageUrl} 
                alt={data.alt || section.title || ""} 
                fill 
                quality={85}
                sizes="(max-width:768px) 100vw, 80vw"
                className="object-cover"
              />
            </div>
          )}
          {data.caption && <p className="text-gray-500 mt-3 md:mt-4 text-sm md:text-base">{data.caption}</p>}
        </div>
      </section>
    );
  }

  if (type === "text-image") {
    const pos = data.imagePosition || "right";
    const isImageLeft = pos === "left";
    const isVertical = pos === "top" || pos === "bottom";
    const isTop = pos === "top";
    return (
      <section key={section.id} className="py-14 md:py-28 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          {section.title && <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-5 md:mb-8 text-center px-2">{section.title}</h2>}
          <div className={`flex ${isVertical ? "flex-col" : "flex-col md:flex-row"} gap-5 md:gap-8 items-center`}>
            {(isImageLeft || isTop) && section.imageUrl && (
              <div className={`${isVertical ? "w-full" : "w-full md:w-1/2"} relative rounded-xl sm:rounded-2xl overflow-hidden`} style={getAspectStyle(data.imageRatio)}>
                <Image 
                src={section.imageUrl} 
                alt={section.title || ""} 
                fill 
                quality={85}
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
              </div>
            )}
            <div className={`${isVertical ? "w-full" : "w-full md:w-1/2"} text-gray-600 leading-relaxed text-sm md:text-lg whitespace-pre-line`}>{data.body || ""}</div>
            {(!isImageLeft && !isTop) && section.imageUrl && (
              <div className={`${isVertical ? "w-full" : "w-full md:w-1/2"} relative rounded-xl sm:rounded-2xl overflow-hidden`} style={getAspectStyle(data.imageRatio)}>
                <Image 
                src={section.imageUrl} 
                alt={section.title || ""} 
                fill 
                quality={85}
                sizes="(max-width:768px) 100vw, 50vw"
                className="object-cover"
              />
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (type === "footer") {
    const svcLinks = Array.isArray(data.serviceLinks) ? data.serviceLinks : [];
    return (
      <footer key={section.id} className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="text-2xl font-extrabold text-red-600 mb-4">{data.brandName || "PORNPISIT BATTERY"}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{data.description || ""}</p>
            </div>
            {svcLinks.length > 0 && (
              <div>
                <h4 className="text-lg font-bold mb-4">บริการของเรา</h4>
                <ul className="space-y-2 text-slate-300 text-sm">
                  {svcLinks.map((link: any, idx: number) => (
                    <li key={idx}><Link href={link.href || "#"} className="hover:text-red-400 transition-colors">{link.label}</Link></li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold mb-4">ติดต่อเรา</h4>
              <div className="space-y-3">
                {data.phone && (
                  <Link href={`tel:${data.phone}`} className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors">
                    <PhoneCall className="w-5 h-5 text-red-400" />
                    <span>{data.phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}</span>
                  </Link>
                )}
                {data.lineUrl && (
                  <Link href={data.lineUrl} target="_blank" className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-colors">
                    <MessageCircle className="w-5 h-5 text-[#00B900]" />
                    <span>{data.lineId || "@398kyxfq"}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-6 text-center text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} {data.copyright || "PORNPISIT BATTERY. All rights reserved."}
          </div>
        </div>
      </footer>
    );
  }

  if (type === "custom") {
    return (
      <section key={section.id} className="py-16 px-4">
        <div className="max-w-6xl mx-auto" dangerouslySetInnerHTML={{ __html: sanitizeHtml(section.content || "") }} />
      </section>
    );
  }

  return null;
}

// ─── Post Card ───

const OG_ASPECT = "1200/630";

function PostCard({ post, featured = false }: { post: any; featured?: boolean }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group block h-full">
      <article className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex ${featured ? "flex-col md:flex-row" : "flex-col"} group-hover:-translate-y-1`}>
        <div className={`relative ${featured ? "w-full md:w-3/5" : "w-full"} flex-shrink-0`} style={{ aspectRatio: OG_ASPECT }}>
          {post.coverImage ? (
            <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                sizes={featured ? "(max-width:768px) 100vw, 60vw" : "(max-width:768px) 100vw, 33vw"} 
                quality={85}
                priority={featured}
                className="object-cover"
              />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 flex items-center justify-center">
              <FileText className="w-12 h-12 text-red-300" />
            </div>
          )}
          {post.category && (
            <span className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">{post.category}</span>
          )}
        </div>
        <div className={`p-5 flex flex-col flex-1 ${featured ? "justify-center" : ""}`}>
          <h2 className={`${featured ? "text-xl md:text-2xl" : "text-lg"} font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-700 transition-colors`}>{post.title}</h2>
          {post.excerpt && (
            <p className={`text-gray-500 ${featured ? "text-base mb-5 line-clamp-4" : "text-sm mb-4 line-clamp-3"} flex-1`}>{post.excerpt}</p>
          )}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(post.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              {post.author && <span className="flex items-center gap-1"><User className="w-3 h-3" />{post.author}</span>}
            </div>
            <span className="text-red-600 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
              อ่านต่อ <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ─── Main Page ───

export default async function PostsPage() {
  // 1. Fetch page data (sections) from DB — same as home
  let postsPage = null;
  let posts: any[] = [];
  try {
    postsPage = await (prisma as any).page.findUnique({
      where: { slug: "posts", isActive: true },
      include: { sections: { where: { isActive: true }, orderBy: { order: "asc" } } },
    });
    posts = await (prisma as any).post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    // DB unreachable during build
  }
  const sections = postsPage?.sections || [];

  const categories = [...new Set(posts.map((p: any) => p.category).filter(Boolean))] as string[];
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Render all admin-managed sections in order */}
      {sections.map((section: any) => {
        const rendered = renderSection(section);
        if (!rendered) return null;
        const sData = parseJson(section.content);
        const noAnimate = ["header", "sub-header", "footer"].includes(section.type);
        if (noAnimate || !sData.animation || sData.animation === "none") return rendered;
        return (
          <AnimateOnScroll key={`anim-${section.id}`} animation={sData.animation} speed={sData.animationSpeed || "normal"} delay={sData.animationDelay || 0}>
            {rendered}
          </AnimateOnScroll>
        );
      })}

      {/* Posts listing (always shown below sections) */}
      <section className="py-8 md:py-12 px-4 bg-gray-50 flex-1">
        <div className="max-w-6xl mx-auto">
          {/* Categories */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center mb-6 md:mb-8">
              <span className="text-xs sm:text-sm text-slate-500 py-1 font-medium">หมวดหมู่:</span>
              {categories.map((cat) => (
                <span key={cat} className="bg-red-50 text-red-700 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-medium">{cat}</span>
              ))}
            </div>
          )}

          {posts.length === 0 ? (
            <div className="text-center py-14 md:py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl md:rounded-2xl">
              <FileText className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 opacity-50" />
              <p className="text-lg md:text-xl font-medium">ยังไม่มีบทความ</p>
              <p className="mt-2 text-xs md:text-sm">กลับมาเยี่ยมชมอีกครั้งเร็วๆ นี้</p>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-10">
              {featured && <PostCard post={featured} featured />}
              {rest.length > 0 && (
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">บทความทั้งหมด</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {rest.map((post: any) => <PostCard key={post.id} post={post} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { SITE_CONFIG } from "@/lib/seo";
import { sanitizeHtml } from "@/lib/sanitize";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, Tag, ArrowLeft, Share2, FileText } from "lucide-react";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  let post = null;
  try {
    post = await (prisma as any).post.findUnique({ where: { slug } });
  } catch {
    // DB unreachable during build
  }
  if (!post) return { title: "ไม่พบบทความ" };

  const ogImage = post.coverImage || SITE_CONFIG.ogImage;
  const postUrl = `${SITE_CONFIG.url}/posts/${encodeURIComponent(post.slug)}`;
  const ogImageType = ogImage.endsWith(".png")
    ? "image/png"
    : ogImage.endsWith(".webp")
      ? "image/webp"
      : "image/jpeg";

  const metaTitle = post.seoTitle || post.title;
  const metaDesc = post.seoDescription || post.excerpt || post.title;
  const metaOgTitle = post.ogTitle || post.seoTitle || post.title;
  const metaOgDesc = post.ogDescription || post.seoDescription || post.excerpt || post.title;
  const metaKeywords = post.seoKeywords || post.tags || undefined;

  return {
    title: metaTitle,
    description: metaDesc,
    keywords: metaKeywords,
    alternates: { canonical: `/posts/${post.slug}` },
    openGraph: {
      title: metaOgTitle,
      description: metaOgDesc,
      url: postUrl,
      type: "article",
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author ? [post.author] : undefined,
      section: post.category || undefined,
      tags: post.tags ? post.tags.split(",").map((t: string) => t.trim()) : undefined,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: metaOgTitle,
          type: ogImageType,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaOgTitle,
      description: metaOgDesc,
      images: [ogImage],
    },
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  let post = null;
  let relatedPosts: any[] = [];
  try {
    post = await (prisma as any).post.findUnique({ where: { slug } });
  } catch {
    // DB unreachable during build
  }

  if (!post || !post.published) {
    notFound();
  }

  const tags = post.tags ? post.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [];

  // Get related posts (same category, exclude self)
  try {
    relatedPosts = post.category
      ? await (prisma as any).post.findMany({
          where: {
            published: true,
            category: post.category,
            NOT: { id: post.id },
          },
          take: 3,
          orderBy: { createdAt: "desc" },
        })
      : [];
  } catch {
    // DB unreachable
  }

  // JSON-LD Article structured data for Google
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.coverImage
      ? [post.coverImage]
      : [SITE_CONFIG.ogImage],
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author || SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.siteName,
      logo: {
        "@type": "ImageObject",
        url: SITE_CONFIG.logo,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/posts/${encodeURIComponent(post.slug)}`,
    },
  };

  // Breadcrumb JSON-LD
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "หน้าแรก",
        item: SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "บทความ",
        item: `${SITE_CONFIG.url}/posts`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_CONFIG.url}/posts/${encodeURIComponent(post.slug)}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Hero / Cover — OG standard 1200x630 (1.91:1) */}
      {post.coverImage && (
        <div className="relative w-full max-w-5xl mx-auto" style={{ aspectRatio: "1200/630" }}>
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(max-width:1024px) 100vw, 1024px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 py-10">
        {/* Back */}
        <Link href="/posts" className="inline-flex items-center gap-1 text-sm text-red-700 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 mb-6">
          <ArrowLeft className="w-4 h-4" />
          กลับไปหน้าบทความ
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 dark:text-slate-500 mb-4">
          {post.category && (
            <span className="bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400 px-3 py-1 rounded-full font-semibold text-xs">
              {post.category}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(post.createdAt).toLocaleDateString("th-TH", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          {post.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {post.author}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-500 dark:text-slate-400 mb-8 border-l-4 border-red-400 dark:border-red-600 pl-4 italic">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div
          className="prose prose-lg prose-red max-w-none
            prose-headings:text-gray-900 prose-headings:font-bold
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-red-700 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:shadow-md
            prose-strong:text-gray-800
            prose-ul:text-gray-600 prose-ol:text-gray-600
            dark:prose-invert dark:prose-headings:text-white
            dark:prose-p:text-slate-300 dark:prose-a:text-red-400
            dark:prose-strong:text-white dark:prose-ul:text-slate-300
            dark:prose-ol:text-slate-300
            whitespace-pre-line"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content || "") }}
        />

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              {tags.map((tag: string) => (
                <span key={tag} className="bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 px-3 py-1 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center gap-3">
          <Share2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          <span className="text-sm text-slate-400 dark:text-slate-500">แชร์บทความนี้</span>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 dark:bg-slate-900 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">บทความที่เกี่ยวข้อง</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp: any) => (
                <Link key={rp.id} href={`/posts/${rp.slug}`} className="group">
                  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md dark:shadow-slate-900/50 transition-all overflow-hidden">
                    <div className="relative w-full" style={{ aspectRatio: "1200/630" }}>
                      {rp.coverImage ? (
                        <Image src={rp.coverImage} alt={rp.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 33vw" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-red-100 to-red-50 dark:from-red-950/30 dark:to-slate-800 flex items-center justify-center">
                          <FileText className="w-10 h-10 text-red-300 dark:text-red-700" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2">
                        {rp.title}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                        {new Date(rp.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

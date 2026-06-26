import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd, generateServiceJsonLd } from "@/lib/seo";
import { ensureServicePages, getServicePageData } from "@/lib/ensureServicePages";
import ServicePageRenderer from "@/components/ServicePageRenderer";

export const dynamic = "force-dynamic";

const SLUG = "alternator-starter";
const FALLBACK_TITLE = "ซ่อมเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ห้วยขวาง ดินแดง ลาดพร้าว";
const FALLBACK_DESC = "รถดับกลางทาง สตาร์ทไม่ติด? บริการตรวจเช็คและเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ไม่ต้องลากรถ ครอบคลุมพื้นที่ห้วยขวาง ดินแดง ลาดพร้าว ประเมินราคาก่อนซ่อม";

export async function generateMetadata(): Promise<Metadata> {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  const title = page?.seoTitle || FALLBACK_TITLE;
  const description = page?.seoDescription || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: page?.seoKeywords?.split(",") || [
      "ซ่อมไดชาร์จนอกสถานที่","เปลี่ยนไดสตาร์ทนอกสถานที่","ซ่อมไดชาร์จ ห้วยขวาง",
      "เปลี่ยนไดสตาร์ท ดินแดง","รถดับกลางทาง","ช่างซ่อมไดชาร์จ",
    ],
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title, description,
      url: `${SITE_CONFIG.url}/${SLUG}`,
      type: "website",
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: "ช่างซ่อมไดชาร์จ เปลี่ยนไดสตาร์ท นอกสถานที่ ห้วยขวาง ดินแดง" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SITE_CONFIG.ogImage] },
  };
}

export default async function AlternatorStarterPage() {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  if (!page) notFound();
  const PAGE_TITLE = page?.seoTitle || FALLBACK_TITLE;
  const PAGE_DESC = page?.seoDescription || FALLBACK_DESC;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "หน้าแรก", url: SITE_CONFIG.url },
    { name: "ซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท", url: `${SITE_CONFIG.url}/alternator-starter` },
  ]);
  const webPageJsonLd = generateWebPageJsonLd(PAGE_TITLE, PAGE_DESC, "/alternator-starter");
  const serviceJsonLd = generateServiceJsonLd(
    "บริการซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท นอกสถานที่",
    PAGE_DESC,
    "/alternator-starter"
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ServicePageRenderer sections={page?.sections || []} slug={SLUG} breadcrumbLabel="ซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท" />
    </>
  );
}

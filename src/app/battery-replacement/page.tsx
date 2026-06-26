import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd, generateServiceJsonLd } from "@/lib/seo";
import { ensureServicePages, getServicePageData } from "@/lib/ensureServicePages";
import ServicePageRenderer from "@/components/ServicePageRenderer";

export const dynamic = "force-dynamic";

const SLUG = "battery-replacement";
const FALLBACK_TITLE = "ร้านแบตเตอรี่รถยนต์ นอกสถานที่ ห้วยขวาง ดินแดง ลาดพร้าว เปลี่ยนแบตด่วน";
const FALLBACK_DESC = "รถสตาร์ทไม่ติด? ร้านแบตเตอรี่รถยนต์ใกล้ฉัน บริการเปลี่ยนแบตเตอรี่ด่วนนอกสถานที่ มีแบตแท้รองรับทุกรุ่น ช่างมืออาชีพพร้อมไปถึงหน้าบ้านคุณ";

export async function generateMetadata(): Promise<Metadata> {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  const title = page?.seoTitle || FALLBACK_TITLE;
  const description = page?.seoDescription || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: page?.seoKeywords?.split(",") || [
      "ร้านแบตเตอรี่รถยนต์นอกสถานที่","ร้านแบตเตอรี่รถยนต์ใกล้ฉัน","เปลี่ยนแบตเตอรี่รถยนต์",
      "เปลี่ยนแบตด่วน ห้วยขวาง","เปลี่ยนแบตด่วน ดินแดง","รถสตาร์ทไม่ติด",
    ],
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title, description,
      url: `${SITE_CONFIG.url}/${SLUG}`,
      type: "website",
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: "ร้านแบตเตอรี่รถยนต์นอกสถานที่ เปลี่ยนแบตด่วน ห้วยขวาง ดินแดง" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SITE_CONFIG.ogImage] },
  };
}

export default async function BatteryReplacementPage() {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  if (!page) notFound();
  const PAGE_TITLE = page?.seoTitle || FALLBACK_TITLE;
  const PAGE_DESC = page?.seoDescription || FALLBACK_DESC;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "หน้าแรก", url: SITE_CONFIG.url },
    { name: "เปลี่ยนแบตเตอรี่รถยนต์", url: `${SITE_CONFIG.url}/battery-replacement` },
  ]);
  const webPageJsonLd = generateWebPageJsonLd(PAGE_TITLE, PAGE_DESC, "/battery-replacement");
  const serviceJsonLd = generateServiceJsonLd(
    "บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่",
    PAGE_DESC,
    "/battery-replacement"
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ServicePageRenderer sections={page?.sections || []} slug={SLUG} breadcrumbLabel="เปลี่ยนแบตเตอรี่รถยนต์" />
    </>
  );
}

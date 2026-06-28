import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd, generateServiceJsonLd } from "@/lib/seo";
import { ensureServicePages, getServicePageData } from "@/lib/ensureServicePages";
import ServicePageRenderer from "@/components/ServicePageRenderer";

export const revalidate = 60;

const SLUG = "car-polishing";
const FALLBACK_TITLE = "รับขัดสีรถยนต์ ขัดไฟหน้านอกสถานที่ ถึงบ้านคุณ ห้วยขวาง ดินแดง ลาดพร้าว";
const FALLBACK_DESC = "บริการขัดสีรถลบรอย ขัดไฟหน้าเหลืองให้ใสปิ๊ง นอกสถานที่ ไม่ต้องทิ้งรถไว้ที่ร้าน สะดวกสบาย บริการถึงบ้านย่านห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ";

export async function generateMetadata(): Promise<Metadata> {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  const title = page?.seoTitle || FALLBACK_TITLE;
  const description = page?.seoDescription || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: page?.seoKeywords?.split(",") || [
      "ขัดสีรถยนต์นอกสถานที่","ขัดสีรถถึงบ้าน","ขัดไฟหน้ารถนอกสถานที่",
      "ขัดสีรถ ห้วยขวาง","ขัดสีรถ ดินแดง","ลบรอยขีดข่วนรถยนต์",
    ],
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title, description,
      url: `${SITE_CONFIG.url}/${SLUG}`,
      type: "website",
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: "ขัดสีรถยนต์ ลบรอย ขัดไฟหน้านอกสถานที่ ถึงบ้าน ห้วยขวาง ดินแดง" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SITE_CONFIG.ogImage] },
  };
}

export default async function CarPolishingPage() {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  if (!page) notFound();
  const PAGE_TITLE = page?.seoTitle || FALLBACK_TITLE;
  const PAGE_DESC = page?.seoDescription || FALLBACK_DESC;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "หน้าแรก", url: SITE_CONFIG.url },
    { name: "ขัดสีรถ ลบรอย ขัดไฟหน้า", url: `${SITE_CONFIG.url}/car-polishing` },
  ]);
  const webPageJsonLd = generateWebPageJsonLd(PAGE_TITLE, PAGE_DESC, "/car-polishing");
  const serviceJsonLd = generateServiceJsonLd(
    "บริการขัดสีรถ ลบรอย ขัดไฟหน้า นอกสถานที่",
    PAGE_DESC,
    "/car-polishing"
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ServicePageRenderer sections={page?.sections || []} slug={SLUG} breadcrumbLabel="ขัดสีรถ ลบรอย ขัดไฟหน้า" />
    </>
  );
}

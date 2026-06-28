import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd, generateServiceJsonLd } from "@/lib/seo";
import { ensureServicePages, getServicePageData } from "@/lib/ensureServicePages";
import ServicePageRenderer from "@/components/ServicePageRenderer";

export const revalidate = 60;

const SLUG = "mobile-tire-repair";
const FALLBACK_TITLE = "ปะยางนอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว ถึงไว ด่วนทันใจ";
const FALLBACK_DESC = "ยางแตก ยางรั่ว โทรเรียกเรา! บริการปะยางนอกสถานที่ด่วน โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ ช่างชำนาญงาน พร้อมให้บริการและแก้ปัญหาทันที";

export async function generateMetadata(): Promise<Metadata> {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  const title = page?.seoTitle || FALLBACK_TITLE;
  const description = page?.seoDescription || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: page?.seoKeywords?.split(",") || [
      "ปะยางนอกสถานที่","ปะยางนอกสถานที่ 24 ชม","ร้านปะยางใกล้ฉัน",
      "ปะยางนอกสถานที่ ห้วยขวาง","ปะยางนอกสถานที่ ดินแดง","ยางแตก ยางรั่ว",
    ],
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title, description,
      url: `${SITE_CONFIG.url}/${SLUG}`,
      type: "website",
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: "ร้านปะยางใกล้ฉัน ปะยางนอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว" }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SITE_CONFIG.ogImage] },
  };
}

export default async function MobileTireRepairPage() {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  if (!page) notFound();
  const PAGE_TITLE = page?.seoTitle || FALLBACK_TITLE;
  const PAGE_DESC = page?.seoDescription || FALLBACK_DESC;
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "หน้าแรก", url: SITE_CONFIG.url },
    { name: "ปะยางนอกสถานที่", url: `${SITE_CONFIG.url}/mobile-tire-repair` },
  ]);
  const webPageJsonLd = generateWebPageJsonLd(PAGE_TITLE, PAGE_DESC, "/mobile-tire-repair");
  const serviceJsonLd = generateServiceJsonLd(
    "บริการปะยางนอกสถานที่ 24 ชม.",
    PAGE_DESC,
    "/mobile-tire-repair"
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <ServicePageRenderer sections={page?.sections || []} slug={SLUG} breadcrumbLabel="ปะยางนอกสถานที่" />
    </>
  );
}

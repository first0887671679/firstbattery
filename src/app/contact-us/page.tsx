import { Metadata } from "next";
import { SITE_CONFIG, generateBreadcrumbJsonLd, generateWebPageJsonLd } from "@/lib/seo";
import { ensureServicePages, getServicePageData } from "@/lib/ensureServicePages";
import ServicePageRenderer from "@/components/ServicePageRenderer";

export const dynamic = "force-dynamic";

const SLUG = "contact-us";
const FALLBACK_TITLE = `ติดต่อเรา | เปลี่ยนแบตเตอรี่นอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว | PORNPISIT BATTERY`;
const FALLBACK_DESC = "ต้องการเปลี่ยนแบตเตอรี่ด่วน? โทร 099-673-1296 บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ถึงไวใน 30 นาที";

export async function generateMetadata(): Promise<Metadata> {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  const title = page?.seoTitle || FALLBACK_TITLE;
  const description = page?.seoDescription || FALLBACK_DESC;
  return {
    title,
    description,
    keywords: page?.seoKeywords?.split(",") || [
      "ติดต่อเปลี่ยนแบตเตอรี่","เบอร์โทรช่างเปลี่ยนแบต","เปลี่ยนแบตเตอรี่ 24 ชม",
      "เปลี่ยนแบตเตอรี่ ห้วยขวาง","เปลี่ยนแบตเตอรี่ ดินแดง","เปลี่ยนแบตเตอรี่ ลาดพร้าว",
      "เปลี่ยนแบตเตอรี่ บางกะปิ","เปลี่ยนแบตเตอรี่ บางเขน","เปลี่ยนแบตเตอรี่ จตุจักร",
    ],
    alternates: { canonical: `/${SLUG}` },
    openGraph: {
      title, description,
      url: `${SITE_CONFIG.url}/${SLUG}`,
      type: "website",
      siteName: SITE_CONFIG.siteName,
      locale: SITE_CONFIG.locale,
      images: [{ url: SITE_CONFIG.ogImage, width: 1200, height: 630, alt: `ติดต่อ ${SITE_CONFIG.name} เปลี่ยนแบตเตอรี่นอกสถานที่ 24 ชม.` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [SITE_CONFIG.ogImage] },
  };
}

function generateContactPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.siteName,
    alternateName: "PORNPISIT BATTERY Service",
    image: SITE_CONFIG.logo,
    logo: {
      "@type": "ImageObject",
      url: SITE_CONFIG.logo,
    },
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    description: SITE_CONFIG.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.locality,
      addressRegion: SITE_CONFIG.address.region,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday", "Tuesday", "Wednesday", "Thursday",
        "Friday", "Saturday", "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    priceRange: "$$",
    currenciesAccepted: "THB",
    paymentAccepted: "Cash, Credit Card, Bank Transfer",
    areaServed: [
      {
        "@type": "City",
        name: "กรุงเทพมหานคร",
        containsPlace: [
          { "@type": "Place", name: "ห้วยขวาง" },
          { "@type": "Place", name: "ดินแดง" },
          { "@type": "Place", name: "ลาดพร้าว" },
          { "@type": "Place", name: "บางกะปิ" },
          { "@type": "Place", name: "บางเขน" },
          { "@type": "Place", name: "จตุจักร" },
          { "@type": "Place", name: "ดุสิต" },
          { "@type": "Place", name: "บางซื่อ" },
        ],
      },
    ],
    sameAs: [SITE_CONFIG.lineUrl],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "150",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export default async function ContactUsPage() {
  await ensureServicePages();
  const page = await getServicePageData(SLUG);
  const PAGE_TITLE = page?.seoTitle || FALLBACK_TITLE;
  const PAGE_DESC = page?.seoDescription || FALLBACK_DESC;

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "หน้าแรก", url: SITE_CONFIG.url },
    { name: "ติดต่อเรา", url: `${SITE_CONFIG.url}/contact-us` },
  ]);
  const webPageJsonLd = generateWebPageJsonLd(PAGE_TITLE, PAGE_DESC, "/contact-us");
  const contactJsonLd = generateContactPageJsonLd();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }} />
      <ServicePageRenderer sections={page?.sections || []} slug={SLUG} breadcrumbLabel="ติดต่อเรา" />
    </>
  );
}

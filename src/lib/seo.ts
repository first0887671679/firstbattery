// Centralized SEO Configuration
// Update these values to match your actual business information

export const SITE_CONFIG = {
  name: "__BRAND_NAME__",
  siteName: "__BRAND_NAME__ บริการแบตเตอรี่รถยนต์ 24 ชม.",
  url: "https://example.com",
  locale: "th_TH",
  language: "th",
  phone: "__PHONE__",
  phoneFormatted: "__PHONE__",
  lineId: "__LINE_ID__",
  lineUrl: "__LINE_URL__",
  email: "__EMAIL__",
  facebook: "__FACEBOOK_URL__",
  googleMap: "__GOOGLE_MAP_URL__",
  address: {
    street: "__ADDRESS__",
    locality: "__CITY__",
    region: "__CITY__",
    postalCode: "__POSTAL_CODE__",
    country: "TH",
  },
  geo: {
    latitude: "__LATITUDE__",
    longitude: "__LONGITUDE__",
  },
  logo: "https://example.com/opengraph-image",
  ogImage: "https://example.com/opengraph-image",
  description:
    "__BRAND_NAME__ บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง __SERVICE_AREA__ ถึงไวใน 30 นาที",
  shortDescription:
    "__BRAND_NAME__ บริการแบตเตอรี่รถยนต์ 24 ชม. เปลี่ยนแบตถึงที่ __SERVICE_AREA__",
  keywords: [
    "เปลี่ยนแบตเตอรี่รถยนต์",
    "แบตเตอรี่รถยนต์ 24 ชม",
    "เปลี่ยนแบตเตอรี่นอกสถานที่",
    "ร้านแบตเตอรี่ใกล้ฉัน",
    "__KEYWORD_1__",
    "__KEYWORD_2__",
    "__KEYWORD_3__",
    "__KEYWORD_4__",
    "แบตหมด รถสตาร์ทไม่ติด",
    "บริการแบตเตอรี่ฉุกเฉิน",
    "เปลี่ยนแบตรถยนต์",
    "ร้านแบตเตอรี่ 24 ชั่วโมง",
  ],
};

// JSON-LD Structured Data: LocalBusiness
export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.siteName,
    alternateName: "__BRAND_NAME__ Service",
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
        name: "__CITY__",
        containsPlace: [
          { "@type": "Place", name: "__AREA_1__" },
          { "@type": "Place", name: "__AREA_2__" },
          { "@type": "Place", name: "__AREA_3__" },
          { "@type": "Place", name: "__AREA_4__" },
        ],
      },
    ],
    sameAs: [SITE_CONFIG.lineUrl, SITE_CONFIG.facebook, SITE_CONFIG.googleMap],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "บริการแบตเตอรี่รถยนต์",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม.",
                url: `${SITE_CONFIG.url}/battery-replacement`,
                description:
                  "บริการเปลี่ยนแบตเตอรี่รถยนต์ถึงที่ รวดเร็วทันใจ พร้อมเช็คระบบไฟฟรี รับประกันคุณภาพ",
              },
            },
          ],
        },
      ],
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "200",
      bestRating: "5",
      worstRating: "1",
    },
  };
}

// JSON-LD: WebSite with SearchAction
export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    name: SITE_CONFIG.siteName,
    url: SITE_CONFIG.url,
    description: SITE_CONFIG.description,
    inLanguage: SITE_CONFIG.language,
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
  };
}

// JSON-LD: WebPage
export function generateWebPageJsonLd(
  title: string,
  description: string,
  path: string = "/"
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}${path}#webpage`,
    url: `${SITE_CONFIG.url}${path}`,
    name: title,
    description: description,
    isPartOf: {
      "@id": `${SITE_CONFIG.url}/#website`,
    },
    about: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    inLanguage: SITE_CONFIG.language,
  };
}

// JSON-LD: BreadcrumbList
export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// JSON-LD: FAQ
export function generateFAQJsonLd(
  faqs: { question: string; answer: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// JSON-LD: Service
export function generateServiceJsonLd(
  name: string,
  description: string,
  path: string
) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_CONFIG.url}${cleanPath}#service`,
    name: name,
    description: description,
    url: `${SITE_CONFIG.url}${cleanPath}`,
    provider: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    areaServed: [
      {
        "@type": "City",
        name: "กรุงเทพมหานคร",
      },
    ],
    serviceType: "Battery Replacement Service",
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: SITE_CONFIG.phone,
      serviceUrl: `${SITE_CONFIG.url}${cleanPath}`,
    },
  };
}

// Centralized SEO Configuration for Pornpisit Battery
// Update these values to match your actual business information

export const SITE_CONFIG = {
  name: "PORNPISIT BATTERY",
  siteName: "PORNPISIT BATTERY บริการแบตเตอรี่รถยนต์ 24 ชม.",
  url: "https://pornpisitbattery.com",
  locale: "th_TH",
  language: "th",
  phone: "0996731296",
  phoneFormatted: "099-673-1296",
  lineId: "@398kyxfq",
  lineUrl: "https://lin.ee/OBB86S4",
  email: "info@pornpisitbattery.com",
  facebook: "https://www.facebook.com/profile.php?id=61586430572682",
  googleMap: "https://maps.app.goo.gl/vEpxr93MhWHrDB3Y9?g_st=ic",
  address: {
    street: "ห้วยขวาง",
    locality: "กรุงเทพมหานคร",
    region: "กรุงเทพมหานคร",
    postalCode: "10310",
    country: "TH",
  },
  geo: {
    latitude: 13.7780,
    longitude: 100.5730,
  },
  logo: "https://pornpisitbattery.com/opengraph-image",
  ogImage: "https://pornpisitbattery.com/opengraph-image",
  description:
    "PORNPISIT BATTERY บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ ถึงไวใน 30 นาที",
  shortDescription:
    "PORNPISIT BATTERY บริการแบตเตอรี่รถยนต์ 24 ชม. เปลี่ยนแบตถึงที่ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ",
  keywords: [
    "เปลี่ยนแบตเตอรี่รถยนต์",
    "แบตเตอรี่รถยนต์ 24 ชม",
    "เปลี่ยนแบตเตอรี่นอกสถานที่",
    "ร้านแบตเตอรี่ใกล้ฉัน",
    "แบตเตอรี่รถยนต์ ห้วยขวาง",
    "แบตเตอรี่รถยนต์ ดินแดง",
    "แบตเตอรี่รถยนต์ ลาดพร้าว",
    "แบตเตอรี่รถยนต์ บางกะปิ",
    "แบตเตอรี่รถยนต์ จตุจักร",
    "เปลี่ยนแบตเตอรี่ บางเขน",
    "เปลี่ยนแบตเตอรี่ ดุสิต",
    "เปลี่ยนแบตเตอรี่ บางซื่อ",
    "แบตหมด รถสตาร์ทไม่ติด",
    "บริการแบตเตอรี่ฉุกเฉิน",
    "เปลี่ยนแบตรถยนต์ กรุงเทพ",
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
    alternateName: "Pornpisit Battery Service",
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
          { "@type": "Place", name: "จตุจักร" },
          { "@type": "Place", name: "บางเขน" },
          { "@type": "Place", name: "ดุสิต" },
          { "@type": "Place", name: "บางซื่อ" },
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

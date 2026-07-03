/**
 * Auto-migration: Updates DB sections with __BRAND_NAME__ data
 * Runs once on first server request. Checks if header still has old brand name.
 */
import { prisma } from "@/lib/prisma";

let migrated = false;

export async function ensureBrandMigration() {
  if (migrated) return;
  migrated = true;

  try {
    const homePage = await (prisma as any).page.findUnique({
      where: { slug: "home" },
      include: { sections: true },
    });

    if (!homePage) return;

    const sections = homePage.sections;
    const headerSec = sections.find((s: any) => s.type === "header");
    if (!headerSec) return;

    const headerData = JSON.parse(headerSec.content || "{}");
    // Only migrate if still old brand
    if (headerData.brandName && !headerData.brandName.includes("FIRSTCARCENTER") && !headerData.brandName.includes("Firstcar")) {
      return; // Already migrated
    }

    console.log("[auto-migrate] Updating DB to __BRAND_NAME__...");

    for (const section of sections) {
      const type = section.type;

      if (type === "header") {
        await update(section.id, {
          content: JSON.stringify({
            ...JSON.parse(section.content || "{}"),
            brandName: "__BRAND_NAME__",
            brandSub: "บริการแบตเตอรี่ 24 ชม.",
            phone: "__PHONE__",
            phoneLabel: "โทรด่วน",
            lineUrl: "__LINE_URL__",
            lineLabel: "Line",
            stickyPhoneLabel: "โทรเรียกช่าง",
            stickyLineLabel: "แอดไลน์",
            links: [
              { label: "หน้าแรก", href: "/" },
              { label: "บริการ", href: "#services", children: [{ label: "เปลี่ยนแบตเตอรี่รถยนต์", href: "/battery-replacement" }] },
              { label: "เช็คราคาแบต", href: "/check-price" },
              { label: "ติดต่อเรา", href: "#contact" },
            ],
          }),
        });
      }

      if (type === "sub-header") {
        await update(section.id, {
          content: JSON.stringify({
            text: "🔋 บริการเปลี่ยนแบตเตอรี่ 24 ชม. ถึงที่ทันใจ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ โทรเลย!",
            linkUrl: "tel:__PHONE__",
            linkLabel: "โทรเลย",
            bgColor: "red",
          }),
        });
      }

      if (type === "hero") {
        const heroData = JSON.parse(section.content || "{}");
        if (Array.isArray(heroData.slides)) {
          heroData.slides = heroData.slides.map((slide: any) => ({
            ...slide,
            phoneUrl: "tel:__PHONE__",
            lineUrl: "__LINE_URL__",
          }));
        } else {
          heroData.phoneUrl = "tel:__PHONE__";
          heroData.lineUrl = "__LINE_URL__";
        }
        await update(section.id, { content: JSON.stringify(heroData) });
      }

      if (type === "services") {
        await update(section.id, {
          title: "บริการของเรา",
          content: JSON.stringify({
            description: "บริการเปลี่ยนแบตเตอรี่รถยนต์ครบวงจร ถึงที่ 24 ชม.",
            items: [
              { title: "เปลี่ยนแบตเตอรี่รถยนต์", description: "ช่างพร้อมนำแบตแท้ไปเปลี่ยนถึงที่ รับประกันคุณภาพ เช็คระบบไฟให้ฟรี", icon: "Battery", href: "/battery-replacement" },
              { title: "เปลี่ยนแบตฉุกเฉิน 24 ชม.", description: "บริการฉุกเฉินตลอด 24 ชั่วโมง ไม่ว่าจะดึกดื่นหรือเช้ามืด", icon: "Zap", href: "/battery-replacement" },
              { title: "เช็คระบบไฟฟ้ารถยนต์", description: "ตรวจเช็คระบบชาร์จ ไดชาร์จ สตาร์ท ฟรี! เมื่อใช้บริการเปลี่ยนแบต", icon: "Wrench", href: "#contact" },
              { title: "แบตเตอรี่ทุกยี่ห้อ ทุกรุ่น", description: "รองรับรถยนต์ทุกยี่ห้อ ทุกรุ่น แบตเตอรี่แท้จากโรงงาน", icon: "Shield", href: "/check-price" },
            ],
          }),
        });
      }

      if (type === "why-us") {
        await update(section.id, {
          title: "ทำไมต้องเลือก __BRAND_NAME__?",
          content: JSON.stringify({
            badge: "Why Choose Us",
            subtitle: "เรามุ่งมั่นให้บริการที่ดีที่สุด",
            items: [
              { title: "บริการ 24 ชั่วโมง", description: "พร้อมให้บริการทุกวัน ไม่มีวันหยุด", icon: "Clock" },
              { title: "ถึงที่ภายใน 30 นาที", description: "ช่างออกบริการรวดเร็ว ครอบคลุมพื้นที่ ห้วยขวาง ดินแดง ลาดพร้าว", icon: "Zap" },
              { title: "แบตเตอรี่แท้ 100%", description: "ใช้แบตเตอรี่แท้จากโรงงาน คุณภาพสูง", icon: "Shield" },
              { title: "รับประกันคุณภาพ", description: "ทุกงานรับประกัน เปลี่ยนแบตพร้อมเช็คระบบไฟให้ฟรี", icon: "ThumbsUp" },
            ],
          }),
        });
      }

      if (type === "testimonials") {
        await update(section.id, {
          title: "รีวิวจากลูกค้าจริง",
          content: JSON.stringify({
            items: [
              { name: "คุณนัท", role: "ผู้ใช้บริการเปลี่ยนแบตเตอรี่", avatar: "https://i.pravatar.cc/120?img=32", rating: 5, content: "โทรเรียกตอนตี 2 ช่างมาถึงไวมาก บริการดี สุภาพ ประทับใจมากครับ" },
              { name: "คุณมิ้นท์", role: "ผู้ใช้บริการเปลี่ยนแบตฉุกเฉิน", avatar: "https://i.pravatar.cc/120?img=15", rating: 5, content: "รถสตาร์ทไม่ติดกลางทาง ไม่ถึง 30 นาทีมาถึง ราคายุติธรรมมากค่ะ" },
              { name: "คุณโจ", role: "ผู้ใช้บริการที่ ห้วยขวาง", avatar: "https://i.pravatar.cc/120?img=5", rating: 5, content: "ใช้บริการหลายครั้ง ช่างมาไว แบตแท้ ราคาตรงตามที่แจ้ง แนะนำเลยครับ" },
            ],
          }),
        });
      }

      if (type === "faq") {
        await update(section.id, {
          title: "คำถามที่พบบ่อย",
          content: JSON.stringify({
            items: [
              { question: "เปลี่ยนแบตเตอรี่นอกสถานที่ใช้เวลานานไหม?", answer: "ใช้เวลาเปลี่ยนเพียง 15-30 นาที ช่างเดินทางถึงที่คุณภายใน 30 นาที" },
              { question: "บริการ 24 ชั่วโมงจริงไหม?", answer: "ใช่ครับ ทุกวัน ไม่มีวันหยุด โทร __PHONE__ หรือแอดไลน์ __LINE_ID__" },
              { question: "ให้บริการพื้นที่ไหนบ้าง?", answer: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ" },
              { question: "มีการรับประกันแบตเตอรี่ไหม?", answer: "แบตเตอรี่ทุกลูกเป็นของแท้ มีรับประกันตามเงื่อนไขของแต่ละยี่ห้อ" },
              { question: "ราคาเปลี่ยนแบตเตอรี่เท่าไหร่?", answer: "ราคาขึ้นอยู่กับรุ่นรถและขนาดแบต แอดไลน์ __LINE_ID__ สอบถามราคาฟรี" },
            ],
          }),
        });
      }

      if (type === "contact") {
        await update(section.id, {
          title: "ติดต่อเรา",
          content: JSON.stringify({
            badge: "พร้อมให้บริการ 24/7",
            heading: "แบตหมด? โทรหาเราเลย!",
            description: "ทีมช่างผู้เชี่ยวชาญพร้อมเปลี่ยนแบตเตอรี่ถึงที่คุณตลอด 24 ชั่วโมง",
            phone: "__PHONE__",
            lineId: "__LINE_ID__",
            lineUrl: "__LINE_URL__",
            trustSignals: [
              { icon: "MapPin", label: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ" },
              { icon: "Clock", label: "บริการ 24 ชั่วโมง" },
              { icon: "Shield", label: "แบตเตอรี่แท้ รับประกัน" },
            ],
          }),
        });
      }

      if (type === "footer") {
        await update(section.id, {
          content: JSON.stringify({
            brandName: "__BRAND_NAME__",
            description: "__BRAND_NAME__ บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. ถึงที่รวดเร็วทันใจ",
            openHours: "เปิดให้บริการตลอด 24 ชั่วโมง",
            area: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ",
            phone: "__PHONE__",
            lineId: "__LINE_ID__",
            lineUrl: "__LINE_URL__",
            facebook: "__FACEBOOK_URL__",
            googleMap: "__GOOGLE_MAP_URL__",
            copyright: "__BRAND_NAME__. All rights reserved.",
            footerBgColor: "#0a0a0a",
            footerTextColor: "#737373",
            footerAccentColor: "#dc2626",
            serviceLinks: [
              { label: "เปลี่ยนแบตเตอรี่รถยนต์", href: "/battery-replacement" },
              { label: "เช็คราคาแบตเตอรี่", href: "/check-price" },
              { label: "ติดต่อเรา", href: "#contact" },
            ],
          }),
        });
      }

      if (type === "cta-banner") {
        await update(section.id, {
          content: JSON.stringify({
            badge: "พร้อมออกให้บริการทันที",
            heading: "แบตหมด? อย่ารอช้า —",
            headingSub: "โทรหาเราได้ทันที",
            description: "ช่างผู้เชี่ยวชาญออกนอกสถานที่ภายใน 30 นาที · บริการ 24 ชั่วโมง",
            phone: "__PHONE__",
            lineUrl: "__LINE_URL__",
            badges: ["✓ ออกนอกสถานที่", "✓ แบตเตอรี่แท้", "✓ ราคาโปร่งใส"],
          }),
        });
      }
    }

    // Also update posts page sections if they exist
    const postsPage = await (prisma as any).page.findUnique({
      where: { slug: "posts" },
      include: { sections: true },
    });
    if (postsPage) {
      for (const section of postsPage.sections) {
        if (section.type === "header") {
          const data = JSON.parse(section.content || "{}");
          data.brandName = "__BRAND_NAME__";
          data.phone = "__PHONE__";
          data.lineUrl = "__LINE_URL__";
          await update(section.id, { content: JSON.stringify(data) });
        }
        if (section.type === "footer") {
          const data = JSON.parse(section.content || "{}");
          data.brandName = "__BRAND_NAME__";
          data.phone = "__PHONE__";
          data.lineId = "__LINE_ID__";
          data.lineUrl = "__LINE_URL__";
          data.facebook = "__FACEBOOK_URL__";
          data.googleMap = "__GOOGLE_MAP_URL__";
          data.copyright = "__BRAND_NAME__. All rights reserved.";
          data.area = "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ";
          await update(section.id, { content: JSON.stringify(data) });
        }
        if (section.type === "contact") {
          const data = JSON.parse(section.content || "{}");
          data.phone = "__PHONE__";
          data.lineId = "__LINE_ID__";
          data.lineUrl = "__LINE_URL__";
          await update(section.id, { content: JSON.stringify(data) });
        }
      }
    }

    console.log("[auto-migrate] DB updated to __BRAND_NAME__ successfully!");
  } catch (e) {
    console.error("[auto-migrate] Error:", e);
    migrated = false; // Allow retry on next request
  }
}

async function update(id: string, data: any) {
  await (prisma as any).pageSection.update({ where: { id }, data });
}

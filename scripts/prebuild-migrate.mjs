/**
 * Prebuild migration: Updates ALL old FIRSTCARCENTER data in DB to PORNPISIT BATTERY
 * Runs BEFORE next build so pages render with correct data.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// All old → new replacements
const REPLACEMENTS = [
  // Brand name
  ["FIRSTCARCENTER", "PORNPISIT BATTERY"],
  ["Firstcarcenter", "PORNPISIT BATTERY"],
  ["firstcarcenter", "PORNPISIT BATTERY"],
  ["First Car Center", "PORNPISIT BATTERY"],
  ["FirstCarCenter", "PORNPISIT BATTERY"],
  // Phone
  ["088-767-1679", "099-673-1296"],
  ["0887671679", "0996731296"],
  ["088 767 1679", "099 673 1296"],
  // LINE
  ["@730ohrmd", "@398kyxfq"],
  ["lin.ee/xxqKaZn", "lin.ee/OBB86S4"],
  // Old service areas → new
  ["โซนบางนา ศรีนครินทร์ สมุทรปราการ", "โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ"],
  ["บางนา ศรีนครินทร์ สมุทรปราการ", "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ"],
  ["โซนสุขุมวิท บางนา เทพารักษ์ วัดด่าน", "โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ"],
  ["บางนา แบริ่ง ลาซาล ศรีนครินทร์", "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ"],
  ["สุขุมวิท บางนา แบริ่ง ลาซาล", "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ"],
  ["เทพารักษ์ แพรกษา วัดด่านสำโรง", "บางเขน จตุจักร ดุสิต บางซื่อ"],
  ["ศรีนครินทร์ เทพารักษ์ แพรกษา", "ห้วยขวาง ดินแดง ลาดพร้าว"],
  ["บางนา ศรีนครินทร์", "ห้วยขวาง ดินแดง"],
  ["โซนบางนา", "โซนห้วยขวาง"],
  // Additional old area patterns found in production DB
  ["สุขุมวิทตอนปลาย, บางนา, แบริ่ง, ลาซาล และโซนสมุทรปราการ", "ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ"],
  ["ศรีนครินทร์, เทพารักษ์, แพรกษา, วัดด่านสำโรง, วัดหนามแดง", "ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ"],
  ["สุขุมวิทตอนปลาย", "ห้วยขวาง"],
  ["สมุทรปราการ", "บางกะปิ"],
  ["บางนา", "ห้วยขวาง"],
  ["ศรีนครินทร์", "ดินแดง"],
  ["แบริ่ง", "ลาดพร้าว"],
  ["ลาซาล", "บางกะปิ"],
  ["เทพารักษ์", "บางเขน"],
  ["แพรกษา", "จตุจักร"],
  ["วัดด่านสำโรง", "ดุสิต"],
  ["วัดหนามแดง", "บางซื่อ"],
  ["สำโรง", "ดุสิต"],
];

async function migrate() {
  console.log("[prebuild-migrate] Checking DB for old brand data...");

  try {
    // ── 1. Update ALL pageSection.content ──
    const sections = await prisma.pageSection.findMany();
    let updatedSections = 0;

    for (const section of sections) {
      let content = section.content || "";
      let title = section.title || "";
      let changed = false;

      for (const [from, to] of REPLACEMENTS) {
        if (content.includes(from)) {
          content = content.replaceAll(from, to);
          changed = true;
        }
        if (title.includes(from)) {
          title = title.replaceAll(from, to);
          changed = true;
        }
      }

      if (changed) {
        await prisma.pageSection.update({
          where: { id: section.id },
          data: { content, title },
        });
        updatedSections++;
      }
    }
    console.log(`[prebuild-migrate] Updated ${updatedSections}/${sections.length} page sections`);

    // ── 2. Update ALL Page metadata ──
    const pages = await prisma.page.findMany();
    let updatedPages = 0;

    for (const page of pages) {
      const fields = ["title", "seoTitle", "seoDescription", "seoKeywords"];
      let data = {};
      let changed = false;

      for (const field of fields) {
        let val = page[field] || "";
        for (const [from, to] of REPLACEMENTS) {
          if (val.includes(from)) {
            val = val.replaceAll(from, to);
            changed = true;
          }
        }
        data[field] = val;
      }

      if (changed) {
        await prisma.page.update({ where: { id: page.id }, data });
        updatedPages++;
      }
    }
    console.log(`[prebuild-migrate] Updated ${updatedPages}/${pages.length} pages`);

    // ── 3. Update ALL Post fields ──
    const posts = await prisma.post.findMany();
    let updatedPosts = 0;

    for (const post of posts) {
      const fields = [
        "title", "content", "excerpt", "author",
        "seoTitle", "seoDescription", "seoKeywords",
        "ogTitle", "ogDescription",
      ];
      let data = {};
      let changed = false;

      for (const field of fields) {
        let val = post[field] || "";
        for (const [from, to] of REPLACEMENTS) {
          if (val.includes(from)) {
            val = val.replaceAll(from, to);
            changed = true;
          }
        }
        data[field] = val;
      }

      if (changed) {
        await prisma.post.update({ where: { id: post.id }, data });
        updatedPosts++;
      }
    }
    console.log(`[prebuild-migrate] Updated ${updatedPosts}/${posts.length} posts`);

    // ── 4. Force-set critical sections (header, footer, contact) ──
    const homePage = await prisma.page.findUnique({
      where: { slug: "home" },
      include: { sections: true },
    });

    if (homePage) {
      for (const section of homePage.sections) {
        if (section.type === "header") {
          const d = safeJson(section.content);
          d.brandName = "PORNPISIT BATTERY";
          d.brandSub = "บริการแบตเตอรี่ 24 ชม.";
          d.phone = "0996731296";
          d.phoneLabel = "โทรด่วน";
          d.lineUrl = "https://lin.ee/OBB86S4";
          d.lineLabel = "Line";
          d.stickyPhoneLabel = "โทรเรียกช่าง";
          d.stickyLineLabel = "แอดไลน์";
          // Only set default links if no links exist yet (preserve admin edits)
          if (!Array.isArray(d.links) || d.links.length === 0) {
            d.links = [
              { label: "หน้าแรก", href: "/" },
              { label: "เปลี่ยนแบตเตอรี่", href: "/battery-replacement" },
              { label: "เช็คราคาแบต", href: "/check-price" },
              { label: "ติดต่อเรา", href: "/contact-us" },
              { label: "บทความ", href: "/posts" },
            ];
          }
          await prisma.pageSection.update({ where: { id: section.id }, data: { content: JSON.stringify(d) } });
        }

        if (section.type === "sub-header") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              content: JSON.stringify({
                text: "🔋 บริการเปลี่ยนแบตเตอรี่ 24 ชม. ถึงที่ทันใจ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ โทรเลย!",
                linkUrl: "tel:0996731296",
                linkLabel: "โทรเลย",
                bgColor: "red",
              }),
            },
          });
        }

        if (section.type === "hero") {
          const d = safeJson(section.content);
          if (Array.isArray(d.slides)) {
            d.slides = d.slides.map((s) => ({
              ...s,
              phoneUrl: "tel:0996731296",
              lineUrl: "https://lin.ee/OBB86S4",
              ctaPhoneLabel: s.ctaPhoneLabel || "โทรเรียกช่างเปลี่ยนแบต",
              ctaLineLabel: s.ctaLineLabel || "แอดไลน์สอบถาม",
            }));
          }
          d.phoneUrl = "tel:0996731296";
          d.lineUrl = "https://lin.ee/OBB86S4";
          await prisma.pageSection.update({ where: { id: section.id }, data: { content: JSON.stringify(d) } });
        }

        if (section.type === "services") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
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
            },
          });
        }

        if (section.type === "contact") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              title: "ติดต่อเรา",
              content: JSON.stringify({
                badge: "พร้อมให้บริการ 24/7",
                heading: "แบตหมด? โทรหาเราเลย!",
                description: "ทีมช่างผู้เชี่ยวชาญพร้อมเปลี่ยนแบตเตอรี่ถึงที่คุณตลอด 24 ชั่วโมง",
                phone: "0996731296",
                lineId: "@398kyxfq",
                lineUrl: "https://lin.ee/OBB86S4",
                trustSignals: [
                  { icon: "MapPin", label: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ" },
                  { icon: "Clock", label: "บริการ 24 ชั่วโมง" },
                  { icon: "Shield", label: "แบตเตอรี่แท้ รับประกัน" },
                ],
              }),
            },
          });
        }

        if (section.type === "footer") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              content: JSON.stringify({
                brandName: "PORNPISIT BATTERY",
                description: "PORNPISIT BATTERY บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. ถึงที่รวดเร็วทันใจ",
                openHours: "เปิดให้บริการตลอด 24 ชั่วโมง",
                area: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ",
                phone: "0996731296",
                lineId: "@398kyxfq",
                lineUrl: "https://lin.ee/OBB86S4",
                facebook: "https://www.facebook.com/profile.php?id=61586430572682",
                googleMap: "https://maps.app.goo.gl/vEpxr93MhWHrDB3Y9?g_st=ic",
                copyright: "PORNPISIT BATTERY. All rights reserved.",
                footerBgColor: "#0a0a0a",
                footerTextColor: "#737373",
                footerAccentColor: "#dc2626",
                serviceLinks: [
                  { label: "เปลี่ยนแบตเตอรี่รถยนต์", href: "/battery-replacement" },
                  { label: "เช็คราคาแบตเตอรี่", href: "/check-price" },
                  { label: "ติดต่อเรา", href: "/contact-us" },
                ],
              }),
            },
          });
        }

        if (section.type === "cta-banner") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              content: JSON.stringify({
                badge: "พร้อมออกให้บริการทันที",
                heading: "แบตหมด? อย่ารอช้า —",
                headingSub: "โทรหาเราได้ทันที",
                description: "ช่างผู้เชี่ยวชาญออกนอกสถานที่ภายใน 30 นาที · บริการ 24 ชั่วโมง",
                phone: "0996731296",
                lineUrl: "https://lin.ee/OBB86S4",
                badges: ["✓ ออกนอกสถานที่", "✓ แบตเตอรี่แท้", "✓ ราคาโปร่งใส"],
              }),
            },
          });
        }

        if (section.type === "why-us") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              title: "ทำไมต้องเลือก PORNPISIT BATTERY?",
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
            },
          });
        }

        if (section.type === "testimonials") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              title: "รีวิวจากลูกค้าจริง",
              content: JSON.stringify({
                items: [
                  { name: "คุณนัท", role: "ผู้ใช้บริการเปลี่ยนแบตเตอรี่", avatar: "https://i.pravatar.cc/120?img=32", rating: 5, content: "โทรเรียกตอนตี 2 ช่างมาถึงไวมาก บริการดี สุภาพ ประทับใจมากครับ" },
                  { name: "คุณมิ้นท์", role: "ผู้ใช้บริการเปลี่ยนแบตฉุกเฉิน", avatar: "https://i.pravatar.cc/120?img=15", rating: 5, content: "รถสตาร์ทไม่ติดกลางทาง ไม่ถึง 30 นาทีมาถึง ราคายุติธรรมมากค่ะ" },
                  { name: "คุณโจ", role: "ผู้ใช้บริการที่ ห้วยขวาง", avatar: "https://i.pravatar.cc/120?img=5", rating: 5, content: "ใช้บริการหลายครั้ง ช่างมาไว แบตแท้ ราคาตรงตามที่แจ้ง แนะนำเลยครับ" },
                ],
              }),
            },
          });
        }

        if (section.type === "faq") {
          await prisma.pageSection.update({
            where: { id: section.id },
            data: {
              title: "คำถามที่พบบ่อย",
              content: JSON.stringify({
                items: [
                  { question: "เปลี่ยนแบตเตอรี่นอกสถานที่ใช้เวลานานไหม?", answer: "ใช้เวลาเปลี่ยนเพียง 15-30 นาที ช่างเดินทางถึงที่คุณภายใน 30 นาที" },
                  { question: "บริการ 24 ชั่วโมงจริงไหม?", answer: "ใช่ครับ ทุกวัน ไม่มีวันหยุด โทร 099-673-1296 หรือแอดไลน์ @398kyxfq" },
                  { question: "ให้บริการพื้นที่ไหนบ้าง?", answer: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ" },
                  { question: "มีการรับประกันแบตเตอรี่ไหม?", answer: "แบตเตอรี่ทุกลูกเป็นของแท้ มีรับประกันตามเงื่อนไขของแต่ละยี่ห้อ" },
                  { question: "ราคาเปลี่ยนแบตเตอรี่เท่าไหร่?", answer: "ราคาขึ้นอยู่กับรุ่นรถและขนาดแบต แอดไลน์ @398kyxfq สอบถามราคาฟรี" },
                ],
              }),
            },
          });
        }
      }

      console.log("[prebuild-migrate] Force-set home page critical sections ✓");
    }

    // ── 4b. Force-update ALL service pages with correct areas ──
    const SERVICE_SLUGS = [
      "battery-replacement",
      "mobile-tire-repair",
      "alternator-starter",
      "car-polishing",
      "contact-us",
    ];
    const NEW_AREAS = ["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"];
    const NEW_AREAS_DESC = "ครอบคลุมโซนกรุงเทพฯ: ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ";

    for (const slug of SERVICE_SLUGS) {
      try {
        const svcPage = await prisma.page.findUnique({
          where: { slug },
          include: { sections: true },
        });
        if (!svcPage) continue;

        // Update page SEO fields
        const pageFields = ["seoTitle", "seoDescription", "seoKeywords"];
        let pageData = {};
        let pageChanged = false;
        for (const field of pageFields) {
          let val = svcPage[field] || "";
          for (const [from, to] of REPLACEMENTS) {
            if (val.includes(from)) {
              val = val.replaceAll(from, to);
              pageChanged = true;
            }
          }
          pageData[field] = val;
        }
        if (pageChanged) {
          await prisma.page.update({ where: { id: svcPage.id }, data: pageData });
        }

        // Update sections
        for (const section of svcPage.sections) {
          let content = section.content || "";
          let title = section.title || "";
          let changed = false;

          for (const [from, to] of REPLACEMENTS) {
            if (content.includes(from)) {
              content = content.replaceAll(from, to);
              changed = true;
            }
            if (title.includes(from)) {
              title = title.replaceAll(from, to);
              changed = true;
            }
          }

          // Force-update areas section
          if (section.type === "areas") {
            const d = safeJson(content);
            d.areas = NEW_AREAS;
            d.description = NEW_AREAS_DESC;
            content = JSON.stringify(d);
            changed = true;
          }

          if (changed) {
            await prisma.pageSection.update({
              where: { id: section.id },
              data: { content, title },
            });
          }
        }
      } catch (e) {
        console.error(`[prebuild-migrate] Error updating service page ${slug}:`, e.message);
      }
    }
    console.log("[prebuild-migrate] Force-updated all service pages ✓");

    // ── 5. Force-set posts page sections ──
    const postsPage = await prisma.page.findUnique({
      where: { slug: "posts" },
      include: { sections: true },
    });
    if (postsPage) {
      for (const section of postsPage.sections) {
        if (section.type === "header") {
          const d = safeJson(section.content);
          d.brandName = "PORNPISIT BATTERY";
          d.brandSub = "บริการแบตเตอรี่ 24 ชม.";
          d.phone = "0996731296";
          d.lineUrl = "https://lin.ee/OBB86S4";
          await prisma.pageSection.update({ where: { id: section.id }, data: { content: JSON.stringify(d) } });
        }
        if (section.type === "footer") {
          const d = safeJson(section.content);
          d.brandName = "PORNPISIT BATTERY";
          d.phone = "0996731296";
          d.lineId = "@398kyxfq";
          d.lineUrl = "https://lin.ee/OBB86S4";
          d.facebook = "https://www.facebook.com/profile.php?id=61586430572682";
          d.googleMap = "https://maps.app.goo.gl/vEpxr93MhWHrDB3Y9?g_st=ic";
          d.copyright = "PORNPISIT BATTERY. All rights reserved.";
          d.area = "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ";
          d.serviceLinks = [
            { label: "เปลี่ยนแบตเตอรี่รถยนต์", href: "/battery-replacement" },
            { label: "เช็คราคาแบตเตอรี่", href: "/check-price" },
            { label: "ติดต่อเรา", href: "/contact-us" },
          ];
          await prisma.pageSection.update({ where: { id: section.id }, data: { content: JSON.stringify(d) } });
        }
        if (section.type === "contact") {
          const d = safeJson(section.content);
          d.phone = "0996731296";
          d.lineId = "@398kyxfq";
          d.lineUrl = "https://lin.ee/OBB86S4";
          await prisma.pageSection.update({ where: { id: section.id }, data: { content: JSON.stringify(d) } });
        }
      }
      console.log("[prebuild-migrate] Force-set posts page sections ✓");
    }

    // ── 5b. Force-recreate contact-us page with all sections ──
    let contactPage = await prisma.page.findUnique({ where: { slug: "contact-us" } });
    if (!contactPage) {
      contactPage = await prisma.page.create({
        data: {
          slug: "contact-us",
          title: "ติดต่อเรา",
          order: 6,
          seoTitle: "ติดต่อเรา | เปลี่ยนแบตเตอรี่นอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว | PORNPISIT BATTERY",
          seoDescription: "ต้องการเปลี่ยนแบตเตอรี่ด่วน? โทร 099-673-1296 บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ถึงไวใน 30 นาที",
          seoKeywords: "ติดต่อเปลี่ยนแบตเตอรี่,เบอร์โทรช่างเปลี่ยนแบต,เปลี่ยนแบตเตอรี่ 24 ชม,เปลี่ยนแบตเตอรี่ ห้วยขวาง,เปลี่ยนแบตเตอรี่ ดินแดง,เปลี่ยนแบตเตอรี่ ลาดพร้าว",
        },
      });
    } else {
      await prisma.page.update({
        where: { id: contactPage.id },
        data: {
          seoTitle: "ติดต่อเรา | เปลี่ยนแบตเตอรี่นอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว | PORNPISIT BATTERY",
          seoDescription: "ต้องการเปลี่ยนแบตเตอรี่ด่วน? โทร 099-673-1296 บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ถึงไวใน 30 นาที",
          seoKeywords: "ติดต่อเปลี่ยนแบตเตอรี่,เบอร์โทรช่างเปลี่ยนแบต,เปลี่ยนแบตเตอรี่ 24 ชม,เปลี่ยนแบตเตอรี่ ห้วยขวาง,เปลี่ยนแบตเตอรี่ ดินแดง,เปลี่ยนแบตเตอรี่ ลาดพร้าว",
        },
      });
    }

    // Delete ALL old sections and recreate fresh
    await prisma.pageSection.deleteMany({ where: { pageId: contactPage.id } });

    const contactSections = [
      {
        type: "hero",
        title: "Hero",
        content: JSON.stringify({
          heading: 'ติดต่อเรา — เปลี่ยนแบตเตอรี่ด่วน <span class="text-red-400">24 ชั่วโมง</span>',
          description: 'รถสตาร์ทไม่ติด? แบตหมด? โทรหาเราได้ตลอดเวลา ทีมช่างพร้อมนำแบตเตอรี่แท้ไปเปลี่ยนถึงที่คุณ ครอบคลุมพื้นที่ <strong class="text-white">ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ</strong> และพื้นที่ใกล้เคียง ประเมินราคาฟรี ไม่มีบวกเพิ่มหน้างาน',
          ctaPhoneLabel: "โทรเรียกช่างเปลี่ยนแบต",
          ctaLineLabel: "แอดไลน์สอบถาม",
        }),
        order: 0,
      },
      {
        type: "contact-channels",
        title: "ช่องทางการติดต่อ",
        content: JSON.stringify({
          heading: "ช่องทางการติดต่อ",
          channels: [
            { type: "phone", label: "โทรศัพท์", sublabel: "สายด่วน 24 ชม.", value: "099-673-1296", href: "tel:0996731296" },
            { type: "line", label: "Line Official", sublabel: "ส่งโลเคชั่น / รูปประเมินราคา", value: "@398kyxfq", href: "https://lin.ee/OBB86S4" },
            { type: "facebook", label: "Facebook Page", sublabel: "ติดตามข่าวสาร / โปรโมชั่น", value: "PORNPISIT BATTERY", href: "https://www.facebook.com/profile.php?id=61586430572682" },
          ],
        }),
        order: 1,
      },
      {
        type: "areas",
        title: "พื้นที่ให้บริการ",
        content: JSON.stringify({
          heading: 'พื้นที่ให้บริการ <span class="text-red-600">เปลี่ยนแบตเตอรี่นอกสถานที่</span> ของเรา',
          description: "เพื่อความรวดเร็วในการเข้าถึงหน้างาน ภายใน 30 นาที เราให้บริการครอบคลุมพื้นที่ดังต่อไปนี้:",
          areas: ["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"],
        }),
        order: 2,
      },
      {
        type: "map",
        title: "แผนที่",
        content: JSON.stringify({
          heading: "แผนที่พื้นที่ให้บริการ",
          description: "PORNPISIT BATTERY ครอบคลุมพื้นที่โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ",
        }),
        order: 3,
      },
      {
        type: "hours",
        title: "เวลาทำการ",
        content: JSON.stringify({
          heading: "เวลาทำการ",
          daysLabel: "ทุกวัน จันทร์ - อาทิตย์",
          hoursLabel: "ตลอด 24 ชั่วโมง",
          note: "มีทีมช่างสแตนด์บายกะกลางคืน",
        }),
        order: 4,
      },
      {
        type: "cta-bottom",
        title: "CTA",
        content: JSON.stringify({
          heading: "แบตหมด? ติดต่อเราทันที!",
          description: "ไม่ว่าจะดึกดื่นแค่ไหน ทีมช่างพร้อมนำแบตเตอรี่แท้ไปเปลี่ยนถึงที่ โทรหรือแอดไลน์ได้เลยตอนนี้",
          ctaPhoneLabel: "โทร 099-673-1296",
          ctaLineLabel: "แอดไลน์ @398kyxfq",
        }),
        order: 5,
      },
    ];

    for (const sec of contactSections) {
      await prisma.pageSection.create({
        data: {
          pageId: contactPage.id,
          type: sec.type,
          title: sec.title,
          content: sec.content,
          order: sec.order,
          isActive: true,
        },
      });
    }
    console.log("[prebuild-migrate] Force-recreated contact-us page with 6 sections ✓");

    // ── 6. Update SiteSettings if exists ──
    try {
      const settings = await prisma.siteSettings.findFirst();
      if (settings) {
        let data = {};
        let changed = false;
        for (const key of Object.keys(settings)) {
          if (typeof settings[key] === "string") {
            let val = settings[key];
            for (const [from, to] of REPLACEMENTS) {
              if (val.includes(from)) {
                val = val.replaceAll(from, to);
                changed = true;
              }
            }
            data[key] = val;
          }
        }
        if (changed) {
          await prisma.siteSettings.update({ where: { id: settings.id }, data });
          console.log("[prebuild-migrate] Updated SiteSettings ✓");
        }
      }
    } catch {
      // SiteSettings may not exist
    }

    console.log("[prebuild-migrate] ✅ All done! DB is now PORNPISIT BATTERY.");
  } catch (e) {
    console.error("[prebuild-migrate] ❌ Error:", e.message);
    // Don't fail the build — pages will use fallback values
  } finally {
    await prisma.$disconnect();
  }
}

function safeJson(str) {
  try { return JSON.parse(str || "{}"); } catch { return {}; }
}

migrate();

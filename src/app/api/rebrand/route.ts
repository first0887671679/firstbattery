import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Find the home page
    const homePage = await (prisma as any).page.findUnique({
      where: { slug: "home" },
      include: { sections: true },
    });

    if (!homePage) {
      // Create home page with all sections
      const newHome = await (prisma as any).page.create({
        data: {
          slug: "home",
          title: "หน้าแรก",
          order: 0,
          seoTitle: "__BRAND_NAME__ บริการแบตเตอรี่รถยนต์ 24 ชม.",
          seoDescription: "บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ",
        },
      });
      await createAllSections(newHome.id);
      return NextResponse.json({ success: true, message: "Created home page with all sections" });
    }

    // Update home page meta
    await (prisma as any).page.update({
      where: { slug: "home" },
      data: {
        seoTitle: "__BRAND_NAME__ บริการแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม.",
        seoDescription: "บริการเปลี่ยนแบตเตอรี่รถยนต์ถึงที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ โทร __PHONE__",
      },
    });

    const sections = homePage.sections;
    const updated: string[] = [];

    for (const section of sections) {
      const type = section.type;

      if (type === "header") {
        await updateSection(section.id, {
          content: JSON.stringify({
            brandName: "__BRAND_NAME__",
            brandSub: "บริการแบตเตอรี่ 24 ชม.",
            phone: "__PHONE__",
            phoneLabel: "โทรด่วน",
            lineUrl: "__LINE_URL__",
            lineLabel: "Line",
            stickyPhoneLabel: "โทรเรียกช่าง",
            stickyLineLabel: "แอดไลน์",
            navBgColor: "#0a0a0a",
            navTextColor: "#a3a3a3",
            navAccentColor: "#dc2626",
            logoSize: 44,
            logoSizeMobile: 32,
            navbarHeight: 64,
            navbarHeightMobile: 52,
            links: [
              { label: "หน้าแรก", href: "/" },
              { label: "บริการ", href: "#services", children: [{ label: "เปลี่ยนแบตเตอรี่รถยนต์", href: "/battery-replacement" }] },
              { label: "เช็คราคาแบต", href: "/check-price" },
              { label: "ติดต่อเรา", href: "#contact" },
            ],
          }),
        });
        updated.push("header");
      }

      if (type === "sub-header") {
        await updateSection(section.id, {
          content: JSON.stringify({
            text: "🔋 บริการเปลี่ยนแบตเตอรี่ 24 ชม. ถึงที่ทันใจ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ โทรเลย!",
            linkUrl: "tel:__PHONE__",
            linkLabel: "โทรเลย",
            bgColor: "red",
          }),
        });
        updated.push("sub-header");
      }

      if (type === "hero") {
        await updateSection(section.id, {
          content: JSON.stringify({
            autoSlide: true,
            intervalMs: 5000,
            slides: [
              {
                heading: "บริการแบตเตอรี่รถยนต์",
                subheading: "นอกสถานที่ 24 ชั่วโมง",
                description: "เปลี่ยนแบตถึงที่รวดเร็วทันใจ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ",
                phoneUrl: "tel:__PHONE__",
                lineUrl: "__LINE_URL__",
                imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1920&auto=format&fit=crop",
                textAlign: "center",
                overlayOpacity: 45,
              },
              {
                heading: "แบตหมด? รถสตาร์ทไม่ติด?",
                subheading: "โทรหาเราได้ 24 ชม.",
                description: "ช่างผู้เชี่ยวชาญพร้อมนำแบตเตอรี่แท้มาเปลี่ยนให้ถึงที่ภายใน 30 นาที",
                phoneUrl: "tel:__PHONE__",
                lineUrl: "__LINE_URL__",
                imageUrl: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop",
                textAlign: "center",
                overlayOpacity: 40,
              },
              {
                heading: "เปลี่ยนแบตเตอรี่ถึงที่",
                subheading: "รวดเร็ว ปลอดภัย รับประกัน",
                description: "แบตเตอรี่แท้ทุกยี่ห้อ รับประกันคุณภาพ ราคาคุ้มค่า",
                phoneUrl: "tel:__PHONE__",
                lineUrl: "__LINE_URL__",
                imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1920&auto=format&fit=crop",
                textAlign: "center",
                overlayOpacity: 40,
              },
            ],
          }),
        });
        updated.push("hero");
      }

      if (type === "services") {
        await updateSection(section.id, {
          title: "บริการของเรา",
          content: JSON.stringify({
            description: "บริการเปลี่ยนแบตเตอรี่รถยนต์ครบวงจร ถึงที่ 24 ชม. โดยช่างผู้เชี่ยวชาญ",
            items: [
              { title: "เปลี่ยนแบตเตอรี่รถยนต์", description: "รถสตาร์ทไม่ติด? ช่างพร้อมนำแบตแท้ไปเปลี่ยนถึงที่ รับประกันคุณภาพ เช็คระบบไฟให้ฟรี", icon: "Battery", href: "/battery-replacement" },
              { title: "เปลี่ยนแบตฉุกเฉิน 24 ชม.", description: "บริการฉุกเฉินตลอด 24 ชั่วโมง ไม่ว่าจะดึกดื่นหรือเช้ามืด ช่างพร้อมออกบริการทันที", icon: "Zap", href: "/battery-replacement" },
              { title: "เช็คระบบไฟฟ้ารถยนต์", description: "ตรวจเช็คระบบชาร์จ ระบบไฟฟ้า ไดชาร์จ สตาร์ท ฟรี! เมื่อใช้บริการเปลี่ยนแบต", icon: "Wrench", href: "#contact" },
              { title: "แบตเตอรี่ทุกยี่ห้อ ทุกรุ่น", description: "รองรับรถยนต์ทุกยี่ห้อ ทุกรุ่น ทั้งรถเก๋ง กระบะ SUV แบตเตอรี่แท้จากโรงงาน", icon: "Shield", href: "/check-price" },
            ],
          }),
        });
        updated.push("services");
      }

      if (type === "gallery") {
        await updateSection(section.id, {
          title: "ภาพผลงานและหน้างานจริง",
          content: JSON.stringify({
            images: [
              { src: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop", alt: "เปลี่ยนแบตเตอรี่รถยนต์", caption: "เปลี่ยนแบตเตอรี่ถึงที่ เร็ว ปลอดภัย" },
              { src: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop", alt: "บริการแบตเตอรี่ 24 ชม.", caption: "บริการ 24 ชม. ถึงที่ทันใจ" },
              { src: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop", alt: "เปลี่ยนแบตนอกสถานที่", caption: "เปลี่ยนแบตนอกสถานที่ทั่วกรุงเทพ" },
              { src: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=800&auto=format&fit=crop", alt: "ช่างผู้เชี่ยวชาญ", caption: "ช่างมืออาชีพ มีประสบการณ์" },
            ],
          }),
        });
        updated.push("gallery");
      }

      if (type === "why-us") {
        await updateSection(section.id, {
          title: "ทำไมต้องเลือก __BRAND_NAME__?",
          content: JSON.stringify({
            badge: "Why Choose Us",
            subtitle: "เรามุ่งมั่นให้บริการที่ดีที่สุด เพื่อให้คุณกลับมาใช้รถได้อย่างมั่นใจ",
            items: [
              { title: "บริการ 24 ชั่วโมง", description: "พร้อมให้บริการทุกวัน ไม่มีวันหยุด ไม่ว่าจะดึกดื่นหรือเช้ามืด", icon: "Clock" },
              { title: "ถึงที่ภายใน 30 นาที", description: "ช่างออกบริการรวดเร็ว ครอบคลุมพื้นที่ ห้วยขวาง ดินแดง ลาดพร้าว", icon: "Zap" },
              { title: "แบตเตอรี่แท้ 100%", description: "ใช้แบตเตอรี่แท้จากโรงงาน คุณภาพสูง รับประกันยาวนาน", icon: "Shield" },
              { title: "รับประกันคุณภาพ", description: "ทุกงานรับประกัน เปลี่ยนแบตพร้อมเช็คระบบไฟให้ฟรี", icon: "ThumbsUp" },
            ],
          }),
        });
        updated.push("why-us");
      }

      if (type === "testimonials") {
        await updateSection(section.id, {
          title: "รีวิวจากลูกค้าจริง",
          content: JSON.stringify({
            items: [
              { name: "คุณนัท", role: "ผู้ใช้บริการเปลี่ยนแบตเตอรี่", avatar: "https://i.pravatar.cc/120?img=32", rating: 5, content: "โทรเรียกตอนตี 2 ช่างมาถึงไวมาก ไม่ถึง 20 นาที บริการดี สุภาพ เปลี่ยนแบตเสร็จเช็คระบบไฟให้ด้วย ประทับใจมากครับ" },
              { name: "คุณมิ้นท์", role: "ผู้ใช้บริการเปลี่ยนแบตฉุกเฉิน", avatar: "https://i.pravatar.cc/120?img=15", rating: 5, content: "รถสตาร์ทไม่ติดกลางทาง ใจเสียมาก โทรหา __BRAND_NAME__ ไม่ถึง 30 นาทีมาถึง เปลี่ยนแบตจบในที่เดียว ราคายุติธรรมมากค่ะ" },
              { name: "คุณโจ", role: "ผู้ใช้บริการที่ ห้วยขวาง", avatar: "https://i.pravatar.cc/120?img=5", rating: 5, content: "ใช้บริการหลายครั้งแล้ว ทุกครั้งช่างมาไว แบตแท้ ราคาตรงตามที่แจ้ง ไม่มีจ่ายเพิ่ม แนะนำเลยครับ" },
            ],
          }),
        });
        updated.push("testimonials");
      }

      if (type === "faq") {
        await updateSection(section.id, {
          title: "คำถามที่พบบ่อย",
          content: JSON.stringify({
            subtitle: "รวมคำตอบสำหรับคำถามที่ลูกค้าสอบถามบ่อยที่สุดเกี่ยวกับบริการแบตเตอรี่",
            items: [
              { question: "เปลี่ยนแบตเตอรี่นอกสถานที่ใช้เวลานานไหม?", answer: "ใช้เวลาเปลี่ยนเพียง 15-30 นาที ช่างเดินทางไปถึงที่คุณภายใน 30 นาที พร้อมเปลี่ยนแบตเตอรี่และตรวจเช็คระบบไฟให้ฟรี" },
              { question: "บริการ 24 ชั่วโมงจริงไหม?", answer: "ใช่ครับ เราให้บริการตลอด 24 ชั่วโมง ทุกวัน ไม่มีวันหยุด โทรเรียกช่างได้ทุกเวลา โทร __PHONE__ หรือแอดไลน์ __LINE_ID__" },
              { question: "ให้บริการพื้นที่ไหนบ้าง?", answer: "ครอบคลุมพื้นที่ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ และพื้นที่ใกล้เคียง" },
              { question: "มีการรับประกันแบตเตอรี่ไหม?", answer: "แบตเตอรี่ทุกลูกเป็นของแท้จากโรงงาน มีรับประกันตามเงื่อนไขของแต่ละยี่ห้อ พร้อมเช็คระบบไฟฟ้าให้ฟรี" },
              { question: "ราคาเปลี่ยนแบตเตอรี่เท่าไหร่?", answer: "ราคาขึ้นอยู่กับรุ่นรถและขนาดแบตเตอรี่ สามารถแอดไลน์ __LINE_ID__ หรือโทร __PHONE__ สอบถามราคาได้ฟรี ไม่มีค่าใช้จ่ายในการประเมิน" },
            ],
          }),
        });
        updated.push("faq");
      }

      if (type === "contact") {
        await updateSection(section.id, {
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
        updated.push("contact");
      }

      if (type === "footer") {
        await updateSection(section.id, {
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
        updated.push("footer");
      }

      if (type === "cta-banner") {
        await updateSection(section.id, {
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
        updated.push("cta-banner");
      }
    }

    return NextResponse.json({
      success: true,
      message: "Rebrand complete! __BRAND_NAME__",
      updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

async function updateSection(id: string, data: any) {
  await (prisma as any).pageSection.update({ where: { id }, data });
}

async function createAllSections(pageId: string) {
  const sections = [
    { pageId, type: "header", title: "เมนูบนสุด", content: JSON.stringify({ brandName: "__BRAND_NAME__", brandSub: "บริการแบตเตอรี่ 24 ชม.", phone: "__PHONE__", phoneLabel: "โทรด่วน", lineUrl: "__LINE_URL__", lineLabel: "Line", navBgColor: "#0a0a0a", navTextColor: "#a3a3a3", navAccentColor: "#dc2626", links: [{ label: "หน้าแรก", href: "/" }, { label: "บริการ", href: "#services", children: [{ label: "เปลี่ยนแบตเตอรี่รถยนต์", href: "/battery-replacement" }] }, { label: "เช็คราคาแบต", href: "/check-price" }, { label: "ติดต่อเรา", href: "#contact" }] }), order: 0 },
    { pageId, type: "sub-header", title: "แถบประกาศ", content: JSON.stringify({ text: "🔋 บริการเปลี่ยนแบตเตอรี่ 24 ชม. ถึงที่ทันใจ โทรเลย!", linkUrl: "tel:__PHONE__", linkLabel: "โทรเลย", bgColor: "red" }), order: 1 },
    { pageId, type: "hero", title: "Hero Banner", content: JSON.stringify({ autoSlide: true, intervalMs: 5000, slides: [{ heading: "บริการแบตเตอรี่รถยนต์", subheading: "นอกสถานที่ 24 ชั่วโมง", description: "เปลี่ยนแบตถึงที่รวดเร็วทันใจ", phoneUrl: "tel:__PHONE__", lineUrl: "__LINE_URL__", imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1920&auto=format&fit=crop", textAlign: "center", overlayOpacity: 45 }] }), order: 2 },
    { pageId, type: "services", title: "บริการของเรา", content: JSON.stringify({ items: [{ title: "เปลี่ยนแบตเตอรี่รถยนต์", description: "ช่างพร้อมนำแบตแท้ไปเปลี่ยนถึงที่ รับประกันคุณภาพ", icon: "Battery", href: "/battery-replacement" }, { title: "เปลี่ยนแบตฉุกเฉิน 24 ชม.", description: "บริการฉุกเฉินตลอด 24 ชม.", icon: "Zap", href: "/battery-replacement" }, { title: "เช็คระบบไฟฟ้ารถยนต์", description: "ตรวจเช็คระบบชาร์จ ไดชาร์จ สตาร์ท ฟรี!", icon: "Wrench", href: "#contact" }, { title: "แบตเตอรี่ทุกยี่ห้อ ทุกรุ่น", description: "รองรับรถยนต์ทุกยี่ห้อ ทุกรุ่น", icon: "Shield", href: "/check-price" }] }), order: 3 },
    { pageId, type: "why-us", title: "ทำไมต้องเลือก __BRAND_NAME__?", content: JSON.stringify({ items: [{ title: "บริการ 24 ชั่วโมง", description: "พร้อมให้บริการทุกวัน ไม่มีวันหยุด", icon: "Clock" }, { title: "ถึงที่ภายใน 30 นาที", description: "ช่างออกบริการรวดเร็ว", icon: "Zap" }, { title: "แบตเตอรี่แท้ 100%", description: "แบตเตอรี่แท้จากโรงงาน", icon: "Shield" }, { title: "รับประกันคุณภาพ", description: "ทุกงานรับประกัน", icon: "ThumbsUp" }] }), order: 4 },
    { pageId, type: "testimonials", title: "รีวิวจากลูกค้าจริง", content: JSON.stringify({ items: [{ name: "คุณนัท", role: "ผู้ใช้บริการ", avatar: "https://i.pravatar.cc/120?img=32", rating: 5, content: "บริการดี สุภาพ ประทับใจครับ" }, { name: "คุณมิ้นท์", role: "ผู้ใช้บริการฉุกเฉิน", avatar: "https://i.pravatar.cc/120?img=15", rating: 5, content: "ราคายุติธรรมมากค่ะ" }] }), order: 5 },
    { pageId, type: "faq", title: "คำถามที่พบบ่อย", content: JSON.stringify({ items: [{ question: "เปลี่ยนแบตเตอรี่ใช้เวลานานไหม?", answer: "ใช้เวลาเพียง 15-30 นาที" }, { question: "บริการ 24 ชั่วโมงจริงไหม?", answer: "ใช่ครับ ทุกวัน โทร __PHONE__" }] }), order: 6 },
    { pageId, type: "contact", title: "ติดต่อเรา", content: JSON.stringify({ heading: "แบตหมด? โทรหาเราเลย!", description: "พร้อมเปลี่ยนแบตเตอรี่ถึงที่ 24 ชม.", phone: "__PHONE__", lineId: "__LINE_ID__", lineUrl: "__LINE_URL__" }), order: 7 },
    { pageId, type: "footer", title: "ท้ายเว็บ", content: JSON.stringify({ brandName: "__BRAND_NAME__", description: "บริการเปลี่ยนแบตเตอรี่ 24 ชม.", openHours: "เปิดให้บริการตลอด 24 ชั่วโมง", area: "ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ", phone: "__PHONE__", lineId: "__LINE_ID__", lineUrl: "__LINE_URL__", facebook: "__FACEBOOK_URL__", googleMap: "__GOOGLE_MAP_URL__", copyright: "__BRAND_NAME__. All rights reserved.", serviceLinks: [{ label: "เปลี่ยนแบตเตอรี่", href: "/battery-replacement" }, { label: "เช็คราคา", href: "/check-price" }] }), order: 8 },
  ];
  for (const section of sections) {
    await (prisma as any).pageSection.create({ data: section });
  }
}

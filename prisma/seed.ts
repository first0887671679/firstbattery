import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@pornpisitbattery.com' },
    update: {},
    create: {
      email: 'admin@pornpisitbattery.com',
      name: 'Admin User',
      password: hashedPassword,
    },
  })

  // Contact Info
  await prisma.contactInfo.upsert({
    where: { id: 'contact-info-1' },
    update: {},
    create: {
      id: 'contact-info-1',
      phone: '0996731296',
      lineId: '@398kyxfq',
      lineUrl: 'https://lin.ee/OBB86S4',
      address: 'ห้วยขวาง',
    }
  })

  // =========================================================
  // สร้าง Page + Section เฉพาะเมื่อยังไม่มี (ไม่ลบข้อมูลเดิม)
  // =========================================================
  const existingHome = await (prisma as any).page.findUnique({ where: { slug: 'home' } })
  const homePage = existingHome || await (prisma as any).page.create({
    data: {
      slug: 'home',
      title: 'หน้าแรก',
      order: 0,
      seoTitle: 'PORNPISIT BATTERY บริการแบตเตอรี่รถยนต์ 24 ชั่วโมง',
      seoDescription: 'บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชั่วโมง ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
      seoKeywords: 'เปลี่ยนแบตเตอรี่,แบตเตอรี่รถยนต์,แบตเตอรี่ 24 ชม',
    },
  })

  const homeSections = [
    // 0: เมนูบนสุด (Navbar)
    {
      pageId: homePage.id,
      type: 'header',
      title: 'เมนูบนสุด',
      content: JSON.stringify({
        brandName: 'PORNPISIT BATTERY',
        brandSub: 'บริการแบตเตอรี่ 24 ชม.',
        phone: '0996731296',
        phoneLabel: 'โทรด่วน',
        lineUrl: 'https://lin.ee/OBB86S4',
        lineLabel: 'Line',
        links: [
          { label: 'หน้าแรก', href: '/' },
          {
            label: 'บริการ',
            href: '#',
            children: [
          { label: 'เปลี่ยนแบตเตอรี่รถยนต์', href: '/battery-replacement' },
            ],
          },
          { label: 'เช็คราคาแบต', href: '/check-price' },
          { label: 'ติดต่อเรา', href: '/contact-us' },
        ],
      }),
      order: 0,
    },
    // 1: แถบรอง (ประกาศ/โปรโมชั่น)
    {
      pageId: homePage.id,
      type: 'sub-header',
      title: 'แถบประกาศ',
      content: JSON.stringify({
        text: '🔋 บริการเปลี่ยนแบตเตอรี่ 24 ชม. ถึงที่ทันใจ โทรเลย!',
        linkUrl: 'tel:0996731296',
        linkLabel: 'โทรเลย',
        bgColor: 'orange',
      }),
      order: 1,
    },
    // 2: Hero Banner (สไลด์)
    {
      pageId: homePage.id,
      type: 'hero',
      title: 'Hero Banner',
      content: JSON.stringify({
        autoSlide: true,
        intervalMs: 5000,
        slides: [
          {
            heading: 'บริการแบตเตอรี่รถยนต์',
            subheading: 'นอกสถานที่ 24 ชั่วโมง',
            description: 'เปลี่ยนแบตถึงที่รวดเร็วทันใจ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
            phoneUrl: 'tel:0996731296',
            lineUrl: 'https://lin.ee/OBB86S4',
            imageUrl: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop',
            textAlign: 'center',
            overlayOpacity: 30,
          },
          {
            heading: 'แบตหมด? รถสตาร์ทไม่ติด?',
            subheading: 'โทรหาเราได้ 24 ชม.',
            description: 'ช่างผู้เชี่ยวชาญพร้อมนำแบตเตอรี่แท้มาเปลี่ยนให้ถึงที่ภายใน 30 นาที',
            phoneUrl: 'tel:0996731296',
            lineUrl: 'https://lin.ee/OBB86S4',
            imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1920&auto=format&fit=crop',
            textAlign: 'left',
            overlayOpacity: 40,
          },
          {
            heading: 'เปลี่ยนแบตเตอรี่ถึงที่',
            subheading: 'รวดเร็ว ปลอดภัย รับประกัน',
            description: 'แบตเตอรี่แท้ทุกยี่ห้อ รับประกันคุณภาพ ราคาคุ้มค่า',
            phoneUrl: 'tel:0996731296',
            lineUrl: 'https://lin.ee/OBB86S4',
            imageUrl: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=1920&auto=format&fit=crop',
            textAlign: 'right',
            overlayOpacity: 35,
          },
        ],
      }),
      order: 2,
    },
    // 3: บริการ
    {
      pageId: homePage.id,
      type: 'services',
      title: 'บริการของเรา',
      content: JSON.stringify({
        items: [
          {
            title: 'เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่',
            description: 'รถสตาร์ทไม่ติด? ช่างพร้อมนำแบตแท้ไปเปลี่ยนถึงที่ รับประกันคุณภาพ',
            icon: 'Battery',
            href: '/battery-replacement',
          },
          {
            title: 'เปลี่ยนแบตฉุกเฉิน 24 ชม.',
            description: 'บริการฉุกเฉินตลอด 24 ชม. ช่างพร้อมออกบริการทันที',
            icon: 'Zap',
            href: '/battery-replacement',
          },
          {
            title: 'เช็คระบบไฟฟ้ารถยนต์',
            description: 'ตรวจเช็คระบบชาร์จ ไดชาร์จ สตาร์ท ฟรี! เมื่อใช้บริการเปลี่ยนแบต',
            icon: 'Wrench',
            href: '#contact',
          },
          {
            title: 'แบตเตอรี่ทุกยี่ห้อ ทุกรุ่น',
            description: 'รองรับรถยนต์ทุกยี่ห้อ ทุกรุ่น แบตเตอรี่แท้จากโรงงาน',
            icon: 'Shield',
            href: '/check-price',
          },
        ],
      }),
      order: 3,
    },
    // 2: ภาพผลงาน (ข้อมูลเต็มจาก ShowcaseImage model เดิม)
    {
      pageId: homePage.id,
      type: 'gallery',
      title: 'ภาพผลงานและหน้างานจริง',
      content: JSON.stringify({
        images: [
          { src: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop', alt: 'เปลี่ยนแบตเตอรี่รถยนต์', caption: 'เปลี่ยนแบตเตอรี่ถึงที่ เร็ว ปลอดภัย' },
          { src: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?q=80&w=800&auto=format&fit=crop', alt: 'ซ่อมไดชาร์จ ไดสตาร์ท', caption: 'ซ่อมไดชาร์จ ไดสตาร์ท โดยช่างเชี่ยวชาญ' },
          { src: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=800&auto=format&fit=crop', alt: 'ขัดไฟหน้ารถ', caption: 'ขัดไฟหน้ารถ คืนความใส' },
          { src: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=800&auto=format&fit=crop', alt: 'ปะยางนอกสถานที่', caption: 'ปะยางนอกสถานที่ 24 ชม.' },
        ],
      }),
      order: 4,
    },
    // 5: ทำไมต้องเลือกเรา (ข้อมูลเต็มจาก WhyUsItem model เดิม)
    {
      pageId: homePage.id,
      type: 'why-us',
      title: 'ทำไมต้องเลือกเรา?',
      content: JSON.stringify({
        items: [
          { title: 'บริการ 24 ชั่วโมง', description: 'พร้อมให้บริการทุกวัน ไม่มีวันหยุด ไม่ว่าจะดึกดื่นหรือเช้ามืด', icon: 'Clock' },
          { title: 'ถึงที่ภายใน 30 นาที', description: 'ช่างออกบริการรวดเร็ว เดินทางถึงที่ภายใน 30 นาทีในพื้นที่ กทม.', icon: 'Zap' },
          { title: 'ช่างผู้เชี่ยวชาญ', description: 'ทีมช่างมีประสบการณ์มากกว่า 10 ปี ผ่านการอบรมมาตรฐาน', icon: 'Shield' },
          { title: 'รับประกันงานบริการ', description: 'ทุกงานมีการรับประกัน ใช้อะไหล่แท้คุณภาพสูง', icon: 'ThumbsUp' },
        ],
      }),
      order: 5,
    },
    // 6: รีวิวลูกค้า (ข้อมูลเต็มจาก Testimonial model เดิม)
    {
      pageId: homePage.id,
      type: 'testimonials',
      title: 'รีวิวจากลูกค้าจริง',
      content: JSON.stringify({
        items: [
          { name: 'คุณนัท', role: 'ผู้ใช้บริการเปลี่ยนแบตเตอรี่', avatar: 'https://i.pravatar.cc/120?img=32', rating: 5, content: 'โทรเรียกตอนดึก ช่างมาถึงไวมาก บริการดี สุภาพ ใส่ใจรายละเอียด เปลี่ยนเสร็จเช็คระบบไฟให้ด้วย ประทับใจครับ' },
          { name: 'คุณมิ้นท์', role: 'ผู้ใช้บริการซ่อมไดชาร์จ', avatar: 'https://i.pravatar.cc/120?img=15', rating: 5, content: 'รถสตาร์ทไม่ติดกลางทาง ติดต่อแล้วไม่ถึง 30 นาทีมาถึง ซ่อมจบในที่เดียว ราคายุติธรรม แนะนำเลยค่ะ' },
          { name: 'คุณโจ', role: 'ผู้ใช้บริการปะยาง', avatar: 'https://i.pravatar.cc/120?img=5', rating: 5, content: 'ยางรั่วตอนฝนตก โชคดีมากที่เจอทีมนี้ อุปกรณ์ครบ มืออาชีพ ทำงานเร็วและสะอาดเรียบร้อยมาก' },
        ],
      }),
      order: 6,
    },
    // 7: คำถามที่พบบ่อย (ข้อมูลเต็มจาก FaqItem model เดิม)
    {
      pageId: homePage.id,
      type: 'faq',
      title: 'คำถามที่พบบ่อย',
      content: JSON.stringify({
        items: [
          { question: 'เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ใช้เวลานานไหม?', answer: 'ใช้เวลาประมาณ 15-30 นาที ช่างจะเดินทางไปถึงที่คุณภายใน 30 นาที พร้อมเปลี่ยนแบตเตอรี่และตรวจเช็คระบบไฟให้ฟรี' },
          { question: 'บริการ 24 ชั่วโมงจริงไหม?', answer: 'ใช่ครับ เราให้บริการตลอด 24 ชั่วโมง ทุกวัน ไม่มีวันหยุด สามารถโทรเรียกช่างได้ทุกเวลา' },
          { question: 'ให้บริการพื้นที่ไหนบ้าง?', answer: 'เราให้บริการครอบคลุมพื้นที่กรุงเทพมหานครและปริมณฑล รวมถึง นนทบุรี ปทุมธานี สมุทรปราการ สมุทรสาคร และนครปฐม' },
          { question: 'มีการรับประกันงานบริการไหม?', answer: 'ทุกงานบริการมีการรับประกันคุณภาพ แบตเตอรี่รับประกัน 1 ปีเต็ม งานซ่อมไดชาร์จ ไดสตาร์ท รับประกัน 6 เดือน ใช้อะไหล่แท้ทุกชิ้น' },
          { question: 'ราคาบริการเท่าไหร่?', answer: 'ราคาขึ้นอยู่กับรุ่นรถและประเภทงานบริการ สามารถแอดไลน์ @398kyxfq หรือโทรสอบถามราคาได้ฟรี ไม่มีค่าใช้จ่ายในการประเมินราคา' },
        ],
      }),
      order: 7,
    },
    // 8: ติดต่อเรา
    {
      pageId: homePage.id,
      type: 'contact',
      title: 'ติดต่อเรา',
      content: JSON.stringify({
        heading: 'แบตหมด? โทรหาเราเลย!',
        description: 'ทีมช่างผู้เชี่ยวชาญพร้อมเปลี่ยนแบตเตอรี่ถึงที่คุณตลอด 24 ชั่วโมง',
        phone: '0996731296',
        lineId: '@398kyxfq',
        lineUrl: 'https://lin.ee/OBB86S4',
      }),
      order: 8,
    },
    // 9: Footer
    {
      pageId: homePage.id,
      type: 'footer',
      title: 'ท้ายเว็บ',
      content: JSON.stringify({
        brandName: 'PORNPISIT BATTERY',
        description: 'PORNPISIT BATTERY บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. ถึงที่รวดเร็วทันใจ',
        openHours: 'เปิดให้บริการตลอด 24 ชั่วโมง',
        area: 'ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
        phone: '0996731296',
        lineId: '@398kyxfq',
        lineUrl: 'https://lin.ee/OBB86S4',
        facebook: 'https://www.facebook.com/profile.php?id=61586430572682',
        googleMap: 'https://maps.app.goo.gl/vEpxr93MhWHrDB3Y9?g_st=ic',
        copyright: 'PORNPISIT BATTERY. All rights reserved.',
        serviceLinks: [
          { label: 'เปลี่ยนแบตเตอรี่รถยนต์', href: '/battery-replacement' },
          { label: 'เช็คราคาแบตเตอรี่', href: '/check-price' },
          { label: 'ติดต่อเรา', href: '#contact' },
        ],
      }),
      order: 9,
    },
  ]

  // Only create home sections if this is a fresh page (no existing sections)
  const existingHomeSections = await (prisma as any).pageSection.count({ where: { pageId: homePage.id } })
  if (existingHomeSections === 0) {
    for (const section of homeSections) {
      await (prisma as any).pageSection.create({ data: section })
    }
    console.log('Created home sections')
  } else {
    console.log('Home sections already exist, skipping')
  }

  // =========================================================
  // หน้าบริการเปลี่ยนแบตเตอรี่
  // =========================================================
  const existingBattery = await (prisma as any).page.findUnique({ where: { slug: 'battery-service' } })
  const batteryPage = existingBattery || await (prisma as any).page.create({
    data: {
      slug: 'battery-service',
      title: 'บริการเปลี่ยนแบตเตอรี่',
      order: 1,
      seoTitle: 'เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. | PORNPISIT BATTERY',
      seoDescription: 'บริการเปลี่ยนแบตเตอรี่รถยนต์ถึงที่ รวดเร็ว ปลอดภัย รับประกัน 1 ปี',
      seoKeywords: 'เปลี่ยนแบตเตอรี่,แบตเตอรี่รถยนต์,แบตหมด',
    },
  })

  const batterySections = [
    {
      pageId: batteryPage.id,
      type: 'hero',
      title: 'Hero',
      content: JSON.stringify({
        heading: 'เปลี่ยนแบตเตอรี่รถยนต์',
        subheading: 'นอกสถานที่ ถึงที่รวดเร็ว',
        description: 'รับประกัน 1 ปี เช็คระบบไฟฟรี ช่างผู้เชี่ยวชาญ',
      }),
      order: 0,
    },
    {
      pageId: batteryPage.id,
      type: 'text-image',
      title: 'รายละเอียดบริการ',
      content: JSON.stringify({
        body: 'เราให้บริการเปลี่ยนแบตเตอรี่รถยนต์ถึงที่ ครอบคลุมทุกยี่ห้อ ทุกรุ่น พร้อมตรวจเช็คระบบไฟฟ้าให้ฟรี ใช้แบตเตอรี่แท้คุณภาพสูง รับประกัน 1 ปีเต็ม',
        imagePosition: 'right',
      }),
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=800&auto=format&fit=crop',
      order: 1,
    },
  ]

  const existingBatterySections = await (prisma as any).pageSection.count({ where: { pageId: batteryPage.id } })
  if (existingBatterySections === 0) {
    for (const section of batterySections) {
      await (prisma as any).pageSection.create({ data: section })
    }
  }

  // =========================================================
  // หน้าปะยางนอกสถานที่
  // =========================================================
  const existingTire = await (prisma as any).page.findUnique({ where: { slug: 'mobile-tire-repair' } })
  const tireRepairPage = existingTire || await (prisma as any).page.create({
    data: {
      slug: 'mobile-tire-repair',
      title: 'บริการปะยางนอกสถานที่',
      order: 2,
      seoTitle: 'ปะยางนอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ ถึงไว ด่วนทันใจ',
      seoDescription: 'ยางแตก ยางรั่ว โทรเรียกเรา! บริการปะยางนอกสถานที่ด่วน ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ ช่างชำนาญงาน พร้อมให้บริการและแก้ปัญหาทันที',
      seoKeywords: 'ปะยางนอกสถานที่,ร้านปะยางใกล้ฉัน,ปะยาง 24 ชม,ปะยาง บางนา,ปะยาง ศรีนครินทร์',
    },
  })

  if (!existingTire) {
    await (prisma as any).pageSection.create({
      data: {
        pageId: tireRepairPage.id,
        type: 'hero',
        title: 'Hero',
        content: JSON.stringify({
          heading: 'ร้านปะยางใกล้ฉัน บริการปะยางนอกสถานที่ 24 ชั่วโมง',
          subheading: 'ด่วนทันใจ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
          description: 'ยางแตก ยางแบน ยางรั่ว ไม่ต้องตกใจ ช่างพร้อมออกบริการถึงที่ภายใน 30 นาที',
        }),
        order: 0,
      },
    })
  }

  // =========================================================
  // หน้าเปลี่ยนแบตเตอรี่ (slug ใหม่)
  // =========================================================
  const existingBattReplacement = await (prisma as any).page.findUnique({ where: { slug: 'battery-replacement' } })
  const batteryReplacementPage = existingBattReplacement || await (prisma as any).page.create({
    data: {
      slug: 'battery-replacement',
      title: 'บริการเปลี่ยนแบตเตอรี่รถยนต์',
      order: 3,
      seoTitle: 'ร้านแบตเตอรี่รถยนต์ นอกสถานที่ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ เปลี่ยนแบตด่วน',
      seoDescription: 'รถสตาร์ทไม่ติด? ร้านแบตเตอรี่รถยนต์ใกล้ฉัน บริการเปลี่ยนแบตเตอรี่ด่วนนอกสถานที่ มีแบตแท้รองรับทุกรุ่น ช่างมืออาชีพพร้อมไปถึงหน้าบ้านคุณ',
      seoKeywords: 'เปลี่ยนแบตเตอรี่รถยนต์,ร้านแบตเตอรี่ใกล้ฉัน,เปลี่ยนแบตนอกสถานที่,แบตเตอรี่ บางนา,แบตเตอรี่ ศรีนครินทร์',
    },
  })

  if (!existingBattReplacement) {
    await (prisma as any).pageSection.create({
      data: {
        pageId: batteryReplacementPage.id,
        type: 'hero',
        title: 'Hero',
        content: JSON.stringify({
          heading: 'ร้านแบตเตอรี่รถยนต์นอกสถานที่',
          subheading: 'เปลี่ยนแบตด่วน 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
          description: 'รถสตาร์ทไม่ติด บิดกุญแจแล้วเงียบ เราพร้อมนำแบตเตอรี่แท้ไปเปลี่ยนให้ถึงที่',
        }),
        order: 0,
      },
    })
  }

  // =========================================================
  // หน้าซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท
  // =========================================================
  const existingAlternator = await (prisma as any).page.findUnique({ where: { slug: 'alternator-starter' } })
  const alternatorPage = existingAlternator || await (prisma as any).page.create({
    data: {
      slug: 'alternator-starter',
      title: 'บริการซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท',
      order: 4,
      seoTitle: 'ซ่อมเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
      seoDescription: 'รถดับกลางทาง สตาร์ทไม่ติด? บริการตรวจเช็คและเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ไม่ต้องลากรถ ครอบคลุมพื้นที่บริการ ประเมินราคาก่อนซ่อม',
      seoKeywords: 'ซ่อมไดชาร์จ,เปลี่ยนไดสตาร์ท,ไดชาร์จนอกสถานที่,ไดสตาร์ทนอกสถานที่,ซ่อมไดชาร์จ บางนา',
    },
  })

  if (!existingAlternator) {
    await (prisma as any).pageSection.create({
      data: {
        pageId: alternatorPage.id,
        type: 'hero',
        title: 'Hero',
        content: JSON.stringify({
          heading: 'บริการซ่อมเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่',
          subheading: 'ด่วน ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
          description: 'วิเคราะห์อาการแม่นยำด้วย OBD มีอะไหล่คุณภาพ ซ่อมเสร็จหน้างานขับต่อได้',
        }),
        order: 0,
      },
    })
  }

  // =========================================================
  // หน้าขัดสีรถ ลบรอย ขัดไฟหน้า
  // =========================================================
  const existingPolishing = await (prisma as any).page.findUnique({ where: { slug: 'car-polishing' } })
  const polishingPage = existingPolishing || await (prisma as any).page.create({
    data: {
      slug: 'car-polishing',
      title: 'บริการขัดสีรถ ลบรอย ขัดไฟหน้า',
      order: 5,
      seoTitle: 'รับขัดสีรถยนต์ ขัดไฟหน้านอกสถานที่ ถึงบ้านคุณ ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
      seoDescription: 'บริการขัดสีรถลบรอย ขัดไฟหน้าเหลืองให้ใสปิ๊ง นอกสถานที่ ไม่ต้องทิ้งรถไว้ที่ร้าน สะดวกสบาย บริการถึงบ้าน ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
      seoKeywords: 'ขัดสีรถนอกสถานที่,ขัดไฟหน้ารถ,ลบรอยขีดข่วน,ขัดสีรถ บางนา,ขัดไฟหน้า ศรีนครินทร์',
    },
  })

  if (!existingPolishing) {
    await (prisma as any).pageSection.create({
      data: {
        pageId: polishingPage.id,
        type: 'hero',
        title: 'Hero',
        content: JSON.stringify({
          heading: 'บริการขัดสีรถ ลบรอย ขัดไฟหน้าเหลือง',
          subheading: 'นอกสถานที่ ถึงบ้าน ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
          description: 'ไม่ต้องทิ้งรถไว้คาร์แคร์ ช่างนำเครื่องมือไปบริการถึงบ้าน',
        }),
        order: 0,
      },
    })
  }

  console.log({
    admin,
    homePage: homePage.id,
    batteryPage: batteryPage.id,
    tireRepairPage: tireRepairPage.id,
    batteryReplacementPage: batteryReplacementPage.id,
    alternatorPage: alternatorPage.id,
    polishingPage: polishingPage.id,
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

/**
 * One-time migration script to update internal links in live DB
 * Run: node prisma/update-links.mjs
 */
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const homePage = await prisma.page.findUnique({
    where: { slug: 'home' },
    include: { sections: true },
  })

  if (!homePage) {
    console.log('Home page not found')
    return
  }

  const sections = homePage.sections

  // 1. Update header (brand, phone, line, links)
  const headerSec = sections.find((s) => s.type === 'header')
  if (headerSec) {
    const data = JSON.parse(headerSec.content || '{}')
    data.brandName = '__BRAND_NAME__'
    data.phone = '__PHONE__'
    data.lineUrl = '__LINE_URL__'
    data.links = [
      { label: 'หน้าแรก', href: '/' },
      {
        label: 'บริการ',
        href: '#',
        children: [
          { label: 'ปะยางนอกสถานที่ 24 ชม.', href: '/mobile-tire-repair' },
          { label: 'เปลี่ยนแบตเตอรี่รถยนต์', href: '/battery-replacement' },
          { label: 'ซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท', href: '/alternator-starter' },
          { label: 'ขัดสีรถ ลบรอย ขัดไฟหน้า', href: '/car-polishing' },
        ],
      },
      { label: 'เช็คราคาแบต', href: '/check-price' },
      { label: 'ติดต่อเรา', href: '/contact-us' },
    ]
    await prisma.pageSection.update({
      where: { id: headerSec.id },
      data: { content: JSON.stringify(data) },
    })
    console.log('Header links updated')
  }

  // 2. Update services items
  const servicesSec = sections.find((s) => s.type === 'services')
  if (servicesSec) {
    const data = JSON.parse(servicesSec.content || '{}')
    data.items = [
      {
        title: 'ปะยางนอกสถานที่ 24 ชม.',
        description: 'ยางแตก ยางรั่ว ช่างปะยางถึงที่ภายใน 30 นาที โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ',
        icon: 'PenTool',
        href: '/mobile-tire-repair',
      },
      {
        title: 'เปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่',
        description: 'รถสตาร์ทไม่ติด? ช่างพร้อมนำแบตแท้ไปเปลี่ยนถึงที่ รับประกัน 1 ปี',
        icon: 'Battery',
        href: '/battery-replacement',
      },
      {
        title: 'ซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท',
        description: 'วิเคราะห์อาการแม่นยำด้วย OBD ซ่อมเสร็จหน้างาน ไม่ต้องลากรถ',
        icon: 'Wrench',
        href: '/alternator-starter',
      },
      {
        title: 'ขัดสีรถ ลบรอย ขัดไฟหน้า',
        description: 'บริการขัดสีรถลบรอย ขัดไฟหน้าเหลืองให้ใสปิ๊ง นอกสถานที่ถึงบ้าน',
        icon: 'Sparkles',
        href: '/car-polishing',
      },
    ]
    await prisma.pageSection.update({
      where: { id: servicesSec.id },
      data: { content: JSON.stringify(data) },
    })
    console.log('Services items updated')
  }

  // 3. Update footer (brand, phone, line, facebook, googleMap, serviceLinks)
  const footerSec = sections.find((s) => s.type === 'footer')
  if (footerSec) {
    const data = JSON.parse(footerSec.content || '{}')
    data.brandName = '__BRAND_NAME__'
    data.description = '__BRAND_NAME__ บริการดูแลรักษารถยนต์นอกสถานที่ 24 ชั่วโมง ถึงที่รวดเร็วทันใจ โดยช่างผู้เชี่ยวชาญ'
    data.area = '__SERVICE_AREA__'
    data.phone = '__PHONE__'
    data.lineId = '__LINE_ID__'
    data.lineUrl = '__LINE_URL__'
    data.facebook = '__FACEBOOK_URL__'
    data.googleMap = '__GOOGLE_MAP_URL__'
    data.copyright = '__BRAND_NAME__. All rights reserved.'
    data.serviceLinks = [
      { label: 'ปะยางนอกสถานที่ 24 ชม.', href: '/mobile-tire-repair' },
      { label: 'เปลี่ยนแบตเตอรี่รถยนต์', href: '/battery-replacement' },
      { label: 'ซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท', href: '/alternator-starter' },
      { label: 'ขัดสีรถ ลบรอย ขัดไฟหน้า', href: '/car-polishing' },
      { label: 'เช็คราคาแบตเตอรี่', href: '/check-price' },
      { label: 'ติดต่อเรา', href: '/contact-us' },
    ]
    await prisma.pageSection.update({
      where: { id: footerSec.id },
      data: { content: JSON.stringify(data) },
    })
    console.log('Footer serviceLinks updated')
  }

  // 4. Update contact section
  const contactSec = sections.find((s) => s.type === 'contact')
  if (contactSec) {
    const data = JSON.parse(contactSec.content || '{}')
    data.phone = '__PHONE__'
    data.lineId = '__LINE_ID__'
    data.lineUrl = '__LINE_URL__'
    await prisma.pageSection.update({
      where: { id: contactSec.id },
      data: { content: JSON.stringify(data) },
    })
    console.log('Contact section updated')
  }

  // 5. Update hero slides phone/line
  const heroSec = sections.find((s) => s.type === 'hero')
  if (heroSec) {
    const data = JSON.parse(heroSec.content || '{}')
    if (Array.isArray(data.slides)) {
      data.slides = data.slides.map((slide) => ({
        ...slide,
        phoneUrl: 'tel:__PHONE__',
        lineUrl: '__LINE_URL__',
      }))
    }
    await prisma.pageSection.update({
      where: { id: heroSec.id },
      data: { content: JSON.stringify(data) },
    })
    console.log('Hero slides updated')
  }

  console.log('All business info updated!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

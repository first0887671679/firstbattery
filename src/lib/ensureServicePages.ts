import { prisma } from "@/lib/prisma";

export interface ServicePageDef {
  slug: string;
  title: string;
  order: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  sections: {
    type: string;
    title: string;
    content: string;
    imageUrl?: string;
    order: number;
  }[];
}

const SERVICE_PAGES: ServicePageDef[] = [
  /* ═══════════════════════════════════════════
     ปะยางนอกสถานที่
     ═══════════════════════════════════════════ */
  {
    slug: "mobile-tire-repair",
    title: "บริการปะยางนอกสถานที่",
    order: 2,
    seoTitle: "ปะยางนอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว ถึงไว ด่วนทันใจ",
    seoDescription: "ยางแตก ยางรั่ว โทรเรียกเรา! บริการปะยางนอกสถานที่ด่วน โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ ช่างชำนาญงาน พร้อมให้บริการและแก้ปัญหาทันที",
    seoKeywords: "ปะยางนอกสถานที่,ร้านปะยางใกล้ฉัน,ปะยาง 24 ชม,ปะยาง ห้วยขวาง,ปะยาง ดินแดง",
    sections: [
      {
        type: "hero",
        title: "Hero",
        content: JSON.stringify({
          heading: "ร้านปะยางใกล้ฉัน บริการปะยางนอกสถานที่ 24 ชั่วโมง ด่วนทันใจ โซนห้วยขวาง ดินแดง ลาดพร้าว",
          description: 'รถยางแตก ยางแบน หรือยางรั่วระหว่างทาง! เราคือผู้ให้บริการ <strong class="text-white">ปะยางนอกสถานที่</strong> แบบเร่งด่วน พร้อมออกช่วยเหลือคุณทุกที่ สแตนด์บายพร้อมเดินทางไปแก้ไขปัญหาให้คุณถึงที่ภายใน 30 นาที',
          imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=1600&auto=format&fit=crop",
          ctaPhoneLabel: "โทรเรียกช่างปะยางด่วน",
          ctaLineLabel: "แอดไลน์ส่งพิกัด",
        }),
        order: 0,
      },
      {
        type: "why-us",
        title: "ทำไมต้องเรียกเรา",
        content: JSON.stringify({
          heading: 'ทำไมต้องเรียกใช้บริการ <span class="text-red-600">ร้านปะยางใกล้ฉัน</span> ของเรา?',
          items: [
            { icon: "Clock", title: "รวดเร็ว ทันใจ ถึงหน้างานไวใน 30 นาที", desc: "ทีมช่างสแตนด์บายพร้อมออกบริการตลอด 24 ชม. ไม่ว่าจะดึกดื่นแค่ไหน เราไปถึงคุณได้" },
            { icon: "Shield", title: "เครื่องมือมาตรฐาน ปลอดภัย 100%", desc: "ปะแบบแทงไหมและสตีมยาง ใช้เครื่องมือคุณภาพสูง มาตรฐานความปลอดภัย ขับต่อได้ทันที" },
            { icon: "CheckCircle", title: "ประเมินราคาชัดเจน ไม่มีบวกเพิ่ม", desc: "แจ้งราคาก่อนเริ่มงานทุกครั้ง ไม่มีค่าใช้จ่ายแอบแฝง โปร่งใสทุกขั้นตอน" },
          ],
        }),
        order: 1,
      },
      {
        type: "info",
        title: "ยางรั่ว ยางแบน ควรทำอย่างไร?",
        content: JSON.stringify({
          heading: "ยางรั่ว ยางแบน ควรทำอย่างไร?",
          description: 'จอดรถในจุดที่ปลอดภัย เปิดไฟฉุกเฉิน <strong>ห้ามขับบดเด็ดขาด</strong> และโทรเรียกบริการ <strong>ปะยางนอกสถานที่ 24 ชม.</strong> ของเรา พร้อมแจ้งพิกัด Location',
          layout: "steps",
          items: [
            { step: "1", text: "จอดรถจุดปลอดภัย เปิดไฟฉุกเฉิน" },
            { step: "2", text: "โทรแจ้ง หรือส่งพิกัดทาง Line" },
            { step: "3", text: "ช่างถึงภายใน 30 นาที แก้ไขทันที" },
          ],
        }),
        order: 2,
      },
      {
        type: "areas",
        title: "พื้นที่ให้บริการ",
        content: JSON.stringify({
          heading: "พื้นที่ให้บริการ ปะยางนอกสถานที่",
          description: "ครอบคลุมโซนกรุงเทพฯ: ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ",
          areas: ["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"],
        }),
        order: 3,
      },
      {
        type: "cta-bottom",
        title: "CTA",
        content: JSON.stringify({
          heading: "ยางแตก ยางรั่ว โทรหาเราได้ทันที!",
          description: "ช่างพร้อมออกบริการ 24 ชั่วโมง ส่งพิกัดมาทาง Line หรือโทรเรียกช่างปะยางด่วนได้เลย",
          ctaPhoneLabel: "โทรเรียกช่างปะยางด่วน",
          ctaLineLabel: "แอดไลน์ส่งพิกัด",
        }),
        order: 4,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     เปลี่ยนแบตเตอรี่รถยนต์
     ═══════════════════════════════════════════ */
  {
    slug: "battery-replacement",
    title: "บริการเปลี่ยนแบตเตอรี่รถยนต์",
    order: 3,
    seoTitle: "ร้านแบตเตอรี่รถยนต์ นอกสถานที่ ห้วยขวาง ดินแดง ลาดพร้าว เปลี่ยนแบตด่วน",
    seoDescription: "รถสตาร์ทไม่ติด? ร้านแบตเตอรี่รถยนต์ใกล้ฉัน บริการเปลี่ยนแบตเตอรี่ด่วนนอกสถานที่ มีแบตแท้รองรับทุกรุ่น ช่างมืออาชีพพร้อมไปถึงหน้าบ้านคุณ",
    seoKeywords: "เปลี่ยนแบตเตอรี่รถยนต์,ร้านแบตเตอรี่ใกล้ฉัน,เปลี่ยนแบตนอกสถานที่,แบตเตอรี่ ห้วยขวาง,แบตเตอรี่ ดินแดง",
    sections: [
      {
        type: "hero",
        title: "Hero",
        content: JSON.stringify({
          heading: "ร้านแบตเตอรี่รถยนต์นอกสถานที่ เปลี่ยนแบตด่วน 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว",
          description: 'รถสตาร์ทไม่ติด บิดกุญแจแล้วเงียบ! ไม่ต้องเสียเวลาเรียกรถลาก เราคือ <strong class="text-white">ร้านแบตเตอรี่รถยนต์นอกสถานที่</strong> ที่พร้อมนำแบตเตอรี่ลูกใหม่ไปเปลี่ยนให้คุณถึงที่หมายอย่างรวดเร็ว ปลอดภัย และได้มาตรฐาน',
          imageUrl: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1600&auto=format&fit=crop",
          ctaPhoneLabel: "โทรเรียกร้านแบตเตอรี่ด่วน",
          ctaLineLabel: "แอดไลน์เช็คราคาแบต",
        }),
        order: 0,
      },
      {
        type: "why-us",
        title: "กำลังมองหาร้านแบตเตอรี่ใกล้ฉัน",
        content: JSON.stringify({
          heading: 'กำลังมองหา <span class="text-red-600">ร้านแบตเตอรี่ใกล้ฉัน</span> อยู่ใช่ไหม?<br class="hidden sm:block" /><span class="text-lg sm:text-xl md:text-2xl font-bold text-slate-600">เราพร้อมไปถึงไวใน 30 นาที</span>',
          items: [
            { icon: "Clock", title: "บริการถึงที่ สะดวก รวดเร็ว", desc: "ไม่ต้องลากรถไปร้าน ช่างพร้อมนำแบตเตอรี่ลูกใหม่ไปเปลี่ยนให้ถึงที่ ภายใน 30 นาที ทุกวัน 24 ชม." },
            { icon: "Shield", title: "แบตเตอรี่แท้ 100% มีรับประกันทุกลูก", desc: "เราเลือกใช้แบตเตอรี่แท้จากโรงงาน GS, FB, Panasonic, 3K และอื่นๆ รับประกันคุณภาพ 1-2 ปีเต็ม" },
            { icon: "Zap", title: "เลี้ยงไฟขณะเปลี่ยน ระบบไม่รวน", desc: "สำรองไฟ Backup ให้รถของคุณทุกครั้ง ระบบอิเล็กทรอนิกส์ ตั้งค่าเบาะ กระจก ไม่หาย" },
          ],
        }),
        order: 1,
      },
      {
        type: "info",
        title: "อาการที่ควรเปลี่ยนแบตเตอรี่",
        content: JSON.stringify({
          heading: "อาการแบบไหนที่ควรเรียกช่างเปลี่ยนแบตเตอรี่?",
          layout: "list",
          items: [
            { icon: "AlertTriangle", text: "สตาร์ทรถติดยากในตอนเช้า หรือไดสตาร์ทหมุนช้าลง" },
            { icon: "AlertTriangle", text: "ระบบไฟส่องสว่างภายในรถหรี่ลงผิดปกติ" },
            { icon: "AlertTriangle", text: "แบตเตอรี่บวม หรือมีคราบขี้เกลือเกาะที่ขั้ว" },
            { icon: "AlertTriangle", text: "อายุแบตเตอรี่เกิน 1.5 - 2 ปี ควรตรวจเช็ค" },
          ],
          bgColor: "bg-slate-50",
        }),
        order: 2,
      },
      {
        type: "areas",
        title: "พื้นที่ให้บริการ",
        content: JSON.stringify({
          heading: "พื้นที่ให้บริการ เปลี่ยนแบตเตอรี่นอกสถานที่",
          description: "ครอบคลุมโซนกรุงเทพฯ: ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ",
          areas: ["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"],
        }),
        order: 3,
      },
      {
        type: "cta-bottom",
        title: "CTA",
        content: JSON.stringify({
          heading: "รถสตาร์ทไม่ติด? โทรหาเราเลย!",
          description: "ช่างพร้อมนำแบตเตอรี่แท้ไปเปลี่ยนให้ถึงที่ 24 ชม. แอดไลน์ส่งรูปแบตเดิมเพื่อเช็คราคาได้ทันที",
          ctaPhoneLabel: "โทรเรียกร้านแบตเตอรี่ด่วน",
          ctaLineLabel: "แอดไลน์เช็คราคาแบต",
        }),
        order: 4,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     ไดชาร์จ ไดสตาร์ท
     ═══════════════════════════════════════════ */
  {
    slug: "alternator-starter",
    title: "บริการซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท",
    order: 4,
    seoTitle: "ซ่อมเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ห้วยขวาง ดินแดง ลาดพร้าว",
    seoDescription: "รถดับกลางทาง สตาร์ทไม่ติด? บริการตรวจเช็คและเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ไม่ต้องลากรถ ครอบคลุมพื้นที่ห้วยขวาง ดินแดง ลาดพร้าว ประเมินราคาก่อนซ่อม",
    seoKeywords: "ซ่อมไดชาร์จ,เปลี่ยนไดสตาร์ท,ไดชาร์จนอกสถานที่,ไดสตาร์ทนอกสถานที่,ซ่อมไดชาร์จ ห้วยขวาง",
    sections: [
      {
        type: "hero",
        title: "Hero",
        content: JSON.stringify({
          heading: "บริการซ่อมเปลี่ยนไดชาร์จ ไดสตาร์ท นอกสถานที่ ด่วน โซนห้วยขวาง ดินแดง ลาดพร้าว",
          description: 'รถสตาร์ทไม่ติด ไฟหน้าปัดโชว์ หรือรถดับกลางอากาศ! อาจเป็นสัญญาณของระบบไดชาร์จหรือไดสตาร์ทพัง เรามีบริการ <strong class="text-white">ช่างซ่อมไดชาร์จนอกสถานที่</strong> และ <strong class="text-white">เปลี่ยนไดสตาร์ทนอกสถานที่</strong> พร้อมเครื่องมือวิเคราะห์ปัญหาที่แม่นยำ ออกให้บริการถึงที่',
          imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=1600&auto=format&fit=crop",
          ctaPhoneLabel: "โทรปรึกษาช่างด่วน",
          ctaLineLabel: "แอดไลน์ส่งโลเคชั่น",
        }),
        order: 0,
      },
      {
        type: "info",
        title: "วิเคราะห์อาการ",
        content: JSON.stringify({
          heading: 'รถสตาร์ทไม่ติด เป็นที่ <span class="text-red-600">แบตเตอรี่ ไดชาร์จ หรือ ไดสตาร์ท?</span>',
          layout: "two-column",
          items: [
            { icon: "Zap", title: "อาการไดชาร์จเสีย (Alternator)", desc: "ไฟรูปแบตเตอรี่เตือนสีแดงโชว์หน้าปัด\nแอร์ไม่เย็น ไฟหน้าหรี่ลง\nเครื่องยนต์ดับกลางทาง\nชาร์จไฟไม่เข้า แบตหมดซ้ำๆ" },
            { icon: "Wrench", title: "อาการไดสตาร์ทเสีย (Starter)", desc: "ไฟหน้าและแตรปกติ แต่บิดกุญแจแล้วเงียบ\nบิดกุญแจแล้วมีเสียงดัง \"แชะๆ\"\nสตาร์ทติดบ้างไม่ติดบ้าง\nได้ยินเสียงคลิกเบาๆ แต่เครื่องไม่หมุน" },
          ],
          bgColor: "bg-white",
        }),
        order: 1,
      },
      {
        type: "info",
        title: "ทำไมต้องเลือกเรา",
        content: JSON.stringify({
          heading: "ทำไมต้องเลือกบริการเปลี่ยนไดสตาร์ท ไดชาร์จ ของเรา?",
          description: "วิเคราะห์อาการแม่นยำด้วยเครื่องมือ OBD มีอะไหล่รองรับทั้งของแท้ศูนย์และอะไหล่บิ้วคุณภาพสูง ประหยัดค่ารถลาก แก้ไขเสร็จหน้างานขับต่อได้ทันที",
          layout: "cards",
          items: [
            { icon: "Wrench", title: "วิเคราะห์ด้วย OBD", desc: "เครื่องมือสแกนระบบแม่นยำ" },
            { icon: "Shield", title: "อะไหล่คุณภาพ", desc: "ทั้งแท้ศูนย์และบิ้วเกรด A" },
            { icon: "CheckCircle", title: "ประหยัดค่ารถลาก", desc: "ซ่อมเสร็จหน้างาน ขับต่อได้" },
          ],
          bgColor: "bg-slate-50",
        }),
        order: 2,
      },
      {
        type: "areas",
        title: "พื้นที่ให้บริการ",
        content: JSON.stringify({
          heading: "พื้นที่ให้บริการ ซ่อม/เปลี่ยน ไดชาร์จ ไดสตาร์ท",
          description: "ครอบคลุมโซนกรุงเทพฯ: ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ",
          areas: ["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"],
        }),
        order: 3,
      },
      {
        type: "cta-bottom",
        title: "CTA",
        content: JSON.stringify({
          heading: "รถดับกลางทาง? ปรึกษาช่างได้ทันที!",
          description: "แจ้งอาการเบื้องต้น ช่างวิเคราะห์ปัญหาและประเมินราคาก่อนออกบริการ ไม่มีค่าใช้จ่ายแอบแฝง",
          ctaPhoneLabel: "โทรปรึกษาช่างด่วน",
          ctaLineLabel: "แอดไลน์ส่งโลเคชั่น",
        }),
        order: 4,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     ขัดสีรถ ลบรอย ขัดไฟหน้า
     ═══════════════════════════════════════════ */
  {
    slug: "car-polishing",
    title: "บริการขัดสีรถ ลบรอย ขัดไฟหน้า",
    order: 5,
    seoTitle: "รับขัดสีรถยนต์ ขัดไฟหน้านอกสถานที่ ถึงบ้านคุณ ห้วยขวาง ดินแดง ลาดพร้าว",
    seoDescription: "บริการขัดสีรถลบรอย ขัดไฟหน้าเหลืองให้ใสปิ๊ง นอกสถานที่ ไม่ต้องทิ้งรถไว้ที่ร้าน สะดวกสบาย บริการถึงบ้านย่านห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ",
    seoKeywords: "ขัดสีรถนอกสถานที่,ขัดไฟหน้ารถ,ลบรอยขีดข่วน,ขัดสีรถ ห้วยขวาง,ขัดไฟหน้า ดินแดง",
    sections: [
      {
        type: "hero",
        title: "Hero",
        content: JSON.stringify({
          heading: "บริการขัดสีรถ ลบรอย ขัดไฟหน้าเหลือง นอกสถานที่ ถึงบ้าน โซนห้วยขวาง ดินแดง ลาดพร้าว",
          description: 'คืนความเงางามและปลอดภัยให้รถคุณด้วย <strong class="text-white">บริการขัดสีรถยนต์นอกสถานที่</strong> และ <strong class="text-white">ขัดไฟหน้ารถนอกสถานที่</strong> โดยช่างผู้ชำนาญการ ไม่ต้องขับรถไปทิ้งไว้ที่คาร์แคร์ข้ามวันให้เสียเวลา เราพร้อมนำเครื่องมือไปบริการเนรมิตรถคุณให้สวยใสถึงหน้าบ้าน',
          imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?q=80&w=1600&auto=format&fit=crop",
          ctaPhoneLabel: "โทรสอบถามคิวช่าง",
          ctaLineLabel: "ถ่ายรูปส่งประเมินราคาทาง Line",
        }),
        order: 0,
      },
      {
        type: "why-us",
        title: "ทำไมต้องเลือกเรา",
        content: JSON.stringify({
          heading: 'ทำไมต้องเลือก <span class="text-red-600">บริการขัดสีรถถึงบ้าน</span> และ <span class="text-red-600">ขัดไฟหน้า</span> ของเรา?',
          items: [
            { icon: "Sun", title: "ขัดไฟหน้าใสปิ๊ง แก้ปัญหาไฟหน้าเหลือง หมอง ลอก", desc: "ขัดไล่เบอร์กระดาษทรายและเคลือบ UV ป้องกันการเหลืองซ้ำ เพิ่มความสว่างและความปลอดภัยในการขับขี่ยามค่ำคืน" },
            { icon: "Sparkles", title: "ขัดลบรอยขีดข่วน รอยขนแมว รอยเบียดเฉี่ยวชน", desc: "ฟื้นฟูสภาพสีรถให้กลับมาเรียบเนียน เงางาม ด้วยน้ำยาขัดสีคุณภาพสูงและแผ่นขัดระดับมืออาชีพ" },
            { icon: "Clock", title: "ประหยัดเวลา ไม่ต้องทิ้งรถ สะดวกสุดๆ", desc: "เปลี่ยนพื้นที่จอดรถที่บ้านคุณให้เป็นคาร์แคร์ส่วนตัว ไม่ต้องขับไปทิ้งรถค้างคืน นัดเวลาที่สะดวกได้เลย" },
          ],
        }),
        order: 1,
      },
      {
        type: "info",
        title: "จองคิวขัดสีรถ",
        content: JSON.stringify({
          heading: "จองคิวขัดสีรถ ขัดไฟหน้า ประเมินราคาฟรี!",
          description: "ถ่ายรูปรถจุดที่มีปัญหา แล้วส่งมาให้เราประเมินราคาเบื้องต้นได้ฟรี นัดหมายวันและเวลาที่สะดวกได้เลย!",
          layout: "steps",
          items: [
            { step: "1", icon: "Camera", text: "ถ่ายรูปจุดที่ต้องการขัด" },
            { step: "2", icon: "MessageCircle", text: "ส่งรูปทาง Line ประเมินราคาฟรี" },
            { step: "3", icon: "CheckCircle", text: "นัดวัน-เวลา ช่างไปบริการถึงบ้าน" },
          ],
        }),
        order: 2,
      },
      {
        type: "areas",
        title: "พื้นที่ให้บริการ",
        content: JSON.stringify({
          heading: "พื้นที่ให้บริการ ขัดสีรถ ขัดไฟหน้า ถึงบ้าน",
          description: "ครอบคลุมโซนกรุงเทพฯ: ห้วยขวาง, ดินแดง, ลาดพร้าว, บางกะปิ, บางเขน, จตุจักร, ดุสิต, บางซื่อ",
          areas: ["ห้วยขวาง", "ดินแดง", "ลาดพร้าว", "บางกะปิ", "บางเขน", "จตุจักร", "ดุสิต", "บางซื่อ"],
        }),
        order: 3,
      },
      {
        type: "cta-bottom",
        title: "CTA",
        content: JSON.stringify({
          heading: "อยากให้รถสวยใสเหมือนใหม่? นัดคิวได้เลย!",
          description: "ถ่ายรูปรถส่งมาทาง Line ประเมินราคาฟรี หรือโทรสอบถามคิวช่างได้ทันที",
          ctaPhoneLabel: "โทรสอบถามคิวช่าง",
          ctaLineLabel: "ถ่ายรูปส่งประเมินราคาทาง Line",
        }),
        order: 4,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     ติดต่อเรา
     ═══════════════════════════════════════════ */
  {
    slug: "contact-us",
    title: "ติดต่อเรา",
    order: 6,
    seoTitle: "ติดต่อเรา | เปลี่ยนแบตเตอรี่นอกสถานที่ 24 ชม. ห้วยขวาง ดินแดง ลาดพร้าว | PORNPISIT BATTERY",
    seoDescription: "ต้องการเปลี่ยนแบตเตอรี่ด่วน? โทร 0996731296 บริการเปลี่ยนแบตเตอรี่รถยนต์นอกสถานที่ 24 ชม. โซนห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ถึงไวใน 30 นาที",
    seoKeywords: "ติดต่อเปลี่ยนแบตเตอรี่,เบอร์โทรช่างเปลี่ยนแบต,เปลี่ยนแบตเตอรี่ 24 ชม,เปลี่ยนแบตเตอรี่ ห้วยขวาง,เปลี่ยนแบตเตอรี่ ดินแดง,เปลี่ยนแบตเตอรี่ ลาดพร้าว",
    sections: [
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
        }),
        order: 4,
      },
      {
        type: "cta-bottom",
        title: "CTA",
        content: JSON.stringify({
          heading: "แบตหมด? ติดต่อเราทันที!",
          description: "ไม่ว่าจะดึกดื่นแค่ไหน ทีมช่างพร้อมนำแบตเตอรี่แท้ไปเปลี่ยนถึงที่ โทรหรือแอดไลน์ได้เลยตอนนี้",
          ctaPhoneLabel: "โทรเรียกช่างเปลี่ยนแบต",
          ctaLineLabel: "แอดไลน์สอบถาม",
        }),
        order: 5,
      },
    ],
  },

  /* ═══════════════════════════════════════════
     บทความ / ข่าวสาร
     ═══════════════════════════════════════════ */
  {
    slug: "posts",
    title: "บทความ / ข่าวสาร",
    order: 7,
    seoTitle: "บทความ ข่าวสาร ความรู้ดูแลรถยนต์ | PORNPISIT BATTERY",
    seoDescription: "บทความ ข่าวสาร ความรู้เกี่ยวกับการดูแลรักษารถยนต์ เปลี่ยนแบตเตอรี่ ปะยาง ขัดสีรถ จาก PORNPISIT BATTERY",
    seoKeywords: "บทความรถยนต์,ข่าวสาร,ความรู้ดูแลรถ,เคล็ดลับรถยนต์",
    sections: [],
  },
];

// Singleton promise to prevent concurrent execution during build
let _ensurePromise: Promise<void> | null = null;

/**
 * Ensure all service pages exist in the DB.
 * Call this at build time or on first request.
 * Uses upsert to avoid race conditions during concurrent builds.
 */
export async function ensureServicePages() {
  if (!_ensurePromise) {
    _ensurePromise = _doEnsure();
  }
  return _ensurePromise;
}

async function _doEnsure() {
  // Ensure header has "บทความ" link
  try {
    const homePage = await (prisma as any).page.findUnique({
      where: { slug: "home" },
      include: { sections: true },
    });
    if (homePage) {
      const headerSec = homePage.sections.find((s: any) => s.type === "header");
      if (headerSec) {
        const hData = JSON.parse(headerSec.content || "{}");
        const links: any[] = Array.isArray(hData.links) ? hData.links : [];
        const hasPostsLink = links.some((l: any) =>
          l.href === "/posts" ||
          (Array.isArray(l.children) && l.children.some((c: any) => c.href === "/posts"))
        );
        if (!hasPostsLink) {
          links.push({ label: "บทความ", href: "/posts" });
          hData.links = links;
          await (prisma as any).pageSection.update({
            where: { id: headerSec.id },
            data: { content: JSON.stringify(hData) },
          });
        }
      }
    }
  } catch (e) {
    // Non-critical, ignore
  }

  for (const def of SERVICE_PAGES) {
    try {
      const page = await (prisma as any).page.upsert({
        where: { slug: def.slug },
        update: {}, // don't overwrite existing data
        create: {
          slug: def.slug,
          title: def.title,
          order: def.order,
          seoTitle: def.seoTitle,
          seoDescription: def.seoDescription,
          seoKeywords: def.seoKeywords,
        },
      });

      // Re-seed sections if page has fewer sections than expected (migration)
      const sectionCount = await (prisma as any).pageSection.count({
        where: { pageId: page.id },
      });
      if (sectionCount < def.sections.length) {
        // Delete old sections and re-create
        if (sectionCount > 0) {
          await (prisma as any).pageSection.deleteMany({
            where: { pageId: page.id },
          });
        }
        for (const sec of def.sections) {
          await (prisma as any).pageSection.create({
            data: {
              pageId: page.id,
              type: sec.type,
              title: sec.title,
              content: sec.content,
              imageUrl: sec.imageUrl || null,
              order: sec.order,
            },
          });
        }
      }
    } catch (e) {
      // Ignore unique constraint and DB connection errors
      if ((e as any)?.code !== "P2002") {
        console.error("ensureServicePages error:", (e as any)?.message || e);
      }
    }
  }

  // Seed 5 sample posts if no posts exist yet
  try {
    const postCount = await (prisma as any).post.count();
    if (postCount === 0) {
      const SEED_POSTS = [
        {
          title: "ยางรถยนต์แตกกลางทาง ทำอย่างไร? 5 ขั้นตอนเอาตัวรอดฉบับมือใหม่",
          slug: "tire-blowout-emergency-guide",
          excerpt: "เมื่อยางรถยนต์แตกกลางทาง อย่าตกใจ! รวม 5 ขั้นตอนเอาตัวรอดที่ทุกคนควรรู้ พร้อมเบอร์ช่างปะยางนอกสถานที่ 24 ชม.",
          content: `<h2>ยางรถยนต์แตกกลางทาง ทำอย่างไร?</h2><p>การที่ยางรถยนต์แตกกลางทางเป็นเหตุการณ์ที่ไม่มีใครอยากเจอ แต่สามารถเกิดขึ้นได้ทุกเมื่อ</p><h3>1. อย่าตกใจ จับพวงมาลัยให้มั่น</h3><p>เมื่อยางแตก รถจะดึงไปด้านที่ยางแตก ให้จับพวงมาลัยมั่นคงและค่อยๆ ลดความเร็ว</p><h3>2. เปิดไฟฉุกเฉินทันที</h3><p>เปิดไฟฉุกเฉิน (Hazard Light) เพื่อเตือนรถคันอื่น แล้วค่อยๆ ชิดซ้ายจอดในจุดปลอดภัย</p><h3>3. จอดรถจุดปลอดภัย</h3><p>หาจุดจอดที่ห่างจากการจราจร เปิดสามเหลี่ยมสะท้อนแสง ห่างจากท้ายรถอย่างน้อย 50 เมตร</p><h3>4. ประเมินสถานการณ์</h3><p>ดูว่าเป็นยางรั่วหรือยางแตก ถ้ายางรั่วสามารถปะได้ แต่ถ้ายางแตกต้องเปลี่ยนยางอะไหล่</p><h3>5. โทรเรียกช่างปะยางนอกสถานที่</h3><p>ถ้าไม่มั่นใจ <strong>โทรเรียกช่าง PORNPISIT BATTERY</strong> บริการปะยางนอกสถานที่ 24 ชม. ถึงที่ภายใน 30 นาที โทร 0996731296</p><h3>วิธีป้องกันยางแตก</h3><ul><li>ตรวจลมยางทุก 2 สัปดาห์</li><li>เปลี่ยนยางเมื่อดอกยางน้อยกว่า 1.6 มม.</li><li>ไม่ขับเร็วเกินในวันที่อากาศร้อนจัด</li><li>หลีกเลี่ยงถนนที่มีเศษวัสดุแหลมคม</li></ul>`,
          coverImage: "/images/blog/pig-tire-blowout-cover.svg",
          category: "ความรู้รถยนต์",
          tags: "ยางแตก,ปะยาง,ฉุกเฉิน,ยางรั่ว,วิธีเอาตัวรอด",
          published: true,
          author: "PORNPISIT BATTERY",
          seoTitle: "ยางรถยนต์แตกกลางทาง ทำอย่างไร? 5 ขั้นตอนเอาตัวรอด | PORNPISIT BATTERY",
          seoDescription: "รวม 5 ขั้นตอนเอาตัวรอดเมื่อยางรถยนต์แตกกลางทาง พร้อมเบอร์ช่างปะยางนอกสถานที่ 24 ชม.",
          seoKeywords: "ยางแตก,ยางรั่ว,ปะยางนอกสถานที่,ฉุกเฉิน",
          ogTitle: "ยางรถยนต์แตกกลางทาง ทำอย่างไร? 5 ขั้นตอนเอาตัวรอด",
          ogDescription: "เมื่อยางรถยนต์แตกกลางทาง อย่าตกใจ! รวม 5 ขั้นตอนเอาตัวรอดที่ทุกคนควรรู้",
        },
        {
          title: "แบตเตอรี่รถยนต์หมด สตาร์ทไม่ติด สัญญาณเตือนที่ไม่ควรมองข้าม",
          slug: "car-battery-dead-signs-and-solutions",
          excerpt: "สตาร์ทรถไม่ติด? อาจเป็นสัญญาณว่าแบตเตอรี่กำลังจะหมดอายุ รวมสัญญาณเตือน วิธีแก้ไข และวิธีดูแลแบตเตอรี่ให้อยู่ยาว",
          content: `<h2>5 สัญญาณเตือนแบตเตอรี่ใกล้หมด</h2><ol><li><strong>สตาร์ทรถช้ากว่าปกติ</strong> — เครื่องหมุนช้า เสียงครืดครืด</li><li><strong>ไฟหน้าหรี่ลง</strong> — สว่างน้อยกว่าปกติ โดยเฉพาะตอนจอดนิ่ง</li><li><strong>ไฟเตือนแบตเตอรี่ขึ้นบนหน้าปัด</strong></li><li><strong>อุปกรณ์ไฟฟ้าทำงานผิดปกติ</strong> — วิทยุดับ กระจกไฟฟ้าช้า</li><li><strong>แบตเตอรี่บวม</strong> — ต้องเปลี่ยนทันที อันตราย!</li></ol><h3>วิธีแก้ไขเมื่อสตาร์ทไม่ติด</h3><p>ถ้าแบตหมดกะทันหัน สามารถ <strong>พ่วงแบต (Jump Start)</strong> จากรถคันอื่นได้ แต่ถ้าแบตเก่ามากควรเปลี่ยนลูกใหม่</p><h3>เปลี่ยนแบตเตอรี่ถึงที่ PORNPISIT BATTERY</h3><p>เราบริการ <strong>เปลี่ยนแบตเตอรี่รถยนต์ถึงที่</strong> ทุกยี่ห้อ ทุกรุ่น รับประกัน 1-2 ปี โทร 0996731296</p><h3>Tips ดูแลแบตเตอรี่ให้อยู่ยาว</h3><ul><li>ไม่จอดทิ้งรถนานเกิน 2 สัปดาห์โดยไม่สตาร์ท</li><li>ปิดอุปกรณ์ไฟฟ้าทุกอย่างก่อนดับเครื่อง</li><li>ตรวจขั้วแบตเตอรี่ไม่ให้มีคราบสนิม</li></ul>`,
          coverImage: "/images/blog/pig-battery-dead-signs-cover.svg",
          category: "ความรู้รถยนต์",
          tags: "แบตเตอรี่,สตาร์ทไม่ติด,เปลี่ยนแบต,แบตหมด",
          published: true,
          author: "PORNPISIT BATTERY",
          seoTitle: "แบตเตอรี่รถยนต์หมด สตาร์ทไม่ติด แก้ยังไง? | PORNPISIT BATTERY",
          seoDescription: "รวมสัญญาณเตือนแบตเตอรี่รถยนต์ใกล้หมด วิธีแก้ไขเบื้องต้น และ Tips ดูแลแบตเตอรี่ให้ใช้งานได้นาน",
          seoKeywords: "แบตเตอรี่รถยนต์,สตาร์ทไม่ติด,เปลี่ยนแบตเตอรี่",
          ogTitle: "แบตเตอรี่รถยนต์หมด สตาร์ทไม่ติด แก้ยังไง?",
          ogDescription: "รวมสัญญาณเตือน วิธีแก้ไข และ Tips ดูแลแบตเตอรี่รถยนต์ให้อยู่ยาว",
        },
        {
          title: "ไดชาร์จเสีย อาการเป็นอย่างไร? เช็คเองได้ไหม?",
          slug: "alternator-failure-symptoms",
          excerpt: "ไดชาร์จเสียแต่ไม่รู้ตัว อาจทำให้รถดับกลางทาง! รู้จักอาการ สัญญาณเตือน และวิธีเช็คเบื้องต้น",
          content: `<h2>ไดชาร์จ (Alternator) คืออะไร?</h2><p>ไดชาร์จผลิตกระแสไฟฟ้าเพื่อชาร์จแบตเตอรี่และจ่ายไฟให้อุปกรณ์ทั้งหมดในรถ ถ้าไดชาร์จเสีย แบตเตอรี่จะไม่ได้ชาร์จ และรถจะดับในที่สุด</p><h3>อาการไดชาร์จเสีย</h3><ol><li><strong>ไฟหน้าหรี่ๆ สว่างๆ สลับกัน</strong></li><li><strong>ไฟเตือนรูปแบตเตอรี่ขึ้นที่หน้าปัด</strong></li><li><strong>เสียงดังผิดปกติจากห้องเครื่อง</strong> — เสียงแหลมจากสายพาน</li><li><strong>กลิ่นไหม้</strong> — คอยล์ภายในร้อนจัด</li><li><strong>อุปกรณ์ไฟฟ้าทำงานผิดปกติ</strong></li><li><strong>รถดับกลางทาง</strong></li></ol><h3>วิธีเช็คเบื้องต้น</h3><p>ใช้มัลติมิเตอร์วัดแรงดันที่ขั้วแบตเตอรี่ขณะเครื่องทำงาน ค่าปกติ <strong>13.5 - 14.5 โวลต์</strong> ถ้าต่ำกว่า 13V แสดงว่าไดชาร์จมีปัญหา</p><h3>ซ่อม/เปลี่ยนไดชาร์จถึงที่</h3><p>PORNPISIT BATTERY บริการซ่อมและเปลี่ยนไดชาร์จถึงที่ ไม่ต้องลากรถ โทร 0996731296</p>`,
          coverImage: "/images/blog/pig-alternator-failure-cover.svg",
          category: "ซ่อมบำรุง",
          tags: "ไดชาร์จ,ไดชาร์จเสีย,ระบบไฟรถยนต์,ซ่อมรถ",
          published: true,
          author: "PORNPISIT BATTERY",
          seoTitle: "ไดชาร์จเสีย อาการเป็นอย่างไร? เช็คเองได้ไหม? | PORNPISIT BATTERY",
          seoDescription: "รู้จักอาการไดชาร์จเสีย 6 สัญญาณเตือน วิธีเช็คด้วยตัวเอง พร้อมบริการซ่อมถึงที่",
          seoKeywords: "ไดชาร์จเสีย,อาการไดชาร์จเสีย,ซ่อมไดชาร์จ",
          ogTitle: "ไดชาร์จเสีย อาการเป็นอย่างไร? เช็คเองได้ไหม?",
          ogDescription: "รู้จัก 6 สัญญาณเตือนไดชาร์จเสีย วิธีเช็คเบื้องต้น และบริการซ่อมถึงที่ 24 ชม.",
        },
        {
          title: "ขัดสีรถเอง vs จ้างช่างขัด ต่างกันอย่างไร? คุ้มไหม?",
          slug: "diy-vs-pro-car-polishing",
          excerpt: "กำลังลังเลว่าจะขัดสีรถเองหรือจ้างช่างดี? เปรียบเทียบข้อดีข้อเสีย ค่าใช้จ่าย และผลลัพธ์ให้ชัดเจน",
          content: `<h2>ขัดสีรถเอง vs จ้างช่างมืออาชีพ</h2><p>เมื่อสีรถเริ่มหมอง มีรอยขนแมว หลายคนลังเลว่าจะขัดเองหรือจ้างช่าง</p><h3>ขัดสีรถเอง (DIY)</h3><p><strong>ข้อดี:</strong> ประหยัดค่าแรง ทำได้ตามเวลาที่สะดวก ได้เรียนรู้ดูแลรถ</p><p><strong>ข้อเสีย:</strong> ถ้าไม่มีประสบการณ์อาจทำสีเสียหายหนักขึ้น ต้องซื้ออุปกรณ์ 3,000-8,000 บาท ใช้เวลานาน 1-2 วัน</p><h3>จ้างช่างมืออาชีพ</h3><p><strong>ข้อดี:</strong> ผลลัพธ์ดีเยี่ยม สีเงาวาวเหมือนใหม่ รวดเร็ว 3-6 ชม. มีประกันงาน</p><p><strong>ข้อเสีย:</strong> ค่าใช้จ่าย 2,500-8,000 บาท ต้องนัดคิว</p><h3>สรุป: จ้างช่างคุ้มกว่า!</h3><p>ถ้าเป็นรอยลึกหรือสีหมองมาก แนะนำจ้างช่างมืออาชีพ PORNPISIT BATTERY บริการขัดสีรถถึงบ้าน ส่งรูปประเมินราคาฟรีทาง Line!</p>`,
          coverImage: "/images/blog/pig-car-polishing-cover.svg",
          category: "ขัดสีรถ",
          tags: "ขัดสีรถ,ขัดสีรถเอง,จ้างช่างขัดสี,ดูแลสีรถ",
          published: true,
          author: "PORNPISIT BATTERY",
          seoTitle: "ขัดสีรถเอง vs จ้างช่างขัด ต่างกันอย่างไร? | PORNPISIT BATTERY",
          seoDescription: "เปรียบเทียบข้อดีข้อเสียของการขัดสีรถเองกับจ้างช่างมืออาชีพ ค่าใช้จ่าย ผลลัพธ์ และคำแนะนำ",
          seoKeywords: "ขัดสีรถ,ขัดสีรถเอง,จ้างช่างขัดสี,ดูแลสีรถ",
          ogTitle: "ขัดสีรถเอง vs จ้างช่างขัด ต่างกันอย่างไร? คุ้มไหม?",
          ogDescription: "เปรียบเทียบขัดสีรถเอง vs จ้างช่าง ข้อดีข้อเสีย ค่าใช้จ่าย ผลลัพธ์ที่ได้",
        },
        {
          title: "Checklist ดูแลรถหน้าฝน 10 ข้อ ขับปลอดภัยตลอดหน้าฝน",
          slug: "rainy-season-car-checklist",
          excerpt: "หน้าฝนมาแล้ว! เช็ครถให้พร้อมก่อนออกถนน 10 ข้อที่ต้องทำ ตั้งแต่ยาง ใบปัดน้ำฝน ไปจนถึงระบบไฟ",
          content: `<h2>10 Checklist ดูแลรถหน้าฝน</h2><p>ช่วงหน้าฝนรถยนต์ต้องเจอสภาพอากาศที่โหดร้าย การเตรียมรถให้พร้อมจึงสำคัญมาก</p><h3>1. ตรวจสภาพยาง</h3><p>ดอกยางต้องลึกอย่างน้อย 1.6 มม. ยางดอกน้อยระบายน้ำไม่ดี ทำให้รถลื่นไถล</p><h3>2. ตรวจลมยาง</h3><p>เติมลมยางตามค่าที่กำหนด</p><h3>3. เช็คใบปัดน้ำฝน</h3><p>ควรเปลี่ยนทุก 6-12 เดือน ถ้าปัดแล้วเป็นรอยต้องเปลี่ยนทันที</p><h3>4. เติมน้ำฉีดกระจก</h3><p>ใช้น้ำยาสูตรกันน้ำ ช่วยให้น้ำฝนไหลออกจากกระจกได้ดี</p><h3>5. ตรวจระบบไฟทุกดวง</h3><p>ไฟหน้า ไฟท้าย ไฟเบรก ไฟเลี้ยว ต้องทำงานครบ</p><h3>6. เช็คแบตเตอรี่</h3><p>หน้าฝนอุปกรณ์ไฟฟ้าทำงานหนักขึ้น แบตเตอรี่ต้องแข็งแรง</p><h3>7. ตรวจระบบเบรก</h3><p>ผ้าเบรกและจานเบรกต้องอยู่ในสภาพดี</p><h3>8. เช็คซีลประตูและกระจก</h3><p>ยางซีลเก่าจะทำให้น้ำรั่วเข้ารถ</p><h3>9. ทำความสะอาดท่อระบายน้ำ</h3><p>ท่อระบายน้ำอุดตันจะทำให้น้ำท่วมห้องเครื่อง</p><h3>10. พกอุปกรณ์ฉุกเฉิน</h3><p>ร่ม ไฟฉาย สามเหลี่ยมสะท้อนแสง และ <strong>เบอร์ PORNPISIT BATTERY 0996731296</strong></p>`,
          coverImage: "/images/blog/pig-rainy-season-cover.svg",
          category: "ดูแลรักษารถ",
          tags: "หน้าฝน,ดูแลรถ,ขับปลอดภัย,checklist",
          published: true,
          author: "PORNPISIT BATTERY",
          seoTitle: "Checklist ดูแลรถหน้าฝน 10 ข้อ ขับปลอดภัย | PORNPISIT BATTERY",
          seoDescription: "รวม 10 ข้อที่ต้องเช็ครถก่อนหน้าฝน ตั้งแต่ยาง ใบปัดน้ำฝน แบตเตอรี่ ไปจนถึงระบบเบรก",
          seoKeywords: "ดูแลรถหน้าฝน,checklist รถ,ขับปลอดภัย",
          ogTitle: "Checklist ดูแลรถหน้าฝน 10 ข้อ ขับปลอดภัยตลอดหน้าฝน",
          ogDescription: "เช็ครถให้พร้อมก่อนหน้าฝน! 10 ข้อที่ต้องทำ ตั้งแต่ยาง ใบปัดน้ำฝน ไปจนถึงระบบไฟ",
        },
      ];

      for (const post of SEED_POSTS) {
        try {
          await (prisma as any).post.upsert({
            where: { slug: post.slug },
            update: {},
            create: post,
          });
        } catch (e) {
          if ((e as any)?.code !== "P2002") console.error("Seed post error:", e);
        }
      }
    }
  } catch (e) {
    // Non-critical, ignore
  }
}

/**
 * Get page data from DB by slug. Returns null if not found or DB unreachable.
 */
export async function getServicePageData(slug: string) {
  try {
    return await (prisma as any).page.findUnique({
      where: { slug, isActive: true },
      include: { sections: { where: { isActive: true }, orderBy: { order: "asc" } } },
    });
  } catch {
    return null;
  }
}

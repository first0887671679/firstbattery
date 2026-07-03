import Image from "next/image";
import { Star } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  avatar: string;
  rating: number;
  content: string;
}

interface TestimonialsProps {
  items?: TestimonialItem[];
}

const defaultTestimonials: TestimonialItem[] = [
  {
    name: "คุณนัท",
    role: "ผู้ใช้บริการเปลี่ยนแบตเตอรี่",
    avatar: "https://i.pravatar.cc/120?img=32",
    rating: 5,
    content:
      "โทรเรียกตอนดึก ช่างมาถึงไวมาก บริการดี สุภาพ ใส่ใจรายละเอียด เปลี่ยนเสร็จเช็คระบบไฟให้ด้วย ประทับใจครับ",
  },
  {
    name: "คุณมิ้นท์",
    role: "ผู้ใช้บริการซ่อมไดชาร์จ",
    avatar: "https://i.pravatar.cc/120?img=15",
    rating: 5,
    content:
      "รถสตาร์ทไม่ติดกลางทาง ติดต่อแล้วไม่ถึง 30 นาทีมาถึง ซ่อมจบในที่เดียว ราคายุติธรรม แนะนำเลยค่ะ",
  },
  {
    name: "คุณโจ",
    role: "ผู้ใช้บริการปะยาง",
    avatar: "https://i.pravatar.cc/120?img=5",
    rating: 5,
    content:
      "ยางรั่วตอนฝนตก โชคดีมากที่เจอทีมนี้ อุปกรณ์ครบ มืออาชีพ ทำงานเร็วและสะอาดเรียบร้อยมาก",
  },
];

export default function Testimonials({ items }: TestimonialsProps) {
  const testimonials = items && items.length > 0 ? items : defaultTestimonials;
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-red-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 md:w-64 md:h-64 bg-red-50/60 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-red-100 border border-red-200 text-red-700 text-xs font-bold px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase">
            <Star size={12} fill="currentColor" />
            รีวิวจากลูกค้าจริง
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 px-2">
            ลูกค้าไว้ใจเรา<span className="text-red-600">ทั่วกรุงเทพ</span>
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base px-2">ความเชื่อมั่นจากผู้ใช้บริการจริงกว่า 1,000+ ราย</p>
          {/* Rating summary */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-4 sm:mt-5">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-amber-400 sm:[&]:w-[18px] sm:[&]:h-[18px]" fill="currentColor" />
              ))}
            </div>
            <span className="text-slate-900 font-bold text-lg sm:text-xl">4.9</span>
            <span className="text-slate-500 text-xs sm:text-sm">/ 5.0 เฉลี่ยจากรีวิวทั้งหมด</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-slate-200 rounded-2xl p-5 md:p-6 hover:border-red-300 hover:shadow-lg transition-all duration-300 sm:hover:-translate-y-1 group"
            >
              {/* Quote icon */}
              <div className="absolute top-5 right-5 text-red-200 group-hover:text-red-300 transition-colors">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} className="text-amber-400" fill="currentColor" />
                ))}
              </div>

              {/* Content */}
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 md:mb-6 italic">"{t.content}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 md:pt-4 border-t border-slate-100">
                <div className="relative">
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={44}
                    height={44}
                    className="rounded-full object-cover ring-2 ring-red-200"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
                <div className="ml-auto">
                  <div className="w-7 h-7 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

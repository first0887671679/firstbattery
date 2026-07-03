"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save, Plus, Trash2, Edit, X, ChevronUp, ChevronDown,
  Eye, EyeOff, ArrowLeft, Globe, LayoutTemplate
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Section {
  id: string;
  type: string;
  title: string | null;
  content: string;
  imageUrl: string | null;
  order: number;
  isActive: boolean;
}

interface PageData {
  id: string;
  slug: string;
  title: string;
  isActive: boolean;
  order: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  sections: Section[];
}

const SECTION_TYPES = [
  { value: "hero", label: "Hero Banner", icon: "🎯" },
  { value: "text", label: "ข้อความ", icon: "📝" },
  { value: "image", label: "รูปภาพ", icon: "🖼️" },
  { value: "text-image", label: "ข้อความ + รูปภาพ", icon: "📰" },
  { value: "gallery", label: "แกลเลอรี่", icon: "🎨" },
  { value: "why-us", label: "ทำไมต้องเลือกเรา", icon: "💪" },
  { value: "faq", label: "คำถามที่พบบ่อย", icon: "❓" },
  { value: "testimonials", label: "รีวิวลูกค้า", icon: "⭐" },
  { value: "services", label: "รายการบริการ", icon: "🔧" },
  { value: "battery-checker", label: "เช็ครุ่นแบตเตอรี่", icon: "🔋" },
  { value: "cta-banner", label: "CTA Banner", icon: "📣" },
  { value: "contact", label: "ติดต่อเรา", icon: "📞" },
  { value: "info", label: "ข้อมูล/ขั้นตอน", icon: "📋" },
  { value: "areas", label: "พื้นที่ให้บริการ", icon: "📍" },
  { value: "cta-bottom", label: "CTA ด้านล่าง", icon: "🔥" },
  { value: "contact-channels", label: "ช่องทางติดต่อ", icon: "📱" },
  { value: "map", label: "แผนที่ Google", icon: "🗺️" },
  { value: "hours", label: "เวลาทำการ", icon: "🕐" },
  { value: "custom", label: "กำหนดเอง (HTML)", icon: "💻" },
];

const LOCKED_TYPES = ["header", "sub-header", "footer"];

const ALL_TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  header: { label: "เมนูบนสุด (Navbar)", icon: "🧭" },
  "sub-header": { label: "แถบรอง (ประกาศ/โปรโมชั่น)", icon: "📢" },
  footer: { label: "ท้ายเว็บ (Footer)", icon: "" },
  ...Object.fromEntries(SECTION_TYPES.map(t => [t.value, { label: t.label, icon: t.icon }])),
};

function getTypeLabel(type: string) {
  return ALL_TYPE_LABELS[type]?.label || type;
}

function getTypeIcon(type: string) {
  return ALL_TYPE_LABELS[type]?.icon || "📄";
}

function parseContent(content: string): Record<string, any> {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// ============================================================
// Sub-form components for each section type (user-friendly, no JSON)
// ============================================================

function HeaderForm({ data, imageUrl, onChange, onImageChange }: {
  data: Record<string, any>; imageUrl: string;
  onChange: (d: Record<string, any>) => void; onImageChange: (url: string) => void;
}) {
  const links: { label: string; href: string }[] = Array.isArray(data.links) ? data.links : [];
  const addLink = () => onChange({ ...data, links: [...links, { label: "", href: "" }] });
  const removeLink = (idx: number) => onChange({ ...data, links: links.filter((_: any, i: number) => i !== idx) });
  const updateLink = (idx: number, field: string, value: string) => {
    const updated = links.map((l: any, i: number) => i === idx ? { ...l, [field]: value } : l);
    onChange({ ...data, links: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="ชื่อแบรนด์ (โลโก้ข้อความ)" value={data.brandName || ""} onChange={(v) => onChange({ ...data, brandName: v })} placeholder="PORNPISIT BATTERY" />
      <Field label="คำอธิบายใต้โลโก้" value={data.brandSub || ""} onChange={(v) => onChange({ ...data, brandSub: v })} placeholder="บริการรถยนต์ 24 ชม." />
      <ImageUpload label="รูปโลโก้ (ถ้ามี)" value={imageUrl} onChange={onImageChange} aspectRatio={data.logoRatio || "free"} onAspectRatioChange={(r) => onChange({ ...data, logoRatio: r })} />
      <div className="grid grid-cols-2 gap-2">
        <Field label="เบอร์โทร" value={data.phone || ""} onChange={(v) => onChange({ ...data, phone: v })} placeholder="0996731296" />
        <Field label="ข้อความปุ่มโทร" value={data.phoneLabel || ""} onChange={(v) => onChange({ ...data, phoneLabel: v })} placeholder="โทรด่วน" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="Line URL" value={data.lineUrl || ""} onChange={(v) => onChange({ ...data, lineUrl: v })} placeholder="https://lin.ee/OBB86S4" />
        <Field label="ข้อความปุ่ม Line" value={data.lineLabel || ""} onChange={(v) => onChange({ ...data, lineLabel: v })} placeholder="Line" />
      </div>

      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">📱 Sticky Bottom Bar (มือถือ)</p>
        <div className="grid grid-cols-2 gap-2">
          <Field label="ข้อความปุ่มโทร (มือถือ)" value={data.stickyPhoneLabel || ""} onChange={(v) => onChange({ ...data, stickyPhoneLabel: v })} placeholder="โทรเรียกช่าง" />
          <Field label="ข้อความปุ่ม Line (มือถือ)" value={data.stickyLineLabel || ""} onChange={(v) => onChange({ ...data, stickyLineLabel: v })} placeholder="แอดไลน์" />
        </div>
      </div>

      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">รายการเมนู</p>
        {links.map((link: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <Input className="flex-1" value={link.label} onChange={(e) => updateLink(idx, "label", e.target.value)} placeholder="ชื่อเมนู" />
            <Input className="flex-1" value={link.href} onChange={(e) => updateLink(idx, "href", e.target.value)} placeholder="ลิงก์ เช่น #services" />
            <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-500 shrink-0" onClick={() => removeLink(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addLink} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-1" /> เพิ่มเมนู
        </Button>
      </div>
    </div>
  );
}

function SubHeaderForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="ข้อความประกาศ" value={data.text || ""} onChange={(v) => onChange({ ...data, text: v })} placeholder="เช่น โปรโมชั่น! ลด 20% เมื่อเรียกใช้บริการวันนี้" />
      <Field label="ลิงก์ (ถ้ามี)" value={data.linkUrl || ""} onChange={(v) => onChange({ ...data, linkUrl: v })} placeholder="https://..." />
      <Field label="ข้อความลิงก์" value={data.linkLabel || ""} onChange={(v) => onChange({ ...data, linkLabel: v })} placeholder="ดูรายละเอียด" />
      <div>
        <Label className="text-sm">สีพื้นหลัง</Label>
        <select value={data.bgColor || "orange"} onChange={(e) => onChange({ ...data, bgColor: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="orange">ส้ม</option>
          <option value="blue">น้ำเงิน</option>
          <option value="green">เขียว</option>
          <option value="red">แดง</option>
          <option value="slate">เทา</option>
          <option value="black">ดำ</option>
        </select>
      </div>
    </div>
  );
}

function FooterForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const serviceLinks: { label: string; href: string }[] = Array.isArray(data.serviceLinks) ? data.serviceLinks : [];
  const addLink = () => onChange({ ...data, serviceLinks: [...serviceLinks, { label: "", href: "" }] });
  const removeLink = (idx: number) => onChange({ ...data, serviceLinks: serviceLinks.filter((_: any, i: number) => i !== idx) });
  const updateLink = (idx: number, field: string, value: string) => {
    const updated = serviceLinks.map((l: any, i: number) => i === idx ? { ...l, [field]: value } : l);
    onChange({ ...data, serviceLinks: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="ชื่อแบรนด์" value={data.brandName || ""} onChange={(v) => onChange({ ...data, brandName: v })} placeholder="PORNPISIT BATTERY" />
      <FieldArea label="คำอธิบายบริษัท" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="บริการดูแลรักษารถยนต์..." />
      <Field label="เวลาทำการ" value={data.openHours || ""} onChange={(v) => onChange({ ...data, openHours: v })} placeholder="เปิดให้บริการตลอด 24 ชั่วโมง" />
      <Field label="พื้นที่ให้บริการ" value={data.area || ""} onChange={(v) => onChange({ ...data, area: v })} placeholder="ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="เบอร์โทร" value={data.phone || ""} onChange={(v) => onChange({ ...data, phone: v })} placeholder="0996731296" />
        <Field label="Line ID" value={data.lineId || ""} onChange={(v) => onChange({ ...data, lineId: v })} placeholder="@398kyxfq" />
      </div>
      <Field label="Line URL" value={data.lineUrl || ""} onChange={(v) => onChange({ ...data, lineUrl: v })} placeholder="https://lin.ee/OBB86S4" />
      <Field label="Copyright" value={data.copyright || ""} onChange={(v) => onChange({ ...data, copyright: v })} placeholder="PORNPISIT BATTERY. All rights reserved." />

      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">ลิงก์บริการ</p>
        {serviceLinks.map((link: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <Input className="flex-1" value={link.label} onChange={(e) => updateLink(idx, "label", e.target.value)} placeholder="ชื่อบริการ" />
            <Input className="flex-1" value={link.href} onChange={(e) => updateLink(idx, "href", e.target.value)} placeholder="/services/battery" />
            <Button type="button" variant="ghost" size="sm" className="h-9 w-9 p-0 text-red-500 shrink-0" onClick={() => removeLink(idx)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addLink} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-1" /> เพิ่มลิงก์บริการ
        </Button>
      </div>
    </div>
  );
}

function HeroForm({ data, imageUrl, onChange, onImageChange }: {
  data: Record<string, any>; imageUrl: string;
  onChange: (d: Record<string, any>) => void; onImageChange: (url: string) => void;
}) {
  const slides: any[] = Array.isArray(data.slides) ? data.slides : [];
  const hasSlides = slides.length > 0;

  // ถ้ายังไม่มี slides ให้แปลงข้อมูลเดิมเป็น slide แรก
  const ensureSlides = () => {
    if (!hasSlides) {
      return [{
        heading: data.heading || "",
        subheading: data.subheading || "",
        description: data.description || "",
        phoneUrl: data.phoneUrl || "",
        lineUrl: data.lineUrl || "",
        imageUrl: imageUrl || "",
        textAlign: "center",
        overlayOpacity: 30,
      }];
    }
    return slides;
  };

  const addSlide = () => {
    const current = ensureSlides();
    onChange({
      ...data,
      slides: [...current, { heading: "", subheading: "", description: "", phoneUrl: data.phoneUrl || slides[0]?.phoneUrl || "", lineUrl: data.lineUrl || slides[0]?.lineUrl || "", imageUrl: "", textAlign: "center", overlayOpacity: 30 }],
      autoSlide: data.autoSlide ?? true,
      intervalMs: data.intervalMs ?? 5000,
    });
  };

  const removeSlide = (idx: number) => {
    const current = ensureSlides();
    onChange({ ...data, slides: current.filter((_: any, i: number) => i !== idx) });
  };

  const updateSlide = (idx: number, field: string, value: any) => {
    const current = ensureSlides();
    const updated = current.map((s: any, i: number) => i === idx ? { ...s, [field]: value } : s);
    onChange({ ...data, slides: updated });
  };

  const moveSlide = (idx: number, dir: number) => {
    const current = ensureSlides();
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= current.length) return;
    const arr = [...current];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    onChange({ ...data, slides: arr });
  };

  const currentSlides = hasSlides ? slides : (data.heading ? ensureSlides() : []);

  return (
    <div className="space-y-4">
      {/* ตั้งค่าสไลด์ */}
      <div className="bg-blue-50 rounded-lg p-3 space-y-2">
        <p className="text-sm font-semibold text-blue-700">ตั้งค่าสไลด์</p>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={data.autoSlide !== false} onChange={(e) => onChange({ ...data, autoSlide: e.target.checked })} className="rounded" />
            เลื่อนอัตโนมัติ
          </label>
          <div className="flex items-center gap-2 text-sm">
            <span>ทุก</span>
            <Input className="w-20 h-8" type="number" min={1000} step={500} value={data.intervalMs || 5000} onChange={(e) => onChange({ ...data, intervalMs: parseInt(e.target.value) || 5000 })} />
            <span>มิลลิวินาที</span>
          </div>
        </div>
      </div>

      {/* รายการ Slides */}
      {currentSlides.map((slide: any, idx: number) => (
        <Card key={idx} className="border-red-200 bg-red-50/30">
          <CardContent className="pt-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-red-700">Slide {idx + 1} / {currentSlides.length}</span>
              <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={idx === 0} onClick={() => moveSlide(idx, -1)}>
                  <ChevronUp className="w-4 h-4" />
                </Button>
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={idx === currentSlides.length - 1} onClick={() => moveSlide(idx, 1)}>
                  <ChevronDown className="w-4 h-4" />
                </Button>
                {currentSlides.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeSlide(idx)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <Field label="หัวข้อหลัก" value={slide.heading || ""} onChange={(v) => updateSlide(idx, "heading", v)} placeholder="เช่น บริการดูแลรักษารถยนต์" />
            <Field label="หัวข้อรอง (สีเหลือง)" value={slide.subheading || ""} onChange={(v) => updateSlide(idx, "subheading", v)} placeholder="เช่น นอกสถานที่ 24 ชั่วโมง" />
            <FieldArea label="คำอธิบาย" value={slide.description || ""} onChange={(v) => updateSlide(idx, "description", v)} rows={2} placeholder="คำอธิบายสั้นๆ" />

            <div className="grid grid-cols-2 gap-2">
              <Field label="เบอร์โทร (tel:)" value={slide.phoneUrl || ""} onChange={(v) => updateSlide(idx, "phoneUrl", v)} placeholder="tel:0996731296" />
              <Field label="ลิงก์ Line" value={slide.lineUrl || ""} onChange={(v) => updateSlide(idx, "lineUrl", v)} placeholder="https://lin.ee/OBB86S4" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">ตำแหน่งข้อความ</Label>
                <select value={slide.textAlign || "center"} onChange={(e) => updateSlide(idx, "textAlign", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="left">ชิดซ้าย</option>
                  <option value="center">กลาง</option>
                  <option value="right">ชิดขวา</option>
                </select>
              </div>
              <div>
                <Label className="text-sm">ความทึบพื้นหลัง (%)</Label>
                <Input type="number" min={0} max={100} value={slide.overlayOpacity ?? 30} onChange={(e) => updateSlide(idx, "overlayOpacity", parseInt(e.target.value) || 0)} className="mt-1" />
              </div>
            </div>

            <ImageUpload label="รูปพื้นหลัง" value={slide.imageUrl || ""} onChange={(url) => updateSlide(idx, "imageUrl", url)} aspectRatio={slide.imageRatio || "free"} onAspectRatioChange={(r) => updateSlide(idx, "imageRatio", r)} />
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addSlide} className="w-full border-dashed border-red-300 text-red-700 hover:bg-red-50">
        <Plus className="w-4 h-4 mr-1" /> เพิ่ม Slide
      </Button>
    </div>
  );
}

function TextForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <FieldArea label="เนื้อหา" value={data.body || ""} onChange={(v) => onChange({ ...data, body: v })} rows={6} placeholder="เขียนเนื้อหาที่นี่..." />
    </div>
  );
}

function ImageForm({ data, imageUrl, onChange, onImageChange }: {
  data: Record<string, any>; imageUrl: string;
  onChange: (d: Record<string, any>) => void; onImageChange: (url: string) => void;
}) {
  return (
    <div className="space-y-3">
      <ImageUpload label="รูปภาพ" value={imageUrl} onChange={onImageChange} aspectRatio={data.imageRatio || "free"} onAspectRatioChange={(r) => onChange({ ...data, imageRatio: r })} />
      <Field label="คำอธิบายรูป (Alt)" value={data.alt || ""} onChange={(v) => onChange({ ...data, alt: v })} placeholder="คำอธิบายสำหรับ SEO" />
      <Field label="คำบรรยายใต้ภาพ" value={data.caption || ""} onChange={(v) => onChange({ ...data, caption: v })} placeholder="(ถ้ามี)" />
    </div>
  );
}

function TextImageForm({ data, imageUrl, onChange, onImageChange }: {
  data: Record<string, any>; imageUrl: string;
  onChange: (d: Record<string, any>) => void; onImageChange: (url: string) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldArea label="เนื้อหา" value={data.body || ""} onChange={(v) => onChange({ ...data, body: v })} rows={4} placeholder="เขียนเนื้อหา..." />
      <ImageUpload label="รูปภาพประกอบ" value={imageUrl} onChange={onImageChange} aspectRatio={data.imageRatio || "free"} onAspectRatioChange={(r) => onChange({ ...data, imageRatio: r })} />
      <div>
        <Label className="text-sm">ตำแหน่งรูป</Label>
        <select value={data.imagePosition || "right"} onChange={(e) => onChange({ ...data, imagePosition: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="left">รูปซ้าย ข้อความขวา</option>
          <option value="right">ข้อความซ้าย รูปขวา</option>
          <option value="top">รูปบน ข้อความล่าง</option>
          <option value="bottom">ข้อความบน รูปล่าง</option>
        </select>
      </div>
    </div>
  );
}

function GalleryForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const images: { src: string; alt: string; caption: string }[] = Array.isArray(data.images) ? data.images : [];

  const addImage = () => {
    onChange({ ...data, images: [...images, { src: "", alt: "", caption: "" }] });
  };
  const removeImage = (idx: number) => {
    onChange({ ...data, images: images.filter((_: any, i: number) => i !== idx) });
  };
  const updateImage = (idx: number, field: string, value: string) => {
    const updated = images.map((img: any, i: number) => i === idx ? { ...img, [field]: value } : img);
    onChange({ ...data, images: updated });
  };

  return (
    <div className="space-y-3">
      {images.map((img: any, idx: number) => (
        <Card key={idx} className="bg-white">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">รูปที่ {idx + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeImage(idx)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <ImageUpload value={img.src || ""} onChange={(url) => updateImage(idx, "src", url)} aspectRatio={img.imageRatio || "free"} onAspectRatioChange={(r) => updateImage(idx, "imageRatio", r)} />
            <Field label="คำอธิบาย" value={img.alt || ""} onChange={(v) => updateImage(idx, "alt", v)} placeholder="คำอธิบายรูป" />
            <Field label="คำบรรยาย" value={img.caption || ""} onChange={(v) => updateImage(idx, "caption", v)} placeholder="คำบรรยาย (ถ้ามี)" />
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addImage} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-1" /> เพิ่มรูปภาพ
      </Button>
    </div>
  );
}

function FaqForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const items: { question: string; answer: string }[] = Array.isArray(data.items) ? data.items : [];

  const addItem = () => onChange({ ...data, items: [...items, { question: "", answer: "" }] });
  const removeItem = (idx: number) => onChange({ ...data, items: items.filter((_: any, i: number) => i !== idx) });
  const updateItem = (idx: number, field: string, value: string) => {
    const updated = items.map((item: any, i: number) => i === idx ? { ...item, [field]: value } : item);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="Badge (ข้อความเล็กๆ ด้านบน)" value={data.badge || ""} onChange={(v) => onChange({ ...data, badge: v })} placeholder="FAQ" />
      <Field label="คำอธิบายใต้หัวข้อ" value={data.subtitle || ""} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="รวมคำตอบสำหรับคำถามที่ลูกค้าสอบถามบ่อยที่สุด" />

      {items.map((item: any, idx: number) => (
        <Card key={idx} className="bg-white">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">คำถามที่ {idx + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeItem(idx)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Field label="คำถาม" value={item.question || ""} onChange={(v) => updateItem(idx, "question", v)} placeholder="เช่น บริการ 24 ชม. จริงไหม?" />
            <FieldArea label="คำตอบ" value={item.answer || ""} onChange={(v) => updateItem(idx, "answer", v)} rows={3} placeholder="คำตอบ..." />
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-1" /> เพิ่มคำถาม
      </Button>
    </div>
  );
}

function TestimonialsForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const items: any[] = Array.isArray(data.items) ? data.items : [];

  const addItem = () => onChange({ ...data, items: [...items, { name: "", role: "", content: "", rating: 5, avatar: "" }] });
  const removeItem = (idx: number) => onChange({ ...data, items: items.filter((_: any, i: number) => i !== idx) });
  const updateItem = (idx: number, field: string, value: any) => {
    const updated = items.map((item: any, i: number) => i === idx ? { ...item, [field]: value } : item);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="space-y-3">
      {items.map((item: any, idx: number) => (
        <Card key={idx} className="bg-white">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">รีวิวที่ {idx + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeItem(idx)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Field label="ชื่อ" value={item.name || ""} onChange={(v) => updateItem(idx, "name", v)} placeholder="คุณ..." />
              <Field label="บริการที่ใช้" value={item.role || ""} onChange={(v) => updateItem(idx, "role", v)} placeholder="เช่น ผู้ใช้บริการเปลี่ยนแบตฯ" />
            </div>
            <FieldArea label="เนื้อหารีวิว" value={item.content || ""} onChange={(v) => updateItem(idx, "content", v)} rows={2} placeholder="เนื้อหารีวิว..." />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">คะแนน</Label>
                <select value={item.rating || 5} onChange={(e) => updateItem(idx, "rating", Number(e.target.value))} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ดาว</option>)}
                </select>
              </div>
              <Field label="Avatar URL (ถ้ามี)" value={item.avatar || ""} onChange={(v) => updateItem(idx, "avatar", v)} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-1" /> เพิ่มรีวิว
      </Button>
    </div>
  );
}

function ServicesForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const items: any[] = Array.isArray(data.items) ? data.items : [];
  const iconOptions = ["Battery", "Wrench", "Lightbulb", "PenTool", "Shield", "Clock", "Zap", "ThumbsUp", "Star"];

  const addItem = () => onChange({ ...data, items: [...items, { title: "", description: "", icon: "Battery", href: "#" }] });
  const removeItem = (idx: number) => onChange({ ...data, items: items.filter((_: any, i: number) => i !== idx) });
  const updateItem = (idx: number, field: string, value: string) => {
    const updated = items.map((item: any, i: number) => i === idx ? { ...item, [field]: value } : item);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="คำอธิบาย Section" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} placeholder="ครบทุกบริการดูแลรักษารถยนต์นอกสถานที่..." />

      {items.map((item: any, idx: number) => (
        <Card key={idx} className="bg-white">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">บริการที่ {idx + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeItem(idx)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Field label="ชื่อบริการ" value={item.title || ""} onChange={(v) => updateItem(idx, "title", v)} placeholder="เช่น เปลี่ยนแบตเตอรี่" />
            <FieldArea label="รายละเอียด" value={item.description || ""} onChange={(v) => updateItem(idx, "description", v)} rows={2} placeholder="คำอธิบายสั้นๆ" />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-sm">ไอคอน</Label>
                <select value={item.icon || "Battery"} onChange={(e) => updateItem(idx, "icon", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {iconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <Field label="ลิงก์" value={item.href || ""} onChange={(v) => updateItem(idx, "href", v)} placeholder="/services/battery" />
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-1" /> เพิ่มบริการ
      </Button>

    </div>
  );
}

function BatteryCheckerForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="หัวข้อ" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="เช็ครุ่นแบตเตอรี่รถยนต์ของคุณ" />
      <Field label="คำอธิบาย" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} placeholder="เลือกยี่ห้อและรุ่นรถเพื่อดูแบตเตอรี่ที่เหมาะสม" />

      <div className="border-t pt-3 space-y-2">
        <p className="text-sm font-medium text-slate-700 mb-1">การแสดงผล</p>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={data.showDropdown !== false} onChange={(e) => onChange({ ...data, showDropdown: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600" />
          <span className="text-sm text-slate-700">แสดง Dropdown เลือกยี่ห้อ/รุ่นรถ</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={data.showBrandGrid !== false} onChange={(e) => onChange({ ...data, showBrandGrid: e.target.checked })} className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-600" />
          <span className="text-sm text-slate-700">แสดง Grid เลือกยี่ห้อรถ (ไอคอน)</span>
        </label>
      </div>
    </div>
  );
}

function CtaBannerForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const badges: string[] = Array.isArray(data.badges) ? data.badges : [];

  return (
    <div className="space-y-3">
      <Field label="Badge (ข้อความเล็กๆ ด้านบน)" value={data.badge || ""} onChange={(v) => onChange({ ...data, badge: v })} placeholder="พร้อมออกให้บริการทันที" />
      <Field label="หัวข้อหลัก" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="รถเสีย? อย่ารอช้า —" />
      <Field label="หัวข้อรอง (สีส้ม)" value={data.headingSub || ""} onChange={(v) => onChange({ ...data, headingSub: v })} placeholder="โทรหาเราได้เลย" />
      <FieldArea label="คำอธิบาย" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="ช่างผู้เชี่ยวชาญออกนอกสถานที่ภายใน 30 นาที · บริการ 24 ชั่วโมง" />
      <div className="grid grid-cols-2 gap-2">
        <Field label="เบอร์โทร" value={data.phone || ""} onChange={(v) => onChange({ ...data, phone: v })} placeholder="0996731296" />
        <Field label="Line URL" value={data.lineUrl || ""} onChange={(v) => onChange({ ...data, lineUrl: v })} placeholder="https://lin.ee/OBB86S4" />
      </div>

      <div className="border-t pt-3">
        <p className="text-xs font-medium text-slate-600 mb-1">Trust Badges (เช่น ✓ ออกนอกสถานที่)</p>
        {badges.map((badge: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-1">
            <Input className="flex-1 h-8 text-xs" value={badge} onChange={(e) => { const nb = [...badges]; nb[idx] = e.target.value; onChange({ ...data, badges: nb }); }} />
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => onChange({ ...data, badges: badges.filter((_: string, i: number) => i !== idx) })}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, badges: [...badges, ""] })} className="w-full border-dashed h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> เพิ่ม Badge
        </Button>
      </div>
    </div>
  );
}

function WhyUsForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const items: any[] = Array.isArray(data.items) ? data.items : [];
  const iconOptions = ["Clock", "Zap", "Shield", "ThumbsUp", "Star", "Battery", "Wrench", "Lightbulb", "PenTool"];

  const addItem = () => onChange({ ...data, items: [...items, { title: "", description: "", icon: "Star" }] });
  const removeItem = (idx: number) => onChange({ ...data, items: items.filter((_: any, i: number) => i !== idx) });
  const updateItem = (idx: number, field: string, value: string) => {
    const updated = items.map((item: any, i: number) => i === idx ? { ...item, [field]: value } : item);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="Badge (ข้อความเล็กๆ ด้านบน)" value={data.badge || ""} onChange={(v) => onChange({ ...data, badge: v })} placeholder="Why Choose Us" />
      <Field label="คำอธิบายใต้หัวข้อ" value={data.subtitle || ""} onChange={(v) => onChange({ ...data, subtitle: v })} placeholder="เรามุ่งมั่นให้บริการที่ดีที่สุด..." />

      {items.map((item: any, idx: number) => (
        <Card key={idx} className="bg-white">
          <CardContent className="pt-4 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-slate-600">จุดเด่นที่ {idx + 1}</span>
              <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeItem(idx)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <Field label="หัวข้อ" value={item.title || ""} onChange={(v) => updateItem(idx, "title", v)} placeholder="เช่น บริการ 24 ชั่วโมง" />
            <FieldArea label="รายละเอียด" value={item.description || ""} onChange={(v) => updateItem(idx, "description", v)} rows={2} placeholder="คำอธิบายสั้นๆ" />
            <div>
              <Label className="text-sm">ไอคอน</Label>
              <select value={item.icon || "Star"} onChange={(e) => updateItem(idx, "icon", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {iconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
        <Plus className="w-4 h-4 mr-1" /> เพิ่มจุดเด่น
      </Button>
    </div>
  );
}

function ContactForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const trustSignals: any[] = Array.isArray(data.trustSignals) ? data.trustSignals : [];
  const iconOptions = ["MapPin", "Clock", "Shield", "Star", "Zap", "ThumbsUp"];

  return (
    <div className="space-y-3">
      <Field label="Badge (ข้อความเล็กๆ ด้านบน)" value={data.badge || ""} onChange={(v) => onChange({ ...data, badge: v })} placeholder="พร้อมให้บริการ 24/7" />
      <Field label="หัวข้อ" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="รถเสีย? อย่ารอช้า โทรหาเราเลย!" />
      <FieldArea label="คำอธิบาย" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="คำอธิบาย..." />
      <div className="grid grid-cols-2 gap-2">
        <Field label="เบอร์โทร" value={data.phone || ""} onChange={(v) => onChange({ ...data, phone: v })} placeholder="0996731296" />
        <Field label="Line ID" value={data.lineId || ""} onChange={(v) => onChange({ ...data, lineId: v })} placeholder="@398kyxfq" />
      </div>
      <Field label="Line URL" value={data.lineUrl || ""} onChange={(v) => onChange({ ...data, lineUrl: v })} placeholder="https://lin.ee/OBB86S4" />

      {/* Trust Signals */}
      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">🛡️ Trust Signals (ไอคอน + ข้อความด้านล่าง)</p>
        {trustSignals.map((ts: any, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-2">
            <select value={ts.icon || "Star"} onChange={(e) => { const nt = [...trustSignals]; nt[idx] = { ...nt[idx], icon: e.target.value }; onChange({ ...data, trustSignals: nt }); }} className="w-24 rounded-md border border-input bg-background px-2 py-1.5 text-xs">
              {iconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
            <Input className="flex-1 h-8 text-xs" value={ts.label || ""} onChange={(e) => { const nt = [...trustSignals]; nt[idx] = { ...nt[idx], label: e.target.value }; onChange({ ...data, trustSignals: nt }); }} placeholder="ข้อความ เช่น บริการตลอด 24 ชม." />
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => onChange({ ...data, trustSignals: trustSignals.filter((_: any, i: number) => i !== idx) })}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, trustSignals: [...trustSignals, { icon: "Star", label: "" }] })} className="w-full border-dashed h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> เพิ่ม Trust Signal
        </Button>
      </div>
    </div>
  );
}

function InfoForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const items: any[] = Array.isArray(data.items) ? data.items : [];
  const iconOptions = ["AlertTriangle", "CheckCircle", "Camera", "MessageCircle", "Wrench", "Shield", "Zap", "Clock"];

  const addItem = () => onChange({ ...data, items: [...items, { text: "", icon: "CheckCircle", step: "", title: "", desc: "" }] });
  const removeItem = (idx: number) => onChange({ ...data, items: items.filter((_: any, i: number) => i !== idx) });
  const updateItem = (idx: number, field: string, value: string) => {
    const updated = items.map((item: any, i: number) => i === idx ? { ...item, [field]: value } : item);
    onChange({ ...data, items: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="หัวข้อ (heading)" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="เช่น ยางรั่ว ยางแบน ควรทำอย่างไร?" />
      <FieldArea label="คำอธิบาย (description)" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={3} placeholder="คำอธิบายเพิ่มเติม (รองรับ HTML)" />
      <div>
        <Label className="text-sm">รูปแบบการแสดงผล (layout)</Label>
        <select value={data.layout || "steps"} onChange={(e) => onChange({ ...data, layout: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="steps">ขั้นตอน (1, 2, 3)</option>
          <option value="list">รายการ (ไอคอน + ข้อความ)</option>
          <option value="cards">การ์ด (ไอคอน + หัวข้อ + คำอธิบาย)</option>
          <option value="two-column">สองคอลัมน์ (หัวข้อ + รายละเอียด)</option>
        </select>
      </div>
      <div>
        <Label className="text-sm">สีพื้นหลัง</Label>
        <select value={data.bgColor || "bg-slate-50"} onChange={(e) => onChange({ ...data, bgColor: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="bg-white">ขาว</option>
          <option value="bg-slate-50">เทาอ่อน</option>
        </select>
      </div>

      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">รายการข้อมูล</p>
        {items.map((item: any, idx: number) => (
          <Card key={idx} className="bg-white mb-2">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-600">รายการที่ {idx + 1}</span>
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeItem(idx)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              {(data.layout === "steps" || !data.layout) && (
                <Field label="หมายเลขขั้นตอน" value={item.step || ""} onChange={(v) => updateItem(idx, "step", v)} placeholder="1" />
              )}
              <div>
                <Label className="text-sm">ไอคอน</Label>
                <select value={item.icon || "CheckCircle"} onChange={(e) => updateItem(idx, "icon", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {iconOptions.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
                </select>
              </div>
              <Field label="ข้อความ / หัวข้อ" value={item.text || item.title || ""} onChange={(v) => updateItem(idx, data.layout === "two-column" || data.layout === "cards" ? "title" : "text", v)} placeholder="ข้อความ" />
              {(data.layout === "two-column" || data.layout === "cards") && (
                <FieldArea label="รายละเอียด (แยกบรรทัดด้วย Enter)" value={item.desc || ""} onChange={(v) => updateItem(idx, "desc", v)} rows={3} placeholder="รายละเอียด..." />
              )}
            </CardContent>
          </Card>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addItem} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-1" /> เพิ่มรายการ
        </Button>
      </div>
    </div>
  );
}

function AreasForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const areas: string[] = Array.isArray(data.areas) ? data.areas : [];

  return (
    <div className="space-y-3">
      <Field label="หัวข้อ (heading)" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="พื้นที่ให้บริการ" />
      <FieldArea label="คำอธิบาย" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="ครอบคลุมโซน..." />
      <div>
        <Label className="text-sm">สีพื้นหลัง</Label>
        <select value={data.bgColor || "bg-white"} onChange={(e) => onChange({ ...data, bgColor: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
          <option value="bg-white">ขาว</option>
          <option value="bg-slate-50">เทาอ่อน</option>
        </select>
      </div>

      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">พื้นที่ (tags)</p>
        {areas.map((area: string, idx: number) => (
          <div key={idx} className="flex items-center gap-2 mb-1">
            <Input className="flex-1 h-8 text-sm" value={area} onChange={(e) => { const na = [...areas]; na[idx] = e.target.value; onChange({ ...data, areas: na }); }} placeholder="ชื่อพื้นที่" />
            <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => onChange({ ...data, areas: areas.filter((_: string, i: number) => i !== idx) })}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={() => onChange({ ...data, areas: [...areas, ""] })} className="w-full border-dashed h-7 text-xs">
          <Plus className="w-3 h-3 mr-1" /> เพิ่มพื้นที่
        </Button>
      </div>
    </div>
  );
}

function CtaBottomForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="หัวข้อ" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="ยางแตก ยางรั่ว โทรหาเราได้ทันที!" />
      <FieldArea label="คำอธิบาย" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="ช่างพร้อมออกบริการ 24 ชม." />
      <Field label="ข้อความปุ่มโทร" value={data.ctaPhoneLabel || ""} onChange={(v) => onChange({ ...data, ctaPhoneLabel: v })} placeholder="โทรเรียกช่างด่วน" />
      <Field label="ข้อความปุ่ม Line" value={data.ctaLineLabel || ""} onChange={(v) => onChange({ ...data, ctaLineLabel: v })} placeholder="แอดไลน์ส่งพิกัด" />
    </div>
  );
}

function ContactChannelsForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  const channels: any[] = Array.isArray(data.channels) ? data.channels : [];
  const typeOptions = ["phone", "line", "facebook"];

  const addChannel = () => onChange({ ...data, channels: [...channels, { type: "phone", label: "", sublabel: "", value: "", href: "" }] });
  const removeChannel = (idx: number) => onChange({ ...data, channels: channels.filter((_: any, i: number) => i !== idx) });
  const updateChannel = (idx: number, field: string, value: string) => {
    const updated = channels.map((ch: any, i: number) => i === idx ? { ...ch, [field]: value } : ch);
    onChange({ ...data, channels: updated });
  };

  return (
    <div className="space-y-3">
      <Field label="หัวข้อ" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="ช่องทางการติดต่อ" />
      <div className="border-t pt-3">
        <p className="text-sm font-medium text-slate-700 mb-2">ช่องทาง</p>
        {channels.map((ch: any, idx: number) => (
          <Card key={idx} className="bg-white mb-2">
            <CardContent className="pt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-600">ช่องทางที่ {idx + 1}</span>
                <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => removeChannel(idx)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
              <div>
                <Label className="text-sm">ประเภท</Label>
                <select value={ch.type || "phone"} onChange={(e) => updateChannel(idx, "type", e.target.value)} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  {typeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="ชื่อ" value={ch.label || ""} onChange={(v) => updateChannel(idx, "label", v)} placeholder="โทรศัพท์" />
                <Field label="ข้อความรอง" value={ch.sublabel || ""} onChange={(v) => updateChannel(idx, "sublabel", v)} placeholder="สายด่วน 24 ชม." />
              </div>
              <Field label="ค่าที่แสดง" value={ch.value || ""} onChange={(v) => updateChannel(idx, "value", v)} placeholder="099-673-1296" />
              <Field label="ลิงก์ (href)" value={ch.href || ""} onChange={(v) => updateChannel(idx, "href", v)} placeholder="tel:0996731296" />
            </CardContent>
          </Card>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addChannel} className="w-full border-dashed">
          <Plus className="w-4 h-4 mr-1" /> เพิ่มช่องทาง
        </Button>
      </div>
    </div>
  );
}

function MapForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="หัวข้อ" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="แผนที่พื้นที่ให้บริการ" />
      <FieldArea label="คำอธิบาย" value={data.description || ""} onChange={(v) => onChange({ ...data, description: v })} rows={2} placeholder="คำอธิบาย" />
    </div>
  );
}

function HoursForm({ data, onChange }: { data: Record<string, any>; onChange: (d: Record<string, any>) => void }) {
  return (
    <div className="space-y-3">
      <Field label="หัวข้อ" value={data.heading || ""} onChange={(v) => onChange({ ...data, heading: v })} placeholder="เวลาทำการ" />
      <Field label="วันให้บริการ" value={data.daysLabel || ""} onChange={(v) => onChange({ ...data, daysLabel: v })} placeholder="ทุกวัน จันทร์ - อาทิตย์" />
      <Field label="เวลาให้บริการ" value={data.hoursLabel || ""} onChange={(v) => onChange({ ...data, hoursLabel: v })} placeholder="ตลอด 24 ชั่วโมง" />
      <Field label="หมายเหตุ" value={data.note || ""} onChange={(v) => onChange({ ...data, note: v })} placeholder="มีทีมช่างสแตนด์บายกะกลางคืน" />
    </div>
  );
}

function CustomForm({ content, onContentChange, imageUrl, onImageChange }: {
  content: string; onContentChange: (c: string) => void;
  imageUrl: string; onImageChange: (url: string) => void;
}) {
  return (
    <div className="space-y-3">
      <FieldArea label="เนื้อหา (HTML หรือ JSON)" value={content} onChange={onContentChange} rows={8} placeholder="<div>...</div>" />
      <ImageUpload label="รูปภาพ (ถ้ามี)" value={imageUrl} onChange={onImageChange} aspectRatio={JSON.parse(content || '{}').imageRatio || "free"} onAspectRatioChange={(r) => { try { const d = JSON.parse(content || '{}'); d.imageRatio = r; onContentChange(JSON.stringify(d)); } catch {} }} />
    </div>
  );
}

// Reusable field components
function Field({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Input className="mt-1" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function FieldArea({ label, value, onChange, rows, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string;
}) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={value} onChange={(e) => onChange(e.target.value)} rows={rows || 3} placeholder={placeholder} />
    </div>
  );
}

export default function PageEditorPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = params.id as string;

  const [page, setPage] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // SEO form state
  const [seo, setSeo] = useState({
    seoTitle: "",
    seoDescription: "",
    seoKeywords: "",
    ogTitle: "",
    ogDescription: "",
  });

  // Section editing
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [sectionForm, setSectionForm] = useState({
    type: "text",
    title: "",
    content: "{}",
    imageUrl: "",
    isActive: true,
  });
  const [showAddSection, setShowAddSection] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [confirmMsg, setConfirmMsg] = useState("");

  const fetchPage = useCallback(async () => {
    try {
      const res = await fetch(`/api/pages/${pageId}`);
      if (!res.ok) {
        router.push("/admin/pages");
        return;
      }
      const data: PageData = await res.json();
      setPage(data);
      setSeo({
        seoTitle: data.seoTitle || "",
        seoDescription: data.seoDescription || "",
        seoKeywords: data.seoKeywords || "",
        ogTitle: data.ogTitle || "",
        ogDescription: data.ogDescription || "",
      });
    } catch (error) {
      console.error("Failed to fetch page", error);
    } finally {
      setIsLoading(false);
    }
  }, [pageId, router]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  // ========== SEO Save ==========
  const handleSaveSeo = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: page.title,
          slug: page.slug,
          isActive: page.isActive,
          order: page.order,
          ...seo,
        }),
      });
      if (res.ok) showMsg("บันทึก SEO สำเร็จ!");
    } catch (error) {
      console.error("Failed to save SEO", error);
    } finally {
      setSaving(false);
    }
  };

  // ========== Section CRUD ==========
  const handleAddSection = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...sectionForm,
          order: (page?.sections?.length || 0),
        }),
      });
      if (res.ok) {
        await fetchPage();
        setShowAddSection(false);
        resetSectionForm();
        showMsg("เพิ่ม section สำเร็จ!");
      }
    } catch (error) {
      console.error("Failed to add section", error);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSection = async (sectionId: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/pages/${pageId}/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionForm),
      });
      if (res.ok) {
        await fetchPage();
        setEditingSectionId(null);
        resetSectionForm();
        showMsg("บันทึก section สำเร็จ!");
      }
    } catch (error) {
      console.error("Failed to update section", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm("ยืนยันการลบ section นี้?")) return;
    try {
      const res = await fetch(`/api/pages/${pageId}/sections/${sectionId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchPage();
        showMsg("ลบ section สำเร็จ!");
      }
    } catch (error) {
      console.error("Failed to delete section", error);
    }
  };

  const handleToggleSectionActive = async (section: Section) => {
    try {
      await fetch(`/api/pages/${pageId}/sections/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...section, isActive: !section.isActive }),
      });
      await fetchPage();
    } catch (error) {
      console.error("Failed to toggle section", error);
    }
  };

  // ========== Reorder ==========
  const handleReorder = async (sectionId: string, direction: "up" | "down") => {
    if (!page) return;
    const sections = [...page.sections];
    const idx = sections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sections.length) return;

    // Swap orders
    const temp = sections[idx].order;
    sections[idx].order = sections[swapIdx].order;
    sections[swapIdx].order = temp;

    try {
      await fetch(`/api/pages/${pageId}/sections`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reorder: sections.map((s) => ({ id: s.id, order: s.order })),
        }),
      });
      await fetchPage();
    } catch (error) {
      console.error("Failed to reorder", error);
    }
  };

  const resetSectionForm = () => {
    setSectionForm({ type: "text", title: "", content: "{}", imageUrl: "", isActive: true });
  };

  const startEditSection = (section: Section) => {
    setEditingSectionId(section.id);
    setShowAddSection(false);
    setSectionForm({
      type: section.type,
      title: section.title || "",
      content: section.content || "{}",
      imageUrl: section.imageUrl || "",
      isActive: section.isActive,
    });
  };

  // ========== Content Data Helpers ==========
  const contentData = parseContent(sectionForm.content);

  const setContentData = (data: Record<string, any>) => {
    setSectionForm({ ...sectionForm, content: JSON.stringify(data) });
  };

  const renderContentForm = () => {
    const type = sectionForm.type;
    const imgUrl = sectionForm.imageUrl || "";
    const setImg = (url: string) => setSectionForm({ ...sectionForm, imageUrl: url });

    if (type === "header") return <HeaderForm data={contentData} imageUrl={imgUrl} onChange={setContentData} onImageChange={setImg} />;
    if (type === "sub-header") return <SubHeaderForm data={contentData} onChange={setContentData} />;
    if (type === "hero") return <HeroForm data={contentData} imageUrl={imgUrl} onChange={setContentData} onImageChange={setImg} />;
    if (type === "text") return <TextForm data={contentData} onChange={setContentData} />;
    if (type === "image") return <ImageForm data={contentData} imageUrl={imgUrl} onChange={setContentData} onImageChange={setImg} />;
    if (type === "text-image") return <TextImageForm data={contentData} imageUrl={imgUrl} onChange={setContentData} onImageChange={setImg} />;
    if (type === "gallery") return <GalleryForm data={contentData} onChange={setContentData} />;
    if (type === "why-us") return <WhyUsForm data={contentData} onChange={setContentData} />;
    if (type === "faq") return <FaqForm data={contentData} onChange={setContentData} />;
    if (type === "testimonials") return <TestimonialsForm data={contentData} onChange={setContentData} />;
    if (type === "services") return <ServicesForm data={contentData} onChange={setContentData} />;
    if (type === "battery-checker") return <BatteryCheckerForm data={contentData} onChange={setContentData} />;
    if (type === "cta-banner") return <CtaBannerForm data={contentData} onChange={setContentData} />;
    if (type === "contact") return <ContactForm data={contentData} onChange={setContentData} />;
    if (type === "info") return <InfoForm data={contentData} onChange={setContentData} />;
    if (type === "areas") return <AreasForm data={contentData} onChange={setContentData} />;
    if (type === "cta-bottom") return <CtaBottomForm data={contentData} onChange={setContentData} />;
    if (type === "contact-channels") return <ContactChannelsForm data={contentData} onChange={setContentData} />;
    if (type === "map") return <MapForm data={contentData} onChange={setContentData} />;
    if (type === "hours") return <HoursForm data={contentData} onChange={setContentData} />;
    if (type === "footer") return <FooterForm data={contentData} onChange={setContentData} />;
    return <CustomForm content={sectionForm.content} onContentChange={(c) => setSectionForm({ ...sectionForm, content: c })} imageUrl={imgUrl} onImageChange={setImg} />;
  };

  const renderSectionForm = (onSubmit: () => void, submitLabel: string) => (
    <Card className="mb-4 border-red-200 bg-red-50/30">
      <CardContent className="pt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-sm font-medium">ประเภท Section</Label>
            <select
              value={sectionForm.type}
              onChange={(e) => setSectionForm({ ...sectionForm, type: e.target.value, content: "{}" })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {SECTION_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-sm font-medium">ชื่อ Section (หัวข้อ)</Label>
            <Input
              className="mt-1"
              value={sectionForm.title}
              onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
              placeholder="เช่น บริการของเรา"
            />
          </div>
        </div>

        {/* อนิเมชั่น */}
        {!["header", "sub-header"].includes(sectionForm.type) && (
          <div className="bg-purple-50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">อนิเมชั่น</p>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs">เอฟเฟกต์</Label>
                <select value={contentData.animation || "none"} onChange={(e) => setContentData({ ...contentData, animation: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs">
                  <option value="none">ไม่มี</option>
                  <option value="fadeIn">Fade In</option>
                  <option value="fadeInUp">Fade In ↑</option>
                  <option value="fadeInDown">Fade In ↓</option>
                  <option value="fadeInLeft">Fade In ←</option>
                  <option value="fadeInRight">Fade In →</option>
                  <option value="zoomIn">Zoom In</option>
                  <option value="zoomOut">Zoom Out</option>
                  <option value="slideUp">Slide Up</option>
                  <option value="slideDown">Slide Down</option>
                  <option value="bounceIn">Bounce In</option>
                  <option value="flipIn">Flip In</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">ความเร็ว</Label>
                <select value={contentData.animationSpeed || "normal"} onChange={(e) => setContentData({ ...contentData, animationSpeed: e.target.value })} className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs">
                  <option value="slow">ช้า (1.2s)</option>
                  <option value="normal">ปกติ (0.7s)</option>
                  <option value="fast">เร็ว (0.4s)</option>
                </select>
              </div>
              <div>
                <Label className="text-xs">หน่วง (ms)</Label>
                <Input type="number" min={0} step={100} className="mt-1 h-7 text-xs" value={contentData.animationDelay || 0} onChange={(e) => setContentData({ ...contentData, animationDelay: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          {renderContentForm()}
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button onClick={() => { setConfirmMsg("คุณต้องการบันทึก Section นี้หรือไม่?"); setConfirmAction(() => onSubmit); setShowConfirm(true); }} disabled={saving} className="bg-red-600 hover:bg-red-700">
            <Save className="w-4 h-4 mr-2" />
            {saving ? "กำลังบันทึก..." : submitLabel}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowAddSection(false);
              setEditingSectionId(null);
              resetSectionForm();
            }}
          >
            <X className="w-4 h-4 mr-2" />
            ยกเลิก
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-slate-800">กำลังโหลด...</h1>
      </div>
    );
  }

  if (!page) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-slate-800">ไม่พบหน้า</h1>
        <Link href="/admin/pages">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับไปรายการหน้า
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/pages">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">{page.title}</h1>
          <p className="text-sm text-slate-400">/{page.slug}</p>
        </div>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {message}
        </div>
      )}

      {/* ========== Sections ========== */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-red-600" />
            เนื้อหา (Sections)
          </h2>
          {!showAddSection && !editingSectionId && (
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                setShowAddSection(true);
                resetSectionForm();
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              เพิ่ม Section
            </Button>
          )}
        </div>

        {showAddSection && renderSectionForm(handleAddSection, "เพิ่ม Section")}

        {page.sections.length === 0 && !showAddSection && (
          <div className="text-center py-10 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
            <LayoutTemplate className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>ยังไม่มี section</p>
            <p className="text-sm mt-1">กดปุ่ม &quot;เพิ่ม Section&quot; เพื่อเริ่มสร้างเนื้อหา</p>
          </div>
        )}

        <div className="space-y-3">
          {page.sections.map((section, idx) => (
            <div key={section.id}>
              {editingSectionId === section.id ? (
                renderSectionForm(() => handleUpdateSection(section.id), "บันทึก")
              ) : (
                <Card className={`transition-shadow hover:shadow-md ${!section.isActive ? "opacity-50" : ""}`}>
                  <CardContent className="py-3 flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                        onClick={() => handleReorder(section.id, "up")}
                        disabled={idx === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-slate-400 hover:text-slate-600"
                        onClick={() => handleReorder(section.id, "down")}
                        disabled={idx === page.sections.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-xl w-8 text-center">{getTypeIcon(section.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm">
                        {section.title || getTypeLabel(section.type)}
                      </div>
                      <div className="text-xs text-slate-400">
                        {getTypeLabel(section.type)}
                        {section.imageUrl && " • มีรูปภาพ"}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {LOCKED_TYPES.includes(section.type) ? (
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                          แก้ไขที่เมนู &quot;จัดการเนื้อหา&quot;
                        </span>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleSectionActive(section)}
                            className={`h-8 w-8 p-0 ${section.isActive ? "text-green-600" : "text-slate-400"}`}
                          >
                            {section.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => startEditSection(section)} className="h-8 w-8 p-0 text-blue-600">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSection(section.id)} className="h-8 w-8 p-0 text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ========== SEO Section ========== */}
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Globe className="w-5 h-5" />
            SEO สำหรับหน้านี้
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <Label>Title Tag</Label>
            <Input
              value={seo.seoTitle}
              onChange={(e) => setSeo({ ...seo, seoTitle: e.target.value })}
              placeholder="ชื่อหน้าบน Google"
            />
            <p className="text-xs text-slate-400">{seo.seoTitle.length}/60 ตัวอักษร</p>
          </div>
          <div className="space-y-1">
            <Label>Meta Description</Label>
            <textarea
              value={seo.seoDescription}
              onChange={(e) => setSeo({ ...seo, seoDescription: e.target.value })}
              rows={3}
              placeholder="คำอธิบายหน้าสำหรับ Google"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-xs text-slate-400">{seo.seoDescription.length}/160 ตัวอักษร</p>
          </div>
          <div className="space-y-1">
            <Label>Keywords (คั่นด้วย ,)</Label>
            <Input
              value={seo.seoKeywords}
              onChange={(e) => setSeo({ ...seo, seoKeywords: e.target.value })}
              placeholder="เปลี่ยนแบตเตอรี่,ซ่อมไดชาร์จ"
            />
          </div>
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Open Graph (แชร์ Facebook / LINE)</p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>OG Title</Label>
                <Input
                  value={seo.ogTitle}
                  onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                  placeholder="ถ้าเว้นว่างจะใช้ Title Tag"
                />
              </div>
              <div className="space-y-1">
                <Label>OG Description</Label>
                <textarea
                  value={seo.ogDescription}
                  onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
                  rows={2}
                  placeholder="ถ้าเว้นว่างจะใช้ Meta Description"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <Button onClick={() => { setConfirmMsg("คุณต้องการบันทึกการตั้งค่า SEO หรือไม่?"); setConfirmAction(() => handleSaveSeo); setShowConfirm(true); }} disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "กำลังบันทึก..." : "บันทึก SEO"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showConfirm}
        title="ยืนยันการบันทึก"
        message={confirmMsg}
        onConfirm={() => { setShowConfirm(false); if (confirmAction) confirmAction(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

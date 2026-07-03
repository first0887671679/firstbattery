"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Globe } from "lucide-react";

interface SeoItem {
  id?: string;
  pagePath: string;
  pageLabel: string;
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
}

const defaultPages: SeoItem[] = [
  { pagePath: "/", pageLabel: "หน้าแรก", title: "", description: "", keywords: "", ogTitle: "", ogDescription: "" },
  { pagePath: "/services/battery", pageLabel: "เปลี่ยนแบตเตอรี่", title: "", description: "", keywords: "", ogTitle: "", ogDescription: "" },
  { pagePath: "/services/alternator-starter", pageLabel: "ซ่อมไดชาร์จ ไดสตาร์ท", title: "", description: "", keywords: "", ogTitle: "", ogDescription: "" },
  { pagePath: "/services/headlight-restoration", pageLabel: "ขัดไฟหน้ารถ", title: "", description: "", keywords: "", ogTitle: "", ogDescription: "" },
  { pagePath: "/services/tire-repair", pageLabel: "ปะยางนอกสถานที่", title: "", description: "", keywords: "", ogTitle: "", ogDescription: "" },
];

export default function SeoAdminPage() {
  const [pages, setPages] = useState<SeoItem[]>(defaultPages);
  const [activePath, setActivePath] = useState("/");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    try {
      const res = await fetch("/api/seo");
      const data = await res.json();
      if (Array.isArray(data)) {
        const merged = defaultPages.map((dp) => {
          const found = data.find((d: SeoItem) => d.pagePath === dp.pagePath);
          return found ? { ...dp, ...found } : dp;
        });
        setPages(merged);
      }
    } catch (error) {
      console.error("Failed to fetch SEO", error);
    }
  };

  const activePage = pages.find((p) => p.pagePath === activePath) || pages[0];

  const updateField = (field: keyof SeoItem, value: string) => {
    setPages((prev) =>
      prev.map((p) => (p.pagePath === activePath ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activePage),
      });
      if (res.ok) {
        setMessage("บันทึกสำเร็จ!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Failed to save", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-slate-800">จัดการ SEO ทุกหน้า</h1>

      {message && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          {message}
        </div>
      )}

      {/* Page Tabs */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
        {pages.map((p) => (
          <button
            key={p.pagePath}
            onClick={() => setActivePath(p.pagePath)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
              activePath === p.pagePath
                ? "bg-red-600 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-red-50"
            }`}
          >
            <Globe className="w-3 h-3 inline mr-1" />
            {p.pageLabel}
          </button>
        ))}
      </div>

      <Card className="max-w-full lg:max-w-3xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-red-600" />
            SEO สำหรับ: {activePage.pageLabel}
            <span className="text-sm font-normal text-slate-400 ml-2">{activePage.pagePath}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <Label>Title Tag (ชื่อหน้าบน Google)</Label>
            <Input
              value={activePage.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="เช่น เปลี่ยนแบตเตอรี่นอกสถานที่ 24 ชม. | PORNPISIT BATTERY"
            />
            <p className="text-xs text-slate-400">{activePage.title.length}/60 ตัวอักษร (แนะนำไม่เกิน 60)</p>
          </div>

          <div className="space-y-1">
            <Label>Meta Description (คำอธิบายบน Google)</Label>
            <textarea
              value={activePage.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={3}
              placeholder="อธิบายเนื้อหาหน้านี้สั้นๆ สำหรับ Google"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <p className="text-xs text-slate-400">{activePage.description.length}/160 ตัวอักษร (แนะนำไม่เกิน 160)</p>
          </div>

          <div className="space-y-1">
            <Label>Keywords (คั่นด้วย ,)</Label>
            <Input
              value={activePage.keywords}
              onChange={(e) => updateField("keywords", e.target.value)}
              placeholder="เช่น เปลี่ยนแบตเตอรี่,ซ่อมไดชาร์จ,24 ชั่วโมง"
            />
          </div>

          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">Open Graph (แชร์ Facebook / LINE)</p>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>OG Title</Label>
                <Input
                  value={activePage.ogTitle}
                  onChange={(e) => updateField("ogTitle", e.target.value)}
                  placeholder="ถ้าเว้นว่างจะใช้ Title Tag แทน"
                />
              </div>
              <div className="space-y-1">
                <Label>OG Description</Label>
                <textarea
                  value={activePage.ogDescription}
                  onChange={(e) => updateField("ogDescription", e.target.value)}
                  rows={2}
                  placeholder="ถ้าเว้นว่างจะใช้ Meta Description แทน"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button onClick={handleSave} disabled={saving} className="bg-red-600 hover:bg-red-700">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "กำลังบันทึก..." : "บันทึก SEO"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

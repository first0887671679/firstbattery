"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface ServiceLink {
  label: string;
  href: string;
}

export default function FooterEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [msg, setMsg] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [pageId, setPageId] = useState("");

  const [brandName, setBrandName] = useState("PORNPISIT BATTERY");
  const [description, setDescription] = useState("");
  const [openHours, setOpenHours] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [lineUrl, setLineUrl] = useState("");
  const [lineId, setLineId] = useState("");
  const [copyright, setCopyright] = useState("");
  const [serviceLinks, setServiceLinks] = useState<ServiceLink[]>([]);
  const [footerBgColor, setFooterBgColor] = useState("#020617");
  const [footerTextColor, setFooterTextColor] = useState("#94a3b8");
  const [footerAccentColor, setFooterAccentColor] = useState("#dc2626");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pages");
      const pages = await res.json();
      const home = pages.find((p: any) => p.slug === "home");
      if (!home) return;
      setPageId(home.id);

      const footerSec = home.sections.find((s: any) => s.type === "footer");
      if (footerSec) {
        setSectionId(footerSec.id);
        const data = JSON.parse(footerSec.content || "{}");
        setBrandName(data.brandName || "");
        setDescription(data.description || "");
        setOpenHours(data.openHours || "");
        setArea(data.area || "");
        setPhone(data.phone || "");
        setLineUrl(data.lineUrl || "");
        setLineId(data.lineId || "");
        setCopyright(data.copyright || "");
        setServiceLinks(Array.isArray(data.serviceLinks) ? data.serviceLinks : []);
        setFooterBgColor(data.footerBgColor || "#020617");
        setFooterTextColor(data.footerTextColor || "#94a3b8");
        setFooterAccentColor(data.footerAccentColor || "#dc2626");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const showMsg = (m: string) => {
    setMsg(m);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleSave = async () => {
    if (!sectionId || !pageId) return;
    setSaving(true);
    try {
      await fetch(`/api/pages/${pageId}/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "footer",
          title: "ท้ายเว็บ (Footer)",
          content: JSON.stringify({
            brandName,
            description,
            openHours,
            area,
            phone,
            lineUrl,
            lineId,
            copyright,
            serviceLinks,
            footerBgColor,
            footerTextColor,
            footerAccentColor,
          }),
          isActive: true,
        }),
      });
      showMsg("บันทึกสำเร็จ!");
    } catch (e) {
      console.error(e);
      showMsg("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setServiceLinks([...serviceLinks, { label: "", href: "" }]);
  const removeLink = (idx: number) => setServiceLinks(serviceLinks.filter((_, i) => i !== idx));
  const updateLink = (idx: number, field: keyof ServiceLink, value: string) => {
    setServiceLinks(serviceLinks.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };

  if (loading) {
    return <div className="text-center py-12 text-slate-500">กำลังโหลด...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">🔻 จัดการท้ายเว็บ (Footer)</h1>
          <p className="text-sm text-slate-500">แก้ไขข้อมูลบริษัท ลิงก์บริการ และช่องทางติดต่อ</p>
        </div>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium">{msg}</div>
      )}

      {/* Company Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">ข้อมูลบริษัท</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm">ชื่อแบรนด์</Label>
            <Input className="mt-1" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="PORNPISIT BATTERY" />
          </div>
          <div>
            <Label className="text-sm">คำอธิบาย</Label>
            <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="บริการดูแลรักษารถยนต์..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">เวลาทำการ</Label>
              <Input className="mt-1" value={openHours} onChange={(e) => setOpenHours(e.target.value)} placeholder="เปิดบริการ 24 ชั่วโมง" />
            </div>
            <div>
              <Label className="text-sm">พื้นที่ให้บริการ</Label>
              <Input className="mt-1" value={area} onChange={(e) => setArea(e.target.value)} placeholder="ห้วยขวาง ดินแดง ลาดพร้าว บางกะปิ บางเขน จตุจักร ดุสิต บางซื่อ" />
            </div>
          </div>
          <div>
            <Label className="text-sm">ข้อความ Copyright</Label>
            <Input className="mt-1" value={copyright} onChange={(e) => setCopyright(e.target.value)} placeholder="PORNPISIT BATTERY. All rights reserved." />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">ช่องทางติดต่อ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm">เบอร์โทร</Label>
            <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0996731296" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Line URL</Label>
              <Input className="mt-1" value={lineUrl} onChange={(e) => setLineUrl(e.target.value)} placeholder="https://lin.ee/OBB86S4" />
            </div>
            <div>
              <Label className="text-sm">Line ID</Label>
              <Input className="mt-1" value={lineId} onChange={(e) => setLineId(e.target.value)} placeholder="@398kyxfq" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer Colors */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">🎨 สีท้ายเว็บ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-sm">สีพื้นหลัง</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={footerBgColor} onChange={(e) => setFooterBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <Input value={footerBgColor} onChange={(e) => setFooterBgColor(e.target.value)} className="flex-1 font-mono text-xs" placeholder="#020617" />
              </div>
            </div>
            <div>
              <Label className="text-sm">สีตัวอักษร</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={footerTextColor} onChange={(e) => setFooterTextColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <Input value={footerTextColor} onChange={(e) => setFooterTextColor(e.target.value)} className="flex-1 font-mono text-xs" placeholder="#94a3b8" />
              </div>
            </div>
            <div>
              <Label className="text-sm">สีเน้น (ไอคอน/ขีดเส้น)</Label>
              <div className="flex items-center gap-2 mt-1">
                <input type="color" value={footerAccentColor} onChange={(e) => setFooterAccentColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                <Input value={footerAccentColor} onChange={(e) => setFooterAccentColor(e.target.value)} className="flex-1 font-mono text-xs" placeholder="#dc2626" />
              </div>
            </div>
          </div>
          {/* Preview */}
          <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
            <div className="h-1" style={{ background: `linear-gradient(to right, ${footerAccentColor}, ${footerAccentColor}88, ${footerAccentColor})` }} />
            <div className="flex items-center justify-between px-4 py-4" style={{ backgroundColor: footerBgColor }}>
              <div>
                <span className="text-sm font-bold text-white">ตัวอย่าง Footer</span>
                <p className="text-xs mt-0.5" style={{ color: footerTextColor }}>ข้อความตัวอย่าง</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${footerAccentColor}20` }}>
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: footerAccentColor }} />
                </div>
                <span className="text-xs" style={{ color: footerTextColor }}>ลิงก์</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Service Links */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">ลิงก์บริการ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {serviceLinks.map((link, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 w-5 text-center">{idx + 1}</span>
              <Input className="flex-1" value={link.label} onChange={(e) => updateLink(idx, "label", e.target.value)} placeholder="ชื่อบริการ" />
              <Input className="flex-1" value={link.href} onChange={(e) => updateLink(idx, "href", e.target.value)} placeholder="ลิงก์ เช่น /services/battery" />
              <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => removeLink(idx)}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addLink} className="w-full border-dashed">
            <Plus className="w-4 h-4 mr-1" /> เพิ่มลิงก์บริการ
          </Button>
        </CardContent>
      </Card>

      <Button onClick={() => setShowConfirm(true)} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 h-12 text-base">
        <Save className="w-5 h-5 mr-2" />
        {saving ? "กำลังบันทึก..." : "บันทึก Footer"}
      </Button>

      <ConfirmDialog
        open={showConfirm}
        title="ยืนยันการบันทึก"
        message="คุณต้องการบันทึกการแก้ไข Footer หรือไม่?"
        onConfirm={() => { setShowConfirm(false); handleSave(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

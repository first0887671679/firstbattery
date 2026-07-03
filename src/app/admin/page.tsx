"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Save, Navigation, ChevronDown as ChevronDownIcon, PanelLeft, FileText,
  Phone, Globe, Smartphone, Image as ImageIcon, Plus, Trash2,
  ChevronUp, ChevronDown, ExternalLink
} from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface NavLink { label: string; href: string; }

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Header
  const [sectionId, setSectionId] = useState("");
  const [homeId, setHomeId] = useState("");
  const [brandName, setBrandName] = useState("PORNPISIT BATTERY");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoRatio, setLogoRatio] = useState("free");
  const [logoSize, setLogoSize] = useState(40);
  const [logoSizeMobile, setLogoSizeMobile] = useState(28);
  const [navbarHeight, setNavbarHeight] = useState(56);
  const [navbarHeightMobile, setNavbarHeightMobile] = useState(48);
  const [navBgColor, setNavBgColor] = useState("#0f172a");
  const [navTextColor, setNavTextColor] = useState("#cbd5e1");
  const [navAccentColor, setNavAccentColor] = useState("#dc2626");
  const [phone, setPhone] = useState("");
  const [phoneLabel, setPhoneLabel] = useState("โทรด่วน");
  const [lineUrl, setLineUrl] = useState("");
  const [lineLabel, setLineLabel] = useState("Line");
  const [links, setLinks] = useState<NavLink[]>([]);
  const [brandSub, setBrandSub] = useState("");

  // Sub-header
  const [subSectionId, setSubSectionId] = useState("");
  const [subText, setSubText] = useState("");
  const [subLinkUrl, setSubLinkUrl] = useState("");
  const [subLinkLabel, setSubLinkLabel] = useState("");
  const [subBgColor, setSubBgColor] = useState("orange");
  const [subActive, setSubActive] = useState(true);

  // Counts
  const [pageCount, setPageCount] = useState(0);
  const [sectionCount, setSectionCount] = useState(0);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pages");
      const pages = await res.json();
      setPageCount(pages.length);
      const home = pages.find((p: any) => p.slug === "home");
      if (!home) return;
      setHomeId(home.id);
      setSectionCount(home.sections?.length || 0);

      const headerSec = home.sections.find((s: any) => s.type === "header");
      if (headerSec) {
        setSectionId(headerSec.id);
        const d = JSON.parse(headerSec.content || "{}");
        setBrandName(d.brandName || "PORNPISIT BATTERY");
        setBrandSub(d.brandSub || "");
        setLogoUrl(headerSec.imageUrl || "");
        setLogoRatio(d.logoRatio || "free");
        setLogoSize(d.logoSize || 40);
        setLogoSizeMobile(d.logoSizeMobile || 28);
        setNavbarHeight(d.navbarHeight || 56);
        setNavbarHeightMobile(d.navbarHeightMobile || 48);
        setNavBgColor(d.navBgColor || "#0f172a");
        setNavTextColor(d.navTextColor || "#cbd5e1");
        setNavAccentColor(d.navAccentColor || "#dc2626");
        setPhone(d.phone || "");
        setPhoneLabel(d.phoneLabel || "โทรด่วน");
        setLineUrl(d.lineUrl || "");
        setLineLabel(d.lineLabel || "Line");
        setLinks(Array.isArray(d.links) ? d.links : []);
      }

      const subSec = home.sections.find((s: any) => s.type === "sub-header");
      if (subSec) {
        setSubSectionId(subSec.id);
        const d = JSON.parse(subSec.content || "{}");
        setSubText(d.text || "");
        setSubLinkUrl(d.linkUrl || "");
        setSubLinkLabel(d.linkLabel || "");
        setSubBgColor(d.bgColor || "orange");
        setSubActive(subSec.isActive);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const showMsg = (m: string) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleSave = async () => {
    if (!sectionId || !homeId) return;
    setSaving(true);
    try {
      await fetch(`/api/pages/${homeId}/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "header", title: "เมนูบนสุด",
          content: JSON.stringify({
            brandName, brandSub, phone, phoneLabel, lineUrl, lineLabel, links,
            logoRatio, logoSize, logoSizeMobile, navbarHeight, navbarHeightMobile,
            navBgColor, navTextColor, navAccentColor,
          }),
          imageUrl: logoUrl, isActive: true,
        }),
      });
      if (subSectionId) {
        await fetch(`/api/pages/${homeId}/sections/${subSectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "sub-header", title: "แถบประกาศ",
            content: JSON.stringify({ text: subText, linkUrl: subLinkUrl, linkLabel: subLinkLabel, bgColor: subBgColor }),
            isActive: subActive,
          }),
        });
      }
      showMsg("✅ บันทึกสำเร็จ!");
    } catch (e) { console.error(e); showMsg("❌ เกิดข้อผิดพลาด"); } finally { setSaving(false); }
  };

  const addLink = () => setLinks([...links, { label: "", href: "" }]);
  const removeLink = (i: number) => setLinks(links.filter((_, idx) => idx !== i));
  const updateLink = (i: number, f: keyof NavLink, v: string) => setLinks(links.map((l, idx) => idx === i ? { ...l, [f]: v } : l));
  const moveLink = (i: number, dir: number) => {
    const n = i + dir; if (n < 0 || n >= links.length) return;
    const a = [...links]; [a[i], a[n]] = [a[n], a[i]]; setLinks(a);
  };

  if (loading) return <div className="text-center py-12 text-slate-500">กำลังโหลด...</div>;

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-800 mb-1">🏠 Dashboard</h1>
      <p className="text-xs sm:text-sm text-slate-500 mb-4 sm:mb-6">ตั้งค่าด่วน — แก้ไขและบันทึกได้ทันที</p>

      {msg && <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium">{msg}</div>}

      {/* ===== Quick Stats ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {[
          { label: "หน้าเว็บ", value: pageCount, icon: "📄" },
          { label: "Sections", value: sectionCount, icon: "🧩" },
          { label: "เมนู", value: links.length, icon: "🧭" },
          { label: "แถบประกาศ", value: subActive ? "เปิด" : "ปิด", icon: "📢" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">{s.icon}</span>
            <div>
              <p className="text-[10px] sm:text-xs text-slate-400">{s.label}</p>
              <p className="text-base sm:text-lg font-bold text-slate-800">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ===== Quick Edit: Logo & Sizes ===== */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-red-600" /> โลโก้ & ขนาด
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-4">
            <ImageUpload label="รูปโลโก้" value={logoUrl} onChange={setLogoUrl} aspectRatio={logoRatio} onAspectRatioChange={setLogoRatio} />
            <div className="space-y-3">
              <div>
                <Label className="text-xs">ชื่อแบรนด์</Label>
                <Input className="mt-1 h-9" value={brandName} onChange={e => setBrandName(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">🖥️ โลโก้ Desktop</Label>
                  <div className="flex gap-1 mt-1">
                    {[32, 40, 48, 56, 64, 80].map(v => (
                      <button key={v} onClick={() => setLogoSize(v)} className={`text-[10px] px-1.5 py-1 rounded border ${logoSize === v ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-500 border-slate-200"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">📱 โลโก้ Mobile</Label>
                  <div className="flex gap-1 mt-1">
                    {[20, 24, 28, 32, 36, 40].map(v => (
                      <button key={v} onClick={() => setLogoSizeMobile(v)} className={`text-[10px] px-1.5 py-1 rounded border ${logoSizeMobile === v ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-500 border-slate-200"}`}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">🖥️ ความสูง Navbar</Label>
                  <div className="flex gap-1 mt-1">
                    {[48, 56, 64, 72, 80].map(v => (
                      <button key={v} onClick={() => setNavbarHeight(v)} className={`text-[10px] px-1.5 py-1 rounded border ${navbarHeight === v ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-500 border-slate-200"}`}>{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">📱 ความสูง Navbar Mobile</Label>
                  <div className="flex gap-1 mt-1">
                    {[36, 40, 44, 48, 52, 56].map(v => (
                      <button key={v} onClick={() => setNavbarHeightMobile(v)} className={`text-[10px] px-1.5 py-1 rounded border ${navbarHeightMobile === v ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-500 border-slate-200"}`}>{v}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Quick Edit: Navbar Colors ===== */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">🎨 สีเมนูบาร์</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "พื้นหลัง", value: navBgColor, set: setNavBgColor },
              { label: "ตัวอักษร", value: navTextColor, set: setNavTextColor },
              { label: "สีเน้น", value: navAccentColor, set: setNavAccentColor },
            ].map((c, i) => (
              <div key={i}>
                <Label className="text-xs">{c.label}</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={c.value} onChange={e => c.set(e.target.value)} className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0.5" />
                  <Input value={c.value} onChange={e => c.set(e.target.value)} className="flex-1 font-mono text-xs h-8" />
                </div>
              </div>
            ))}
          </div>
          {/* Mini preview */}
          <div className="mt-3 rounded-lg overflow-hidden border border-slate-200">
            <div className="h-0.5" style={{ background: `linear-gradient(to right, ${navAccentColor}, ${navAccentColor}88)` }} />
            <div className="flex items-center justify-between px-3 py-2" style={{ backgroundColor: navBgColor }}>
              <span className="text-xs font-bold text-white">{brandName}</span>
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: navTextColor }}>เมนู</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-white" style={{ backgroundColor: navAccentColor }}>CTA</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Quick Edit: Menu Links ===== */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Navigation className="w-4 h-4 text-red-600" /> รายการเมนู ({links.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {links.map((link, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400 w-4 text-center">{i + 1}</span>
              <Input className="flex-1 h-8 text-xs" value={link.label} onChange={e => updateLink(i, "label", e.target.value)} placeholder="ชื่อเมนู" />
              <Input className="flex-1 h-8 text-xs" value={link.href} onChange={e => updateLink(i, "href", e.target.value)} placeholder="/path หรือ #anchor" />
              <button onClick={() => moveLink(i, -1)} disabled={i === 0} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronUp className="w-3 h-3" /></button>
              <button onClick={() => moveLink(i, 1)} disabled={i === links.length - 1} className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30"><ChevronDown className="w-3 h-3" /></button>
              <button onClick={() => removeLink(i)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-3 h-3" /></button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLink} className="w-full border-dashed h-8 text-xs">
            <Plus className="w-3 h-3 mr-1" /> เพิ่มเมนู
          </Button>
        </CardContent>
      </Card>

      {/* ===== Quick Edit: Contact ===== */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Phone className="w-4 h-4 text-red-600" /> ช่องทางติดต่อ (Navbar)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
            <div><Label className="text-xs">เบอร์โทร</Label><Input className="mt-1 h-8 text-xs" value={phone} onChange={e => setPhone(e.target.value)} placeholder="080..." /></div>
            <div><Label className="text-xs">ข้อความปุ่มโทร</Label><Input className="mt-1 h-8 text-xs" value={phoneLabel} onChange={e => setPhoneLabel(e.target.value)} /></div>
            <div><Label className="text-xs">Line URL</Label><Input className="mt-1 h-8 text-xs" value={lineUrl} onChange={e => setLineUrl(e.target.value)} /></div>
            <div><Label className="text-xs">ข้อความปุ่ม Line</Label><Input className="mt-1 h-8 text-xs" value={lineLabel} onChange={e => setLineLabel(e.target.value)} /></div>
          </div>
        </CardContent>
      </Card>

      {/* ===== Quick Edit: Sub-header ===== */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">📢 แถบประกาศ</CardTitle>
            <label className="flex items-center gap-1.5 text-xs">
              <input type="checkbox" checked={subActive} onChange={e => setSubActive(e.target.checked)} className="rounded" />
              เปิดใช้งาน
            </label>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div><Label className="text-xs">ข้อความ</Label><Input className="mt-1 h-8 text-xs" value={subText} onChange={e => setSubText(e.target.value)} placeholder="โปรโมชั่น!..." /></div>
            <div><Label className="text-xs">ลิงก์</Label><Input className="mt-1 h-8 text-xs" value={subLinkUrl} onChange={e => setSubLinkUrl(e.target.value)} /></div>
            <div><Label className="text-xs">ข้อความลิงก์</Label><Input className="mt-1 h-8 text-xs" value={subLinkLabel} onChange={e => setSubLinkLabel(e.target.value)} /></div>
          </div>
          <div className="flex gap-1.5 mt-2">
            {[
              { value: "orange", bg: "bg-red-600" }, { value: "blue", bg: "bg-blue-600" },
              { value: "green", bg: "bg-green-600" }, { value: "red", bg: "bg-red-600" },
              { value: "slate", bg: "bg-slate-700" }, { value: "black", bg: "bg-black" },
            ].map(c => (
              <button key={c.value} onClick={() => setSubBgColor(c.value)} className={`w-6 h-6 rounded-full ${c.bg} border-2 transition-all ${subBgColor === c.value ? "border-red-400 scale-110 ring-2 ring-red-200" : "border-transparent"}`} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ===== Save Button ===== */}
      <Button onClick={() => setShowConfirm(true)} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 h-11 text-base mb-8">
        <Save className="w-5 h-5 mr-2" />
        {saving ? "กำลังบันทึก..." : "💾 บันทึกทั้งหมด"}
      </Button>

      {/* ===== Shortcut Cards ===== */}
      <h2 className="text-base sm:text-lg font-bold text-slate-700 mb-3">🔗 ตั้งค่าละเอียดเพิ่มเติม</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {[
          { href: "/admin/header", icon: "🧭", label: "เมนูบนสุด", desc: "Navbar ละเอียด" },
          { href: "/admin/responsive", icon: "📱", label: "ตั้งค่า Responsive", desc: "ขนาด UI ทุกส่วน" },
          { href: "/admin/footer", icon: "🔻", label: "ท้ายเว็บ", desc: "Footer" },
          { href: "/admin/pages", icon: "📄", label: "จัดการหน้าเว็บ", desc: `${pageCount} หน้า` },
          { href: "/admin/posts", icon: "📝", label: "บทความ", desc: "ข่าวสาร" },
          { href: "/admin/seo", icon: "🌐", label: "SEO", desc: "Google / Social" },
          { href: "/admin/contact", icon: "📞", label: "ช่องทางติดต่อ", desc: "โทร / Line" },
        ].map((item, i) => (
          <Link key={i} href={item.href} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md hover:border-red-200 transition-all group">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800 group-hover:text-red-700 transition-colors">{item.label}</p>
                <p className="text-[10px] text-slate-400">{item.desc}</p>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-red-400 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="ยืนยันการบันทึก"
        message="คุณต้องการบันทึกการตั้งค่าด่วนทั้งหมดหรือไม่?"
        onConfirm={() => { setShowConfirm(false); handleSave(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

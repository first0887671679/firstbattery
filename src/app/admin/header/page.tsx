"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, Trash2, ChevronUp, ChevronDown, ArrowLeft, Navigation } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

export default function HeaderEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [sectionId, setSectionId] = useState("");

  // Header data
  const [brandName, setBrandName] = useState("PORNPISIT BATTERY");
  const [brandSub, setBrandSub] = useState("");
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
  const [availablePages, setAvailablePages] = useState<any[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);

  // Sub-header data
  const [subSectionId, setSubSectionId] = useState("");
  const [subText, setSubText] = useState("");
  const [subLinkUrl, setSubLinkUrl] = useState("");
  const [subLinkLabel, setSubLinkLabel] = useState("");
  const [subBgColor, setSubBgColor] = useState("orange");
  const [subActive, setSubActive] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/pages");
      const pages = await res.json();
      const home = pages.find((p: any) => p.slug === "home");
      if (!home) return;

      // Set available pages for menu links
      setAvailablePages(pages);

      // Find header section
      const headerSec = home.sections.find((s: any) => s.type === "header");
      if (headerSec) {
        setSectionId(headerSec.id);
        const data = JSON.parse(headerSec.content || "{}");
        setBrandName(data.brandName || "");
        setBrandSub(data.brandSub || "");
        setPhone(data.phone || "");
        setPhoneLabel(data.phoneLabel || "โทรด่วน");
        setLineUrl(data.lineUrl || "");
        setLineLabel(data.lineLabel || "Line");
        setLinks(Array.isArray(data.links) ? data.links : []);
        setLogoUrl(headerSec.imageUrl || "");
        setLogoRatio(data.logoRatio || "free");
        setLogoSize(data.logoSize || 40);
        setLogoSizeMobile(data.logoSizeMobile || 28);
        setNavbarHeight(data.navbarHeight || 56);
        setNavbarHeightMobile(data.navbarHeightMobile || 48);
        setNavBgColor(data.navBgColor || "#0f172a");
        setNavTextColor(data.navTextColor || "#cbd5e1");
        setNavAccentColor(data.navAccentColor || "#dc2626");
      }

      // Find sub-header section
      const subSec = home.sections.find((s: any) => s.type === "sub-header");
      if (subSec) {
        setSubSectionId(subSec.id);
        const data = JSON.parse(subSec.content || "{}");
        setSubText(data.text || "");
        setSubLinkUrl(data.linkUrl || "");
        setSubLinkLabel(data.linkLabel || "");
        setSubBgColor(data.bgColor || "orange");
        setSubActive(subSec.isActive);
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
    if (!sectionId) return;
    setSaving(true);
    try {
      // Find pageId from home
      const pagesRes = await fetch("/api/pages");
      const pages = await pagesRes.json();
      const home = pages.find((p: any) => p.slug === "home");
      if (!home) return;

      // Save header
      const headerRes = await fetch(`/api/pages/${home.id}/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "header",
          title: "เมนูบนสุด",
          content: JSON.stringify({
            brandName,
            brandSub,
            phone,
            phoneLabel,
            lineUrl,
            lineLabel,
            links,
            logoRatio,
            logoSize,
            logoSizeMobile,
            navbarHeight,
            navbarHeightMobile,
            navBgColor,
            navTextColor,
            navAccentColor,
          }),
          imageUrl: logoUrl,
          isActive: true,
        }),
      });
      if (!headerRes.ok) {
        const err = await headerRes.json().catch(() => ({}));
        throw new Error(err.error || `HTTP ${headerRes.status}`);
      }

      // Save sub-header if exists
      if (subSectionId) {
        const subRes = await fetch(`/api/pages/${home.id}/sections/${subSectionId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "sub-header",
            title: "แถบประกาศ",
            content: JSON.stringify({
              text: subText,
              linkUrl: subLinkUrl,
              linkLabel: subLinkLabel,
              bgColor: subBgColor,
            }),
            isActive: subActive,
          }),
        });
        if (!subRes.ok) {
          const err = await subRes.json().catch(() => ({}));
          throw new Error(err.error || `HTTP ${subRes.status}`);
        }
      }

      showMsg("บันทึกสำเร็จ!");
    } catch (e: any) {
      console.error(e);
      showMsg("เกิดข้อผิดพลาด: " + (e.message || "ไม่สามารถบันทึกได้"));
    } finally {
      setSaving(false);
    }
  };

  const addLink = () => setLinks([...links, { label: "", href: "" }]);
  const removeLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));
  const updateLink = (idx: number, field: "label" | "href", value: string) => {
    setLinks(links.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  };
  const moveLink = (idx: number, dir: number) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= links.length) return;
    const arr = [...links];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setLinks(arr);
  };

  // Sub-menu (children) helpers
  const addChild = (parentIdx: number) => {
    setLinks(links.map((l, i) => i === parentIdx ? { ...l, children: [...(l.children || []), { label: "", href: "" }] } : l));
  };
  const removeChild = (parentIdx: number, childIdx: number) => {
    setLinks(links.map((l, i) => i === parentIdx ? { ...l, children: (l.children || []).filter((_, ci) => ci !== childIdx) } : l));
  };
  const updateChild = (parentIdx: number, childIdx: number, field: "label" | "href", value: string) => {
    setLinks(links.map((l, i) => i === parentIdx ? { ...l, children: (l.children || []).map((c, ci) => ci === childIdx ? { ...c, [field]: value } : c) } : l));
  };
  const moveChild = (parentIdx: number, childIdx: number, dir: number) => {
    const children = [...(links[parentIdx].children || [])];
    const newIdx = childIdx + dir;
    if (newIdx < 0 || newIdx >= children.length) return;
    [children[childIdx], children[newIdx]] = [children[newIdx], children[childIdx]];
    setLinks(links.map((l, i) => i === parentIdx ? { ...l, children } : l));
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
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Navigation className="w-6 h-6 text-red-600" />
            จัดการเมนูบนสุด
          </h1>
          <p className="text-sm text-slate-500">แก้ไข Navbar และแถบประกาศ</p>
        </div>
      </div>

      {msg && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium">{msg}</div>
      )}

      {/* Header / Navbar */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">🧭 Navbar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">ชื่อแบรนด์</Label>
              <Input className="mt-1" value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="PORNPISIT BATTERY" />
            </div>
            <div>
              <Label className="text-sm">คำอธิบายใต้โลโก้</Label>
              <Input className="mt-1" value={brandSub} onChange={(e) => setBrandSub(e.target.value)} placeholder="บริการรถยนต์ 24 ชม." />
            </div>
          </div>

          <ImageUpload
            label="รูปโลโก้ (ถ้ามี)"
            value={logoUrl}
            onChange={setLogoUrl}
            aspectRatio={logoRatio}
            onAspectRatioChange={setLogoRatio}
          />

          {/* Desktop sizes */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">🖥️ ขนาด Desktop</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">ขนาดโลโก้ (px)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={20}
                    max={200}
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value) || 40)}
                    className="w-24"
                  />
                  <span className="text-xs text-slate-400">px (ค่าเริ่มต้น 40)</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {[24, 32, 40, 48, 56, 64, 80].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setLogoSize(v)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${
                        logoSize === v ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-600 border-slate-200 hover:border-red-300"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm">ความสูงแถบเมนู (px)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={40}
                    max={120}
                    value={navbarHeight}
                    onChange={(e) => setNavbarHeight(Number(e.target.value) || 56)}
                    className="w-24"
                  />
                  <span className="text-xs text-slate-400">px (ค่าเริ่มต้น 56)</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {[40, 48, 56, 64, 72, 80].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setNavbarHeight(v)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${
                        navbarHeight === v ? "bg-red-600 text-white border-red-600" : "bg-white text-slate-600 border-slate-200 hover:border-red-300"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile sizes */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">📱 ขนาดบนมือถือ (Responsive)</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">ขนาดโลโก้มือถือ (px)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={16}
                    max={80}
                    value={logoSizeMobile}
                    onChange={(e) => setLogoSizeMobile(Number(e.target.value) || 28)}
                    className="w-24"
                  />
                  <span className="text-xs text-slate-400">px (ค่าเริ่มต้น 28)</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {[20, 24, 28, 32, 36, 40].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setLogoSizeMobile(v)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${
                        logoSizeMobile === v ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm">ความสูงแถบเมนูมือถือ (px)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="number"
                    min={36}
                    max={80}
                    value={navbarHeightMobile}
                    onChange={(e) => setNavbarHeightMobile(Number(e.target.value) || 48)}
                    className="w-24"
                  />
                  <span className="text-xs text-slate-400">px (ค่าเริ่มต้น 48)</span>
                </div>
                <div className="flex gap-1 mt-1.5">
                  {[36, 40, 44, 48, 52, 56].map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setNavbarHeightMobile(v)}
                      className={`text-xs px-2 py-1 rounded border transition-all ${
                        navbarHeightMobile === v ? "bg-blue-500 text-white border-blue-500" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Preview */}
            <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[10px] text-slate-400 mb-2">ตัวอย่าง: มือถือ → Desktop</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: navBgColor }}>
                  <div className="rounded bg-slate-500" style={{ width: logoSizeMobile * 1.5, height: logoSizeMobile, opacity: 0.5 }} />
                  <span className="text-[10px]" style={{ color: navTextColor }}>📱 {logoSizeMobile}px / {navbarHeightMobile}px</span>
                </div>
                <span className="text-slate-300">→</span>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ backgroundColor: navBgColor }}>
                  <div className="rounded bg-slate-500" style={{ width: logoSize * 1.5, height: logoSize, opacity: 0.5 }} />
                  <span className="text-[10px]" style={{ color: navTextColor }}>🖥️ {logoSize}px / {navbarHeight}px</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navbar Colors */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">🎨 สีเมนูบาร์</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-sm">สีพื้นหลัง</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={navBgColor} onChange={(e) => setNavBgColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                  <Input value={navBgColor} onChange={(e) => setNavBgColor(e.target.value)} className="flex-1 font-mono text-xs" placeholder="#0f172a" />
                </div>
              </div>
              <div>
                <Label className="text-sm">สีตัวอักษร</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={navTextColor} onChange={(e) => setNavTextColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                  <Input value={navTextColor} onChange={(e) => setNavTextColor(e.target.value)} className="flex-1 font-mono text-xs" placeholder="#cbd5e1" />
                </div>
              </div>
              <div>
                <Label className="text-sm">สีเน้น (ปุ่ม/ขีดเส้น)</Label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={navAccentColor} onChange={(e) => setNavAccentColor(e.target.value)} className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer p-0.5" />
                  <Input value={navAccentColor} onChange={(e) => setNavAccentColor(e.target.value)} className="flex-1 font-mono text-xs" placeholder="#dc2626" />
                </div>
              </div>
            </div>
            {/* Preview bar */}
            <div className="mt-3 rounded-xl overflow-hidden border border-slate-200">
              <div className="h-1" style={{ background: `linear-gradient(to right, ${navAccentColor}, ${navAccentColor}88, ${navAccentColor})` }} />
              <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: navBgColor }}>
                <span className="text-sm font-bold" style={{ color: '#ffffff' }}>ตัวอย่าง Navbar</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: navTextColor }}>เมนู 1</span>
                  <span className="text-xs" style={{ color: navTextColor }}>เมนู 2</span>
                  <span className="text-xs font-bold px-2 py-1 rounded-md text-white" style={{ backgroundColor: navAccentColor }}>ปุ่ม CTA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">เบอร์โทร</Label>
              <Input className="mt-1" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0996731296" />
            </div>
            <div>
              <Label className="text-sm">ข้อความปุ่มโทร</Label>
              <Input className="mt-1" value={phoneLabel} onChange={(e) => setPhoneLabel(e.target.value)} placeholder="โทรด่วน" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">Line URL</Label>
              <Input className="mt-1" value={lineUrl} onChange={(e) => setLineUrl(e.target.value)} placeholder="https://lin.ee/OBB86S4" />
            </div>
            <div>
              <Label className="text-sm">ข้อความปุ่ม Line</Label>
              <Input className="mt-1" value={lineLabel} onChange={(e) => setLineLabel(e.target.value)} placeholder="Line" />
            </div>
          </div>

          {/* Menu Links */}
          <div className="border-t pt-4">
            <p className="text-sm font-semibold text-slate-700 mb-3">รายการเมนู</p>
            {links.map((link, idx) => (
              <div key={idx} className="mb-3 p-3 border rounded-lg bg-slate-50">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-5 text-center font-bold">{idx + 1}</span>
                    <Input className="flex-1" value={link.label} onChange={(e) => updateLink(idx, "label", e.target.value)} placeholder="ชื่อเมนู" />
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={idx === 0} onClick={() => moveLink(idx, -1)}>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={idx === links.length - 1} onClick={() => moveLink(idx, 1)}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500" onClick={() => removeLink(idx)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 w-5 text-center">🔗</span>
                    <select 
                      value={link.href.startsWith('/') && availablePages.some(p => `/${p.slug}` === link.href) ? link.href : link.href === '#' ? '#' : 'custom'}
                      onChange={(e) => updateLink(idx, "href", e.target.value === 'custom' ? '' : e.target.value)}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="">เลือกหน้าเว็บ...</option>
                      <option value="#">--- ไม่มีลิงก์ (แค่ dropdown) ---</option>
                      {availablePages.map((page: any) => (
                        <option key={page.id} value={`/${page.slug}`}>
                          {page.title} (/{page.slug})
                        </option>
                      ))}
                      <option value="custom">--- ใส่ URL ด้วยตนเอง ---</option>
                    </select>
                  </div>
                  {(link.href === 'custom' || (link.href !== '#' && !link.href.startsWith('/') || (link.href.startsWith('/') && !availablePages.some(p => `/${p.slug}` === link.href) && link.href !== '#'))) && link.href !== '' && link.href !== '#' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 w-5 text-center">🔗</span>
                      <Input 
                        className="flex-1" 
                        value={link.href} 
                        onChange={(e) => updateLink(idx, "href", e.target.value)} 
                        placeholder="URL หรือ #anchor เช่น /about, #contact, https://example.com" 
                      />
                    </div>
                  )}
                </div>

                {/* Sub-menu items */}
                <div className="mt-3 pt-3 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                    <ChevronDown className="w-3 h-3" /> เมนูย่อย ({(link.children || []).length} รายการ)
                  </p>
                  {(link.children || []).map((child, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-2 mb-2 ml-4 p-2 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-300 w-4 text-center">{cIdx + 1}</span>
                      <Input className="flex-1 h-8 text-sm" value={child.label} onChange={(e) => updateChild(idx, cIdx, "label", e.target.value)} placeholder="ชื่อเมนูย่อย" />
                      <select
                        value={child.href.startsWith('/') && availablePages.some(p => `/${p.slug}` === child.href) ? child.href : 'custom'}
                        onChange={(e) => updateChild(idx, cIdx, "href", e.target.value === 'custom' ? '' : e.target.value)}
                        className="w-40 rounded-md border border-input bg-background px-2 py-1 text-xs h-8"
                      >
                        <option value="">เลือกหน้า...</option>
                        {availablePages.map((page: any) => (
                          <option key={page.id} value={`/${page.slug}`}>
                            {page.title} (/{page.slug})
                          </option>
                        ))}
                        <option value="custom">ใส่ URL เอง</option>
                      </select>
                      {(child.href === 'custom' || (child.href && !child.href.startsWith('/')) || (child.href.startsWith('/') && !availablePages.some(p => `/${p.slug}` === child.href))) && child.href !== '' && (
                        <Input className="w-36 h-8 text-xs" value={child.href} onChange={(e) => updateChild(idx, cIdx, "href", e.target.value)} placeholder="/url" />
                      )}
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={cIdx === 0} onClick={() => moveChild(idx, cIdx, -1)}>
                        <ChevronUp className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={cIdx === (link.children || []).length - 1} onClick={() => moveChild(idx, cIdx, 1)}>
                        <ChevronDown className="w-3 h-3" />
                      </Button>
                      <Button type="button" variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-400" onClick={() => removeChild(idx, cIdx)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="ghost" size="sm" onClick={() => addChild(idx)} className="ml-4 text-xs border border-dashed border-slate-300 text-slate-500 hover:text-red-600 hover:border-red-300">
                    <Plus className="w-3 h-3 mr-1" /> เพิ่มเมนูย่อย
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addLink} className="w-full border-dashed mt-1">
              <Plus className="w-4 h-4 mr-1" /> เพิ่มเมนู
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sub-header / Announcement bar */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">📢 แถบประกาศ</CardTitle>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={subActive} onChange={(e) => setSubActive(e.target.checked)} className="rounded" />
              เปิดใช้งาน
            </label>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-sm">ข้อความ</Label>
            <Input className="mt-1" value={subText} onChange={(e) => setSubText(e.target.value)} placeholder="โปรโมชั่น! ลด 20%..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-sm">ลิงก์ (ถ้ามี)</Label>
              <Input className="mt-1" value={subLinkUrl} onChange={(e) => setSubLinkUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <Label className="text-sm">ข้อความลิงก์</Label>
              <Input className="mt-1" value={subLinkLabel} onChange={(e) => setSubLinkLabel(e.target.value)} placeholder="ดูรายละเอียด" />
            </div>
          </div>
          <div>
            <Label className="text-sm">สีพื้นหลัง</Label>
            <div className="flex gap-2 mt-1.5">
              {[
                { value: "orange", bg: "bg-red-600" },
                { value: "blue", bg: "bg-blue-600" },
                { value: "green", bg: "bg-green-600" },
                { value: "red", bg: "bg-red-600" },
                { value: "slate", bg: "bg-slate-700" },
                { value: "black", bg: "bg-black" },
              ].map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setSubBgColor(c.value)}
                  className={`w-8 h-8 rounded-full ${c.bg} border-2 transition-all ${subBgColor === c.value ? "border-red-400 scale-110 ring-2 ring-red-200" : "border-transparent"}`}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <Button onClick={() => setShowConfirm(true)} disabled={saving} className="w-full bg-red-600 hover:bg-red-700 h-12 text-base">
        <Save className="w-5 h-5 mr-2" />
        {saving ? "กำลังบันทึก..." : "บันทึกทั้งหมด"}
      </Button>

      <ConfirmDialog
        open={showConfirm}
        title="ยืนยันการบันทึก"
        message="คุณต้องการบันทึกการแก้ไขเมนูบนสุดและแถบประกาศหรือไม่?"
        onConfirm={() => { setShowConfirm(false); handleSave(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

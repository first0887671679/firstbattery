"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, ArrowLeft, Eye, EyeOff, Globe, Search, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import RichTextEditor from "@/components/admin/RichTextEditor";

export default function PostEditor() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;
  const isNew = postId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(false);
  const [author, setAuthor] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");
  const [ogTitle, setOgTitle] = useState("");
  const [ogDescription, setOgDescription] = useState("");
  const [showSeo, setShowSeo] = useState(false);

  const fetchPost = useCallback(async () => {
    try {
      const res = await fetch(`/api/posts/${postId}`);
      if (!res.ok) {
        router.push("/admin/posts");
        return;
      }
      const data = await res.json();
      setTitle(data.title || "");
      setSlug(data.slug || "");
      setExcerpt(data.excerpt || "");
      setContent(data.content || "");
      setCoverImage(data.coverImage || "");
      setCategory(data.category || "");
      setTags(data.tags || "");
      setPublished(data.published || false);
      setAuthor(data.author || "");
      setSeoTitle(data.seoTitle || "");
      setSeoDescription(data.seoDescription || "");
      setSeoKeywords(data.seoKeywords || "");
      setOgTitle(data.ogTitle || "");
      setOgDescription(data.ogDescription || "");
    } catch {
      router.push("/admin/posts");
    } finally {
      setLoading(false);
    }
  }, [postId, router]);

  useEffect(() => {
    if (!isNew) fetchPost();
  }, [isNew, fetchPost]);

  // Auto-generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (isNew || !slug) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setMessage("กรุณาใส่หัวข้อบทความ");
      return;
    }
    if (!slug.trim()) {
      setMessage("กรุณาใส่ slug");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const body = { title, slug, excerpt, content, coverImage, category, tags, published, author, seoTitle, seoDescription, seoKeywords, ogTitle, ogDescription };

      let res;
      if (isNew) {
        res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch(`/api/posts/${postId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        const data = await res.json();
        setMessage("บันทึกสำเร็จ!");
        if (isNew) {
          router.push(`/admin/posts/${data.id}`);
        }
      } else {
        const err = await res.json();
        setMessage(err.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setMessage("เกิดข้อผิดพลาด");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-slate-800">กำลังโหลด...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/posts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" /> กลับ
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-800">
            {isNew ? "เขียนบทความใหม่" : "แก้ไขบทความ"}
          </h1>
        </div>
        <Button
          variant={published ? "default" : "outline"}
          size="sm"
          onClick={() => setPublished(!published)}
          className={published ? "bg-green-600 hover:bg-green-700" : ""}
        >
          {published ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
          {published ? "เผยแพร่แล้ว" : "แบบร่าง"}
        </Button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${message.includes("สำเร็จ") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message}
        </div>
      )}

      {/* Main form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div>
                <Label className="text-sm font-medium">หัวข้อบทความ *</Label>
                <Input
                  className="mt-1 text-lg font-semibold"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="เช่น วิธีดูแลแบตเตอรี่รถยนต์ให้อายุยืน"
                />
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" /> Slug (URL)
                </Label>
                <Input
                  className="mt-1 font-mono text-sm"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-slate-400 mt-1">URL: /posts/{slug || "..."}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">เนื้อหาย่อ (Excerpt)</Label>
                <textarea
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="สรุปสั้นๆ ของบทความ (แสดงในหน้ารายการ)"
                />
              </div>

              <div>
                <Label className="text-sm font-medium">เนื้อหาบทความ</Label>
                <div className="mt-1">
                  <RichTextEditor value={content} onChange={setContent} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">รูปภาพปก</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUpload
                value={coverImage}
                onChange={setCoverImage}
                showAspectRatio={false}
              />
              <p className="text-xs text-slate-400 mt-2">📐 แนะนำขนาด <strong>1200 × 630 px</strong> (อัตราส่วน 1.91:1) เพื่อแสดงผลสวยงามบน Facebook และ Google</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-slate-600">รายละเอียด</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-xs">หมวดหมู่</Label>
                <Input
                  className="mt-1"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="เช่น ความรู้, ข่าวสาร, โปรโมชั่น"
                />
              </div>
              <div>
                <Label className="text-xs">แท็ก (คั่นด้วยเครื่องหมาย ,)</Label>
                <Input
                  className="mt-1"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="เช่น แบตเตอรี่, รถยนต์, ดูแลรถ"
                />
              </div>
              <div>
                <Label className="text-xs">ผู้เขียน</Label>
                <Input
                  className="mt-1"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="เช่น ทีม PORNPISIT BATTERY"
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Section */}
          <Card>
            <CardHeader className="pb-3 cursor-pointer" onClick={() => setShowSeo(!showSeo)}>
              <CardTitle className="text-sm font-semibold text-slate-600 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><Search className="w-4 h-4" /> SEO / โซเชียล</span>
                {showSeo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </CardTitle>
            </CardHeader>
            {showSeo && (
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-xs">SEO Title</Label>
                  <Input className="mt-1" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={title || "หัวข้อสำหรับ Google (ไม่ใส่ = ใช้ชื่อบทความ)"} />
                  <p className="text-xs text-slate-400 mt-0.5">{(seoTitle || title).length}/60 ตัวอักษร</p>
                </div>
                <div>
                  <Label className="text-xs">SEO Description</Label>
                  <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" rows={2} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder={excerpt || "คำอธิบายสำหรับ Google (ไม่ใส่ = ใช้เนื้อหาย่อ)"} />
                  <p className="text-xs text-slate-400 mt-0.5">{(seoDescription || excerpt).length}/160 ตัวอักษร</p>
                </div>
                <div>
                  <Label className="text-xs">Keywords (คั่นด้วย ,)</Label>
                  <Input className="mt-1" value={seoKeywords} onChange={(e) => setSeoKeywords(e.target.value)} placeholder="เช่น แบตเตอรี่, รถยนต์" />
                </div>
                <hr className="border-slate-100" />
                <p className="text-xs font-medium text-slate-500">Open Graph (Facebook / LINE)</p>
                <div>
                  <Label className="text-xs">OG Title</Label>
                  <Input className="mt-1" value={ogTitle} onChange={(e) => setOgTitle(e.target.value)} placeholder={seoTitle || title || "หัวข้อสำหรับ Facebook"} />
                </div>
                <div>
                  <Label className="text-xs">OG Description</Label>
                  <textarea className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" rows={2} value={ogDescription} onChange={(e) => setOgDescription(e.target.value)} placeholder={seoDescription || excerpt || "คำอธิบายสำหรับ Facebook"} />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Save Button */}
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={saving}
            className="w-full bg-red-600 hover:bg-red-700 h-12 text-base"
          >
            <Save className="w-5 h-5 mr-2" />
            {saving ? "กำลังบันทึก..." : isNew ? "สร้างบทความ" : "บันทึกบทความ"}
          </Button>

          {!isNew && slug && (
            <Link href={`/posts/${slug}`} target="_blank" className="block">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" /> ดูตัวอย่างหน้าเว็บ
              </Button>
            </Link>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        title="ยืนยันการบันทึก"
        message={isNew ? "คุณต้องการสร้างบทความใหม่หรือไม่?" : "คุณต้องการบันทึกการแก้ไขบทความหรือไม่?"}
        onConfirm={() => { setShowConfirm(false); handleSave(); }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  );
}

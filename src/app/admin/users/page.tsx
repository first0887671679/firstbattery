"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Edit, Trash2, UserPlus, Shield, Mail, Eye, EyeOff, X, Check, Loader2 } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<{ text: string; type: "ok" | "err" } | null>(null);

  // Add form
  const [showAdd, setShowAdd] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addName, setAddName] = useState("");
  const [addPass, setAddPass] = useState("");
  const [addShowPass, setAddShowPass] = useState(false);
  const [adding, setAdding] = useState(false);

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editEmail, setEditEmail] = useState("");
  const [editName, setEditName] = useState("");
  const [editPass, setEditPass] = useState("");
  const [editShowPass, setEditShowPass] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) setUsers(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const flash = (text: string, type: "ok" | "err" = "ok") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 3000);
  };

  const handleAdd = async () => {
    if (!addEmail || !addPass) { flash("กรุณากรอก Email และ Password", "err"); return; }
    if (addPass.length < 6) { flash("Password ต้องมีอย่างน้อย 6 ตัวอักษร", "err"); return; }
    setAdding(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: addEmail, name: addName, password: addPass }),
      });
      if (res.ok) {
        flash("เพิ่มผู้ดูแลสำเร็จ");
        setAddEmail(""); setAddName(""); setAddPass(""); setShowAdd(false);
        fetchUsers();
      } else {
        const data = await res.json();
        flash(data.error || "เกิดข้อผิดพลาด", "err");
      }
    } catch { flash("เกิดข้อผิดพลาด", "err"); }
    finally { setAdding(false); }
  };

  const startEdit = (user: AdminUser) => {
    setEditId(user.id);
    setEditEmail(user.email);
    setEditName(user.name || "");
    setEditPass("");
    setEditShowPass(false);
  };

  const cancelEdit = () => { setEditId(null); };

  const handleSave = async () => {
    if (!editId || !editEmail) { flash("กรุณากรอก Email", "err"); return; }
    if (editPass && editPass.length < 6) { flash("Password ต้องมีอย่างน้อย 6 ตัวอักษร", "err"); return; }
    setSaving(true);
    try {
      const body: Record<string, string> = { email: editEmail, name: editName };
      if (editPass) body.password = editPass;
      const res = await fetch(`/api/users/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        flash("บันทึกสำเร็จ");
        setEditId(null);
        fetchUsers();
      } else {
        const data = await res.json();
        flash(data.error || "เกิดข้อผิดพลาด", "err");
      }
    } catch { flash("เกิดข้อผิดพลาด", "err"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/users/${deleteId}`, { method: "DELETE" });
      if (res.ok) {
        flash("ลบผู้ดูแลสำเร็จ");
        fetchUsers();
      } else {
        const data = await res.json();
        flash(data.error || "เกิดข้อผิดพลาด", "err");
      }
    } catch { flash("เกิดข้อผิดพลาด", "err"); }
    finally { setDeleteId(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        <span className="ml-2 text-slate-500">กำลังโหลด...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-red-600" />
            ผู้ดูแลระบบ
          </h1>
          <p className="text-sm text-slate-500 mt-1">จัดการบัญชีผู้ดูแล ({users.length} คน)</p>
        </div>
        <Button
          onClick={() => setShowAdd(!showAdd)}
          className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
        >
          {showAdd ? <X className="w-4 h-4 mr-2" /> : <UserPlus className="w-4 h-4 mr-2" />}
          {showAdd ? "ยกเลิก" : "เพิ่มผู้ดูแล"}
        </Button>
      </div>

      {msg && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium ${
          msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
        }`}>
          {msg.text}
        </div>
      )}

      {/* ── Add Form ── */}
      {showAdd && (
        <Card className="mb-6 border-red-200 border-2">
          <CardContent className="pt-5 pb-4 space-y-3">
            <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-red-600" />
              เพิ่มผู้ดูแลใหม่
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">ชื่อ</Label>
                <Input
                  className="mt-1"
                  placeholder="ชื่อผู้ดูแล"
                  value={addName}
                  onChange={(e) => setAddName(e.target.value)}
                />
              </div>
              <div>
                <Label className="text-xs">Email <span className="text-red-500">*</span></Label>
                <Input
                  className="mt-1"
                  type="email"
                  placeholder="admin@pornpisitbattery.com"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Password <span className="text-red-500">*</span> (อย่างน้อย 6 ตัวอักษร)</Label>
              <div className="relative mt-1">
                <Input
                  type={addShowPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={addPass}
                  onChange={(e) => setAddPass(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setAddShowPass(!addShowPass)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {addShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              onClick={handleAdd}
              disabled={adding}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {adding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              {adding ? "กำลังเพิ่ม..." : "เพิ่มผู้ดูแล"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── Users List ── */}
      {users.length === 0 ? (
        <div className="text-center py-16 text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
          <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">ยังไม่มีผู้ดูแล</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className="transition-shadow hover:shadow-md">
              <CardContent className="py-4 px-4">
                {editId === user.id ? (
                  /* ── Inline Edit Mode ── */
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">ชื่อ</Label>
                        <Input
                          className="mt-1"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          placeholder="ชื่อผู้ดูแล"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Email</Label>
                        <Input
                          className="mt-1"
                          type="email"
                          value={editEmail}
                          onChange={(e) => setEditEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Password ใหม่ (เว้นว่างถ้าไม่เปลี่ยน)</Label>
                      <div className="relative mt-1">
                        <Input
                          type={editShowPass ? "text" : "password"}
                          placeholder="เว้นว่างถ้าไม่ต้องการเปลี่ยน"
                          value={editPass}
                          onChange={(e) => setEditPass(e.target.value)}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setEditShowPass(!editShowPass)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {editShowPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} disabled={saving} size="sm" className="bg-green-600 hover:bg-green-700">
                        {saving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
                        บันทึก
                      </Button>
                      <Button onClick={cancelEdit} variant="outline" size="sm">
                        <X className="w-4 h-4 mr-1" /> ยกเลิก
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* ── View Mode ── */
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-red-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                        {user.name || "ไม่มีชื่อ"}
                      </p>
                      <p className="text-xs text-slate-400 flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {user.email}
                      </p>
                      <p className="text-[10px] text-slate-300 mt-0.5">
                        สร้างเมื่อ {new Date(user.createdAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => startEdit(user)} title="แก้ไข">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                        onClick={() => setDeleteId(user.id)}
                        title="ลบ"
                        disabled={users.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ── Info Note ── */}
      <div className="mt-6 p-4 bg-blue-50 rounded-xl text-xs text-blue-700 space-y-1">
        <p className="font-semibold">คำแนะนำ:</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>ผู้ดูแลทุกคนมีสิทธิ์เท่ากันในการจัดการข้อมูลทั้งหมด</li>
          <li>ไม่สามารถลบผู้ดูแลคนสุดท้ายได้</li>
          <li>Password ต้องมีอย่างน้อย 6 ตัวอักษร</li>
          <li>หลังเปลี่ยน Password จะต้อง Login ใหม่</li>
        </ul>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="ยืนยันการลบผู้ดูแล"
        message="คุณต้องการลบผู้ดูแลระบบนี้หรือไม่? การลบจะไม่สามารถกู้คืนได้"
        confirmLabel="ลบ"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

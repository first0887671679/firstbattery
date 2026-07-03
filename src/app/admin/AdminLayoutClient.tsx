"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Phone, Users, LogOut, PanelLeft, Navigation,
  ChevronDown, FileText, Smartphone, Eye, Menu, X, Home,
} from "lucide-react";

import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { group: null, items: [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  ]},
  { group: "จัดการเนื้อหา", items: [
    { href: "/admin/header", icon: Navigation, label: "เมนูบนสุด" },
    { href: "/admin/footer", icon: ChevronDown, label: "ท้ายเว็บ (Footer)" },
    { href: "/admin/pages", icon: PanelLeft, label: "จัดการหน้าเว็บ" },
    { href: "/admin/posts", icon: FileText, label: "บทความ / ข่าวสาร" },
  ]},
  { group: "ตั้งค่า", items: [
    { href: "/admin/indexing", icon: Eye, label: "ควบคุมการ Index" },
    { href: "/admin/responsive", icon: Smartphone, label: "ตั้งค่า Responsive" },
    { href: "/admin/contact", icon: Phone, label: "ช่องทางติดต่อ" },
    { href: "/admin/users", icon: Users, label: "ผู้ดูแลระบบ" },
  ]},
];

function NavLink({ href, icon: Icon, label, active, onClick }: {
  href: string; icon: any; label: string; active: boolean; onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
        active
          ? "bg-red-600/15 text-red-400 font-semibold"
          : "text-slate-400 hover:bg-slate-800 hover:text-white"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Home size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white leading-none">PORNPISIT BATTERY</h2>
            <p className="text-[10px] text-slate-500 leading-none mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((section, si) => (
          <div key={si}>
            {section.group && (
              <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-wider px-4 pt-4 pb-1.5">
                {section.group}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href + "/"))}
                onClick={onNavigate}
              />
            ))}
          </div>
        ))}
      </nav>

      <div className="px-3 py-3 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={18} />
          ออกจากระบบ
        </button>
      </div>
    </>
  );
}

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className="min-h-screen bg-slate-50 admin-light">
      {/* ── Desktop Sidebar ── */}
      <aside className="fixed inset-y-0 left-0 z-30 w-60 bg-slate-900 text-white hidden lg:flex flex-col">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* ── Mobile Overlay ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile Drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col transform transition-transform duration-200 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X size={20} />
        </button>
        <SidebarContent pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      {/* ── Main Area ── */}
      <div className="lg:pl-60 min-h-screen flex flex-col">
        {/* Mobile Top Bar */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center gap-3 lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="p-2 -ml-2 rounded-lg text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            <Menu size={22} />
          </button>
          <h1 className="text-sm font-bold text-slate-800">PORNPISIT BATTERY Admin</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

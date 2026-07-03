"use client";

import Link from "next/link";
import { PhoneCall, MessageCircle, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { trackPhoneClick, trackLineClick } from "@/lib/gtm";

const navLinks = [
  { label: "หน้าแรก", href: "/" },
  { label: "เปลี่ยนแบตเตอรี่", href: "/battery-replacement" },
  { label: "เช็คราคาแบต", href: "/check-price" },
  { label: "บทความ", href: "/posts" },
  { label: "ติดต่อเรา", href: "/contact-us" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-3xl font-extrabold text-red-600">PORNPISIT BATTERY</span>
          <span className="hidden sm:inline text-base text-gray-500 font-medium">บริการแบตเตอรี่ 24 ชม.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white" asChild>
            <Link href="tel:0996731296" onClick={trackPhoneClick}>
              <PhoneCall className="mr-1 w-4 h-4" />
              โทรด่วน
            </Link>
          </Button>
          <Button size="sm" className="bg-[#00B900] hover:bg-[#009900] text-white" asChild>
            <Link href="https://lin.ee/OBB86S4" target="_blank" rel="noopener noreferrer" onClick={trackLineClick}>
              <MessageCircle className="mr-1 w-4 h-4" />
              Line
            </Link>
          </Button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <nav className="flex flex-col gap-3 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-red-600 font-medium py-2"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { PhoneCall, MessageCircle, Menu, X, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface NavChild {
  label: string;
  href: string;
}

interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

interface DynamicNavbarProps {
  brandName: string;
  brandSub: string;
  logoUrl: string;
  phone: string;
  phoneLabel: string;
  lineUrl: string;
  lineLabel: string;
  links: NavLink[];
  logoSize?: number;
  logoSizeMobile?: number;
  navbarHeight?: number;
  navbarHeightMobile?: number;
  navBgColor?: string;
  navTextColor?: string;
  navAccentColor?: string;
}

export default function DynamicNavbar({
  brandName,
  brandSub,
  logoUrl,
  phone,
  phoneLabel,
  lineUrl,
  lineLabel,
  links,
  logoSize = 60,
  logoSizeMobile = 40,
  navbarHeight = 80,
  navbarHeightMobile = 60,
  navBgColor = "#ffffff",
  navTextColor = "#334155",
  navAccentColor = "#dc2626",
}: DynamicNavbarProps) {
  const bgHex = navBgColor || "#ffffff";
  const textHex = navTextColor || "#334155";
  const accentHex = navAccentColor || "#dc2626";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<number | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleDropdownEnter = (idx: number) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(idx);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md shadow-2xl shadow-black/30" : ""
      }`}
      style={{ backgroundColor: scrolled ? `${bgHex}f7` : bgHex }}
    >
      {/* Accent line top */}
      <div className="h-0.5" style={{ background: `linear-gradient(to right, ${accentHex}, ${accentHex}88, ${accentHex})` }} />

      <style>{`
        .dyn-navbar-inner { height: ${navbarHeightMobile}px; }
        @media (min-width: 640px) { .dyn-navbar-inner { height: ${Math.round((navbarHeightMobile + navbarHeight) / 2)}px; } }
        @media (min-width: 768px) { .dyn-navbar-inner { height: ${navbarHeight}px; } }
        .dyn-navbar-logo { height: ${logoSizeMobile}px; }
        @media (min-width: 640px) { .dyn-navbar-logo { height: ${Math.round((logoSizeMobile + logoSize) / 2)}px; } }
        @media (min-width: 768px) { .dyn-navbar-logo { height: ${logoSize}px; } }
      `}</style>

      <div className="dyn-navbar-inner max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
          {logoUrl ? (
            <div className="relative">
              <Image
                src={logoUrl}
                alt={brandName}
                width={logoSize * 2}
                height={logoSize * 2}
                quality={75}
                priority
                className="dyn-navbar-logo object-contain drop-shadow-sm"
                style={{ width: "auto" }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}cc)`, boxShadow: `0 4px 14px ${accentHex}40` }}>
                <span className="text-white font-black text-base">P</span>
              </div>
              <span className="text-xl font-black tracking-tight" style={{ color: '#0f172a' }}>
                {brandName}
              </span>
            </div>
          )}
          {brandSub && !logoUrl && (
            <span className="hidden lg:block text-xs font-medium pl-3" style={{ color: `${textHex}99`, borderLeft: `1px solid ${textHex}33` }}>
              {brandSub}
            </span>
          )}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {links.map((link, idx) => {
            const hasChildren = link.children && link.children.length > 0;

            if (hasChildren) {
              return (
                <div
                  key={`${link.href}-${idx}`}
                  className="relative"
                  onMouseEnter={() => handleDropdownEnter(idx)}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    className="relative flex items-center gap-1 px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg group"
                    style={{ color: openDropdown === idx ? '#ffffff' : textHex, backgroundColor: openDropdown === idx ? `${textHex}12` : 'transparent' }}
                  >
                    {link.label}
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openDropdown === idx ? 'rotate-180' : ''}`} />
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" style={{ background: accentHex }} />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-0 mt-1 min-w-[220px] rounded-xl overflow-hidden shadow-2xl transition-all duration-200 ${
                      openDropdown === idx ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                    }`}
                    style={{ backgroundColor: bgHex, border: `1px solid ${textHex}20` }}
                  >
                    <div className="py-1.5">
                      {link.href && link.href !== '#' && (
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold transition-colors"
                          style={{ color: accentHex }}
                          onClick={() => setOpenDropdown(null)}
                        >
                          {link.label} ทั้งหมด
                        </Link>
                      )}
                      {link.children!.map((child, cIdx) => (
                        <Link
                          key={`${child.href}-${cIdx}`}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors"
                          style={{ color: textHex }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = `${textHex}12`; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = textHex; e.currentTarget.style.backgroundColor = 'transparent'; }}
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentHex }} />
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={`${link.href}-${idx}`}
                href={link.href}
                className="relative px-4 py-2 font-medium text-sm transition-all duration-200 rounded-lg group"
                style={{ color: textHex }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.backgroundColor = `${textHex}12`; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = textHex; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {link.label}
                <span className="absolute bottom-1 left-4 right-4 h-0.5 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 rounded-full" style={{ background: accentHex }} />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-2">
          {phone && (
            <Link
              href={`tel:${phone}`}
              className="flex items-center gap-2 text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              style={{ background: accentHex, boxShadow: `0 4px 14px ${accentHex}40` }}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{phoneLabel}</span>
            </Link>
          )}
          {lineUrl && (
            <Link
              href={lineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#06C755] hover:bg-[#05b34b] text-white font-semibold text-sm px-4 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-green-500/35 hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{lineLabel}</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl transition-colors"
          style={{ backgroundColor: `${textHex}12`, color: textHex, border: `1px solid ${textHex}18` }}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-[100vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4" style={{ backgroundColor: `${bgHex}ee`, borderTop: `1px solid ${textHex}15` }}>
          <nav className="flex flex-col gap-0.5 mb-4">
            {links.map((link, idx) => {
              const hasChildren = link.children && link.children.length > 0;
              const isExpanded = mobileExpanded === idx;

              if (hasChildren) {
                return (
                  <div key={`${link.href}-${idx}`}>
                    <button
                      className="flex items-center justify-between w-full font-medium py-3.5 px-4 rounded-xl transition-colors text-base"
                      style={{ color: textHex, backgroundColor: isExpanded ? `${textHex}10` : 'transparent' }}
                      onClick={() => setMobileExpanded(isExpanded ? null : idx)}
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        style={{ opacity: 0.5 }}
                      />
                    </button>
                    <div
                      className={`overflow-hidden transition-all duration-200 ${
                        isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pl-4 pb-1">
                        {link.href && link.href !== '#' && (
                          <Link
                            href={link.href}
                            className="flex items-center gap-2.5 py-2.5 px-4 rounded-lg text-sm font-semibold transition-colors"
                            style={{ color: accentHex }}
                            onClick={() => setOpen(false)}
                          >
                            {link.label} ทั้งหมด
                          </Link>
                        )}
                        {link.children!.map((child, cIdx) => (
                          <Link
                            key={`${child.href}-${cIdx}`}
                            href={child.href}
                            className="flex items-center gap-2.5 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors"
                            style={{ color: `${textHex}cc` }}
                            onClick={() => setOpen(false)}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: accentHex }} />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={`${link.href}-${idx}`}
                  href={link.href}
                  className="flex items-center justify-between font-medium py-3.5 px-4 rounded-xl transition-colors text-base"
                  style={{ color: textHex }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  <ChevronDown className="w-4 h-4 -rotate-90" style={{ opacity: 0.3 }} />
                </Link>
              );
            })}
          </nav>
          <div className="flex flex-col gap-2.5 pt-4" style={{ borderTop: `1px solid ${textHex}15` }}>
            {phone && (
              <Link
                href={`tel:${phone}`}
                className="flex items-center justify-center gap-2.5 text-white font-bold py-3.5 rounded-xl transition-all text-base"
                style={{ background: accentHex, boxShadow: `0 4px 14px ${accentHex}30` }}
                onClick={() => setOpen(false)}
              >
                <PhoneCall className="w-5 h-5" />
                {phoneLabel}
              </Link>
            )}
            {lineUrl && (
              <Link
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2.5 bg-[#06C755] hover:bg-[#05b34b] text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-green-500/20 text-base"
                onClick={() => setOpen(false)}
              >
                <MessageCircle className="w-5 h-5" />
                {lineLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

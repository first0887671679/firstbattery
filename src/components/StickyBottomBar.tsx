"use client";

import Link from "next/link";
import { PhoneCall, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackPhoneClick, trackLineClick } from "@/lib/gtm";

interface StickyBottomBarProps {
  phone?: string;
  phoneLabel?: string;
  lineUrl?: string;
  lineLabel?: string;
}

export default function StickyBottomBar({
  phone = "__PHONE__",
  phoneLabel = "โทรเรียกช่าง",
  lineUrl = "__LINE_URL__",
  lineLabel = "แอดไลน์",
}: StickyBottomBarProps) {
  return (
    <div 
      className="fixed bottom-0 left-0 right-0 px-3 py-2 bg-white/95 backdrop-blur-lg border-t border-slate-200/60 shadow-[0_-2px_12px_-2px_rgba(0,0,0,0.1)] md:hidden z-50"
      style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex gap-2 max-w-md mx-auto">
        <Button className="flex-1 bg-red-600 hover:bg-red-700 active:scale-[0.97] text-white font-bold h-11 text-[13px] rounded-xl" asChild>
          <Link href={`tel:${phone}`} onClick={trackPhoneClick}>
            <PhoneCall className="mr-1.5 w-4 h-4" />
            {phoneLabel}
          </Link>
        </Button>
        <Button className="flex-1 bg-[#06C755] hover:bg-[#05b34b] active:scale-[0.97] text-white font-bold h-11 text-[13px] rounded-xl" asChild>
          <Link href={lineUrl} target="_blank" rel="noopener noreferrer" onClick={trackLineClick}>
            <MessageCircle className="mr-1.5 w-4 h-4" />
            {lineLabel}
          </Link>
        </Button>
      </div>
    </div>
  );
}

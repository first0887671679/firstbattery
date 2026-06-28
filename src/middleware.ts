import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Social media crawlers ที่ต้องอนุญาตเสมอ
const SOCIAL_BOTS = [
  "facebookexternalhit",
  "Facebot",
  "FacebookBot",
  "Twitterbot",
  "LinkedInBot",
  "Line",
  "Slackbot",
  "Discordbot",
  "WhatsApp",
  "TelegramBot",
];

function isSocialBot(ua: string): boolean {
  return SOCIAL_BOTS.some((bot) => ua.toLowerCase().includes(bot.toLowerCase()));
}

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";

  // อนุญาต social media crawlers เสมอ — ไม่บล็อก
  if (isSocialBot(userAgent)) {
    return NextResponse.next();
  }

  // เฉพาะ /admin/* ต้อง auth
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({ req: request });
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

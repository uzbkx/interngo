import type { Metadata } from "next";
import { DM_Sans, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/lib/auth-context";
import { SavedProvider } from "@/lib/saved-context";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "InternGo — Internships, Scholarships & Programs",
    template: "%s | InternGo",
  },
  description:
    "Discover internships, scholarships, and international programs. Your gateway to global opportunities for students in Uzbekistan.",
  keywords: [
    "internships",
    "scholarships",
    "international programs",
    "Uzbekistan",
    "students",
    "youth opportunities",
    "amaliyot",
    "grant",
    "стажировка",
    "стипендия",
  ],
  openGraph: {
    title: "InternGo — Your Gateway to Global Opportunities",
    description:
      "Discover internships, scholarships, and international programs curated for students in Uzbekistan.",
    type: "website",
    locale: "en_US",
    alternateLocale: ["uz_UZ", "ru_RU"],
    siteName: "InternGo",
  },
  twitter: {
    card: "summary_large_image",
    title: "InternGo — Your Gateway to Global Opportunities",
    description:
      "Discover internships, scholarships, and international programs curated for students in Uzbekistan.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${dmSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SavedProvider>
            <TooltipProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <Toaster richColors position="bottom-right" />
            </TooltipProvider>
            </SavedProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

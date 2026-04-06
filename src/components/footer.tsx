"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("categories");

  const sections = [
    {
      title: t("explore"),
      links: [
        { href: "/listings?type=INTERNSHIP", label: tc("internships") },
        { href: "/listings?type=SCHOLARSHIP", label: tc("scholarships") },
        { href: "/listings?type=PROGRAM", label: tc("programs") },
        { href: "/listings?type=VOLUNTEER", label: tc("volunteering") },
        { href: "/archive", label: "Archive" },
      ],
    },
    {
      title: t("forOrgs"),
      links: [
        { href: "/post", label: t("postListing") },
        { href: "/auth/signup", label: t("createAccount") },
      ],
    },
    {
      title: t("about"),
      links: [
        { href: "/about", label: t("aboutUs") },
        { href: "/contact", label: t("contact") },
        { href: "https://t.me/interngo", label: "Telegram", external: true },
      ],
    },
    {
      title: t("legal"),
      links: [
        { href: "/terms", label: t("terms") },
        { href: "/privacy", label: t("privacy") },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span className="font-semibold">InternGo</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed">{t("tagline")}</p>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {(link as any).external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} InternGo</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

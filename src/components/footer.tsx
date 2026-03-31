"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { GraduationCap } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("categories");

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">InternGo</span>
            </Link>
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">{t("explore")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/listings?type=INTERNSHIP" className="hover:text-foreground transition-colors">
                  {tc("internships")}
                </Link>
              </li>
              <li>
                <Link href="/listings?type=SCHOLARSHIP" className="hover:text-foreground transition-colors">
                  {tc("scholarships")}
                </Link>
              </li>
              <li>
                <Link href="/listings?type=PROGRAM" className="hover:text-foreground transition-colors">
                  {tc("programs")}
                </Link>
              </li>
              <li>
                <Link href="/listings?type=VOLUNTEER" className="hover:text-foreground transition-colors">
                  {tc("volunteering")}
                </Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-foreground transition-colors">
                  Archive
                </Link>
              </li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">{t("forOrgs")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/post" className="hover:text-foreground transition-colors">
                  {t("postListing")}
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:text-foreground transition-colors">
                  {t("createAccount")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">{t("about")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  {t("contact")}
                </Link>
              </li>
              <li>
                <a
                  href="https://t.me/interngo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Telegram
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-3 text-sm">{t("legal")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  {t("privacy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} InternGo. {t("rights")}
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              {t("terms")}
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              {t("privacy")}
            </Link>
            <a
              href="mailto:contact@interngo.uz"
              className="hover:text-foreground transition-colors"
            >
              {t("contact")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

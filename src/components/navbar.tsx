"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import {
  GraduationCap,
  Menu,
  Search,
  Briefcase,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { user, loading, logout } = useAuth();

  const navLinks = [
    { href: "/listings", label: t("browse"), icon: Search },
    { href: "/post", label: t("post"), icon: Briefcase },
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-semibold tracking-tight">InternGo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button key={link.href} variant="ghost" size="sm" render={<Link href={link.href} />}>
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher currentLocale={locale} />
          <Separator orientation="vertical" className="h-5 mx-1" />
          {!loading && user ? (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/profile" />}>
                <User className="h-4 w-4 mr-1.5" />
                {user.name || user.email}
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : !loading ? (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/auth/login" />}>
                {tc("login")}
              </Button>
              <Button size="sm" render={<Link href="/auth/signup" />}>
                {tc("signup")}
              </Button>
            </>
          ) : null}
        </div>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            className="md:hidden"
            render={<Button variant="ghost" size="icon" />}
          >
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-1 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              ))}
              <Separator className="my-3" />
              <div className="flex items-center gap-2 px-3">
                <ThemeToggle />
                <LanguageSwitcher currentLocale={locale} />
              </div>
              <Separator className="my-3" />
              {!loading && user ? (
                <>
                  <span className="text-sm text-muted-foreground px-3">{user.name || user.email}</span>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => { logout(); setOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    {tc("logout")}
                  </Button>
                </>
              ) : !loading ? (
                <div className="flex flex-col gap-2 px-3">
                  <Button
                    variant="outline"
                    size="sm"
                    render={<Link href="/auth/login" onClick={() => setOpen(false)} />}
                  >
                    {tc("login")}
                  </Button>
                  <Button
                    size="sm"
                    render={<Link href="/auth/signup" onClick={() => setOpen(false)} />}
                  >
                    {tc("signup")}
                  </Button>
                </div>
              ) : null}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

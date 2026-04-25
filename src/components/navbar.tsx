"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  Search,
  Briefcase,
  LayoutDashboard,
  LogOut,
  User,
  Info,
  Mail,
} from "lucide-react";
import { Logo } from "@/components/logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/listings", label: t("browse"), icon: Search },
    { href: "/post", label: t("post"), icon: Briefcase },
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
    { href: "/about", label: t("about"), icon: Info },
    { href: "/contact", label: t("contact"), icon: Mail },
  ];

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(path + "/");
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Logo size={40} priority className="shadow-md group-hover:shadow-lg transition-shadow" />
          <span className="text-xl font-bold tracking-tight">InternGo</span>
        </Link>

        {/* Desktop nav with animated tabs */}
        <nav className="hidden md:flex items-center">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-5 py-2.5 text-base font-medium transition-colors duration-200 ${
                isActive(link.href) ? "text-primary" : "text-foreground hover:text-primary"
              }`}
              onMouseEnter={() => setHoveredLink(link.href)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <span className="relative z-10">{link.label}</span>

              {/* Hover background */}
              {hoveredLink === link.href && (
                <motion.div
                  layoutId="nav-hover-bg"
                  className="absolute inset-0 bg-primary/10 rounded-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}

              {/* Active underline */}
              {isActive(link.href) && (
                <motion.div
                  layoutId="nav-active-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}

              {/* Hover underline (when not active) */}
              {hoveredLink === link.href && !isActive(link.href) && (
                <motion.div
                  layoutId="nav-hover-underline"
                  className="absolute bottom-0 left-2 right-2 h-0.5 bg-primary/40 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher currentLocale={locale} />
          <Separator orientation="vertical" className="h-6 mx-2" />
          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2 h-10 px-3 text-base" />}>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-sm">
                    {getInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[140px] truncate">{user.name || user.email}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem render={<Link href="/profile" />} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/dashboard" />} className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {tc("logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : !loading ? (
            <>
              <Button variant="ghost" render={<Link href="/auth/login" />} className="h-10 px-4 text-base">
                {tc("login")}
              </Button>
              <Button
                render={<Link href="/auth/signup" />}
                className="h-10 px-4 text-base bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                {tc("signup")}
              </Button>
            </>
          ) : null}
        </div>

        {/* Mobile nav */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <nav className="flex flex-col gap-1 mt-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
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
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs">
                        {getInitials(user.name || user.email)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setOpen(false); }} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left">
                    <LogOut className="h-4 w-4" />
                    {tc("logout")}
                  </button>
                </>
              ) : !loading ? (
                <div className="flex flex-col gap-2 px-3">
                  <Button variant="outline" size="sm" render={<Link href="/auth/login" onClick={() => setOpen(false)} />}>
                    {tc("login")}
                  </Button>
                  <Button size="sm" render={<Link href="/auth/signup" onClick={() => setOpen(false)} />} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
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

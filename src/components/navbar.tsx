"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
  const pathname = usePathname();

  const navLinks = [
    { href: "/listings", label: t("browse"), icon: Search },
    { href: "/post", label: t("post"), icon: Briefcase },
    { href: "/dashboard", label: t("dashboard"), icon: LayoutDashboard },
  ];

  function isActive(path: string) {
    return pathname === path || pathname.startsWith(path + "/");
  }

  function getInitials(name: string) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 shadow-md group-hover:shadow-lg transition-shadow">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">InternGo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              render={<Link href={link.href} />}
              className={
                isActive(link.href)
                  ? "bg-accent text-accent-foreground relative after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-gradient-to-r after:from-indigo-600 after:to-blue-600 after:rounded-full"
                  : ""
              }
            >
              {link.label}
            </Button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-1.5">
          <ThemeToggle />
          <LanguageSwitcher currentLocale={locale} />
          <Separator orientation="vertical" className="h-5 mx-1" />
          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="sm" className="gap-2" />}>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs">
                    {getInitials(user.name || user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="max-w-[120px] truncate">{user.name || user.email}</span>
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
              <Button variant="ghost" size="sm" render={<Link href="/auth/login" />}>
                {tc("login")}
              </Button>
              <Button
                size="sm"
                render={<Link href="/auth/signup" />}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                {tc("signup")}
              </Button>
            </>
          ) : null}
        </div>

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
                    isActive(link.href) ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
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

"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getApiBase } from "@/lib/api";

export default function LoginPage() {
  const t = useTranslations("auth");
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.error) { setError(result.error); setLoading(false); return; }
    window.location.href = "/";
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px] rounded-xl border bg-background p-6 shadow-lg shadow-black/5">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border">
            <GraduationCap className="h-5 w-5 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold tracking-tight">{t("welcomeBack")}</h1>
            <p className="text-sm text-muted-foreground">{t("loginDesc")}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-9 rounded-lg border-input shadow-sm shadow-black/5 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 rounded-lg border-input shadow-sm shadow-black/5 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20"
              />
            </div>
          </div>

          <div className="flex justify-between gap-2">
            <span />
            <Link href="/auth/forgot-password" className="text-sm underline hover:no-underline text-primary">
              Forgot password?
            </Link>
          </div>

          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white shadow-sm"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? t("loggingIn") : t("login")}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
          <span className="text-xs text-muted-foreground">{t("orEmail")}</span>
        </div>

        {/* Google */}
        <Button
          variant="outline"
          className="w-full shadow-sm shadow-black/5"
          onClick={() => { window.location.href = `${getApiBase()}/auth/google`; }}
        >
          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {t("googleContinue")}
        </Button>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          {t("noAccount")}{" "}
          <Link href="/auth/signup" className="underline hover:no-underline text-primary font-medium">
            {t("createAccountBtn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

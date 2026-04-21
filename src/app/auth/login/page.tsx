"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AuthShell } from "@/components/ui/auth-shell";
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getApiBase } from "@/lib/api";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full h-10 rounded-md bg-background border border-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 transition-colors";

function safeRedirect(raw: string | null | undefined): string {
  if (!raw) return "/";
  // Only allow same-origin relative paths
  if (raw.startsWith("/") && !raw.startsWith("//")) return raw;
  return "/";
}

function readRedirect(queryRedirect: string | null): string {
  let stored: string | null = null;
  try {
    stored = sessionStorage.getItem("postLoginRedirect");
    if (stored) sessionStorage.removeItem("postLoginRedirect");
  } catch {}
  return safeRedirect(queryRedirect ?? stored);
}

export default function LoginPage() {
  const t = useTranslations("auth");
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    if (result.error) { setError(result.error); setLoading(false); return; }
    window.location.href = readRedirect(searchParams.get("redirect"));
  }

  return (
    <AuthShell
      title={t("welcomeBack")}
      subtitle={t("loginDesc")}
      brandTagline="Sign in to discover internships, scholarships and programs curated for you."
    >
      <div className="mb-4">
        <button
          type="button"
          onClick={() => { window.location.href = `${getApiBase()}/auth/google`; }}
          className="w-full flex items-center justify-center gap-2 bg-background border border-input rounded-lg p-2.5 hover:bg-accent transition-colors text-sm text-foreground"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          {t("googleContinue")}
        </button>
      </div>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-card text-muted-foreground">{t("orEmail")}</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            {t("email")} <span className="text-blue-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            {t("password")} <span className="text-blue-500">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              className={cn(fieldClass, "pr-10")}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-medium transition-all shadow-md hover:shadow-indigo-500/25 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          {loading ? t("loggingIn") : <>
            {t("login")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </>}
        </button>

        <div className="text-center pt-1">
          <Link href="/auth/forgot-password" className="text-blue-500 hover:text-blue-400 text-sm transition-colors">
            Forgot password?
          </Link>
        </div>
      </form>

      <p className="text-center text-xs text-muted-foreground mt-5">
        {t("noAccount")}{" "}
        <Link href="/auth/signup" className="text-blue-500 hover:text-blue-400 font-medium">
          {t("createAccountBtn")}
        </Link>
      </p>
    </AuthShell>
  );
}

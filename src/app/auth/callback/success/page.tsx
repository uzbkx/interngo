"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AuthCallbackSuccess() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      let redirect = "/";
      try {
        const stored = sessionStorage.getItem("postLoginRedirect");
        if (stored && stored.startsWith("/") && !stored.startsWith("//")) {
          redirect = stored;
        }
        sessionStorage.removeItem("postLoginRedirect");
      } catch {}
      window.location.href = redirect;
    } else {
      window.location.href = "/auth/login?error=no_token";
    }
  }, [searchParams]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
        <p className="text-muted-foreground">Signing you in...</p>
      </div>
    </div>
  );
}

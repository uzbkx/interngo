"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoaderCircle, Search, ArrowRight } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { cn } from "@/lib/utils";

interface Preview {
  _id: string;
  title: string;
  slug: string;
  type: string;
  organizationId?: { name?: string };
  organizationName?: string;
}

const typeStyle: Record<string, string> = {
  INTERNSHIP: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  SCHOLARSHIP: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  PROGRAM: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  VOLUNTEER: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  JOB: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

export function HeroSearch() {
  const t = useTranslations("home");
  const router = useRouter();
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Preview[]>([]);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const term = q.trim();
    if (!term) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await apiFetch(`/listings?q=${encodeURIComponent(term)}&limit=3`, {
          signal: ctrl.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setResults((data.listings || []).slice(0, 3));
        }
      } catch {
        // ignore aborts / network errors
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [q]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const term = q.trim();
    router.push(term ? `/listings?q=${encodeURIComponent(term)}` : "/listings");
  }

  const showDropdown = open && q.trim().length > 0;

  return (
    <div ref={wrapRef} className="relative max-w-xl mx-auto mb-10">
      <form onSubmit={submit} className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-4 text-foreground">
          {loading ? (
            <LoaderCircle className="animate-spin" size={18} strokeWidth={2} aria-label="Loading" />
          ) : (
            <Search size={18} strokeWidth={2} aria-hidden />
          )}
        </div>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className={cn(
            "h-12 w-full rounded-xl border border-indigo-400/50 bg-background pl-12 pr-28 text-base shadow-sm",
            "transition-shadow placeholder:text-foreground/70 text-foreground",
            "focus-visible:border-indigo-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-indigo-500/20",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
          )}
        />
        <button
          type="submit"
          className="absolute inset-y-1 right-1 flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 px-4 text-sm font-medium text-white shadow-md transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
        >
          {t("browseCta")}
        </button>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 rounded-xl border border-border bg-background/95 backdrop-blur-xl shadow-lg overflow-hidden">
          {loading && results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-foreground text-center">Searching…</div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-sm text-foreground text-center">No matches</div>
          ) : (
            <>
              {results.map((r) => (
                <Link
                  key={r._id}
                  href={`/listings/${r.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-accent transition-colors border-b border-border/60 last:border-b-0"
                  onClick={() => setOpen(false)}
                >
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                      typeStyle[r.type] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
                    )}
                  >
                    {r.type}
                  </span>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium truncate">{r.title}</div>
                    {(r.organizationId?.name || r.organizationName) && (
                      <div className="text-xs text-foreground truncate">
                        {r.organizationId?.name || r.organizationName}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-4 w-4 text-foreground shrink-0" />
                </Link>
              ))}
              <Link
                href={`/listings?q=${encodeURIComponent(q.trim())}`}
                className="flex items-center justify-center gap-1 px-4 py-2.5 text-xs font-medium text-primary hover:bg-accent transition-colors"
                onClick={() => setOpen(false)}
              >
                {t("browseCta")} <ArrowRight className="h-3 w-3" />
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}

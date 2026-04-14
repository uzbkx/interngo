"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Archive, ChevronLeft, ChevronRight } from "lucide-react";

const TYPE_KEYS = ["", "INTERNSHIP", "SCHOLARSHIP", "PROGRAM", "VOLUNTEER", "JOB"] as const;

export default function ArchivePage() {
  const t = useTranslations("listings");
  const tc = useTranslations("common");
  const [listings, setListings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const typeLabels: Record<string, string> = {
    "": t("all"),
    INTERNSHIP: t("internships"),
    SCHOLARSHIP: t("scholarships"),
    PROGRAM: t("programs"),
    VOLUNTEER: t("volunteering"),
    JOB: t("jobs"),
  };

  async function fetchArchive() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeType) params.set("type", activeType);
      if (query) params.set("q", query);
      params.set("page", String(page));
      params.set("limit", "12");

      const res = await apiFetch(`/listings/archive?${params}`);
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch {
      // API error
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchArchive();
  }, [activeType, page]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchArchive();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Archive className="h-5 w-5 text-muted-foreground" />
          <h1 className="text-2xl font-bold">{t("archive") || "Archive"}</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {t("archiveDesc") || tc("deadlinePassed")}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 pl-12 rounded-xl text-base"
        />
      </form>

      <div className="flex flex-wrap gap-2 mb-8">
        {TYPE_KEYS.map((key) => (
          <button
            key={key}
            onClick={() => { setActiveType(key); setPage(1); }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeType === key
                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {typeLabels[key]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-5 space-y-3">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Archive className="h-12 w-12 mx-auto mb-3 opacity-20" />
          <p className="text-sm mb-1">{tc("noResults")}</p>
          <p className="text-xs">{tc("tryAdjusting")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((listing: any) => (
              <ListingCard
                key={listing._id}
                id={listing._id}
                title={listing.title}
                slug={listing.slug}
                type={listing.type}
                organization={listing.organizationId?.name || listing.organizationName}
                location={listing.location ?? undefined}
                country={listing.country ?? undefined}
                isRemote={listing.isRemote}
                isPaid={listing.isPaid}
                isFree={listing.isFree}
                applicationFee={listing.applicationFee}
                deadline={listing.deadline ? new Date(listing.deadline) : null}
                description={listing.description}
                createdAt={listing.createdAt}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}

      <p className="text-center mt-6 text-xs text-muted-foreground">
        {tc("showingResults", { count: listings.length, total })}
      </p>
    </div>
  );
}

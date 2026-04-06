"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Archive, Loader2 } from "lucide-react";

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
      params.set("limit", "20");

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
          <h1 className="text-2xl font-bold">Archive</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Past opportunities — no longer accepting applications.
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-9"
          />
        </div>
        <Button type="submit" size="sm" variant="secondary">
          {tc("search")}
        </Button>
      </form>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {TYPE_KEYS.map((key) => (
          <Badge
            key={key}
            variant={activeType === key ? "default" : "secondary"}
            className="cursor-pointer text-xs px-2.5 py-0.5"
            onClick={() => { setActiveType(key); setPage(1); }}
          >
            {typeLabels[key]}
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Archive className="h-8 w-8 mx-auto mb-2 opacity-20" />
          <p className="text-sm mb-1">{tc("noResults")}</p>
          <p className="text-xs">{tc("tryAdjusting")}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {listings.map((listing: any) => (
              <div key={listing._id} className="opacity-60">
                <ListingCard
                  id={listing._id}
                  title={listing.title}
                  slug={listing.slug}
                  type={listing.type}
                  organization={listing.organizationId?.name}
                  location={listing.location ?? undefined}
                  country={listing.country ?? undefined}
                  isRemote={listing.isRemote}
                  isPaid={listing.isPaid}
                  deadline={listing.deadline ? new Date(listing.deadline) : null}
                  description={listing.description}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <span className="flex items-center text-xs text-muted-foreground px-2">
                {page} / {totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                Next
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

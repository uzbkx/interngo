import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { serverFetch } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

interface ListingsPageProps {
  searchParams: Promise<{ type?: string; q?: string; page?: string }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const params = await searchParams;
  const activeType = params.type || "";
  const query = params.q || "";
  const page = parseInt(params.page || "1");
  const limit = 12;
  const t = await getTranslations("listings");
  const tc = await getTranslations("common");

  const listingTypes = [
    { label: t("all"), value: "" },
    { label: t("internships"), value: "INTERNSHIP" },
    { label: t("scholarships"), value: "SCHOLARSHIP" },
    { label: t("programs"), value: "PROGRAM" },
    { label: t("volunteering"), value: "VOLUNTEER" },
    { label: t("jobs"), value: "JOB" },
  ];

  let listings: any[] = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    const queryParams = new URLSearchParams();
    if (activeType) queryParams.set("type", activeType);
    if (query) queryParams.set("q", query);
    queryParams.set("page", String(page));
    queryParams.set("limit", String(limit));

    const res = await serverFetch(`/listings?${queryParams}`);
    if (res.ok) {
      const data = await res.json();
      listings = data.listings || [];
      totalCount = data.total || 0;
      totalPages = data.totalPages || 1;
    }
  } catch {
    // API not available
  }

  function buildUrl(newPage: number) {
    const p = new URLSearchParams();
    if (activeType) p.set("type", activeType);
    if (query) p.set("q", query);
    if (newPage > 1) p.set("page", String(newPage));
    const qs = p.toString();
    return `/listings${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <form className="flex gap-2 mb-4" action="/listings" method="GET">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder={t("searchPlaceholder")}
            defaultValue={query}
            className="pl-10 h-9"
          />
        </div>
        {activeType && (
          <input type="hidden" name="type" value={activeType} />
        )}
        <Button type="submit" size="sm">
          {tc("search")}
        </Button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        {listingTypes.map((lt) => (
          <a
            key={lt.value}
            href={
              lt.value
                ? `/listings?type=${lt.value}${query ? `&q=${query}` : ""}`
                : `/listings${query ? `?q=${query}` : ""}`
            }
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeType === lt.value
                ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {lt.label}
          </a>
        ))}
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-sm mb-1">{tc("noResults")}</p>
          <p className="text-xs">{tc("tryAdjusting")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {page > 1 ? (
            <Button variant="outline" size="sm" render={<Link href={buildUrl(page - 1)} />}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <span className="text-xs text-muted-foreground px-2">
            {page} / {totalPages}
          </span>

          {page < totalPages ? (
            <Button variant="outline" size="sm" render={<Link href={buildUrl(page + 1)} />}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <p className="text-center mt-4 text-xs text-muted-foreground">
        {tc("showingResults", { count: listings.length, total: totalCount })}
      </p>
    </div>
  );
}

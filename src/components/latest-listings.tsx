"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

export function LatestListings() {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/listings?limit=6")
      .then((res) => res.json())
      .then((data) => setListings(data.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (listings.length === 0) return null;

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {t("latestTitle")}
            </h2>
            <p className="text-sm text-muted-foreground">{t("latestDesc")}</p>
          </div>
          <Button variant="ghost" size="sm" render={<Link href="/listings" />}>
            {tc("viewAll")}
            <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {listings.map((listing: any) => (
            <ListingCard
              key={listing._id}
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
          ))}
        </div>
      </div>
    </section>
  );
}

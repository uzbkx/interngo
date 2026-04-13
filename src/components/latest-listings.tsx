"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { ListingCard } from "@/components/listing-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function ListingSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-3">
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-5 rounded-full" />
      </div>
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-8 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16 rounded-md" />
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
      <Skeleton className="h-1 w-full" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}

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

  if (listings.length === 0 && !loading) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => <ListingSkeleton key={i} />)
        : listings.map((listing: any) => (
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
              createdAt={listing.createdAt}
            />
          ))
      }
    </div>
  );
}

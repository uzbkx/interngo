import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { serverFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  DollarSign,
  Globe,
  ExternalLink,
  ArrowLeft,
  Building2,
  Clock,
} from "lucide-react";
import { SaveButton } from "@/components/save-button";
import { ApplicationTracker } from "@/components/application-tracker";
import { ShareButtons } from "@/components/share-buttons";
import { DeadlineBadge } from "@/components/deadline-badge";

interface ListingDetailPageProps {
  params: Promise<{ slug: string }>;
}

async function getListing(slug: string) {
  try {
    const res = await serverFetch(`/listings/${slug}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await getListing(slug);

  if (!listing) return { title: "Not Found" };

  const description = listing.description?.slice(0, 160) || "";
  const orgName = listing.organizationId?.name;
  const title = orgName ? `${listing.title} — ${orgName}` : listing.title;

  return {
    title,
    description,
    openGraph: { title, description, type: "article" },
    twitter: { card: "summary", title, description },
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { slug } = await params;
  const t = await getTranslations("listings");
  const tc = await getTranslations("common");
  const tt = await getTranslations("types");

  const listing = await getListing(slug);
  if (!listing) notFound();

  const deadline = listing.deadline ? new Date(listing.deadline) : null;
  const startDate = listing.startDate ? new Date(listing.startDate) : null;
  const endDate = listing.endDate ? new Date(listing.endDate) : null;
  const isExpired = deadline && deadline.getTime() < Date.now();
  const listingId = listing._id;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" render={<Link href="/listings" />}>
        <ArrowLeft className="h-4 w-4 mr-1" />
        {t("backToListings")}
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-5">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <Badge variant="secondary" className="text-xs">
                {tt(listing.type as string)}
              </Badge>
              {listing.source === "AI_SCOUTED" && (
                <Badge variant="outline" className="text-xs">{t("aiDiscovered")}</Badge>
              )}
            </div>
            <h1 className="text-2xl font-bold mb-1">{listing.title}</h1>
            {listing.organizationId?.name && (
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" />
                {listing.organizationId.name}
              </p>
            )}
          </div>

          <Separator className="mb-5" />

          <div className="text-sm leading-relaxed">
            {listing.description.split("\n").map((line: string, i: number) => {
              if (line.startsWith("## ")) {
                return (
                  <h2 key={i} className="text-base font-semibold mt-5 mb-2 text-foreground">
                    {line.replace("## ", "")}
                  </h2>
                );
              }
              if (line.startsWith("- ")) {
                return (
                  <li key={i} className="text-muted-foreground ml-4">
                    {line.replace("- ", "")}
                  </li>
                );
              }
              if (line.trim() === "") return <br key={i} />;
              return (
                <p key={i} className="text-muted-foreground">{line}</p>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-5 space-y-3">
              {listing.applyUrl && !isExpired && (
                <Button
                  className="w-full"
                  render={
                    <a href={listing.applyUrl} target="_blank" rel="noopener noreferrer" />
                  }
                >
                  {tc("apply")}
                  <ExternalLink className="ml-2 h-3.5 w-3.5" />
                </Button>
              )}
              {isExpired && (
                <Button className="w-full" disabled>
                  {tc("deadlinePassed")}
                </Button>
              )}

              <SaveButton listingId={listingId} className="w-full" />
              <ApplicationTracker listingId={listingId} />

              <ShareButtons title={listing.title} url={`/listings/${listing.slug}`} />

              {deadline && deadline.getTime() > Date.now() && (
                <div className="flex justify-center">
                  <DeadlineBadge deadline={deadline} />
                </div>
              )}

              <Separator />

              <div className="space-y-2.5 text-xs">
                {(listing.location || listing.country) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {[listing.city, listing.location, listing.country]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  </div>
                )}
                {listing.isRemote && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="h-3.5 w-3.5 shrink-0" />
                    <span>{tc("remote")}</span>
                  </div>
                )}
                {listing.isPaid && listing.salary && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5 shrink-0" />
                    <span>{listing.salary}{listing.currency ? ` ${listing.currency}` : ""}</span>
                  </div>
                )}
                {deadline && (
                  <div className={`flex items-center gap-2 ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {t("deadline")}: {deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
                {startDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {t("starts")}: {startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
                {endDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {t("ends")}: {endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

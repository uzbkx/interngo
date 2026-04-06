"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Globe, Sparkles } from "lucide-react";
import { DeadlineBadge } from "@/components/deadline-badge";

interface ListingCardProps {
  id: string;
  title: string;
  slug: string;
  type: string;
  organization?: string;
  location?: string;
  country?: string;
  isRemote?: boolean;
  isPaid?: boolean;
  deadline?: Date | string | null;
  description: string;
  createdAt?: string;
}

export function ListingCard({
  title,
  slug,
  type,
  organization,
  location,
  country,
  isRemote,
  isPaid,
  deadline,
  description,
  createdAt,
}: ListingCardProps) {
  const tt = useTranslations("types");
  const tc = useTranslations("common");

  const deadlineDate = deadline ? new Date(deadline) : null;
  const isNew = createdAt && (Date.now() - new Date(createdAt).getTime()) < 48 * 60 * 60 * 1000;

  return (
    <Link href={`/listings/${slug}`}>
      <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
              {organization && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {organization}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {isNew && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  New
                </Badge>
              )}
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {tt(type as string)}
              </Badge>
            </div>
          </div>

          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          {deadlineDate && deadlineDate.getTime() > Date.now() && (
            <div className="mb-2">
              <DeadlineBadge deadline={deadlineDate} />
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 text-[11px] text-muted-foreground">
            {(location || country) && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location || country}
              </span>
            )}
            {isRemote && (
              <span className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {tc("remote")}
              </span>
            )}
            {isPaid && (
              <span className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                {tc("paid")}
              </span>
            )}
            {deadlineDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {deadlineDate.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

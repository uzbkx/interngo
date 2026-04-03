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

const typeColors: Record<string, string> = {
  INTERNSHIP: "bg-blue-100 text-blue-800",
  SCHOLARSHIP: "bg-green-100 text-green-800",
  PROGRAM: "bg-purple-100 text-purple-800",
  VOLUNTEER: "bg-orange-100 text-orange-800",
  JOB: "bg-cyan-100 text-cyan-800",
  OTHER: "bg-gray-100 text-gray-800",
};

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
      <Card className="h-full hover:shadow-md transition-shadow cursor-pointer group">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                  {title}
                </h3>
                {isNew && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-emerald-100 text-emerald-800 shrink-0">
                    <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                    New
                  </Badge>
                )}
              </div>
              {organization && (
                <p className="text-sm text-muted-foreground">
                  {organization}
                </p>
              )}
            </div>
            <Badge variant="secondary" className={typeColors[type] || ""}>
              {tt(type as string)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>

          {deadlineDate && deadlineDate.getTime() > Date.now() && (
            <div className="mb-3">
              <DeadlineBadge deadline={deadlineDate} />
            </div>
          )}

          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
                  year: "numeric",
                })}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

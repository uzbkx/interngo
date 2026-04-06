"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, DollarSign, Globe, Sparkles, Heart } from "lucide-react";
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
  id,
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
  const { user } = useAuth();

  const [saved, setSaved] = useState(false);
  const [savingAnim, setSavingAnim] = useState(false);

  const deadlineDate = deadline ? new Date(deadline) : null;
  const isNew = createdAt && (Date.now() - new Date(createdAt).getTime()) < 48 * 60 * 60 * 1000;

  useEffect(() => {
    if (!user) return;
    apiFetch(`/saved/${id}`)
      .then((res) => res.json())
      .then((data) => setSaved(data.saved))
      .catch(() => {});
  }, [id, user]);

  async function toggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    setSavingAnim(true);
    try {
      const res = await apiFetch("/saved", {
        method: "POST",
        body: JSON.stringify({ listingId: id }),
      });
      const data = await res.json();
      setSaved(data.saved);
    } catch {}
    setTimeout(() => setSavingAnim(false), 300);
  }

  return (
    <Link href={`/listings/${slug}`}>
      <Card className="h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col">
        <CardContent className="p-4 flex flex-col flex-1">
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
              {user && (
                <button
                  onClick={toggleSave}
                  className={`p-1 rounded-full transition-all ${savingAnim ? "scale-125" : "hover:scale-110"}`}
                  aria-label={saved ? "Unsave" : "Save"}
                >
                  <Heart className={`h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"}`} />
                </button>
              )}
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

          <div className="flex flex-wrap gap-2.5 text-[11px] text-muted-foreground mb-3">
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
          </div>

          {/* Deadline pinned to bottom */}
          <div className="mt-auto pt-3 border-t border-border/50">
            {deadlineDate ? (
              deadlineDate.getTime() > Date.now() ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  <DeadlineBadge deadline={deadlineDate} />
                </div>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-destructive">
                  <Calendar className="h-3.5 w-3.5" />
                  {tc("deadlinePassed")}
                </span>
              )
            ) : (
              <span className="text-xs text-muted-foreground/50">No deadline</span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

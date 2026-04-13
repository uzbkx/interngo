"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { MagicCard } from "@/components/ui/magic-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Calendar, DollarSign, Globe, Sparkles, Heart, ArrowUpRight, Clock } from "lucide-react";
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

const typeConfig: Record<string, { color: string; gradient: string }> = {
  INTERNSHIP: { color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300", gradient: "#4f46e5" },
  SCHOLARSHIP: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300", gradient: "#059669" },
  PROGRAM: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300", gradient: "#2563eb" },
  VOLUNTEER: { color: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300", gradient: "#e11d48" },
  JOB: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300", gradient: "#d97706" },
  OTHER: { color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300", gradient: "#6b7280" },
};

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
  const isPast = deadlineDate && deadlineDate.getTime() < Date.now();
  const config = typeConfig[type] || typeConfig.OTHER;

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
    <Link href={`/listings/${slug}`} className="block h-full">
      <MagicCard
        className="h-full cursor-pointer group"
        gradientColor={config.gradient + "15"}
        gradientSize={250}
        gradientOpacity={1}
      >
        <div className="p-5 flex flex-col h-full">
          {/* Top: type badge + save + new */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Badge className={`text-[10px] font-medium px-2 py-0.5 border-0 ${config.color}`}>
                {tt(type as string)}
              </Badge>
              {isNew && (
                <Badge className="text-[10px] px-1.5 py-0.5 border-0 bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  New
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {user && (
                <button
                  onClick={toggleSave}
                  className={`p-1.5 rounded-full transition-all hover:bg-muted ${savingAnim ? "scale-125" : "hover:scale-110"}`}
                  aria-label={saved ? "Unsave" : "Save"}
                >
                  <Heart className={`h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-400"}`} />
                </button>
              )}
              <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2 mb-1">
            {title}
          </h3>

          {/* Organization */}
          {organization && (
            <p className="text-sm text-muted-foreground mb-2">{organization}</p>
          )}

          {/* Description */}
          <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-4 leading-relaxed">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(location || country) && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                <MapPin className="h-3 w-3" />
                {location || country}
              </span>
            )}
            {isRemote && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                <Globe className="h-3 w-3" />
                {tc("remote")}
              </span>
            )}
            {isPaid && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted/60 px-2 py-1 rounded-md">
                <DollarSign className="h-3 w-3" />
                {tc("paid")}
              </span>
            )}
          </div>

          {/* Deadline at bottom */}
          <div className="mt-auto">
            <Separator className="mb-3" />
            {deadlineDate ? (
              isPast ? (
                <div className="flex items-center gap-2 bg-destructive/10 px-3 py-2 rounded-lg">
                  <Clock className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-semibold text-destructive">
                    {tc("deadlinePassed")}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-muted/50 px-3 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Deadline</p>
                      <p className="text-sm font-semibold text-foreground">
                        {deadlineDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <DeadlineBadge deadline={deadlineDate} />
                </div>
              )
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/30">
                <Calendar className="h-4 w-4 text-muted-foreground/40" />
                <span className="text-sm text-muted-foreground/50">No deadline</span>
              </div>
            )}
          </div>
        </div>
      </MagicCard>
    </Link>
  );
}

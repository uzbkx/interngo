"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Clock,
  BarChart3,
  Radar,
} from "lucide-react";
import Link from "next/link";

interface Listing {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  source: string;
  description: string;
  country: string | null;
  isRemote: boolean;
  isPaid: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [published, setPublished] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  async function fetchListings() {
    setLoading(true);
    try {
      const [draftRes, pubRes] = await Promise.all([
        apiFetch("/admin/listings?status=DRAFT"),
        apiFetch("/admin/listings?status=PUBLISHED"),
      ]);
      const draftData = await draftRes.json();
      const pubData = await pubRes.json();
      setDrafts(draftData.listings || []);
      setPublished(pubData.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchListings();
  }, []);

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      await apiFetch(`/listings/${id}/approve`, { method: "PATCH" });
      await fetchListings();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(id: string) {
    setActionLoading(id);
    try {
      await apiFetch(`/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "ARCHIVED" }),
      });
      await fetchListings();
    } finally {
      setActionLoading(null);
    }
  }

  function ListingRow({ listing }: { listing: Listing }) {
    const isActioning = actionLoading === listing.id;

    return (
      <Card className="mb-3">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold truncate">{listing.title}</h3>
                <Badge variant="secondary" className="text-xs shrink-0">
                  {listing.type}
                </Badge>
                <Badge variant="outline" className="text-xs shrink-0">
                  {listing.source === "AI_SCOUTED" ? "AI" : "User"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {listing.description}
              </p>
              <div className="flex gap-3 mt-2 text-xs text-muted-foreground">
                {listing.country && <span>{listing.country}</span>}
                {listing.isRemote && <span>Remote</span>}
                {listing.isPaid && <span>Paid</span>}
                <span>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-2 shrink-0">
              <Button
                size="sm"
                variant="ghost"
                render={
                  <a
                    href={`/listings/${listing.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                <Eye className="h-4 w-4" />
              </Button>
              {listing.status === "DRAFT" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(listing.id)}
                    disabled={isActioning}
                  >
                    {isActioning ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleReject(listing.id)}
                    disabled={isActioning}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage listings, approve submissions, and monitor the platform
        </p>
      </div>

      {/* Quick links */}
      <div className="mb-6">
        <Button variant="outline" render={<Link href="/admin/scouter" />}>
          <Radar className="mr-2 h-4 w-4" />
          AI Scouter Dashboard
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{drafts.length}</div>
              <div className="text-sm text-muted-foreground">
                Pending Review
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{published.length}</div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">
                {drafts.length + published.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({drafts.length})
          </TabsTrigger>
          <TabsTrigger value="published">
            Published ({published.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : drafts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending listings to review
            </div>
          ) : (
            drafts.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))
          )}
        </TabsContent>

        <TabsContent value="published" className="mt-4">
          {loading ? (
            <div className="text-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          ) : published.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No published listings
            </div>
          ) : (
            published.map((listing) => (
              <ListingRow key={listing.id} listing={listing} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

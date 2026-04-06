"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Clock,
  BarChart3,
  Radar,
  Trash2,
  Search,
  Users,
  FileText,
  Globe,
  Edit,
} from "lucide-react";

interface Listing {
  _id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  source: string;
  description: string;
  country: string | null;
  isRemote: boolean;
  isPaid: boolean;
  organizationName: string | null;
  createdAt: string;
}

interface UserInfo {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [published, setPublished] = useState<Listing[]>([]);
  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("published");
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.role !== "ADMIN")) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  async function fetchData() {
    setLoading(true);
    try {
      const [pubRes, draftRes] = await Promise.all([
        apiFetch("/admin/listings?status=PUBLISHED"),
        apiFetch("/admin/listings?status=DRAFT"),
      ]);

      if (pubRes.ok) {
        const data = await pubRes.json();
        setPublished(Array.isArray(data) ? data : data.listings || []);
      }
      if (draftRes.ok) {
        const data = await draftRes.json();
        setDrafts(Array.isArray(data) ? data : data.listings || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role === "ADMIN") fetchData();
  }, [user]);

  if (authLoading || !user || user.role !== "ADMIN") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  async function handleApprove(id: string) {
    setActionLoading(id);
    try {
      await apiFetch(`/listings/${id}/approve`, { method: "PATCH" });
      await fetchData();
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
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setActionLoading(id);
    try {
      await apiFetch(`/listings/${id}`, { method: "DELETE" });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUnpublish(id: string) {
    setActionLoading(id);
    try {
      await apiFetch(`/listings/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "DRAFT" }),
      });
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  }

  function filterListings(listings: Listing[]) {
    if (!searchQuery) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        (l.country && l.country.toLowerCase().includes(q))
    );
  }

  function ListingRow({
    listing,
    showApprove,
  }: {
    listing: Listing;
    showApprove?: boolean;
  }) {
    const isActioning = actionLoading === listing._id;

    return (
      <Card className="mb-2">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-semibold truncate max-w-md">
                  {listing.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {listing.type}
                </Badge>
                <Badge
                  variant="outline"
                  className="text-xs"
                >
                  {listing.source === "AI_SCOUTED" ? "AI" : "User"}
                </Badge>
                {listing.status === "DRAFT" && (
                  <Badge variant="destructive" className="text-xs">
                    Draft
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {listing.description}
              </p>
              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                {listing.organizationName && (
                  <span>{listing.organizationName}</span>
                )}
                {listing.country && <span>{listing.country}</span>}
                <span>
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-1 shrink-0">
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

              {showApprove && (
                <Button
                  size="sm"
                  onClick={() => handleApprove(listing._id)}
                  disabled={isActioning}
                >
                  {isActioning ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                </Button>
              )}

              {!showApprove && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleUnpublish(listing._id)}
                  disabled={isActioning}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}

              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(listing._id)}
                disabled={isActioning}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage listings, users, and platform settings
          </p>
        </div>
        <Button variant="outline" render={<Link href="/admin/scouter" />}>
          <Radar className="mr-2 h-4 w-4" />
          AI Scouter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <FileText className="h-8 w-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold">{published.length}</div>
              <div className="text-xs text-muted-foreground">Published</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-8 w-8 text-orange-500" />
            <div>
              <div className="text-2xl font-bold">{drafts.length}</div>
              <div className="text-xs text-muted-foreground">
                Pending / Flagged
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BarChart3 className="h-8 w-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">
                {published.length + drafts.length}
              </div>
              <div className="text-xs text-muted-foreground">Total</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Globe className="h-8 w-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold">
                {
                  published.filter((l) => l.source === "AI_SCOUTED").length
                }
              </div>
              <div className="text-xs text-muted-foreground">AI Scouted</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search listings by title, type, or country..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v ?? activeTab)}
      >
        <TabsList>
          <TabsTrigger value="published">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Published ({published.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-1.5" />
            Pending ({drafts.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="published" className="mt-4">
          {filterListings(published).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No listings match your search"
                : "No published listings"}
            </div>
          ) : (
            filterListings(published).map((listing) => (
              <ListingRow key={listing._id} listing={listing} />
            ))
          )}
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          {filterListings(drafts).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery
                ? "No listings match your search"
                : "No pending listings — AI moderation is handling everything"}
            </div>
          ) : (
            filterListings(drafts).map((listing) => (
              <ListingRow
                key={listing._id}
                listing={listing}
                showApprove
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

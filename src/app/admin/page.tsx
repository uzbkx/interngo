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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Loader2,
  Eye,
  Clock,
  Radar,
  Trash2,
  Search,
  Users,
  FileText,
  Globe,
  LayoutDashboard,
  Shield,
  TrendingUp,
  Sparkles,
  UserCog,
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

interface Stats {
  totalUsers: number;
  totalPublished: number;
  totalPending: number;
  totalListings: number;
  aiScouted: number;
}

export default function AdminPage() {
  const [published, setPublished] = useState<Listing[]>([]);
  const [drafts, setDrafts] = useState<Listing[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      const [pubRes, draftRes, usersRes, statsRes] = await Promise.all([
        apiFetch("/admin/listings?status=PUBLISHED"),
        apiFetch("/admin/listings?status=DRAFT"),
        apiFetch("/admin/users"),
        apiFetch("/admin/stats"),
      ]);

      if (pubRes.ok) {
        const data = await pubRes.json();
        setPublished(Array.isArray(data) ? data : data.listings || []);
      }
      if (draftRes.ok) {
        const data = await draftRes.json();
        setDrafts(Array.isArray(data) ? data : data.listings || []);
      }
      if (usersRes.ok) {
        const data = await usersRes.json();
        setUsers(Array.isArray(data) ? data : []);
      }
      if (statsRes.ok) {
        setStats(await statsRes.json());
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
      toast.success("Listing approved");
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this listing permanently?")) return;
    setActionLoading(id);
    try {
      await apiFetch(`/listings/${id}`, { method: "DELETE" });
      toast.success("Listing deleted");
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
      toast.success("Listing unpublished");
      await fetchData();
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    try {
      await apiFetch(`/admin/users/${userId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      toast.success("Role updated");
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch {
      toast.error("Failed to update role");
    }
  }

  function filterListings(listings: Listing[]) {
    if (!searchQuery) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q) ||
        (l.country && l.country.toLowerCase().includes(q)) ||
        (l.organizationName && l.organizationName.toLowerCase().includes(q))
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats?.totalUsers || users.length, icon: Users, color: "border-l-indigo-500", iconColor: "text-indigo-500" },
    { label: "Published", value: stats?.totalPublished || published.length, icon: FileText, color: "border-l-emerald-500", iconColor: "text-emerald-500" },
    { label: "Pending", value: stats?.totalPending || drafts.length, icon: Clock, color: "border-l-amber-500", iconColor: "text-amber-500" },
    { label: "AI Scouted", value: stats?.aiScouted || 0, icon: Sparkles, color: "border-l-blue-500", iconColor: "text-blue-500" },
    { label: "Total Listings", value: stats?.totalListings || published.length + drafts.length, icon: TrendingUp, color: "border-l-violet-500", iconColor: "text-violet-500" },
    { label: "Scouter Sources", value: "98", icon: Globe, color: "border-l-cyan-500", iconColor: "text-cyan-500" },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Overview of InternGo platform — listings, users, and scouter
          </p>
        </div>
        <Button render={<Link href="/admin/scouter" />} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <Radar className="mr-2 h-4 w-4" />
          AI Scouter
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {statCards.map((s) => (
          <Card key={s.label} className={`border-l-4 ${s.color}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-1">
                <s.icon className={`h-4 w-4 ${s.iconColor}`} />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-1.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="published">
            <CheckCircle className="h-4 w-4 mr-1.5" />
            Published ({published.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            <Clock className="h-4 w-4 mr-1.5" />
            Pending ({drafts.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-1.5" />
            Users ({users.length})
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent pending */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Clock className="h-4 w-4 text-amber-500" />
                  Pending Review ({drafts.length})
                </h3>
                {drafts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending listings</p>
                ) : (
                  <div className="space-y-2">
                    {drafts.slice(0, 5).map((l) => (
                      <div key={l._id} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{l.title}</p>
                          <p className="text-xs text-muted-foreground">{l.source === "AI_SCOUTED" ? "AI" : "User"} · {new Date(l.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button size="sm" variant="ghost" onClick={() => handleApprove(l._id)} disabled={actionLoading === l._id}>
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(l._id)} disabled={actionLoading === l._id}>
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {drafts.length > 5 && <p className="text-xs text-muted-foreground text-center pt-2">+{drafts.length - 5} more</p>}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent users */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Users className="h-4 w-4 text-indigo-500" />
                  Recent Users
                </h3>
                <div className="space-y-2">
                  {users.slice(0, 5).map((u) => (
                    <div key={u._id} className="flex items-center justify-between gap-2 py-1.5 border-b border-border/50 last:border-0">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{u.name || "No name"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                      <Badge variant={u.role === "ADMIN" ? "default" : "secondary"} className="text-xs shrink-0">
                        {u.role === "ADMIN" && <Shield className="h-3 w-3 mr-0.5" />}
                        {u.role}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Listing types breakdown */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-violet-500" />
                  Listings by Type
                </h3>
                <div className="space-y-2">
                  {["INTERNSHIP", "SCHOLARSHIP", "PROGRAM", "VOLUNTEER", "JOB", "OTHER"].map((type) => {
                    const count = published.filter((l) => l.type === type).length;
                    if (count === 0) return null;
                    const total = published.length || 1;
                    return (
                      <div key={type} className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground w-24">{type}</span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: `${(count / total) * 100}%` }} />
                        </div>
                        <span className="text-xs font-medium w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Source breakdown */}
            <Card>
              <CardContent className="p-5">
                <h3 className="font-semibold flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  Listings by Source
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{published.filter((l) => l.source === "AI_SCOUTED").length}</div>
                    <div className="text-xs text-muted-foreground mt-1">AI Scouted</div>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold">{published.filter((l) => l.source !== "AI_SCOUTED").length}</div>
                    <div className="text-xs text-muted-foreground mt-1">User Submitted</div>
                  </div>
                </div>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full" render={<Link href="/admin/scouter" />}>
                  <Radar className="h-4 w-4 mr-2" />
                  Manage Scouter Sources
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Published Tab */}
        <TabsContent value="published" className="mt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search listings..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
          </div>
          {filterListings(published).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>{searchQuery ? "No listings match" : "No published listings"}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filterListings(published).map((listing) => (
                <Card key={listing._id}>
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold truncate max-w-md">{listing.title}</h3>
                        <Badge variant="secondary" className="text-xs">{listing.type}</Badge>
                        <Badge variant="outline" className="text-xs">{listing.source === "AI_SCOUTED" ? "AI" : "User"}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{listing.description}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        {listing.organizationName && <span>{listing.organizationName}</span>}
                        {listing.country && <span>{listing.country}</span>}
                        <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" variant="ghost" render={<a href={`/listings/${listing.slug}`} target="_blank" rel="noopener noreferrer" />}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUnpublish(listing._id)} disabled={actionLoading === listing._id}>
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(listing._id)} disabled={actionLoading === listing._id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Pending Tab */}
        <TabsContent value="pending" className="mt-4">
          {drafts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>No pending listings — all clear</p>
            </div>
          ) : (
            <div className="space-y-2">
              {drafts.map((listing) => (
                <Card key={listing._id}>
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-semibold truncate max-w-md">{listing.title}</h3>
                        <Badge variant="secondary" className="text-xs">{listing.type}</Badge>
                        <Badge variant="outline" className="text-xs">{listing.source === "AI_SCOUTED" ? "AI" : "User"}</Badge>
                        <Badge variant="destructive" className="text-xs">Draft</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{listing.description}</p>
                      <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                        {listing.organizationName && <span>{listing.organizationName}</span>}
                        <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="sm" onClick={() => handleApprove(listing._id)} disabled={actionLoading === listing._id}>
                        {actionLoading === listing._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(listing._id)} disabled={actionLoading === listing._id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="mt-4">
          <div className="space-y-2">
            {users.map((u) => (
              <Card key={u._id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{u.name || "No name"}</p>
                      {u.role === "ADMIN" && (
                        <Badge className="text-xs bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                          <Shield className="h-3 w-3 mr-0.5" />Admin
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{u.email}</p>
                    <p className="text-xs text-muted-foreground">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="shrink-0">
                    <Select
                      value={u.role}
                      onValueChange={(v) => { if (v) handleRoleChange(u._id, v); }}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STUDENT">Student</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

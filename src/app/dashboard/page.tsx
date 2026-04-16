"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bookmark,
  ClipboardList,
  MapPin,
  Calendar,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface Listing {
  id: string;
  title: string;
  slug: string;
  type: string;
  country: string | null;
  deadline: string | null;
  organization?: { name: string } | null;
}

interface SavedItem {
  id: string;
  listingId: string;
  createdAt: string;
  listing: Listing;
}

interface Application {
  id: string;
  listingId: string;
  status: string;
  notes: string | null;
  updatedAt: string;
  listing: Listing;
}

const STATUS_KEYS = [
  "INTERESTED",
  "APPLIED",
  "INTERVIEW",
  "ACCEPTED",
  "REJECTED",
  "WITHDRAWN",
] as const;

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const ts = useTranslations("status");
  const tc = useTranslations("common");
  const { user, loading: authLoading } = useAuth();

  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    setLoading(true);
    try {
      const [savedRes, appsRes] = await Promise.all([
        apiFetch("/saved"),
        apiFetch("/applications"),
      ]);
      const savedData = await savedRes.json();
      const appsData = await appsRes.json();
      setSaved(savedData.saved || []);
      setApplications(appsData.applications || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  if (!authLoading && !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-full border border-border mb-4">
          <Bookmark className="h-6 w-6 text-primary" />
        </div>
        <h2 className="text-xl font-semibold mb-2">{t("title")}</h2>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">{t("description")}</p>
        <div className="flex gap-3">
          <Button render={<Link href="/auth/login" />} className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
            {tc("login")}
          </Button>
          <Button variant="outline" render={<Link href="/auth/signup" />}>
            {tc("signup")}
          </Button>
        </div>
      </div>
    );
  }

  async function handleUnsave(listingId: string) {
    await apiFetch("/saved", {
      method: "POST",
      body: JSON.stringify({ listingId }),
    });
    setSaved((prev) => prev.filter((s) => s.listingId !== listingId));
  }

  async function handleStatusChange(appId: string, newStatus: string) {
    await apiFetch(`/applications/${appId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, status: newStatus } : a))
    );
  }

  async function handleDeleteApp(appId: string) {
    await apiFetch(`/applications/${appId}`, { method: "DELETE" });
    setApplications((prev) => prev.filter((a) => a.id !== appId));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: t("saved"), value: saved.length, color: "border-l-indigo-500" },
          { label: t("applied"), value: applications.filter((a) => a.status === "APPLIED").length, color: "border-l-blue-500" },
          { label: t("interviews"), value: applications.filter((a) => a.status === "INTERVIEW").length, color: "border-l-amber-500" },
          { label: t("accepted"), value: applications.filter((a) => a.status === "ACCEPTED").length, color: "border-l-emerald-500" },
        ].map((stat) => (
          <Card key={stat.label} className={`border-l-4 ${stat.color}`}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="saved">
        <TabsList>
          <TabsTrigger value="saved">
            <Bookmark className="h-3.5 w-3.5 mr-1.5" />
            {t("saved")} ({saved.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            <ClipboardList className="h-3.5 w-3.5 mr-1.5" />
            {t("applications")} ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-3">
          {saved.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm mb-3">{t("noSaved")}</p>
              <Button variant="outline" size="sm" render={<Link href="/listings" />}>
                {t("browseOpportunities")}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {saved.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${item.listing.slug}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                          {item.listing.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          {item.listing.organization && <span>{item.listing.organization.name}</span>}
                          {item.listing.country && (
                            <span className="flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />{item.listing.country}
                            </span>
                          )}
                          {item.listing.deadline && (
                            <span className="flex items-center gap-0.5">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.listing.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="outline" className="text-[10px]">{item.listing.type}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => handleUnsave(item.listingId)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-3">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm mb-1">{t("noApplications")}</p>
              <p className="text-xs">{t("noApplicationsHint")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${app.listing.slug}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                          {app.listing.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                          {app.listing.organization && <span>{app.listing.organization.name}</span>}
                          <span>{new Date(app.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {app.notes && (
                          <p className="text-xs text-muted-foreground mt-1.5 bg-muted px-2 py-1 rounded">{app.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v ?? app.status)}>
                          <SelectTrigger className="w-28 h-7 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_KEYS.map((key) => (
                              <SelectItem key={key} value={key}>
                                {ts(key)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" render={<Link href={`/listings/${app.listing.slug}`} />}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteApp(app.id)}>
                          <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

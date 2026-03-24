"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
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

const statusColors: Record<string, string> = {
  INTERESTED: "bg-blue-100 text-blue-800",
  APPLIED: "bg-yellow-100 text-yellow-800",
  INTERVIEW: "bg-purple-100 text-purple-800",
  ACCEPTED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  WITHDRAWN: "bg-gray-100 text-gray-800",
};

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const ts = useTranslations("status");

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
    fetchData();
  }, []);

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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{saved.length}</div>
            <div className="text-xs text-muted-foreground">{t("saved")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {applications.filter((a) => a.status === "APPLIED").length}
            </div>
            <div className="text-xs text-muted-foreground">{t("applied")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {applications.filter((a) => a.status === "INTERVIEW").length}
            </div>
            <div className="text-xs text-muted-foreground">{t("interviews")}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {applications.filter((a) => a.status === "ACCEPTED").length}
            </div>
            <div className="text-xs text-muted-foreground">{t("accepted")}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="saved">
        <TabsList>
          <TabsTrigger value="saved">
            <Bookmark className="h-4 w-4 mr-1.5" />
            {t("saved")} ({saved.length})
          </TabsTrigger>
          <TabsTrigger value="applications">
            <ClipboardList className="h-4 w-4 mr-1.5" />
            {t("applications")} ({applications.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="saved" className="mt-4">
          {saved.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bookmark className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="mb-2">{t("noSaved")}</p>
              <Button variant="outline" render={<Link href="/listings" />}>
                {t("browseOpportunities")}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {saved.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${item.listing.slug}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                          {item.listing.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          {item.listing.organization && <span>{item.listing.organization.name}</span>}
                          {item.listing.country && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />{item.listing.country}
                            </span>
                          )}
                          {item.listing.deadline && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(item.listing.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">{item.listing.type}</Badge>
                        <Button size="sm" variant="ghost" onClick={() => handleUnsave(item.listingId)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          {applications.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ClipboardList className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="mb-2">{t("noApplications")}</p>
              <p className="text-sm">{t("noApplicationsHint")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${app.listing.slug}`} className="font-semibold hover:text-primary transition-colors line-clamp-1">
                          {app.listing.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                          {app.listing.organization && <span>{app.listing.organization.name}</span>}
                          <span>{t("updated")} {new Date(app.updatedAt).toLocaleDateString()}</span>
                        </div>
                        {app.notes && (
                          <p className="text-xs text-muted-foreground mt-2 bg-muted p-2 rounded">{app.notes}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select value={app.status} onValueChange={(v) => handleStatusChange(app.id, v ?? app.status)}>
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_KEYS.map((key) => (
                              <SelectItem key={key} value={key}>
                                <Badge variant="secondary" className={`text-xs ${statusColors[key] || ""}`}>
                                  {ts(key)}
                                </Badge>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button size="sm" variant="ghost" render={<Link href={`/listings/${app.listing.slug}`} />}>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDeleteApp(app.id)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
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

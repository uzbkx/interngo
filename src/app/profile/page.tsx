"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingCard } from "@/components/listing-card";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Save,
  Loader2,
  Check,
  Building2,
  LogOut,
  Heart,
  Settings,
  Send,
  Copy,
  LinkIcon,
  Unlink,
  Sparkles,
  Bell,
  Globe,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Profile {
  _id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
  telegramId?: string;
  telegramUsername?: string;
  preferredTypes?: string[];
  preferredCountries?: string[];
  preferRemote?: boolean;
  preferPaid?: boolean;
  notificationsEnabled?: boolean;
}

interface Organization {
  _id: string;
  name: string;
  description: string;
  website: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [org, setOrg] = useState<Organization | null>(null);
  const [savedListings, setSavedListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [telegramCode, setTelegramCode] = useState("");
  const [telegramLoading, setTelegramLoading] = useState(false);
  const [prefTypes, setPrefTypes] = useState<string[]>([]);
  const [prefCountries, setPrefCountries] = useState("");
  const [prefRemote, setPrefRemote] = useState(false);
  const [prefPaid, setPrefPaid] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [prefSaving, setPrefSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      apiFetch("/users/profile").then((r) => r.json()),
      apiFetch("/organizations/mine").then((r) => r.json()),
      apiFetch("/saved").then((r) => r.json()),
    ])
      .then(([profileData, orgData, savedData]) => {
        setProfile(profileData);
        setName(profileData.name || "");
        setBio(profileData.bio || "");
        setPrefTypes(profileData.preferredTypes || []);
        setPrefCountries((profileData.preferredCountries || []).join(", "));
        setPrefRemote(profileData.preferRemote || false);
        setPrefPaid(profileData.preferPaid || false);
        setNotifEnabled(profileData.notificationsEnabled || false);
        setOrg(orgData.organization || null);
        setSavedListings(savedData.saved || []);
      })
      .catch(() => {
        window.location.href = "/auth/login";
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await apiFetch("/users/profile", {
        method: "PATCH",
        body: JSON.stringify({ name, bio }),
      });
      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  }

  async function handleUnsave(listingId: string) {
    await apiFetch("/saved", {
      method: "POST",
      body: JSON.stringify({ listingId }),
    });
    setSavedListings((prev) => prev.filter((s) => s.listingId !== listingId && s.listing?._id !== listingId));
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-0.5">My Profile</h1>
          <p className="text-sm text-muted-foreground">Manage your account</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          <LogOut className="h-3.5 w-3.5 mr-1.5" />
          Log out
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <Settings className="h-3.5 w-3.5 mr-1.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="interests">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Interests
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="h-3.5 w-3.5 mr-1.5" />
            Saved ({savedListings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                  {(profile.name || profile.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{profile.name || "No name set"}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {profile.email}
                  </p>
                  <div className="flex gap-1.5 mt-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5">
                      <Shield className="h-2.5 w-2.5 mr-0.5" />
                      {profile.role}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] px-1.5">
                      <Calendar className="h-2.5 w-2.5 mr-0.5" />
                      {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-xs">Display Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="h-9" />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-xs">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={2} />
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}

                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Saving...</>
                  ) : saved ? (
                    <><Check className="mr-1.5 h-3.5 w-3.5" />Saved</>
                  ) : (
                    <><Save className="mr-1.5 h-3.5 w-3.5" />Save Changes</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                Organization
              </h2>

              {org ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                    {org.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{org.name}</p>
                    {org.website && (
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        {org.website}
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-3">
                  <p className="text-xs text-muted-foreground mb-2">No organization yet.</p>
                  <Button variant="outline" size="sm" onClick={() => (window.location.href = "/post")}>
                    <Building2 className="mr-1.5 h-3.5 w-3.5" />
                    Create Organization
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Telegram Connect */}
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-medium mb-3 flex items-center gap-1.5">
                <Send className="h-4 w-4" />
                Telegram Bot
              </h2>

              {profile.telegramId ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs">
                      <LinkIcon className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    {profile.telegramUsername && (
                      <span className="text-xs text-muted-foreground">@{profile.telegramUsername}</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={async () => {
                      await apiFetch("/users/telegram/unlink", { method: "DELETE" });
                      setProfile((p) => p ? { ...p, telegramId: undefined, telegramUsername: undefined } : p);
                    }}
                  >
                    <Unlink className="h-3.5 w-3.5 mr-1" />
                    Unlink
                  </Button>
                </div>
              ) : telegramCode ? (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    Send this code to <a href="https://t.me/interngouzbot" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">@interngouzbot</a> on Telegram:
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 bg-muted px-4 py-2 rounded-lg text-center text-lg font-bold tracking-widest">
                      {telegramCode}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(`/link ${telegramCode}`);
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Code expires in 10 minutes. Send: <code className="bg-muted px-1 rounded">/link {telegramCode}</code>
                  </p>
                </div>
              ) : (
                <div className="text-center py-2">
                  <p className="text-xs text-muted-foreground mb-3">
                    Connect your Telegram to get notified about new opportunities
                  </p>
                  <Button
                    size="sm"
                    disabled={telegramLoading}
                    onClick={async () => {
                      setTelegramLoading(true);
                      try {
                        const res = await apiFetch("/users/telegram/link-code", { method: "POST" });
                        const data = await res.json();
                        setTelegramCode(data.code);
                      } catch {}
                      setTelegramLoading(false);
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                  >
                    {telegramLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Send className="h-3.5 w-3.5 mr-1.5" />}
                    Connect Telegram
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="interests" className="mt-4 space-y-4">
          <Card>
            <CardContent className="p-5">
              <h2 className="text-sm font-medium mb-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                Opportunity Preferences
              </h2>
              <p className="text-xs text-muted-foreground mb-4">
                Set your interests to filter opportunities on the site and receive matching notifications via Telegram bot.
              </p>

              <div className="space-y-5">
                {/* Opportunity Types */}
                <div>
                  <Label className="text-xs font-medium mb-2 block">Opportunity Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {["INTERNSHIP", "SCHOLARSHIP", "PROGRAM", "VOLUNTEER", "JOB"].map((type) => {
                      const labels: Record<string, string> = { INTERNSHIP: "Internships", SCHOLARSHIP: "Scholarships", PROGRAM: "Programs", VOLUNTEER: "Volunteering", JOB: "Jobs" };
                      const isSelected = prefTypes.includes(type);
                      return (
                        <button
                          key={type}
                          onClick={() => setPrefTypes((prev) => isSelected ? prev.filter((t) => t !== type) : [...prev, type])}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-sm"
                              : "bg-secondary text-secondary-foreground hover:bg-accent"
                          }`}
                        >
                          {labels[type]}
                        </button>
                      );
                    })}
                  </div>
                  {prefTypes.length === 0 && (
                    <p className="text-[11px] text-muted-foreground mt-1.5">Select at least one type to receive notifications</p>
                  )}
                </div>

                <Separator />

                {/* Countries */}
                <div>
                  <Label className="text-xs font-medium flex items-center gap-1 mb-2">
                    <MapPin className="h-3 w-3" />
                    Preferred Countries
                  </Label>
                  <Input
                    placeholder="e.g. USA, Germany, Japan, South Korea"
                    value={prefCountries}
                    onChange={(e) => setPrefCountries(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">Comma-separated. Leave empty for all countries.</p>
                </div>

                <Separator />

                {/* Toggles */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      Remote opportunities only
                    </Label>
                    <Switch checked={prefRemote} onCheckedChange={setPrefRemote} />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5" />
                      Paid opportunities only
                    </Label>
                    <Switch checked={prefPaid} onCheckedChange={setPrefPaid} />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs flex items-center gap-1.5">
                        <Bell className="h-3.5 w-3.5" />
                        Telegram Notifications
                      </Label>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {profile.telegramId
                          ? "Receive matching opportunities via Telegram"
                          : "Connect Telegram first to enable notifications"}
                      </p>
                    </div>
                    <Switch
                      checked={notifEnabled}
                      onCheckedChange={setNotifEnabled}
                      disabled={!profile.telegramId}
                    />
                  </div>
                </div>

                <Separator />

                <Button
                  size="sm"
                  disabled={prefSaving}
                  onClick={async () => {
                    setPrefSaving(true);
                    try {
                      const countries = prefCountries.split(",").map((c) => c.trim()).filter(Boolean);
                      await apiFetch("/users/preferences", {
                        method: "PATCH",
                        body: JSON.stringify({
                          preferredTypes: prefTypes,
                          preferredCountries: countries,
                          preferRemote: prefRemote,
                          preferPaid: prefPaid,
                          notificationsEnabled: notifEnabled,
                        }),
                      });
                      toast.success("Preferences saved!");
                    } catch {
                      toast.error("Failed to save preferences");
                    } finally {
                      setPrefSaving(false);
                    }
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                >
                  {prefSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : <Save className="h-3.5 w-3.5 mr-1.5" />}
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="mt-4">
          {savedListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="h-8 w-8 mx-auto mb-2 opacity-20" />
              <p className="text-sm mb-3">No saved listings yet</p>
              <Button variant="outline" size="sm" render={<Link href="/listings" />}>
                Browse Opportunities
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {savedListings.map((item: any) => {
                const listing = item.listing || item;
                return (
                  <div key={item._id || listing._id} className="relative">
                    <ListingCard
                      id={listing._id}
                      title={listing.title}
                      slug={listing.slug}
                      type={listing.type}
                      organization={listing.organizationId?.name || listing.organizationName}
                      location={listing.location}
                      country={listing.country}
                      isRemote={listing.isRemote}
                      isPaid={listing.isPaid}
                      deadline={listing.deadline ? new Date(listing.deadline) : null}
                      description={listing.description}
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleUnsave(listing._id || item.listingId);
                      }}
                      className="absolute top-2 right-2 bg-background rounded-full p-1 shadow-sm border hover:bg-muted transition-colors z-10"
                      title="Remove from saved"
                    >
                      <Heart className="h-3.5 w-3.5 text-primary fill-primary" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

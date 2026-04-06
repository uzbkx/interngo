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
} from "lucide-react";

interface Profile {
  _id: string;
  email: string;
  name: string;
  bio: string;
  avatarUrl: string;
  role: string;
  createdAt: string;
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

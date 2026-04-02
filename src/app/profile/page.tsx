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
  FileText,
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
  const [myListings, setMyListings] = useState<any[]>([]);
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
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1">My Profile</h1>
          <p className="text-muted-foreground">Manage your account and see your activity</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">
            <Settings className="h-4 w-4 mr-1.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="saved">
            <Heart className="h-4 w-4 mr-1.5" />
            Saved ({savedListings.length})
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-4 space-y-6">
          {/* Account info card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Account Info
              </h2>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                  {(profile.name || profile.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-medium">{profile.name || "No name set"}</p>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {profile.email}
                  </p>
                  <div className="flex gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      <Shield className="h-3 w-3 mr-1" />
                      {profile.role}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      Joined {new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Display Name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : saved ? (
                    <><Check className="mr-2 h-4 w-4" />Saved</>
                  ) : (
                    <><Save className="mr-2 h-4 w-4" />Save Changes</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Organization card */}
          <Card>
            <CardContent className="p-6">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization
              </h2>

              {org ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {org.name[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{org.name}</p>
                    {org.website && (
                      <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                        {org.website}
                      </a>
                    )}
                    {org.description && <p className="text-sm text-muted-foreground mt-1">{org.description}</p>}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No organization yet.</p>
                  <Button variant="outline" onClick={() => (window.location.href = "/post")}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Create Organization
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saved Listings Tab */}
        <TabsContent value="saved" className="mt-4">
          {savedListings.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Heart className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="mb-2">No saved listings yet</p>
              <Button variant="outline" render={<Link href="/listings" />}>
                Browse Opportunities
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow hover:bg-red-50 transition-colors z-10"
                      title="Remove from saved"
                    >
                      <Heart className="h-4 w-4 text-red-500 fill-red-500" />
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

"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Send,
  Loader2,
  Building2,
  User,
  ArrowLeft,
} from "lucide-react";

const TYPE_KEYS = [
  "INTERNSHIP",
  "SCHOLARSHIP",
  "PROGRAM",
  "VOLUNTEER",
  "JOB",
  "OTHER",
] as const;

type PostMode = "choose" | "org-create" | "form";

interface Organization {
  _id: string;
  name: string;
  description?: string;
  website?: string;
}

export default function PostListingPage() {
  const t = useTranslations("post");
  const tt = useTranslations("types");

  const [mode, setMode] = useState<PostMode>("choose");
  const [postAs, setPostAs] = useState<"organization" | "individual" | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // Check if user has an organization
  useEffect(() => {
    apiFetch("/organizations/mine")
      .then((res) => res.json())
      .then((data) => {
        if (data.organization) {
          setOrganization(data.organization);
        }
      })
      .catch(() => {});
  }, []);

  function handleChooseOrg() {
    if (organization) {
      setPostAs("organization");
      setMode("form");
    } else {
      setMode("org-create");
    }
  }

  function handleChooseIndividual() {
    setPostAs("individual");
    setMode("form");
  }

  async function handleCreateOrg(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingOrg(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("orgName"),
      description: form.get("orgDescription"),
      website: form.get("orgWebsite") || undefined,
    };

    try {
      const res = await apiFetch("/organizations", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create organization");
      }
      const data = await res.json();
      setOrganization(data.organization);
      setPostAs("organization");
      setMode("form");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setLoadingOrg(false);
    }
  }

  async function handleSubmitListing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body: Record<string, unknown> = {
      title: formData.get("title"),
      type,
      description: formData.get("description"),
      country: formData.get("country") || undefined,
      city: formData.get("city") || undefined,
      deadline: formData.get("deadline") || undefined,
      applyUrl: formData.get("applyUrl") || undefined,
      isRemote,
      isPaid,
    };

    if (postAs === "organization" && organization) {
      body.organizationId = organization._id;
      body.organizationName = organization.name;
    } else {
      body.organizationName = formData.get("posterName") || undefined;
      body.postedBy = "individual";
    }

    try {
      const res = await apiFetch("/listings", {
        method: "POST",
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setLoading(false);
    }
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <GraduationCap className="h-10 w-10 mx-auto text-primary mb-3" />
            <h1 className="text-2xl font-bold mb-2">{t("successTitle")}</h1>
            <p className="text-muted-foreground">{t("successDesc")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 1: Choose how to post
  if (mode === "choose") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 hover:border-primary/30"
            onClick={handleChooseOrg}
          >
            <CardContent className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">As Organization</h3>
              <p className="text-sm text-muted-foreground">
                Post on behalf of a company, university, or organization
              </p>
              {organization && (
                <p className="text-xs text-primary mt-3 font-medium">
                  {organization.name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-0.5 hover:border-primary/30"
            onClick={handleChooseIndividual}
          >
            <CardContent className="p-8 text-center">
              <User className="h-12 w-12 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">As Individual</h3>
              <p className="text-sm text-muted-foreground">
                Share an opportunity you found or want to recommend
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Step 2: Create organization (if needed)
  if (mode === "org-create") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4"
          onClick={() => setMode("choose")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <h1 className="text-2xl font-bold mb-2">Create Your Organization</h1>
        <p className="text-muted-foreground mb-6">
          Set up your organization profile to post opportunities
        </p>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <Label htmlFor="orgName">Organization Name *</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  placeholder="e.g. Google, United Nations, MIT"
                  required
                />
              </div>
              <div>
                <Label htmlFor="orgDescription">Description</Label>
                <Textarea
                  id="orgDescription"
                  name="orgDescription"
                  placeholder="Brief description of your organization..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="orgWebsite">Website</Label>
                <Input
                  id="orgWebsite"
                  name="orgWebsite"
                  type="url"
                  placeholder="https://..."
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={loadingOrg}>
                {loadingOrg ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
                ) : (
                  <><Building2 className="mr-2 h-4 w-4" />Create & Continue</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Listing form
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-4"
        onClick={() => { setMode("choose"); setError(""); }}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-sm text-muted-foreground">
          Posting as{" "}
          <span className="font-medium text-foreground">
            {postAs === "organization" && organization
              ? organization.name
              : "Individual"}
          </span>
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmitListing} className="space-y-6">
            <div>
              <Label htmlFor="title">{t("fieldTitle")} *</Label>
              <Input id="title" name="title" placeholder={t("titlePlaceholder")} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type">{t("fieldType")} *</Label>
                <Select value={type} onValueChange={(v) => setType(v ?? "")} required>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPE_KEYS.map((key) => (
                      <SelectItem key={key} value={key}>
                        {tt(key)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {postAs === "individual" && (
                <div>
                  <Label htmlFor="posterName">Your Name</Label>
                  <Input id="posterName" name="posterName" placeholder="Your name (optional)" />
                </div>
              )}
              {postAs === "organization" && (
                <div>
                  <Label>{t("fieldOrg")}</Label>
                  <Input value={organization?.name || ""} disabled />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description">{t("fieldDesc")} *</Label>
              <Textarea id="description" name="description" placeholder={t("descPlaceholder")} rows={8} required />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="country">{t("fieldCountry")}</Label>
                <Input id="country" name="country" placeholder={t("countryPlaceholder")} />
              </div>
              <div>
                <Label htmlFor="city">{t("fieldCity")}</Label>
                <Input id="city" name="city" placeholder={t("cityPlaceholder")} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">{t("fieldDeadline")}</Label>
                <Input id="deadline" name="deadline" type="date" />
              </div>
              <div>
                <Label htmlFor="applyUrl">{t("fieldApplyUrl")}</Label>
                <Input id="applyUrl" name="applyUrl" type="url" placeholder="https://..." />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} />
                {t("remoteAvailable")}
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} />
                {t("paidOpportunity")}
              </label>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" size="lg" className="w-full" disabled={loading || !type}>
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("submitting")}</>
              ) : (
                <><Send className="mr-2 h-4 w-4" />{t("submit")}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

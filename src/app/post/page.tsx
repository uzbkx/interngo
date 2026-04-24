"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Captcha, type CaptchaRef } from "@/components/captcha";
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
import { Switch } from "@/components/ui/switch";
import {
  Send,
  Loader2,
  Building2,
  User,
  ArrowLeft,
  CheckCircle,
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
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      try {
        sessionStorage.setItem("postLoginRedirect", "/post");
      } catch {}
      router.replace("/auth/login?redirect=/post");
    }
  }, [authLoading, user, router]);

  const [mode, setMode] = useState<PostMode>("choose");
  const [postAs, setPostAs] = useState<"organization" | "individual" | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loadingOrg, setLoadingOrg] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const captchaRef = useRef<CaptchaRef>(null);
  const [type, setType] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [applicationFee, setApplicationFee] = useState("");

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
      website: form.get("orgWebsite") ? `https://${(form.get("orgWebsite") as string).replace(/^https?:\/\//, "")}` : undefined,
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

    const captchaToken = captchaRef.current?.getToken();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

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
      isFree,
      applicationFee: applicationFee || undefined,
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

  if (authLoading || !user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-emerald-500 to-green-500" />
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold mb-2">{t("successTitle")}</h1>
            <p className="text-sm text-muted-foreground">{t("successDesc")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === "choose") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card
            className="cursor-pointer hover:border-primary/30 transition-colors"
            onClick={handleChooseOrg}
          >
            <CardContent className="p-6 text-center">
              <Building2 className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="text-sm font-medium mb-1">As Organization</h3>
              <p className="text-xs text-muted-foreground">
                Post on behalf of a company or organization
              </p>
              {organization && (
                <p className="text-xs text-primary mt-2 font-medium">
                  {organization.name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer hover:border-primary/30 transition-colors"
            onClick={handleChooseIndividual}
          >
            <CardContent className="p-6 text-center">
              <User className="h-8 w-8 mx-auto text-primary mb-3" />
              <h3 className="text-sm font-medium mb-1">As Individual</h3>
              <p className="text-xs text-muted-foreground">
                Share an opportunity you found
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === "org-create") {
    return (
      <div className="container mx-auto px-4 py-8 max-w-md">
        <Button
          variant="ghost"
          size="sm"
          className="mb-3 -ml-2"
          onClick={() => setMode("choose")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>

        <h1 className="text-xl font-bold mb-1">Create Your Organization</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Set up your organization profile
        </p>

        <Card>
          <CardContent className="p-5">
            <form onSubmit={handleCreateOrg} className="space-y-3">
              <div>
                <Label htmlFor="orgName" className="text-xs">Organization Name *</Label>
                <Input id="orgName" name="orgName" placeholder="e.g. Google, United Nations" required className="h-9" />
              </div>
              <div>
                <Label htmlFor="orgDescription" className="text-xs">Description</Label>
                <Textarea id="orgDescription" name="orgDescription" placeholder="Brief description..." rows={2} />
              </div>
              <div>
                <Label htmlFor="orgWebsite" className="text-xs">Website</Label>
                <div className="flex h-9">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-input bg-muted text-muted-foreground text-xs">https://</span>
                  <input
                    id="orgWebsite"
                    name="orgWebsite"
                    placeholder="google.com"
                    className="flex h-9 w-full rounded-r-lg rounded-l-none border border-input bg-background px-3 py-2 text-sm shadow-sm shadow-black/5 placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
                    onChange={(e) => {
                      const val = e.target.value.replace(/^https?:\/\//, "");
                      e.target.value = val;
                    }}
                  />
                </div>
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button type="submit" className="w-full" size="sm" disabled={loadingOrg}>
                {loadingOrg ? (
                  <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Creating...</>
                ) : (
                  <><Building2 className="mr-1.5 h-3.5 w-3.5" />Create & Continue</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <Button
        variant="ghost"
        size="sm"
        className="mb-3 -ml-2"
        onClick={() => { setMode("choose"); setError(""); }}
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back
      </Button>

      <div className="mb-4">
        <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
        <p className="text-xs text-muted-foreground">
          Posting as{" "}
          <span className="font-medium text-foreground">
            {postAs === "organization" && organization
              ? organization.name
              : "Individual"}
          </span>
        </p>
      </div>

      <Card>
        <CardContent className="p-5">
          <form onSubmit={handleSubmitListing} className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-xs">{t("fieldTitle")} *</Label>
              <Input id="title" name="title" placeholder={t("titlePlaceholder")} required className="h-9" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="type" className="text-xs">{t("fieldType")} *</Label>
                <Select value={type} onValueChange={(v) => setType(v ?? "")} required>
                  <SelectTrigger className="h-9">
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
                  <Label htmlFor="posterName" className="text-xs">Your Name</Label>
                  <Input id="posterName" name="posterName" placeholder="Optional" className="h-9" />
                </div>
              )}
              {postAs === "organization" && (
                <div>
                  <Label className="text-xs">{t("fieldOrg")}</Label>
                  <Input value={organization?.name || ""} disabled className="h-9" />
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="description" className="text-xs">{t("fieldDesc")} *</Label>
              <Textarea id="description" name="description" placeholder={t("descPlaceholder")} rows={6} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="country" className="text-xs">{t("fieldCountry")}</Label>
                <Input id="country" name="country" placeholder={t("countryPlaceholder")} className="h-9" />
              </div>
              <div>
                <Label htmlFor="city" className="text-xs">{t("fieldCity")}</Label>
                <Input id="city" name="city" placeholder={t("cityPlaceholder")} className="h-9" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="deadline" className="text-xs">{t("fieldDeadline")}</Label>
                <Input id="deadline" name="deadline" type="date" className="h-9" />
              </div>
              <div>
                <Label htmlFor="applyUrl" className="text-xs">{t("fieldApplyUrl")}</Label>
                <Input id="applyUrl" name="applyUrl" type="url" placeholder="https://..." className="h-9" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch checked={isRemote} onCheckedChange={setIsRemote} />
                <Label className="text-xs">{t("remoteAvailable")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isPaid} onCheckedChange={setIsPaid} />
                <Label className="text-xs">{t("paidOpportunity")}</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={isFree} onCheckedChange={(v) => { setIsFree(v); if (v) setApplicationFee(""); }} />
                <Label className="text-xs">Free to apply</Label>
              </div>
            </div>

            {!isFree && (
              <div>
                <Label htmlFor="applicationFee" className="text-xs">Application Fee</Label>
                <Input
                  id="applicationFee"
                  placeholder="e.g. $50, €30, Free for nationals"
                  value={applicationFee}
                  onChange={(e) => setApplicationFee(e.target.value)}
                  className="h-9"
                />
              </div>
            )}

            <Captcha ref={captchaRef} />

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button type="submit" className="w-full h-11 bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md" disabled={loading || !type}>
              {loading ? (
                <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />{t("submitting")}</>
              ) : (
                <><Send className="mr-1.5 h-3.5 w-3.5" />{t("submit")}</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

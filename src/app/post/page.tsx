"use client";

import { useState } from "react";
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
import { GraduationCap, Send, Loader2 } from "lucide-react";

const TYPE_KEYS = [
  "INTERNSHIP",
  "SCHOLARSHIP",
  "PROGRAM",
  "VOLUNTEER",
  "JOB",
  "OTHER",
] as const;

export default function PostListingPage() {
  const t = useTranslations("post");
  const tt = useTranslations("types");

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [type, setType] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      title: formData.get("title"),
      type,
      organization: formData.get("organization"),
      description: formData.get("description"),
      country: formData.get("country"),
      city: formData.get("city"),
      deadline: formData.get("deadline") || null,
      applyUrl: formData.get("applyUrl") || null,
      isRemote,
      isPaid,
    };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div>
                <Label htmlFor="organization">{t("fieldOrg")} *</Label>
                <Input id="organization" name="organization" placeholder={t("orgPlaceholder")} required />
              </div>
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

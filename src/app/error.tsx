"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("error");

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center">
      <h1 className="text-lg font-bold mb-1">{t("title")}</h1>
      <p className="text-sm text-muted-foreground mb-6 max-w-sm">
        {t("description")}
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" render={<Link href="/" />}>
          <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
          {t("tryAgain")}
        </Button>
        <Button size="sm" onClick={() => reset()}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          {t("tryAgain")}
        </Button>
      </div>
    </div>
  );
}

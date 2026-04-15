import { getTranslations } from "next-intl/server";

export default async function TermsPage() {
  const t = await getTranslations("terms");

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
      <p className="text-xs text-muted-foreground mb-6">{t("lastUpdated")}</p>
      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        <section><h2 className="text-lg font-semibold text-foreground">{t("s1Title")}</h2><p>{t("s1Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s2Title")}</h2><p>{t("s2Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s3Title")}</h2><p>{t("s3Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s4Title")}</h2><p>{t("s4Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s5Title")}</h2><p>{t("s5Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s6Title")}</h2><p>{t("s6Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s7Title")}</h2><p>{t("s7Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s8Title")}</h2><p>{t("s8Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s9Title")}</h2><p>{t("s9Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s10Title")}</h2><p>{t("s10Text")}</p></section>
      </div>
    </div>
  );
}

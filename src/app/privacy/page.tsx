import { getTranslations } from "next-intl/server";

export default async function PrivacyPage() {
  const t = await getTranslations("privacy");

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <h1 className="text-2xl font-bold mb-1">{t("title")}</h1>
      <p className="text-xs text-muted-foreground mb-6">{t("lastUpdated")}</p>
      <div className="space-y-5 text-sm text-muted-foreground leading-relaxed">
        <section><h2 className="text-lg font-semibold text-foreground">{t("s1Title")}</h2><p>{t("s1Text")}</p></section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">{t("s2Title")}</h2>
          <h3 className="text-base font-medium text-foreground mt-3">{t("s2aTitle")}</h3>
          <ul className="list-disc ml-6 mt-2 space-y-1"><li>{t("s2a1")}</li><li>{t("s2a2")}</li><li>{t("s2a3")}</li><li>{t("s2a4")}</li><li>{t("s2a5")}</li></ul>
          <h3 className="text-base font-medium text-foreground mt-3">{t("s2bTitle")}</h3>
          <ul className="list-disc ml-6 mt-2 space-y-1"><li>{t("s2b1")}</li><li>{t("s2b2")}</li><li>{t("s2b3")}</li><li>{t("s2b4")}</li></ul>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-foreground">{t("s3Title")}</h2>
          <p>{t("s3Text")}</p>
          <ul className="list-disc ml-6 mt-2 space-y-1"><li>{t("s3a1")}</li><li>{t("s3a2")}</li><li>{t("s3a3")}</li><li>{t("s3a4")}</li><li>{t("s3a5")}</li></ul>
          <p className="mt-2"><strong className="text-foreground">{t("s3Note")}</strong></p>
        </section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s4Title")}</h2><p>{t("s4Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s5Title")}</h2><p>{t("s5Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s6Title")}</h2><p>{t("s6Text")}</p></section>
        <section><h2 className="text-lg font-semibold text-foreground">{t("s7Title")}</h2><p>{t("s7Text")}</p></section>
      </div>
    </div>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AnimatedGradientText } from "@/components/ui/animated-gradient-text";
import { LogosCarousel } from "@/components/ui/logos-carousel";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { ShineBorder } from "@/components/ui/shine-border";
import { LiveStats } from "@/components/live-stats";
import { LatestListings } from "@/components/latest-listings";

import AuroraBackground from "@/components/ui/aurora-background";
import {
  Search, Briefcase, BookOpen, Globe, Heart,
  ArrowRight, Sparkles, Radar, Zap, Shield, ChevronRight,
} from "lucide-react";

const F = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
const partners = [
  { id: "erasmus", name: "Erasmus+", image: F("erasmusplus.ec.europa.eu") },
  { id: "daad", name: "DAAD", image: F("daad.de") },
  { id: "chevening", name: "Chevening", image: F("chevening.org") },
  { id: "fulbright", name: "Fulbright", image: F("fulbright.org") },
  { id: "un", name: "United Nations", image: F("un.org") },
  { id: "aiesec", name: "AIESEC", image: F("aiesec.org") },
  { id: "wwf", name: "WWF", image: F("wwf.org") },
  { id: "british-council", name: "British Council", image: F("britishcouncil.org") },
  { id: "world-bank", name: "World Bank", image: F("worldbank.org") },
  { id: "oist", name: "OIST", image: F("oist.jp") },
  { id: "google", name: "Google", image: F("google.com") },
  { id: "stanford", name: "Stanford", image: F("stanford.edu") },
  { id: "unesco", name: "UNESCO", image: F("unesco.org") },
  { id: "technovation", name: "Technovation", image: F("technovation.org") },
  { id: "mit", name: "MIT", image: F("mit.edu") },
  { id: "harvard", name: "Harvard", image: F("harvard.edu") },
  { id: "yale", name: "Yale", image: F("yale.edu") },
  { id: "oxford", name: "Oxford", image: F("ox.ac.uk") },
  { id: "cambridge", name: "Cambridge", image: F("cam.ac.uk") },
  { id: "microsoft", name: "Microsoft", image: F("microsoft.com") },
  { id: "amazon", name: "Amazon", image: F("amazon.com") },
  { id: "tesla", name: "Tesla", image: F("tesla.com") },
  { id: "nasa", name: "NASA", image: F("nasa.gov") },
  { id: "undp", name: "UNDP", image: F("undp.org") },
  { id: "unicef", name: "UNICEF", image: F("unicef.org") },
  { id: "who", name: "WHO", image: F("who.int") },
  { id: "imf", name: "IMF", image: F("imf.org") },
  { id: "oecd", name: "OECD", image: F("oecd.org") },
  { id: "peace-corps", name: "Peace Corps", image: F("peacecorps.gov") },
  { id: "gsoc", name: "GSoC", image: F("summerofcode.withgoogle.com") },
];

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");

  const categories = [
    { title: tc("internships"), description: tc("internshipsDesc"), icon: Briefcase, href: "/listings?type=INTERNSHIP", bg: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400" },
    { title: tc("scholarships"), description: tc("scholarshipsDesc"), icon: BookOpen, href: "/listings?type=SCHOLARSHIP", bg: "from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30", iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400" },
    { title: tc("programs"), description: tc("programsDesc"), icon: Globe, href: "/listings?type=PROGRAM", bg: "from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400" },
    { title: tc("volunteering"), description: tc("volunteeringDesc"), icon: Heart, href: "/listings?type=VOLUNTEER", bg: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30", iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <AuroraBackground />
        <div className="absolute inset-0 bg-background/60 dark:bg-background/70" />
        <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10">
          <AnimatedGradientText className="mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            {t("aiBadge")}
            <ChevronRight className="h-4 w-4 ml-1" />
          </AnimatedGradientText>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {t("heroTitle")}{" "}
            <span className="text-gradient">{t("heroHighlight")}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{t("heroDescription")}</p>

          <form action="/listings" method="GET" className="flex max-w-xl mx-auto gap-2 mb-10">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input name="q" placeholder={t("searchPlaceholder")} className="h-12 pl-12 rounded-xl text-base shadow-sm" />
            </div>
            <ShimmerButton className="h-12 px-6 rounded-xl" shimmerColor="rgba(255,255,255,0.3)" background="linear-gradient(135deg, #4f46e5, #2563eb)">
              {t("browseCta")}
            </ShimmerButton>
          </form>

          <LiveStats />
        </div>
      </section>

      {/* Partners Carousel */}
      <LogosCarousel heading={t("sourcedFrom")} logos={partners} />

      {/* Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">{t("exploreTitle")}</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mx-auto mt-3" />
            <p className="text-muted-foreground mt-3">{t("exploreDescription")}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {categories.map((cat) => (
              <Link key={cat.title} href={cat.href}>
                <ShineBorder
                  className="h-full p-0 bg-transparent"
                  color={["#4f46e5", "#2563eb", "#0ea5e9"]}
                  borderWidth={1.5}
                >
                  <Card className={`bg-gradient-to-br ${cat.bg} border-0 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer h-full`}>
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${cat.iconBg} mb-3`}>
                        <cat.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold mb-1">{cat.title}</h3>
                      <p className="text-xs text-muted-foreground">{cat.description}</p>
                    </CardContent>
                  </Card>
                </ShineBorder>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="py-16 bg-dot-pattern">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold">{t("latestTitle")}</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full mx-auto mt-3" />
            <p className="text-muted-foreground mt-3">{t("latestDesc")}</p>
          </div>
          <LatestListings />
          <div className="text-center mt-8">
            <Button variant="outline" render={<Link href="/listings" />} className="group">
              {t("browseCta")} <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <AnimatedGradientText className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("aiBadge")}
            </AnimatedGradientText>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("aiTitle")}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t("aiDesc")}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Radar, title: t("aiDiscoveryTitle"), desc: t("aiDiscoveryDesc") },
              { icon: Zap, title: t("aiUpdatesTitle"), desc: t("aiUpdatesDesc") },
              { icon: Shield, title: t("aiVerifiedTitle"), desc: t("aiVerifiedDesc") },
            ].map((item, i) => (
              <ShineBorder
                key={item.title}
                className={`p-0 bg-transparent ${i === 1 ? "md:-mt-4" : ""}`}
                color={["#4f46e5", "#2563eb", "#0ea5e9"]}
                borderWidth={1}
              >
                <Card className="border-0 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </ShineBorder>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t("ctaTitle")}</h2>
          <p className="text-indigo-100 max-w-xl mx-auto mb-8">{t("ctaDesc")}</p>
          <Link href="/auth/signup">
            <ShimmerButton className="mx-auto" shimmerColor="rgba(79,70,229,0.4)" background="white">
              <span className="text-indigo-700 font-semibold flex items-center gap-2">
                {t("ctaButton")} <ArrowRight className="h-4 w-4" />
              </span>
            </ShimmerButton>
          </Link>
        </div>
      </section>
    </div>
  );
}

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
import { GlowCard } from "@/components/ui/spotlight-card";
import { LiveStats } from "@/components/live-stats";
import { LatestListings } from "@/components/latest-listings";

// AuroraBackground removed — Three.js is too heavy for slow connections
import {
  Search, Briefcase, BookOpen, Globe, Heart,
  ArrowRight, Sparkles, Radar, Zap, Shield, ChevronRight,
} from "lucide-react";

const partners = [
  { id: "un", name: "United Nations" },
  { id: "google", name: "Google" },
  { id: "harvard", name: "Harvard" },
  { id: "nasa", name: "NASA" },
  { id: "cambridge", name: "Cambridge" },
  { id: "erasmus", name: "Erasmus+" },
  { id: "daad", name: "DAAD" },
  { id: "chevening", name: "Chevening" },
  { id: "fulbright", name: "Fulbright" },
  { id: "aiesec", name: "AIESEC" },
  { id: "stanford", name: "Stanford" },
  { id: "mit", name: "MIT" },
  { id: "oxford", name: "Oxford" },
  { id: "who", name: "WHO" },
  { id: "unesco", name: "UNESCO" },
  { id: "unicef", name: "UNICEF" },
  { id: "wwf", name: "WWF" },
  { id: "undp", name: "UNDP" },
  { id: "world-bank", name: "World Bank" },
  { id: "british-council", name: "British Council" },
  { id: "microsoft", name: "Microsoft" },
  { id: "amazon", name: "Amazon" },
  { id: "tesla", name: "Tesla" },
  { id: "technovation", name: "Technovation" },
];

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");

  const categories = [
    { title: tc("internships"), description: tc("internshipsDesc"), icon: Briefcase, href: "/listings?type=INTERNSHIP", iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400", glow: "blue" as const },
    { title: tc("scholarships"), description: tc("scholarshipsDesc"), icon: BookOpen, href: "/listings?type=SCHOLARSHIP", iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400", glow: "green" as const },
    { title: tc("programs"), description: tc("programsDesc"), icon: Globe, href: "/listings?type=PROGRAM", iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", glow: "purple" as const },
    { title: tc("volunteering"), description: tc("volunteeringDesc"), icon: Heart, href: "/listings?type=VOLUNTEER", iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/50 dark:text-rose-400", glow: "red" as const },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-sky-950/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -left-20 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/3 -right-10 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-sky-400/10 rounded-full blur-3xl animate-float-slower" />
        </div>
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
                <GlowCard glowColor={cat.glow} className="h-full cursor-pointer">
                  <div className="p-6 text-center">
                    <div className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ${cat.iconBg} mb-3`}>
                      <cat.icon className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold mb-1">{cat.title}</h3>
                    <p className="text-xs text-muted-foreground">{cat.description}</p>
                  </div>
                </GlowCard>
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
              <GlowCard key={item.title} glowColor="blue" className={i === 1 ? "md:-mt-4" : ""}>
                <div className="p-6 text-center">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 mb-4">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </GlowCard>
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

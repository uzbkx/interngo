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
import { HeroSearch } from "@/components/hero-search";

import { WorldMap } from "@/components/ui/world-map";
import { ParticlesBg } from "@/components/ui/particles-bg";
import {
  Search, Briefcase, BookOpen, Globe, Heart,
  ArrowRight, Sparkles, Radar, Zap, Shield, ChevronRight,
} from "lucide-react";

function AnimatedWords({
  text,
  startDelay = 0,
  step = 150,
  wordClassName = "",
}: {
  text: string;
  startDelay?: number;
  step?: number;
  wordClassName?: string;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span
          key={`${w}-${i}`}
          className={`word-animate ${wordClassName}`}
          style={{ animationDelay: `${startDelay + i * step}ms` }}
        >
          {w}
        </span>
      ))}
    </>
  );
}

const partners = [
  { id: "un", name: "United Nations", image: "/logos/un.png" },
  { id: "google", name: "Google", image: "/logos/google.png" },
  { id: "harvard", name: "Harvard", image: "/logos/harvard.png" },
  { id: "nasa", name: "NASA", image: "/logos/nasa.png" },
  { id: "cambridge", name: "Cambridge", image: "/logos/cambridge.png" },
  { id: "who", name: "WHO", image: "/logos/who.png" },
  { id: "yale", name: "Yale", image: "/logos/yale.png" },
  { id: "unicef", name: "UNICEF", image: "/logos/unicef.png" },
  { id: "unesco", name: "UNESCO", image: "/logos/unesco.png" },
  { id: "wwf", name: "WWF", image: "/logos/wwf.png" },
  { id: "amazon", name: "Amazon", image: "/logos/amazon.png" },
  { id: "microsoft", name: "Microsoft", image: "/logos/microsoft.png" },
  { id: "tesla", name: "Tesla", image: "/logos/tesla.png" },
  { id: "erasmus", name: "Erasmus+" },
  { id: "daad", name: "DAAD" },
  { id: "chevening", name: "Chevening" },
  { id: "fulbright", name: "Fulbright" },
  { id: "aiesec", name: "AIESEC" },
  { id: "stanford", name: "Stanford" },
  { id: "mit", name: "MIT" },
  { id: "oxford", name: "Oxford" },
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
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <ParticlesBg />
        <div className="container mx-auto px-4 py-20 md:py-32 text-center relative z-10 pointer-events-none">
          <h1 className="text-4xl md:text-6xl font-extralight tracking-tight leading-tight mb-6 text-white">
            <AnimatedWords text={t("heroTitle")} startDelay={0} step={150} />{" "}
            <span
              className="text-gradient font-light word-animate"
              style={{ animationDelay: "600ms" }}
            >
              {t("heroHighlight")}
            </span>
            {t("heroSuffix") && t("heroSuffix") !== "heroSuffix" ? (
              <> <AnimatedWords text={t("heroSuffix")} startDelay={1200} step={150} /></>
            ) : null}
          </h1>
          <p className="text-xl md:text-2xl font-thin tracking-wide leading-relaxed text-blue-100/80 max-w-3xl mx-auto mb-8">
            <AnimatedWords text={t("heroDescription")} startDelay={1400} step={80} />
          </p>

          <div className="pointer-events-auto">
            <HeroSearch />
          </div>

          <div className="pointer-events-auto">
            <LiveStats />
          </div>
        </div>
      </section>

      {/* Partners Carousel */}
      <LogosCarousel heading={t("sourcedFrom")} logos={partners} />

      {/* Global Reach — routes from Tashkent to 10 top destinations */}
      <section className="relative overflow-hidden min-h-[60vh] flex items-center bg-gradient-to-br from-indigo-50 via-blue-50 to-sky-50 dark:from-indigo-950/30 dark:via-blue-950/30 dark:to-sky-950/30">
        <WorldMap
          lineColor="#4f46e5"
          dots={[
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 52.5200, lng: 13.4050 } },   // Tashkent → Berlin (Germany)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 40.7128, lng: -74.0060 } },  // Tashkent → New York (USA)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 51.5074, lng: -0.1278 } },   // Tashkent → London (UK)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 52.3676, lng: 4.9041 } },    // Tashkent → Amsterdam (Netherlands)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 43.6532, lng: -79.3832 } },  // Tashkent → Toronto (Canada)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: -33.8688, lng: 151.2093 } }, // Tashkent → Sydney (Australia)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 48.8566, lng: 2.3522 } },    // Tashkent → Paris (France)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 35.6762, lng: 139.6503 } },  // Tashkent → Tokyo (Japan)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 37.5665, lng: 126.9780 } },  // Tashkent → Seoul (South Korea)
            { start: { lat: 41.2995, lng: 69.2401 }, end: { lat: 47.3769, lng: 8.5417 } },    // Tashkent → Zurich (Switzerland)
          ]}
        />
      </section>

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
      <section className="py-16">
        <div className="max-w-5xl py-16 md:w-full mx-2 md:mx-auto flex flex-col items-center justify-center text-center bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-10 text-white">
          <div className="flex flex-wrap items-center justify-center p-1 rounded-full bg-white/10 backdrop-blur border border-white/30 text-sm">
            <div className="flex items-center">
              <img
                className="size-6 md:size-7 rounded-full border-[3px] border-white object-cover"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=50"
                alt=""
              />
              <img
                className="size-6 md:size-7 rounded-full border-[3px] border-white object-cover -translate-x-2"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=50"
                alt=""
              />
              <img
                className="size-6 md:size-7 rounded-full border-[3px] border-white object-cover -translate-x-4"
                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=50&h=50&auto=format&fit=crop"
                alt=""
              />
            </div>
            <p className="-translate-x-2 font-medium">Join 10k+ students chasing opportunities</p>
          </div>

          <h2 className="text-4xl md:text-5xl md:leading-[60px] font-semibold max-w-xl mt-5 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
            {t("ctaTitle")}
          </h2>
          <p className="text-indigo-100/80 max-w-xl mx-auto mt-4 text-sm md:text-base">{t("ctaDesc")}</p>

          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3 text-indigo-700 bg-white hover:bg-blue-50 transition-all rounded-full uppercase text-sm mt-8 font-medium shadow-md"
          >
            {t("ctaButton")} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { LatestListings } from "@/components/latest-listings";
import {
  Search,
  Briefcase,
  BookOpen,
  Globe,
  Heart,
  ArrowRight,
  Sparkles,
  Users,
  MapPin,
  Radar,
  Zap,
  Shield,
  TrendingUp,
} from "lucide-react";

const partnerLogos = [
  "Erasmus+",
  "DAAD",
  "Chevening",
  "Fulbright",
  "United Nations",
  "AIESEC",
  "KGSP",
  "WWF",
];

export default async function HomePage() {
  const t = await getTranslations("home");
  const tc = await getTranslations("categories");
  // Static stats — updated periodically, no API call on page load
  const totalListings = 16;
  const totalCountries = 10;

  const categories = [
    {
      title: tc("internships"),
      description: tc("internshipsDesc"),
      icon: Briefcase,
      href: "/listings?type=INTERNSHIP",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: tc("scholarships"),
      description: tc("scholarshipsDesc"),
      icon: BookOpen,
      href: "/listings?type=SCHOLARSHIP",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: tc("programs"),
      description: tc("programsDesc"),
      icon: Globe,
      href: "/listings?type=PROGRAM",
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: tc("volunteering"),
      description: tc("volunteeringDesc"),
      icon: Heart,
      href: "/listings?type=VOLUNTEER",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  const stats = [
    { label: t("opportunities"), value: totalListings, icon: Sparkles },
    { label: t("countries"), value: `${totalCountries}+`, icon: MapPin },
    { label: t("students"), value: "500+", icon: Users },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/5 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-16 md:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Floating tags */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {["Erasmus+", "Google Internship", "Chevening", "UN Programs"].map(
                (tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-3 py-1 bg-white/80 backdrop-blur border shadow-sm"
                  >
                    {tag}
                  </Badge>
                )
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              {t("heroTitle")}{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t("heroHighlight")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("heroDescription")}
            </p>

            {/* Hero search bar */}
            <form
              action="/listings"
              method="GET"
              className="max-w-xl mx-auto mb-10"
            >
              <div className="flex gap-2 bg-white rounded-lg shadow-lg border p-1.5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="q"
                    placeholder={t("searchPlaceholder")}
                    className="pl-10 border-0 shadow-none focus-visible:ring-0 h-10"
                  />
                </div>
                <Button type="submit" size="lg" className="px-6">
                  <Search className="h-4 w-4 mr-2" />
                  {t("browseCta")}
                </Button>
              </div>
            </form>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-16">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="h-5 w-5 mx-auto mb-1 text-primary/60" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner/source logo strip */}
      <section className="border-y bg-muted/30 py-6">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs text-muted-foreground mb-4 uppercase tracking-wider">
            {t("sourcedFrom")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
            {partnerLogos.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-muted-foreground/70 hover:text-foreground transition-colors"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            {t("exploreTitle")}
          </h2>
          <p className="text-muted-foreground">{t("exploreDescription")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer group border-transparent hover:border-primary/20">
                <CardContent className="p-6">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}
                  >
                    <cat.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {cat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Opportunities — loaded on client side for fast page load */}
      <LatestListings />

      {/* AI-Powered — replaces "How it works" */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-4 text-xs px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("aiBadge")}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("aiTitle")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t("aiDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: Radar,
                title: t("aiDiscoveryTitle"),
                desc: t("aiDiscoveryDesc"),
                color: "text-primary bg-primary/10",
              },
              {
                icon: Zap,
                title: t("aiUpdatesTitle"),
                desc: t("aiUpdatesDesc"),
                color: "text-accent bg-accent/10",
              },
              {
                icon: Shield,
                title: t("aiVerifiedTitle"),
                desc: t("aiVerifiedDesc"),
                color: "text-emerald-600 bg-emerald-50",
              },
            ].map((item) => (
              <Card key={item.title} className="border-0 shadow-sm">
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${item.color}`}
                  >
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-10 border">
            <TrendingUp className="h-8 w-8 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              {t("ctaTitle")}
            </h2>
            <p className="text-muted-foreground mb-6">{t("ctaDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" render={<Link href="/auth/signup" />}>
                {t("ctaButton")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                render={<Link href="/listings" />}
              >
                {t("browseCta")}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { LiveStats } from "@/components/live-stats";
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
  Radar,
  Zap,
  Shield,
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
  const categories = [
    {
      title: tc("internships"),
      description: tc("internshipsDesc"),
      icon: Briefcase,
      href: "/listings?type=INTERNSHIP",
    },
    {
      title: tc("scholarships"),
      description: tc("scholarshipsDesc"),
      icon: BookOpen,
      href: "/listings?type=SCHOLARSHIP",
    },
    {
      title: tc("programs"),
      description: tc("programsDesc"),
      icon: Globe,
      href: "/listings?type=PROGRAM",
    },
    {
      title: tc("volunteering"),
      description: tc("volunteeringDesc"),
      icon: Heart,
      href: "/listings?type=VOLUNTEER",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-[1.15]">
              {t("heroTitle")}{" "}
              <span className="text-primary">
                {t("heroHighlight")}
              </span>
            </h1>
            <p className="text-base text-muted-foreground mb-8 max-w-lg mx-auto">
              {t("heroDescription")}
            </p>

            {/* Search bar */}
            <form
              action="/listings"
              method="GET"
              className="max-w-md mx-auto mb-12"
            >
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="q"
                    placeholder={t("searchPlaceholder")}
                    className="pl-10 h-10"
                  />
                </div>
                <Button type="submit" size="default">
                  {t("browseCta")}
                </Button>
              </div>
            </form>

            {/* Stats */}
            <LiveStats />
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-y bg-muted/40 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
            {partnerLogos.map((name) => (
              <span
                key={name}
                className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider"
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
          <h2 className="text-2xl font-bold mb-2">
            {t("exploreTitle")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("exploreDescription")}</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
          {categories.map((cat) => (
            <Link key={cat.title} href={cat.href}>
              <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
                <CardContent className="p-5">
                  <cat.icon className="h-5 w-5 text-primary mb-3" />
                  <h3 className="text-sm font-medium mb-1 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Latest Opportunities */}
      <LatestListings />

      {/* AI Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3 text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              {t("aiBadge")}
            </Badge>
            <h2 className="text-2xl font-bold mb-2">
              {t("aiTitle")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              {t("aiDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: Radar,
                title: t("aiDiscoveryTitle"),
                desc: t("aiDiscoveryDesc"),
              },
              {
                icon: Zap,
                title: t("aiUpdatesTitle"),
                desc: t("aiUpdatesDesc"),
              },
              {
                icon: Shield,
                title: t("aiVerifiedTitle"),
                desc: t("aiVerifiedDesc"),
              },
            ].map((item) => (
              <Card key={item.title} className="border">
                <CardContent className="p-5">
                  <item.icon className="h-5 w-5 text-primary mb-3" />
                  <h3 className="text-sm font-medium mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <h2 className="text-xl font-bold mb-2">
                {t("ctaTitle")}
              </h2>
              <p className="text-sm text-muted-foreground mb-6">{t("ctaDesc")}</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button render={<Link href="/auth/signup" />}>
                  {t("ctaButton")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  render={<Link href="/listings" />}
                >
                  {t("browseCta")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

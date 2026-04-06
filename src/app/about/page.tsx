import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GraduationCap, Radar, Globe, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="text-center mb-10">
        <GraduationCap className="h-8 w-8 mx-auto text-primary mb-3" />
        <h1 className="text-2xl font-bold mb-2">About InternGo</h1>
        <p className="text-sm text-muted-foreground">
          Connecting students in Uzbekistan with global opportunities
        </p>
      </div>

      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Our Mission
          </h2>
          <p>
            InternGo was created with a simple goal: to make international
            opportunities accessible to every student in Uzbekistan. Too often,
            life-changing internships, scholarships, and exchange programs go
            unnoticed — buried in different websites, shared only in closed
            groups, or discovered too late.
          </p>
          <p className="mt-2">
            We believe that talent is equally distributed, but opportunity is
            not. InternGo is here to change that.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground mb-3">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                icon: Radar,
                title: "AI-Powered Discovery",
                desc: "Our AI scouter monitors 50+ sources worldwide — from Erasmus+ to the UN — finding new opportunities every 6 hours.",
              },
              {
                icon: Globe,
                title: "Community Submissions",
                desc: "Organizations and individuals can submit opportunities directly to our platform.",
              },
              {
                icon: Users,
                title: "Built for Uzbek Students",
                desc: "Available in Uzbek, Russian, and English. Focused on programs accepting Central Asian applicants.",
              },
              {
                icon: Heart,
                title: "Completely Free",
                desc: "No premium tiers, no hidden fees. Every opportunity is accessible to everyone.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-4">
                  <item.icon className="h-4 w-4 text-primary mb-2" />
                  <h3 className="text-sm font-medium text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Our Story
          </h2>
          <p>
            InternGo started as a personal frustration: finding international
            opportunities as a student in Uzbekistan meant checking dozens of
            websites daily, joining countless Telegram groups, and still missing
            deadlines. We knew there had to be a better way.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-base font-semibold text-foreground mb-2">
            Get in Touch
          </h2>
          <ul className="space-y-1">
            <li>
              Email:{" "}
              <a href="mailto:contact@interngo.uz" className="text-primary hover:underline">
                contact@interngo.uz
              </a>
            </li>
            <li>
              Telegram:{" "}
              <a href="https://t.me/interngo" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                @interngo
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

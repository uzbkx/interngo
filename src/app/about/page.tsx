import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Radar, Globe, Users, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-12">
        <GraduationCap className="h-12 w-12 mx-auto text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-3">About InternGo</h1>
        <p className="text-lg text-muted-foreground">
          Connecting students in Uzbekistan with global opportunities
        </p>
      </div>

      <div className="space-y-8 text-muted-foreground">
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Our Mission
          </h2>
          <p>
            InternGo was created with a simple goal: to make international
            opportunities accessible to every student in Uzbekistan. Too often,
            life-changing internships, scholarships, and exchange programs go
            unnoticed — buried in different websites, shared only in closed
            groups, or discovered too late.
          </p>
          <p className="mt-3">
            We believe that talent is equally distributed, but opportunity is
            not. InternGo is here to change that by bringing all opportunities
            to one place and making them easy to find, save, and track.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            What We Do
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              {
                icon: Radar,
                title: "AI-Powered Discovery",
                desc: "Our AI scouter monitors 50+ sources worldwide — from Erasmus+ and DAAD to the UN and Fulbright — automatically finding new opportunities every 6 hours.",
              },
              {
                icon: Globe,
                title: "Community Submissions",
                desc: "Organizations and individuals can submit opportunities directly to our platform, ensuring nothing falls through the cracks.",
              },
              {
                icon: Users,
                title: "Built for Uzbek Students",
                desc: "Available in Uzbek, Russian, and English. Focused on programs that accept applicants from Uzbekistan and Central Asia.",
              },
              {
                icon: Heart,
                title: "Completely Free",
                desc: "InternGo is free for students. No premium tiers, no hidden fees. Every opportunity is accessible to everyone.",
              },
            ].map((item) => (
              <Card key={item.title}>
                <CardContent className="p-5">
                  <item.icon className="h-6 w-6 text-primary mb-2" />
                  <h3 className="font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Our Story
          </h2>
          <p>
            InternGo started as a personal frustration: finding international
            opportunities as a student in Uzbekistan meant checking dozens of
            websites daily, joining countless Telegram groups, and still missing
            deadlines. We knew there had to be a better way.
          </p>
          <p className="mt-3">
            By combining modern web technology with AI-powered discovery, we
            built a platform that does the searching for you — so you can focus
            on what matters: preparing your applications and building your
            future.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-foreground mb-3">
            Get in Touch
          </h2>
          <p>
            Have a question, suggestion, or want to partner with us? We&apos;d
            love to hear from you.
          </p>
          <ul className="mt-3 space-y-2">
            <li>
              Email:{" "}
              <a
                href="mailto:contact@interngo.uz"
                className="text-primary hover:underline"
              >
                contact@interngo.uz
              </a>
            </li>
            <li>
              Telegram:{" "}
              <a
                href="https://t.me/interngo"
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                @interngo
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}

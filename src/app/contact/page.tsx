"use client";

import { useState, useRef } from "react";
import { apiFetch } from "@/lib/api";
import { Captcha, type CaptchaRef } from "@/components/captcha";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, MessageSquare, MapPin, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const captchaRef = useRef<CaptchaRef>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const captchaToken = captchaRef.current?.getToken();
    if (!captchaToken) {
      setError("Please complete the CAPTCHA");
      return;
    }

    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message"),
    };

    try {
      const res = await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">Contact Us</h1>
        <p className="text-sm text-muted-foreground">
          Have a question, feedback, or partnership inquiry?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-3">
          {[
            { icon: Mail, title: "Email", value: "support@interngo.uz", href: "mailto:support@interngo.uz" },
            { icon: MessageSquare, title: "Telegram Channel", value: "@interngouz", href: "https://t.me/interngouz" },
            { icon: MessageSquare, title: "Support Bot", value: "@interngouzsupportbot", href: "https://t.me/interngouzsupportbot" },
            { icon: MapPin, title: "Location", value: "Tashkent, Uzbekistan" },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="p-4">
                <item.icon className="h-4 w-4 text-primary mb-1.5" />
                <h3 className="text-xs font-medium mb-0.5">{item.title}</h3>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="md:col-span-2">
          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-8 w-8 mx-auto text-primary mb-2" />
                <h2 className="text-lg font-bold mb-1">Message Sent</h2>
                <p className="text-sm text-muted-foreground">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-5">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="name" className="text-xs">Name</Label>
                      <Input id="name" name="name" placeholder="Your name" required className="h-9" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-xs">Email</Label>
                      <Input id="email" name="email" type="email" placeholder="you@example.com" required className="h-9" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject" className="text-xs">Subject</Label>
                    <Input id="subject" name="subject" placeholder="How can we help?" required className="h-9" />
                  </div>
                  <div>
                    <Label htmlFor="message" className="text-xs">Message</Label>
                    <Textarea id="message" name="message" placeholder="Tell us more..." rows={4} required />
                  </div>
                  <Captcha ref={captchaRef} />
                  {error && <p className="text-xs text-destructive">{error}</p>}
                  <Button type="submit" className="w-full" size="sm" disabled={loading}>
                    <Send className="mr-2 h-3.5 w-3.5" />
                    {loading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

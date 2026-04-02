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
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-3">Contact Us</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Have a question, feedback, or partnership inquiry? We&apos;re here to
          help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-5">
              <Mail className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Email</h3>
              <a
                href="mailto:contact@interngo.uz"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                contact@interngo.uz
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <MessageSquare className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Telegram</h3>
              <a
                href="https://t.me/interngo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                @interngo
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <MapPin className="h-5 w-5 text-primary mb-2" />
              <h3 className="font-semibold text-sm mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">
                Tashkent, Uzbekistan
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact form */}
        <div className="md:col-span-2">
          {submitted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-10 w-10 mx-auto text-emerald-500 mb-3" />
                <h2 className="text-xl font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground">
                  Thank you for reaching out. We&apos;ll get back to you within
                  24 hours.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more..."
                      rows={5}
                      required
                    />
                  </div>
                  <Captcha ref={captchaRef} />
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    <Send className="mr-2 h-4 w-4" />
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

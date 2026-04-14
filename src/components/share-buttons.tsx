"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Share2, Copy, Check, Send, MessageCircle, Mail, Link2, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonsProps {
  title: string;
  url: string;
}

export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== "undefined"
    ? `${window.location.origin}${url}`
    : url;

  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);
  const encodedText = encodeURIComponent(`${title}\n${fullUrl}`);

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    toast.success("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  }

  const platforms = [
    {
      name: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:bg-[#0088cc]/10 hover:text-[#0088cc]",
    },
    {
      name: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodedText}`,
      color: "hover:bg-[#25D366]/10 hover:text-[#25D366]",
    },
    {
      name: "X (Twitter)",
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-black/10 hover:text-black dark:hover:bg-white/10 dark:hover:text-white",
    },
    {
      name: "Facebook",
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877F2]/10 hover:text-[#1877F2]",
    },
    {
      name: "LinkedIn",
      icon: Link2,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]",
    },
    {
      name: "Email",
      icon: Mail,
      href: `mailto:?subject=${encodedTitle}&body=${encodedText}`,
      color: "hover:bg-amber-500/10 hover:text-amber-600",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" className="w-full" />}>
        <Share2 className="h-4 w-4 mr-2" />
        Share ({platforms.length + 1})
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="center">
        <p className="text-xs font-medium text-muted-foreground px-2 py-1">Share via</p>
        <div className="space-y-0.5">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${p.color}`}
            >
              <p.icon className="h-4 w-4" />
              {p.name}
            </a>
          ))}
        </div>
        <Separator className="my-1.5" />
        <button
          onClick={handleCopy}
          className="flex items-center gap-3 px-2 py-2 rounded-md text-sm w-full hover:bg-muted transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy link"}
        </button>
      </PopoverContent>
    </Popover>
  );
}

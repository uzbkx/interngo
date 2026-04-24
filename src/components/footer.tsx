"use client";

import type { ComponentProps, ReactNode } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Send } from "lucide-react";
import { Logo } from "@/components/logo";

export function Footer() {
  const t = useTranslations("footer");
  const tc = useTranslations("categories");

  const sections: {
    label: string;
    links: { title: string; href: string; external?: boolean; icon?: React.ComponentType<{ className?: string }> }[];
  }[] = [
    {
      label: t("explore"),
      links: [
        { title: tc("internships"), href: "/listings?type=INTERNSHIP" },
        { title: tc("scholarships"), href: "/listings?type=SCHOLARSHIP" },
        { title: tc("programs"), href: "/listings?type=PROGRAM" },
        { title: tc("volunteering"), href: "/listings?type=VOLUNTEER" },
        { title: "Archive", href: "/archive" },
      ],
    },
    {
      label: t("about"),
      links: [
        { title: t("aboutUs"), href: "/about" },
        { title: t("contact"), href: "/contact" },
        { title: "Telegram", href: "https://t.me/interngouz", external: true, icon: Send },
      ],
    },
    {
      label: t("legal"),
      links: [
        { title: t("terms"), href: "/terms" },
        { title: t("privacy"), href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="md:rounded-t-6xl relative w-full max-w-6xl mx-auto flex flex-col items-center justify-center rounded-t-4xl border-t bg-[radial-gradient(35%_128px_at_50%_0%,theme(colors.foreground/8%),transparent)] px-6 py-12 lg:py-16">
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 xl:grid-cols-3 xl:gap-8">
        <AnimatedContainer className="space-y-4">
          <Link href="/" className="inline-flex items-center gap-2">
            <Logo size={32} className="shadow-md" />
            <span className="text-lg font-bold tracking-tight">InternGo</span>
          </Link>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{t("tagline")}</p>
          <p className="text-muted-foreground text-xs">
            &copy; {new Date().getFullYear()} InternGo. {t("rights")}
          </p>
        </AnimatedContainer>

        <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
          {sections.map((section, index) => (
            <AnimatedContainer key={section.label} delay={0.1 + index * 0.1}>
              <div className="mb-10 md:mb-0">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section.label}
                </h3>
                <ul className="text-muted-foreground mt-4 space-y-2 text-sm">
                  {section.links.map((link) => {
                    const content = (
                      <>
                        {link.icon && <link.icon className="me-1.5 size-4" />}
                        {link.title}
                      </>
                    );
                    return (
                      <li key={link.title}>
                        {link.external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground inline-flex items-center transition-all duration-300"
                          >
                            {content}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className="hover:text-foreground inline-flex items-center transition-all duration-300"
                          >
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </footer>
  );
}

type ViewAnimationProps = {
  delay?: number;
  className?: ComponentProps<typeof motion.div>["className"];
  children: ReactNode;
};

function AnimatedContainer({ className, delay = 0.1, children }: ViewAnimationProps) {
  const shouldReduceMotion = useReducedMotion();
  if (shouldReduceMotion) return <>{children}</>;
  return (
    <motion.div
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.8 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

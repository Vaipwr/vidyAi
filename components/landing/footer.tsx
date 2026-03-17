"use client"

import Link from "next/link"
import { BookOpen, Twitter, Linkedin, Github, Youtube, Mail } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"

const footerLinks = {
  platform: [
    { labelKey: "footer.link.courses", href: "/courses" },
    { labelKey: "footer.link.mentors", href: "/mentors" },
    { labelKey: "footer.link.community", href: "/community" },
    { labelKey: "footer.link.pricing", href: "/pricing" },
  ],
  support: [
    { labelKey: "footer.link.help", href: "/help" },
    { labelKey: "footer.link.contact", href: "/contact" },
    { labelKey: "footer.link.faq", href: "/faq" },
    { labelKey: "footer.link.feedback", href: "/feedback" },
  ],
  legal: [
    { labelKey: "footer.link.privacy", href: "/privacy" },
    { labelKey: "footer.link.terms", href: "/terms" },
    { labelKey: "footer.link.cookies", href: "/cookies" },
  ],
  languages: [
    { labelKey: "footer.link.en", href: "?lang=en" },
    { labelKey: "footer.link.hi", href: "?lang=hi" },
    { labelKey: "footer.link.mr", href: "?lang=mr" },
    { labelKey: "footer.link.ta", href: "?lang=ta" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "https://twitter.com/vidyai", label: "Twitter" },
  { icon: Linkedin, href: "https://linkedin.com/company/vidyai", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com/@vidyai", label: "YouTube" },
  { icon: Github, href: "https://github.com/vidyai", label: "GitHub" },
]

export function LandingFooter() {
  const { t } = useTranslation()

  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-6">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">
                VidyAI<span className="text-primary">++</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t("footer.desc")}
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-card text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footer.platform")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footer.support")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footer.legal")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">{t("footer.languages")}</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.languages.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                    {t(link.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            {new Date().getFullYear()} {t("footer.rights")}
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <a href="mailto:support@vidyai.com" className="hover:text-foreground">
              support@vidyai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

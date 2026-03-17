"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { useTranslation } from "@/lib/i18n/LanguageContext"

const testimonials = [
  {
    contentKey: "test.1.content",
    author: "Priya Kumari",
    roleKey: "test.1.role",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 5,
  },
  {
    contentKey: "test.2.content",
    author: "Dr. Ramesh Iyer",
    roleKey: "test.2.role",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5,
  },
  {
    contentKey: "test.3.content",
    author: "Rahul Sharma",
    roleKey: "test.3.role",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 5,
  },
]

export function LandingTestimonials() {
  const { t } = useTranslation()

  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {t("test.title")}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            {t("test.sub")}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              {/* Rating */}
              <div>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>

                {/* Content */}
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  &ldquo;{t(testimonial.contentKey)}&rdquo;
                </p>
              </div>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {testimonial.author.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{t(testimonial.roleKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

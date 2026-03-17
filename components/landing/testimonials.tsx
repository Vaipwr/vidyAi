import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    content: "VidyAI++ detected when I was confused during algebra and explained it in Hindi. It felt like having a personal teacher who understands me!",
    author: "Priya Kumari",
    role: "Class 10 Student, Bihar",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 5,
  },
  {
    content: "As a mentor on the platform, I can help students across India in their own language. The emotion analytics help me understand where students struggle most.",
    author: "Dr. Ramesh Iyer",
    role: "Mathematics Mentor, Chennai",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5,
  },
  {
    content: "The offline feature is a blessing. I download lessons at school where there is WiFi and study at home. My grades have improved significantly!",
    author: "Rahul Sharma",
    role: "Class 12 Student, Rajasthan",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 5,
  },
]

export function LandingTestimonials() {
  return (
    <section className="px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Loved by{" "}
            <span className="text-primary">Students & Educators</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Join thousands of students who are transforming their learning journey with VidyAI++
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
                  &ldquo;{testimonial.content}&rdquo;
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
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

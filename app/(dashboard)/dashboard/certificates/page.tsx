"use client"

import { useState } from "react"
import useSWR from "swr"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Download, Share2, Eye } from "lucide-react"
import { format } from "date-fns"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface Certificate {
  id: string
  course_title: string
  issued_at: string
  certificate_url: string
}

export default function CertificatesPage() {
  const { data: certificates, isLoading } = useSWR<Certificate[]>(
    "/api/certificates",
    fetcher
  )
  const [downloading, setDownloading] = useState<string | null>(null)

  const handleDownload = async (cert: Certificate) => {
    setDownloading(cert.id)
    
    try {
      // Dynamic import of jsPDF
      const { jsPDF } = await import("jspdf")
      
      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      })

      // Background
      doc.setFillColor(249, 250, 251)
      doc.rect(0, 0, 297, 210, "F")

      // Border
      doc.setDrawColor(79, 107, 245)
      doc.setLineWidth(3)
      doc.rect(10, 10, 277, 190)

      // Inner border
      doc.setLineWidth(0.5)
      doc.rect(15, 15, 267, 180)

      // Title
      doc.setFontSize(40)
      doc.setTextColor(79, 107, 245)
      doc.text("Certificate of Completion", 148.5, 50, { align: "center" })

      // Subtitle
      doc.setFontSize(16)
      doc.setTextColor(100, 100, 100)
      doc.text("This is to certify that", 148.5, 75, { align: "center" })

      // Name placeholder
      doc.setFontSize(28)
      doc.setTextColor(30, 30, 30)
      doc.text("Student Name", 148.5, 95, { align: "center" })

      // Has completed
      doc.setFontSize(16)
      doc.setTextColor(100, 100, 100)
      doc.text("has successfully completed the course", 148.5, 115, { align: "center" })

      // Course title
      doc.setFontSize(24)
      doc.setTextColor(79, 107, 245)
      doc.text(cert.course_title, 148.5, 135, { align: "center" })

      // Date
      doc.setFontSize(12)
      doc.setTextColor(100, 100, 100)
      doc.text(
        `Issued on: ${format(new Date(cert.issued_at), "MMMM d, yyyy")}`,
        148.5,
        160,
        { align: "center" }
      )

      // VidyAI++ branding
      doc.setFontSize(18)
      doc.setTextColor(79, 107, 245)
      doc.text("VidyAI++", 148.5, 185, { align: "center" })

      // Download
      doc.save(`certificate-${cert.id}.pdf`)
    } catch (error) {
      console.error("Failed to generate certificate:", error)
    } finally {
      setDownloading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-4 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Certificates</h1>
        <p className="mt-2 text-muted-foreground">
          View and download your course completion certificates
        </p>
      </div>

      {/* Certificates Grid */}
      {certificates && certificates.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="relative h-32 bg-gradient-to-r from-primary to-primary/70">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="h-16 w-16 text-primary-foreground/20" />
                </div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-sm text-primary-foreground/80">Certificate of Completion</p>
                  <h3 className="text-lg font-bold text-primary-foreground">
                    {cert.course_title}
                  </h3>
                </div>
              </div>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">
                  Issued on {format(new Date(cert.issued_at), "MMMM d, yyyy")}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(cert)}
                    disabled={downloading === cert.id}
                  >
                    {downloading === cert.id ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Download className="mr-2 h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Award className="mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">No certificates yet</h3>
          <p className="mt-2 text-muted-foreground">
            Complete a course to earn your first certificate!
          </p>
          <Button className="mt-4" asChild>
            <a href="/dashboard/courses">Browse Courses</a>
          </Button>
        </Card>
      )}
    </div>
  )
}

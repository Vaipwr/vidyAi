import { NextResponse } from "next/server"

// Demo certificates data
const demoCertificates = [
  {
    id: "cert-1",
    course_title: "Mathematics Fundamentals",
    issued_at: "2026-02-15T10:00:00.000Z",
    certificate_url: "/certificates/cert-1.pdf"
  },
  {
    id: "cert-2",
    course_title: "English Grammar Mastery",
    issued_at: "2026-03-01T14:30:00.000Z",
    certificate_url: "/certificates/cert-2.pdf"
  },
  {
    id: "cert-3",
    course_title: "Computer Basics",
    issued_at: "2026-03-10T09:00:00.000Z",
    certificate_url: "/certificates/cert-3.pdf"
  }
]

export async function GET() {
  return NextResponse.json(demoCertificates)
}

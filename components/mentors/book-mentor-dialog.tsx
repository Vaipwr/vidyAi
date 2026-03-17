"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Star, Calendar as CalendarIcon, Clock } from "lucide-react"
import { format, addDays } from "date-fns"
import type { Mentor } from "@/lib/db"

interface BookMentorDialogProps {
  mentor: Mentor
  open: boolean
  onOpenChange: (open: boolean) => void
}

const timeSlots = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
]

export function BookMentorDialog({ mentor, open, onOpenChange }: BookMentorDialogProps) {
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: "Please select a date and time",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/mentors/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: mentor.id,
          date: selectedDate.toISOString(),
          time: selectedTime,
          message,
        }),
      })

      if (!res.ok) throw new Error("Failed to book session")

      toast({
        title: "Session booked!",
        description: `Your session with ${mentor.name} has been scheduled for ${format(selectedDate, "PPP")} at ${selectedTime}.`,
      })

      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Book a Session</DialogTitle>
          <DialogDescription>
            Schedule a one-on-one mentoring session
          </DialogDescription>
        </DialogHeader>

        {/* Mentor Info */}
        <div className="flex items-center gap-4 rounded-lg bg-muted p-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>
              {mentor.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold text-foreground">{mentor.name}</h4>
            <p className="text-sm text-muted-foreground">{mentor.expertise.join(", ")}</p>
            <div className="mt-1 flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm">{mentor.rating.toFixed(1)}</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <span className="text-lg font-bold text-foreground">
              {mentor.hourlyRate === 0 ? "Free" : `Rs. ${mentor.hourlyRate}`}
            </span>
            {mentor.hourlyRate > 0 && (
              <p className="text-xs text-muted-foreground">per hour</p>
            )}
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Select a Date
              </Label>
              <div className="mt-2 flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) =>
                    date < new Date() || date > addDays(new Date(), 30)
                  }
                  className="rounded-md border"
                />
              </div>
            </div>

            {selectedDate && (
              <div>
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Available Time Slots
                </Label>
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                        selectedTime === slot
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button
              className="w-full"
              disabled={!selectedDate || !selectedTime}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="rounded-lg bg-muted p-3">
              <p className="text-sm text-muted-foreground">Session scheduled for:</p>
              <p className="font-medium text-foreground">
                {selectedDate && format(selectedDate, "PPPP")} at {selectedTime}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message for mentor (optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Tell the mentor what you'd like to learn or discuss..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleBook} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Booking
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

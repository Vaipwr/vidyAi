import React from "react";

export default function SupportPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support</h1>
      <form className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Your Email</label>
          <input type="email" placeholder="Enter your email" className="border rounded-lg px-4 py-2 w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Message</label>
          <textarea placeholder="Describe your issue or question" className="border rounded-lg px-4 py-2 w-full" rows={4} required />
        </div>
        <button type="submit" className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary/90 transition w-full">Send Message</button>
      </form>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Other Support Options</h2>
        <p>Email: <a href="mailto:support@vidyai.com" className="text-primary underline">support@vidyai.com</a></p>
        <p>Phone: +91-123-456-7890</p>
      </div>
    </div>
  );
}

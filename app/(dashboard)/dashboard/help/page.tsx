import React from "react";

export default function HelpPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Help</h1>
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Frequently Asked Questions</h2>
        <ul className="space-y-2">
          <li>
            <strong>How do I reset my password?</strong><br />
            Go to Settings and select "Change Password".
          </li>
          <li>
            <strong>How do I contact a mentor?</strong><br />
            Visit the Mentors page and book a session.
          </li>
          <li>
            <strong>How do I bookmark a course?</strong><br />
            Click the bookmark icon on any course card.
          </li>
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
        <p>Email: <a href="mailto:support@vidyai.com" className="text-primary underline">support@vidyai.com</a></p>
        <p>Live chat available 9am-6pm IST.</p>
      </div>
    </div>
  );
}

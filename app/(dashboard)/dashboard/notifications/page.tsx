import React from "react";

export default function NotificationsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      <ul className="space-y-4">
        <li className="border rounded-lg p-4 bg-white shadow">
          <span className="font-semibold">Course Update:</span> New lessons added to React Basics.
          <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
        </li>
        <li className="border rounded-lg p-4 bg-white shadow">
          <span className="font-semibold">Mentor Message:</span> Jane Doe replied to your question.
          <div className="text-xs text-gray-500 mt-1">Yesterday</div>
        </li>
        <li className="border rounded-lg p-4 bg-white shadow">
          <span className="font-semibold">Forum:</span> Your post "How to use hooks?" received 5 new replies.
          <div className="text-xs text-gray-500 mt-1">3 days ago</div>
        </li>
      </ul>
    </div>
  );
}

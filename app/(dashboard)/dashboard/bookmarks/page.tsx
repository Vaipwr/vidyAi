import React from "react";

export default function BookmarksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
      <ul className="space-y-4">
        <li className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold">React Basics Course</h2>
          <p className="text-sm text-gray-600">Learn the fundamentals of React.js.</p>
          <a href="/dashboard/courses/react-basics" className="text-primary underline">Go to course</a>
        </li>
        <li className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold">Forum Post: How to use hooks?</h2>
          <p className="text-sm text-gray-600">Discussion about React hooks usage and best practices.</p>
          <a href="/dashboard/community" className="text-primary underline">View post</a>
        </li>
        <li className="border rounded-lg p-4 bg-white shadow">
          <h2 className="text-lg font-semibold">Mentor: Jane Doe</h2>
          <p className="text-sm text-gray-600">Book a session with Jane for advanced JavaScript help.</p>
          <a href="/dashboard/mentors" className="text-primary underline">Book mentor</a>
        </li>
      </ul>
    </div>
  );
}

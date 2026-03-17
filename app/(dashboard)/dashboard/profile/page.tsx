import React from "react";

export default function ProfilePage() {
  // Sample user info
  const user = {
    name: "Demo Student",
    email: "demo@vidyai.com",
    phone: "+91-9876543210",
    address: "123 Main Street, Mumbai",
    dob: "2000-01-01",
    image: null,
    preferredLanguage: "English",
    currentStreak: 5,
    totalPoints: 1250,
  };
  return (
    <div className="p-6 flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md rounded-2xl shadow-2xl bg-white p-8">
        {/* Profile Card */}
        <div className="flex flex-col items-center mb-8">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-3 shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="text-2xl font-bold mt-2">{user.name}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 mb-8">
          <div className="rounded-xl bg-gray-50 p-4 flex items-center gap-4">
            <span className="font-medium text-primary text-lg">🌐 Preferred Language:</span>
            <span className="text-gray-700">{user.preferredLanguage}</span>
          </div>
          <div className="rounded-xl bg-orange-100 p-4 flex items-center gap-4">
            <span className="font-medium text-orange-600 text-lg">🔥 Current Streak:</span>
            <span className="text-orange-700">{user.currentStreak} days</span>
          </div>
          <div className="rounded-xl bg-blue-100 p-4 flex items-center gap-4">
            <span className="font-medium text-blue-600 text-lg">⭐ Total Points:</span>
            <span className="text-blue-700">{user.totalPoints}</span>
          </div>
        </div>
        {/* Personal Details Section */}
        <div className="rounded-xl bg-green-50 p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center gap-2">👤 Personal Details</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-2"><span className="font-medium">Name:</span> <span>{user.name}</span></div>
            <div className="flex items-center gap-2"><span className="font-medium">Email:</span> <span>{user.email}</span></div>
            <div className="flex items-center gap-2"><span className="font-medium">Phone:</span> <span>{user.phone}</span></div>
            <div className="flex items-center gap-2"><span className="font-medium">Address:</span> <span>{user.address}</span></div>
            <div className="flex items-center gap-2"><span className="font-medium">Date of Birth:</span> <span>{user.dob}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

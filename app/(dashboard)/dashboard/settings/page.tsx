import React from "react";

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <form className="space-y-6 max-w-md">
        <div>
          <label className="block text-sm font-medium mb-2">Change Email</label>
          <input type="email" placeholder="Enter new email" className="border rounded-lg px-4 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Change Password</label>
          <input type="password" placeholder="Enter new password" className="border rounded-lg px-4 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <select className="border rounded-lg px-4 py-2 w-full">
            <option>Light</option>
            <option>Dark</option>
            <option>System</option>
          </select>
        </div>
        <button type="submit" className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary/90 transition w-full">Save Changes</button>
      </form>
    </div>
  );
}

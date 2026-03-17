"use client";
import React from "react";

export default function RegisterPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="bg-primary rounded-full h-16 w-16 flex items-center justify-center mb-4 shadow">
          <span className="text-white text-3xl font-bold">📝</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-primary">Create Account</h1>
        <p className="text-gray-500 mb-6 text-center">Sign up to access all features and track your learning progress.</p>
        <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <button type="submit" className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary/90 transition mt-2">
            Sign Up
          </button>
          <div className="flex items-center my-2">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <button type="button" className="flex items-center justify-center gap-2 bg-red-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-600 transition">
            <svg className="h-5 w-5" viewBox="0 0 48 48"><g><path fill="#fff" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11.1 0 20-8.9 20-20 0-1.3-.1-2.7-.3-4z"/><path fill="#ea4335" d="M6.3 14.7l6.6 4.8C14.5 16.1 18.8 13 24 13c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.5 5.1 29.5 3 24 3c-7.2 0-13.3 3.8-16.7 9.7z"/><path fill="#34a853" d="M24 43c5.6 0 10.3-1.8 13.7-4.9l-6.3-5.2C29.7 34.5 27 35.5 24 35.5c-5.7 0-10.5-3.8-12.2-9.1l-6.6 5.1C7.7 39.2 15.2 43 24 43z"/><path fill="#4a90e2" d="M44.5 20H24v8.5h11.7C34.7 33.1 29.8 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.4l6.4-6.4C34.5 5.1 29.5 3 24 3 12.9 3 4 11.9 4 23s8.9 20 20 20c11.1 0 20-8.9 20-20 0-1.3-.1-2.7-.3-4z"/></g></svg>
            Sign up with Google
          </button>
          <a href="/login" className="text-center text-primary underline hover:text-primary/80 transition mt-2">Already have an account? Login</a>
        </form>
      </div>
    </div>
  );
}

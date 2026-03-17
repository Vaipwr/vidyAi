"use client";
import React from "react";

export default function RegisterPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    window.location.href = "/dashboard";
  };
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Register</h1>
      <form className="flex flex-col gap-4 w-full max-w-xs" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border rounded-lg px-4 py-2"
          required
        />
        <button type="submit" className="bg-primary text-white rounded-lg px-4 py-2 font-semibold hover:bg-primary/90 transition">
          Sign Up
        </button>
        <span className="text-center text-sm text-gray-500">or</span>
        <button type="button" className="bg-red-500 text-white rounded-lg px-4 py-2 font-semibold hover:bg-red-600 transition">
          Sign up with Google
        </button>
        <a href="/login" className="text-center text-primary underline hover:text-primary/80 transition">Already have an account? Login</a>
      </form>
    </div>
  );
}

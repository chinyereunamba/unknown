"use client";

import React from "react";
import { Button, Card, Input, Link } from "./";

interface AuthFormProps {
  isSignUp: boolean;
  onToggleMode: () => void;
  onSubmit: (credentials: { email: string; password: string }) => Promise<void>;
}

export default function AuthForm({
  isSignUp,
  onToggleMode,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp && password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (error) {
      alert("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    alert("Google authentication would be implemented here");
  };

  return (
    <Card
      className="w-full max-w-md mx-auto p-6"
      data-name="auth-form"
      data-file="components/AuthForm.js"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="">
          {isSignUp ? "Sign up to get started" : "Sign in to your account"}
        </p>
      </div>

      <Button
        onClick={handleGoogleAuth}
        className="w-full flex items-center justify-center space-x-3 rounded-lg px-4 py-3 transition-colors mb-4"
      >
        <div className="icon-chrome text-lg"></div>
        <span>Continue with Google</span>
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2">or</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Enter your password"
          />
        </div>

        {isSignUp && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <Input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field"
              placeholder="Confirm your password"
            />
          </div>
        )}

        <Button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={onToggleMode}
            className="ml-1 text-blue-600 hover:text-blue-700 font-medium"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </Card>
  );
}

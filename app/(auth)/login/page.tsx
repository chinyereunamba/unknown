"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

import AuthForm from "@/components/form";

interface Credentials {
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();

  const handleAuth = async (credentials: Credentials) => {
    // Simulate authentication
    console.log("Authentication with:", credentials);

    // In a real app, you would call your authentication API here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to home page after successful authentication
    router.push("/");
  };

  const handleGoogleAuth = async () => {
    try {
      // Redirect to Better Auth's Google sign-in
      window.location.href = "/api/auth/signin/google";
    } catch (error) {
      console.error("Google authentication error:", error);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div
      className="min-h-screen"
      data-file="pages/AuthPage.js"
      data-name="auth-page"
    >
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mx-auto w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4">
            <span className="font-bold text-lg">S</span>
          </div>
          <AuthForm
            onGoogleAuth={handleGoogleAuth}
            onSubmit={handleAuth}
            onToggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
}

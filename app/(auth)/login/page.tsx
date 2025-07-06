"use client";
import AuthForm from "@/components/form";
import { Zap } from "lucide-react";
import { useState } from "react";


interface Credentials {
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (credentials: Credentials) => {
    // Simulate authentication
    console.log("Authentication with:", credentials);

    // In a real app, you would call your authentication API here
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Redirect to home page after successful authentication
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div
      className="min-h-screen"
      data-name="auth-page"
      data-file="pages/AuthPage.js"
    >
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
            <span className="text-primary font-bold text-lg">S</span>
          </div>
          <AuthForm onToggleMode={toggleMode} onSubmit={handleAuth} />
        </div>
      </div>
    </div>
  );
}

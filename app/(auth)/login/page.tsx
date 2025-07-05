"use client";
import AuthForm from "@/components/form";
import { Zap } from "lucide-react";
import { useState } from "react";
import { Button, Link } from "@/components";

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
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap />
              </div>
              <span className="text-2xl font-bold">WebWhisper AI</span>
            </div>
          </div>

          <AuthForm
            isSignUp={isSignUp}
            onToggleMode={toggleMode}
            onSubmit={handleAuth}
          />

          <div className="mt-8 text-center">
            <Button as={Link} href="/" variant="shadow" className="text-sm">
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

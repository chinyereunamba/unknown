"use client";
import { useState } from "react";

import AuthForm from "@/components/form";

interface Credentials {
  email: string;
  password: string;
}

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);


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
            onToggleMode={toggleMode}
          />
        </div>
      </div>
    </div>
  );
}

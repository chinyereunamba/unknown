"use client";

import { useState } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
// import { useAuth } from "@/contexts/AuthContext";

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  // const { user, isAuthenticated, isLoading, signOut } = useAuth();

  // const handleSignOut = () => {
  //   signOut();
  //   setIsOpen(false);
  // };

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center space-x-2">
  //       <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
  //     </div>
  //   );
  // }

  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center space-x-4">
  //       <Link
  //         className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
  //         href="/login"
  //       >
  //         Sign in
  //       </Link>
  //       <Button asChild size="sm">
  //         <Link href="/login">Get Started</Link>
  //       </Button>
  //     </div>
  //   );
  // }

  return (
    <div className="relative">
      {/* <button
        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
          {user?.name?.[0] || user?.email?.[0] || "U"}
        </div>
        <span className="hidden md:block">{user?.name || user?.email}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 9l-7 7-7-7"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
            <div className="font-medium">{user?.name}</div>
            <div className="text-gray-500 dark:text-gray-400">
              {user?.email}
            </div>
          </div>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      )} */}
    </div>
  );
}

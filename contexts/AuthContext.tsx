"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface AuthContextType {
  // user: User | null;
  // isAuthenticated: boolean;
  // isLoading: boolean;
  // signIn: (user: User) => void;
  // signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  

  const value = {
  //   user,
  //   isAuthenticated: !!user,
  //   isLoading,
  //   signIn,
  //   signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

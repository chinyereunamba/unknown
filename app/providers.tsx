"use client";

import type { ThemeProviderProps } from "next-themes";
import { AutumnProvider } from "autumn-js/react";
import { AuthProvider } from "@/contexts/AuthContext";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <AuthProvider>
          <AutumnProvider
            backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL}
          >
            {children}
          </AutumnProvider>
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

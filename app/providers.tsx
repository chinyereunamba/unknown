"use client";

import type { ThemeProviderProps } from "next-themes";
import { Session } from "next-auth";

import { AutumnProvider } from "autumn-js/react";
import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";

import { LanguageProvider } from "@/contexts/LanguageContext";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
  // session?: Session | null;
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
    // <SessionProvider session={session}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <LanguageProvider>
            <AutumnProvider
              backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL}
            >
              {children}
            </AutumnProvider>
          </LanguageProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    // </SessionProvider>
  );
}

"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthCallback":
        return "There was an error during the OAuth callback. Please check your Google OAuth configuration.";
      case "OAuthSignin":
        return "There was an error during the OAuth sign-in process.";
      case "OAuthCreateAccount":
        return "There was an error creating your account.";
      case "EmailCreateAccount":
        return "There was an error creating your account with email.";
      case "Callback":
        return "There was an error during the callback process.";
      case "OAuthAccountNotLinked":
        return "This account is not linked to any existing user.";
      case "EmailSignin":
        return "There was an error during email sign-in.";
      case "CredentialsSignin":
        return "There was an error during credentials sign-in.";
      case "SessionRequired":
        return "A session is required for this action.";
      case "Default":
      default:
        return "An unexpected error occurred during authentication.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">
            Authentication Error
          </CardTitle>
          <CardDescription>{getErrorMessage(error)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>Error Code:</strong> {error || "Unknown"}
            </p>
            <p>
              <strong>Timestamp:</strong> {new Date().toLocaleString()}
            </p>
          </div>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/login">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

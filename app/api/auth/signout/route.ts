import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.delete("betterauth_token");
    return response;
  } catch (error) {
    console.error("Sign out error:", error);
    return NextResponse.json({ error: "Sign out failed" }, { status: 500 });
  }
}

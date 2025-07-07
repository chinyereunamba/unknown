import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  // Query user by email
  const result = await db.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  const user = result.rows[0];
  if (!user || !user.password_hash) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  // Return user object for NextAuth
  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
  });
}

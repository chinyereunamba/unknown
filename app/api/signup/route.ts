import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const { email, password, name, image } = await req.json();
  // Check if user already exists
  const existing = await db.query(`SELECT id FROM users WHERE email = $1`, [
    email,
  ]);
  if (existing.rows.length > 0) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 400 }
    );
  }
  const password_hash = await bcrypt.hash(password, 10);
  const id = randomUUID();
  await db.query(
    `INSERT INTO users (id, name, email, image, password_hash, created_at) VALUES ($1, $2, $3, $4, $5, now())`,
    [id, name, email, image, password_hash]
  );
  return NextResponse.json({ id, name, email, image });
}

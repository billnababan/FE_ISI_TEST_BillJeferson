// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Validasi role
    if (!["lead", "team"].includes(role)) {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan pengguna ke database
    const result = await query("INSERT INTO users (name, email, password, role, created_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING *", [name, email, hashedPassword, role]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

// src/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();

    // Cek pengguna berdasarkan email
    const result = await query("SELECT * FROM users WHERE email = $1", [email]);

    // Periksa apakah pengguna ditemukan
    if (!result.rows.length) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const user = result.rows[0];

    // Verifikasi password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Buat token JWT
    const token = jwt.sign({ uuid: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return NextResponse.json({ token, role: user.role, uuid: user.id }, { status: 200 }); // Tambahkan role dalam response
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

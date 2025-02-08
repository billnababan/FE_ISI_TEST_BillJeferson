// src/lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export const authenticate = (req: NextRequest, allowedRoles: string[]) => {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    if (typeof decoded !== "object" || !("role" in decoded)) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // Periksa apakah role diizinkan
    if (!allowedRoles.includes(decoded.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return decoded; // Return data pengguna jika berhasil
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
};

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");

    if (role === "team") {
      const result = await query("SELECT id, email FROM users WHERE role = 'team'");
      return NextResponse.json(result.rows, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

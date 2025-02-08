import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authenticate } from "@/lib/authMiddleware"; // Import middleware

export const GET = async (req: NextRequest) => {
  const auth = authenticate(req, ["team"]);
  if (auth instanceof NextResponse) return auth;

  try {
    const result = await query("SELECT * FROM tasks WHERE assigned_to = $1", [auth.uuid]);

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

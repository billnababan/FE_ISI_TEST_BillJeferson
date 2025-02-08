import { NextRequest, NextResponse } from "next/server";

// 🟢 POST: Logout
export const POST = async (req: NextRequest) => {
  try {
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

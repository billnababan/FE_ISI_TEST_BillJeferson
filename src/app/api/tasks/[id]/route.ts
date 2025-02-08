import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authenticate } from "@/lib/authMiddleware"; // Import middleware

export const PUT = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = authenticate(req, ["lead"]);
  if (auth instanceof NextResponse) return auth; // Jika gagal auth, return response error

  try {
    const { title, description, assigned_to } = await req.json();
    const taskId = params.id; // Ambil ID dari URL

    if (!taskId) {
      return NextResponse.json({ message: "Task ID is required" }, { status: 400 });
    }

    // Cari ID pengguna berdasarkan email
    const userResult = await query("SELECT id FROM users WHERE email = $1", [assigned_to]);
    if (userResult.rowCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const assignedToId = userResult.rows[0].id;

    const result = await query("UPDATE tasks SET title = $1, description = $2, assigned_to = $3 WHERE id = $4 RETURNING *", [title, description, assignedToId, taskId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

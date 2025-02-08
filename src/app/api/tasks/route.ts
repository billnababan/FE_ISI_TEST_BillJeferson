// src/app/api/tasks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authenticate } from "@/lib/authMiddleware"; // Import middleware

// 🟢 GET: Semua pengguna bisa melihat task
export const GET = async () => {
  try {
    const result = await query("SELECT * FROM tasks");
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

// 🟠 POST: Hanya "lead" yang bisa menambah task
export const POST = async (req: NextRequest) => {
  const auth = authenticate(req, ["lead"]);
  if (auth instanceof NextResponse) return auth; // Jika gagal auth, return response error

  try {
    const { title, description, assigned_to } = await req.json();

    const userResult = await query("SELECT id FROM users WHERE email = $1", [assigned_to]);
    if (userResult.rowCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const assignedToId = userResult.rows[0].id;

    const status = "Not Started";
    const createdBy = auth.uuid;

    const result = await query("INSERT INTO tasks (title, description, status, assigned_to, created_by, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *", [title, description, status, assignedToId, createdBy]);

    // Insert log
    await query("INSERT INTO logs (task_id, action, performed_by, description, timestamp) VALUES ($1, $2, $3, $4, NOW())", [
      result.rows[0].id,
      "CREATE",
      createdBy,
      `Task with title '${title}' created and assigned to user with ID ${assignedToId}.`,
    ]);

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

// 🟠 PUT: Hanya "lead" yang bisa memperbarui task

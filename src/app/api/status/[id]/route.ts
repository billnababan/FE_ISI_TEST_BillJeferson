import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authenticate } from "@/lib/authMiddleware";

// PUT: Update task status and description
export const PUT = async (req: NextRequest) => {
  const auth = authenticate(req, ["team"]);
  if (auth instanceof NextResponse) return auth;

  try {
    const { status, description } = await req.json();
    const url = new URL(req.url);
    const taskId = url.pathname.split("/").pop();

    const taskCheck = await query("SELECT * FROM tasks WHERE id = $1 AND assigned_to = $2", [taskId, auth.uuid]);

    if (taskCheck.rowCount === 0) {
      return NextResponse.json({ message: "Task not found or not assigned to you" }, { status: 404 });
    }

    const result = await query(
      `UPDATE tasks 
       SET status = $1, description = $2, updated_at = NOW() 
       WHERE id = $3 AND assigned_to = $4 
       RETURNING *`,
      [status, description, taskId, auth.uuid]
    );

    await query(
      `INSERT INTO logs (task_id, action, performed_by, description) 
       VALUES ($1, $2, $3, $4)`,
      [taskId, "UPDATE", auth.uuid, `Task status updated to ${status} by team member`]
    );

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { authenticate } from "@/lib/authMiddleware"; // Import middleware

// 🟢 PATCH: Team bisa merubah status dan keterangan task yang diberikan oleh Lead
export const PATCH = async (req: NextRequest, { params }: { params: { id: string } }) => {
  const auth = authenticate(req, ["team"]);
  if (auth instanceof NextResponse) return auth; // Jika gagal auth, return response error

  try {
    const { status, description } = await req.json();
    const taskId = parseInt(params.id); // Menunggu params.id

    // Validasi status task yang diterima
    const validStatuses = ["Not Started", "On Progress", "Done", "Reject"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
    }

    // Cari task berdasarkan ID
    const taskResult = await query("SELECT * FROM tasks WHERE id = $1", [taskId]);
    if (taskResult.rowCount === 0) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }

    const task = taskResult.rows[0];

    console.log(auth.uuid);
    // Pastikan task ini ditugaskan ke user yang sedang melakukan request
    if (task.assigned_to !== auth.uuid) {
      return NextResponse.json({ message: "You are not assigned to this task" }, { status: 403 });
    }

    // Update task dengan status dan deskripsi baru
    const result = await query("UPDATE tasks SET status = $1, description = $2, updated_at = NOW() WHERE id = $3 RETURNING *", [status, description, taskId]);

    // Insert log
    await query("INSERT INTO logs (task_id, action, performed_by, description, timestamp) VALUES ($1, $2, $3, $4, NOW())", [taskId, "UPDATE", auth.uuid, `Task ID ${taskId} status changed to '${status}' and description updated.`]);

    return NextResponse.json(result.rows[0], { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

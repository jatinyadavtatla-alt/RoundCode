import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { getSessionUser } from "@/lib/auth/session";

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Administrator authorization required." },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const members = await User.find({ role: { $ne: "superadmin" } })
      .select("-passwordHash")
      .sort({ createdAt: -1 })
      .lean();

    const pendingCount = members.filter((m) => m.status === "pending").length;
    const approvedCount = members.filter((m) => m.status === "approved").length;

    return NextResponse.json({
      success: true,
      data: {
        members,
        stats: {
          total: members.length,
          pending: pendingCount,
          approved: approvedCount,
        },
      },
    });
  } catch (error: any) {
    console.error("Admin fetch members error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch members." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Administrator authorization required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, status } = body;

    if (!userId || !status) {
      return NextResponse.json(
        { success: false, error: "User ID and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending", "approved", "rejected", "suspended"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `User status successfully updated to '${status}'.`,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Admin update member status error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update member status." },
      { status: 500 }
    );
  }
}

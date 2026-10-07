import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Submission } from "@/models/Submission";
import { getSessionUser } from "@/lib/auth/session";
import { QUESTIONS_DATA } from "@/lib/data/questions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    await connectToDatabase();

    const submission = await Submission.findById(id)
      .populate("userId", "name email collegeId")
      .populate("reviewedBy", "name email")
      .lean();

    if (!submission) {
      return NextResponse.json(
        { success: false, error: "Submission not found." },
        { status: 404 }
      );
    }

    const isAdmin = session.role === "admin" || session.role === "superadmin";
    const subUserId = (submission.userId as any)?._id?.toString() || (submission.userId as any)?.toString();
    if (!isAdmin && subUserId !== session.userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access to submission." },
        { status: 403 }
      );
    }

    const q = QUESTIONS_DATA[submission.questionId];

    return NextResponse.json({
      success: true,
      data: {
        _id: (submission as any)._id.toString(),
        userId: subUserId,
        userName: (submission.userId as any)?.name || "Member",
        userEmail: (submission.userId as any)?.email || "",
        userCollegeId: (submission.userId as any)?.collegeId || "",
        questionId: submission.questionId,
        questionTitle: q ? q.title : `Question ${submission.questionId}`,
        code: submission.code,
        language: submission.language,
        status: submission.status,
        adminFeedback: submission.adminFeedback || "",
        reviewedBy: (submission.reviewedBy as any)?._id?.toString() || null,
        reviewedByName: (submission.reviewedBy as any)?.name || null,
        reviewedAt: submission.reviewedAt || null,
        submittedAt: submission.submittedAt,
        updatedAt: submission.updatedAt,
      },
    });
  } catch (error: any) {
    console.error("Submission fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch submission." },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const isAdmin = session.role === "admin" || session.role === "superadmin";
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: "Only administrators can review submissions." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status, adminFeedback } = body;

    const validStatuses = [
      "Pending Review",
      "Under Review",
      "Approved",
      "Needs Revision",
    ];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status value." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updateFields: any = {
      reviewedBy: session.userId,
      reviewedAt: new Date(),
    };

    if (status) {
      updateFields.status = status;
    }

    if (adminFeedback !== undefined) {
      updateFields.adminFeedback = adminFeedback;
    }

    const updated = await Submission.findByIdAndUpdate(id, updateFields, {
      returnDocument: "after",
    })
      .populate("userId", "name email")
      .populate("reviewedBy", "name email");

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Submission not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Submission updated successfully.",
      data: updated,
    });
  } catch (error: any) {
    console.error("Submission update error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update submission." },
      { status: 500 }
    );
  }
}

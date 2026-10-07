import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Submission } from "@/models/Submission";
import { User } from "@/models/User";
import { getSessionUser } from "@/lib/auth/session";
import { QUESTIONS_DATA } from "@/lib/data/questions";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required to submit code." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { questionId, code, language } = body;

    if (!questionId || !code || !language) {
      return NextResponse.json(
        { success: false, error: "Question ID, code, and language are required." },
        { status: 400 }
      );
    }

    const validLanguages = ["cpp", "java", "python", "javascript"];
    if (!validLanguages.includes(language.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: "Unsupported language selection." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newSubmission = await Submission.create({
      userId: session.userId,
      questionId: String(questionId),
      code,
      language: language.toLowerCase(),
      status: "Pending Review",
      adminFeedback: "",
      submittedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Code submitted successfully and queued for review.",
        data: {
          submissionId: newSubmission._id,
          status: newSubmission.status,
          submittedAt: newSubmission.submittedAt,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Submission creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit code." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Authentication required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const questionId = searchParams.get("questionId");
    const status = searchParams.get("status");

    await connectToDatabase();

    const query: any = {};

    // Non-admin users can ONLY see their own submissions
    const isAdmin = session.role === "admin" || session.role === "superadmin";
    if (!isAdmin) {
      query.userId = session.userId;
    }

    if (questionId) {
      query.questionId = questionId;
    }

    if (status) {
      query.status = status;
    }

    const submissions = await Submission.find(query)
      .populate("userId", "name email collegeId")
      .populate("reviewedBy", "name email")
      .sort({ submittedAt: -1 })
      .lean();

    const formatted = submissions.map((sub: any) => {
      const q = QUESTIONS_DATA[sub.questionId];
      return {
        _id: sub._id.toString(),
        userId: sub.userId?._id?.toString() || sub.userId?.toString(),
        userName: sub.userId?.name || "Unknown Member",
        userEmail: sub.userId?.email || "",
        userCollegeId: sub.userId?.collegeId || "",
        questionId: sub.questionId,
        questionTitle: q ? q.title : `Question ${sub.questionId}`,
        code: sub.code,
        language: sub.language,
        status: sub.status,
        adminFeedback: sub.adminFeedback || "",
        reviewedBy: sub.reviewedBy?._id?.toString() || null,
        reviewedByName: sub.reviewedBy?.name || null,
        reviewedAt: sub.reviewedAt || null,
        submittedAt: sub.submittedAt,
        updatedAt: sub.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error: any) {
    console.error("Submissions fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch submissions." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Question } from "@/models/Question";
import { getSessionUser } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Administrator authorization required." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      topic,
      difficulty,
      constraints,
      examples,
      expectedComplexity,
      starterCode,
      leetcodeUrl,
    } = body;

    if (!title || !description || !topic || !difficulty) {
      return NextResponse.json(
        { success: false, error: "Title, description, topic, and difficulty are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newQuestion = await Question.create({
      title: title.trim(),
      description: description.trim(),
      topic: topic.trim(),
      difficulty,
      constraints: Array.isArray(constraints) ? constraints : (constraints ? [constraints] : []),
      examples: Array.isArray(examples) ? examples : [],
      expectedComplexity: expectedComplexity || { time: "O(N)", space: "O(1)" },
      starterCode: starterCode || {
        cpp: `class Solution {\npublic:\n    // Implement solution\n};\n`,
        java: `class Solution {\n    // Implement solution\n}\n`,
        python: `class Solution:\n    # Implement solution\n    pass\n`,
        javascript: `function solve() {\n  // Implement solution\n}\n`,
      },
      leetcodeUrl: (leetcodeUrl || "").trim(),
      createdBy: session.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "DSA Question added successfully.",
        data: newQuestion,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin add question error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create question." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const questions = await Question.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      data: questions,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch questions." },
      { status: 500 }
    );
  }
}

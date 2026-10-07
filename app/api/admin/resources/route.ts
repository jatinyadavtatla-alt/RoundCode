import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Resource } from "@/models/Resource";
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
    const { title, description, type, topic, url } = body;

    if (!title || !description || !topic || !url) {
      return NextResponse.json(
        { success: false, error: "Title, description, topic, and URL are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const normalizedType = (type === "video" ? "youtube" : type) || "youtube";

    const newResource = await Resource.create({
      title: title.trim(),
      description: description.trim(),
      type: normalizedType,
      topic: topic.trim(),
      url: url.trim(),
      createdBy: session.userId,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Learning resource uploaded successfully.",
        data: newResource,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Admin add resource error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create resource." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const resources = await Resource.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({
      success: true,
      data: resources,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch resources." },
      { status: 500 }
    );
  }
}

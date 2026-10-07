import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { isAuthorizedAdminEmail } from "@/lib/auth/adminSeed";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, collegeId, branch, year, password } = body;

    if (!name || !email || !password || !collegeId || !branch || !year) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Do not allow regular signups using the 4 reserved admin emails
    if (isAuthorizedAdminEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "This email is reserved for system administrators. Please sign in directly." },
        { status: 400 }
      );
    }

    try {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { success: false, error: "An account with this email already exists." },
          { status: 409 }
        );
      }

      const passwordHash = await hashPassword(password);
      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        phone: (phone || "").trim(),
        collegeId: collegeId.trim().toUpperCase(),
        branch: branch.trim(),
        year: Number(year),
        passwordHash,
        role: "member",
        status: "pending", // User request requires admin approval before account is active
      });

      return NextResponse.json(
        {
          success: true,
          pendingApproval: true,
          message:
            "Signup request submitted successfully. An administrator must approve your application before you can sign in.",
          data: {
            user: {
              id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              status: newUser.status,
            },
          },
        },
        { status: 201 }
      );
    } catch (dbError: any) {
      console.error("Database registration error:", dbError);
      return NextResponse.json(
        {
          success: false,
          error:
            dbError.message ||
            "Unable to complete registration. Please check database connection.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Registration request error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid registration payload." },
      { status: 400 }
    );
  }
}

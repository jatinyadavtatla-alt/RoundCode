import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

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
        status: "approved",
      });

      const token = await createSessionToken({
        userId: newUser._id.toString(),
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        status: newUser.status,
      });

      await setSessionCookie(token);

      return NextResponse.json(
        {
          success: true,
          message: "Registration successful.",
          data: {
            user: {
              id: newUser._id,
              name: newUser.name,
              email: newUser.email,
              role: newUser.role,
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

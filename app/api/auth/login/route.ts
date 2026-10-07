import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    try {
      await connectToDatabase();
      const user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }

      const isValidPassword = await verifyPassword(password, user.passwordHash);
      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Invalid email or password." },
          { status: 401 }
        );
      }

      if (user.status === "suspended") {
        return NextResponse.json(
          { success: false, error: "Your account has been suspended. Please contact administrator." },
          { status: 403 }
        );
      }

      const token = await createSessionToken({
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        message: "Login successful.",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
          },
        },
      });
    } catch (dbError: any) {
      console.error("Database login error:", dbError);
      return NextResponse.json(
        {
          success: false,
          error:
            dbError.message ||
            "Unable to connect to database. Please check configuration.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Login request error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid login payload." },
      { status: 400 }
    );
  }
}

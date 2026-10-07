import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { createSessionToken, setSessionCookie } from "@/lib/auth/session";
import { isAuthorizedAdminEmail, getAuthorizedAdmins } from "@/lib/auth/adminSeed";

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
    await connectToDatabase();

    // Check if the user is one of the 4 dedicated administrators
    const isAdmin = isAuthorizedAdminEmail(normalizedEmail);

    if (isAdmin) {
      const authorizedAdmin = getAuthorizedAdmins().find(
        (a) => a.email.toLowerCase() === normalizedEmail
      );

      let user = await User.findOne({ email: normalizedEmail });

      // If admin doesn't exist yet in DB, create it
      if (!user && authorizedAdmin) {
        const passwordHash = await hashPassword(authorizedAdmin.password);
        user = await User.create({
          name: authorizedAdmin.name,
          email: authorizedAdmin.email,
          phone: "+91 98765 00000",
          collegeId: authorizedAdmin.collegeId,
          branch: authorizedAdmin.branch,
          year: authorizedAdmin.year,
          passwordHash,
          role: "admin",
          status: "approved",
        });
      }

      // Check password: either against DB hash or against the configured env password
      let isValidPassword = false;
      if (user) {
        isValidPassword = await verifyPassword(password, user.passwordHash);
      }
      if (!isValidPassword && authorizedAdmin && password === authorizedAdmin.password) {
        isValidPassword = true;
        // update hash in DB
        if (user) {
          user.passwordHash = await hashPassword(password);
          await user.save();
        }
      }

      if (!isValidPassword) {
        return NextResponse.json(
          { success: false, error: "Invalid admin credentials." },
          { status: 401 }
        );
      }

      // Issue admin session cookie
      const token = await createSessionToken({
        userId: user!._id.toString(),
        email: user!.email,
        name: user!.name,
        role: "admin",
        status: "approved",
      });

      await setSessionCookie(token);

      return NextResponse.json({
        success: true,
        isAdmin: true,
        redirect: "/admin",
        message: "Administrator authenticated successfully.",
        data: {
          user: {
            id: user!._id,
            name: user!.name,
            email: user!.email,
            role: "admin",
            status: "approved",
          },
        },
      });
    }

    // Regular Member Login
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

    // Enforce Approval Workflow:
    if (user.status === "pending") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account is pending administrator approval. Please wait for an admin to review and approve your registration request.",
        },
        { status: 403 }
      );
    }

    if (user.status === "rejected") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your registration request was rejected by an administrator. Please contact society administrators.",
        },
        { status: 403 }
      );
    }

    if (user.status === "suspended") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Your account is currently suspended. Please contact society administrators.",
        },
        { status: 403 }
      );
    }

    // Regular members are always role: "member"
    const token = await createSessionToken({
      userId: user._id.toString(),
      email: user.email,
      name: user.name,
      role: "member",
      status: "approved",
    });

    await setSessionCookie(token);

    return NextResponse.json({
      success: true,
      isAdmin: false,
      redirect: "/dashboard",
      message: "Login successful.",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: "member",
          status: user.status,
        },
      },
    });
  } catch (error: any) {
    console.error("Login request error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "An unexpected error occurred during login.",
      },
      { status: 500 }
    );
  }
}

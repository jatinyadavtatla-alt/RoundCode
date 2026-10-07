import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth/session";

export async function POST() {
  try {
    await clearSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully." });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to log out." },
      { status: 500 }
    );
  }
}

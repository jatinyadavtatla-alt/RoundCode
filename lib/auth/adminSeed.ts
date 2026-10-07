import { User } from "@/models/User";
import { hashPassword } from "./password";
import { connectToDatabase } from "@/lib/db/mongodb";

export interface AdminCredential {
  email: string;
  name: string;
  password: string;
  collegeId: string;
  branch: string;
  year: number;
}

export function getAuthorizedAdmins(): AdminCredential[] {
  return [
    {
      email: (process.env.ADMIN_1_EMAIL || "admin.lead@roundcode.dev").toLowerCase().trim(),
      name: process.env.ADMIN_1_NAME || "Lead Administrator",
      password: process.env.ADMIN_1_PASSWORD || "Admin@RoundCode2026!Lead",
      collegeId: "ADMIN-01",
      branch: "Administration",
      year: 4,
    },
    {
      email: (process.env.ADMIN_2_EMAIL || "mentor.dsa@roundcode.dev").toLowerCase().trim(),
      name: process.env.ADMIN_2_NAME || "DSA Senior Mentor",
      password: process.env.ADMIN_2_PASSWORD || "Admin@RoundCode2026!DSA",
      collegeId: "ADMIN-02",
      branch: "Computer Science",
      year: 4,
    },
    {
      email: (process.env.ADMIN_3_EMAIL || "review.faculty@roundcode.dev").toLowerCase().trim(),
      name: process.env.ADMIN_3_NAME || "Faculty Code Reviewer",
      password: process.env.ADMIN_3_PASSWORD || "Admin@RoundCode2026!Faculty",
      collegeId: "ADMIN-03",
      branch: "Software Engineering",
      year: 4,
    },
    {
      email: (process.env.ADMIN_4_EMAIL || "admin.ops@roundcode.dev").toLowerCase().trim(),
      name: process.env.ADMIN_4_NAME || "Operations Admin",
      password: process.env.ADMIN_4_PASSWORD || "Admin@RoundCode2026!Ops",
      collegeId: "ADMIN-04",
      branch: "Operations",
      year: 4,
    },
  ];
}

/**
 * Checks whether an email is one of the 4 authorized admin emails.
 */
export function isAuthorizedAdminEmail(email: string): boolean {
  if (!email) return false;
  const authorized = getAuthorizedAdmins().map((a) => a.email.toLowerCase());
  return authorized.includes(email.toLowerCase().trim());
}

/**
 * Auto-seeds or synchronizes the 4 authorized admin accounts into MongoDB Atlas.
 */
export async function seedAuthorizedAdmins(): Promise<void> {
  await connectToDatabase();
  const admins = getAuthorizedAdmins();

  for (const admin of admins) {
    const existing = await User.findOne({ email: admin.email });
    const passwordHash = await hashPassword(admin.password);

    if (!existing) {
      await User.create({
        name: admin.name,
        email: admin.email,
        phone: "+91 98765 00000",
        collegeId: admin.collegeId,
        branch: admin.branch,
        year: admin.year,
        passwordHash,
        role: "admin",
        status: "approved",
      });
    } else {
      // Ensure role is admin and status is approved
      existing.role = "admin";
      existing.status = "approved";
      existing.passwordHash = passwordHash;
      await existing.save();
    }
  }
}

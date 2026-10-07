import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/session";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";
import { connectToDatabase } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { Question } from "@/models/Question";
import { Resource } from "@/models/Resource";
import { Submission } from "@/models/Submission";
import { isAuthorizedAdminEmail } from "@/lib/auth/adminSeed";

export default async function AdminPage() {
  const session = await getSessionUser();

  // Strict server-side authorization check:
  // Must be logged in, must have admin role, and email must be an authorized admin email
  if (!session || session.role !== "admin" || !isAuthorizedAdminEmail(session.email)) {
    redirect("/login");
  }

  await connectToDatabase();

  // Gather platform metrics for the admin console
  const [pendingMembers, totalMembers, totalQuestions, totalResources, pendingSubmissions] =
    await Promise.all([
      User.countDocuments({ status: "pending" }),
      User.countDocuments({ role: { $ne: "superadmin" } }),
      Question.countDocuments(),
      Resource.countDocuments(),
      Submission.countDocuments({ status: { $in: ["Pending Review", "Under Review"] } }),
    ]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <AdminDashboardClient
        adminUser={{
          name: session.name,
          email: session.email,
          role: session.role,
        }}
        initialStats={{
          pendingMembers,
          totalMembers,
          totalQuestions,
          totalResources,
          pendingSubmissions,
        }}
      />
    </div>
  );
}

import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  FileCode,
  Award,
  RotateCcw,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/lib/db/mongodb";
import { Submission } from "@/models/Submission";
import { QUESTIONS_DATA } from "@/lib/data/questions";

export default async function DashboardPage() {
  const session = await getSessionUser();
  const userName = session ? session.name : "Member";

  let questionsAttempted = 0;
  let pendingReviews = 0;
  let reviewed = 0;
  let approvedSolutions = 0;
  let needsRevision = 0;
  let recentSubmissions: any[] = [];

  if (session) {
    try {
      await connectToDatabase();
      const userSubmissions = await Submission.find({ userId: session.userId })
        .sort({ submittedAt: -1 })
        .lean();

      const uniqueQuestions = new Set(userSubmissions.map((s) => s.questionId));
      questionsAttempted = uniqueQuestions.size;

      pendingReviews = userSubmissions.filter(
        (s) => s.status === "Pending Review" || s.status === "Under Review"
      ).length;

      reviewed = userSubmissions.filter(
        (s) => s.status === "Approved" || s.status === "Needs Revision"
      ).length;

      approvedSolutions = userSubmissions.filter(
        (s) => s.status === "Approved"
      ).length;

      needsRevision = userSubmissions.filter(
        (s) => s.status === "Needs Revision"
      ).length;

      recentSubmissions = userSubmissions.slice(0, 5).map((sub: any) => {
        const q = QUESTIONS_DATA[sub.questionId];
        return {
          id: sub._id.toString(),
          questionId: sub.questionId,
          problem: q ? q.title : `Question ${sub.questionId}`,
          lang: sub.language,
          status: sub.status,
          adminFeedback: sub.adminFeedback || "",
          time: new Date(sub.submittedAt).toLocaleDateString(),
        };
      });
    } catch (e) {
      console.error("Dashboard metrics error:", e);
    }
  }

  // Fallback defaults for empty state/guest
  if (recentSubmissions.length === 0) {
    recentSubmissions = [
      {
        id: "1",
        questionId: "1",
        problem: "Two Sum",
        lang: "cpp",
        status: "Approved",
        adminFeedback: "Clean hash map solution with optimal O(N) runtime and clear variable names.",
        time: "Yesterday",
      },
      {
        id: "2",
        questionId: "2",
        problem: "Valid Parentheses",
        lang: "python",
        status: "Pending Review",
        adminFeedback: "",
        time: "Today",
      },
    ];
    if (questionsAttempted === 0) {
      questionsAttempted = 2;
      pendingReviews = 1;
      reviewed = 1;
      approvedSolutions = 1;
      needsRevision = 0;
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Approved":
        return <Badge variant="approved">Approved</Badge>;
      case "Under Review":
        return <Badge variant="under_review">Under Review</Badge>;
      case "Needs Revision":
        return <Badge variant="needs_revision">Needs Revision</Badge>;
      default:
        return <Badge variant="pending_review">Pending Review</Badge>;
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Member Console
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-emerald-400 font-mono">
              Status: Active
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Welcome back, {userName}
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Submit solutions in Monaco Editor, track mentor feedback, and iterate on algorithm designs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/submissions">
            <Button variant="secondary" size="sm">
              My Submissions
            </Button>
          </Link>
          <Link href="/questions">
            <Button className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium size-sm">
              Practice Problems
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress & Review Metrics (5 key stats) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* 1. Questions Attempted */}
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase truncate">Attempted</span>
              <FileCode className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {questionsAttempted}
              </span>
              <span className="text-xs text-zinc-500 font-mono">Problems</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Unique challenges coded</p>
          </CardContent>
        </Card>

        {/* 2. Pending Reviews */}
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase truncate">Pending Review</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-amber-400 tracking-tight">
                {pendingReviews}
              </span>
              <span className="text-xs text-zinc-500 font-mono">In Queue</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Awaiting faculty check</p>
          </CardContent>
        </Card>

        {/* 3. Reviewed */}
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase truncate">Reviewed</span>
              <CheckCircle2 className="h-4 w-4 text-sky-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-sky-400 tracking-tight">
                {reviewed}
              </span>
              <span className="text-xs text-zinc-500 font-mono">Solutions</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Critiqued by mentors</p>
          </CardContent>
        </Card>

        {/* 4. Approved Solutions */}
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase truncate">Approved</span>
              <Award className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-400 tracking-tight">
                {approvedSolutions}
              </span>
              <span className="text-xs text-zinc-500 font-mono">Accepted</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">High-standard solutions</p>
          </CardContent>
        </Card>

        {/* 5. Needs Revision */}
        <Card className="border-zinc-800 bg-[#0c0d12] col-span-2 sm:col-span-1">
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase truncate">Needs Revision</span>
              <RotateCcw className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-rose-400 tracking-tight">
                {needsRevision}
              </span>
              <span className="text-xs text-zinc-500 font-mono">To Improve</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Feedback provided</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Topic Progress & Next Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Progress */}
        <Card className="lg:col-span-2 border-zinc-800 bg-[#0c0d12]">
          <CardHeader>
            <CardTitle className="text-lg">Curriculum Progress</CardTitle>
            <CardDescription>
              Progression across algorithmic structures and interview topics
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { topic: "Arrays & Two Pointers", count: "12 / 15", pct: 80 },
              { topic: "Strings & Pattern Matching", count: "6 / 10", pct: 60 },
              { topic: "Linked Lists", count: "4 / 8", pct: 50 },
              { topic: "Trees & Binary Search Trees", count: "2 / 12", pct: 16 },
              { topic: "Dynamic Programming", count: "1 / 18", pct: 5 },
            ].map((t) => (
              <div key={t.topic} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">{t.topic}</span>
                  <span className="font-mono text-zinc-500">{t.count} ({t.pct}%)</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full"
                    style={{ width: `${t.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Challenge */}
        <Card className="border-zinc-800 bg-[#0c0d12] flex flex-col justify-between">
          <div>
            <CardHeader>
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-mono uppercase text-amber-400">
                  Recommended Problem
                </span>
              </div>
              <CardTitle className="text-lg">Reverse Linked List</CardTitle>
              <CardDescription>
                Strengthen pointer manipulation fundamentals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="easy">Easy</Badge>
                <Badge variant="secondary">Linked List</Badge>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Given the head of a singly linked list, reverse the list, and return the reversed list iteratively and recursively.
              </p>
            </CardContent>
          </div>

          <div className="p-6 pt-0">
            <Link href="/questions/3" className="w-full inline-block">
              <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-white text-xs">
                Solve in Monaco
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="border-zinc-800 bg-[#0c0d12]">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Submissions</CardTitle>
            <CardDescription>
              Latest code submissions and mentor review status
            </CardDescription>
          </div>
          <Link href="/submissions">
            <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-white">
              View All History
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-900">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 mt-0.5">
                    <Code2 className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">
                      {sub.problem}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                      <span className="uppercase">{sub.lang}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {sub.time}
                      </span>
                    </div>
                    {sub.adminFeedback && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-xs text-zinc-400">
                        <MessageSquare className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1 italic">
                          &quot;{sub.adminFeedback}&quot;
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  {getStatusBadge(sub.status)}
                  <Link href={`/questions/${sub.questionId}`}>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 hover:text-white">
                      Inspect
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

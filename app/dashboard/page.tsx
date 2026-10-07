import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  Flame,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getSessionUser } from "@/lib/auth/session";

export default async function DashboardPage() {
  const session = await getSessionUser();
  const userName = session ? session.name : "Member";

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
            Track your progress across algorithmic topics and continue problem solving
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/questions">
            <Button className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium">
              Continue Practicing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Solved Problems</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">24</span>
              <span className="text-xs text-zinc-500 font-mono">/ 150</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">16% of total curriculum completed</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Submissions</span>
              <Code2 className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">42</span>
              <span className="text-xs text-zinc-500 font-mono">Total Runs</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Evaluated with Judge0</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Acceptance Rate</span>
              <TrendingUp className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">71.4%</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">30 Accepted / 42 Submissions</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Active Streak</span>
              <Flame className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">5 Days</span>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Daily practice streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Topic Progress & Recommended Challenge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Topic Progress */}
        <Card className="lg:col-span-2 border-zinc-800 bg-[#0c0d12]">
          <CardHeader>
            <CardTitle className="text-lg">Topic Mastery</CardTitle>
            <CardDescription>
              Your progression across foundational algorithmic tracks
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
            <Link href="/questions" className="w-full inline-block">
              <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-white text-xs">
                Solve Challenge
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Submissions */}
      <Card className="border-zinc-800 bg-[#0c0d12]">
        <CardHeader>
          <CardTitle className="text-lg">Recent Submissions</CardTitle>
          <CardDescription>
            Latest code executions and evaluation outcomes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-900">
            {[
              {
                id: "1",
                problem: "Two Sum",
                lang: "C++",
                status: "Accepted",
                runtime: "12ms",
                memory: "10.4MB",
                time: "2 hours ago",
              },
              {
                id: "2",
                problem: "Valid Parentheses",
                lang: "Python",
                status: "Accepted",
                runtime: "28ms",
                memory: "16.2MB",
                time: "Yesterday",
              },
              {
                id: "3",
                problem: "Longest Substring Without Repeating Characters",
                lang: "JavaScript",
                status: "Time Limit Exceeded",
                runtime: "--",
                memory: "--",
                time: "3 days ago",
              },
            ].map((sub) => (
              <div
                key={sub.id}
                className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800">
                    <Code2 className="h-4 w-4 text-zinc-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-200">
                      {sub.problem}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                      <span>{sub.lang}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {sub.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  <Badge
                    variant={
                      sub.status === "Accepted" ? "approved" : "rejected"
                    }
                  >
                    {sub.status}
                  </Badge>
                  {sub.runtime !== "--" && (
                    <span className="text-xs font-mono text-zinc-400">
                      {sub.runtime}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

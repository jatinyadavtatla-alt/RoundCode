"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  ShieldCheck,
  Video,
  PlusCircle,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Send,
  Save,
  Loader2,
  ExternalLink,
  BookOpen,
  Search,
  Code2,
  Filter,
  UserCheck,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SubmissionStatus } from "@/types";

interface AdminDashboardClientProps {
  adminUser: {
    name: string;
    email: string;
    role: string;
  };
  initialStats: {
    pendingMembers: number;
    totalMembers: number;
    totalQuestions: number;
    totalResources: number;
    pendingSubmissions: number;
  };
}

export function AdminDashboardClient({
  adminUser,
  initialStats,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<
    "members" | "questions" | "resources" | "submissions"
  >("members");

  const [stats, setStats] = useState(initialStats);

  // -------------------------------------------------------------
  // TAB 1: MEMBERS STATE
  // -------------------------------------------------------------
  const [members, setMembers] = useState<any[]>([]);
  const [memberLoading, setMemberLoading] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [memberMessage, setMemberMessage] = useState<string | null>(null);

  const fetchMembers = async () => {
    setMemberLoading(true);
    try {
      const res = await fetch("/api/admin/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data.data.members || []);
        if (data.data.stats) {
          setStats((prev) => ({
            ...prev,
            pendingMembers: data.data.stats.pending,
            totalMembers: data.data.stats.total,
          }));
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleMemberStatusChange = async (
    userId: string,
    newStatus: "approved" | "rejected" | "suspended"
  ) => {
    setActionLoadingId(userId);
    setMemberMessage(null);
    try {
      const res = await fetch("/api/admin/members", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");
      setMemberMessage(`User status changed to ${newStatus}.`);
      fetchMembers();
    } catch (err: any) {
      alert(err.message || "Failed to update member status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // -------------------------------------------------------------
  // TAB 2: QUESTIONS STATE
  // -------------------------------------------------------------
  const [qFormData, setQFormData] = useState({
    title: "",
    topic: "Arrays",
    difficulty: "Easy",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    description: "",
    constraints: "",
    exampleInput: "",
    exampleOutput: "",
    exampleExplanation: "",
    leetcodeUrl: "",
    cppStarter: `class Solution {\npublic:\n    // Write solution\n};\n`,
    pythonStarter: `class Solution:\n    def solve(self):\n        pass\n`,
    javaStarter: `class Solution {\n    // Write solution\n}\n`,
    jsStarter: `function solve() {\n  // Write solution\n}\n`,
  });
  const [qSaving, setQSaving] = useState(false);
  const [qSuccess, setQSuccess] = useState<string | null>(null);
  const [qError, setQError] = useState<string | null>(null);

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setQSaving(true);
    setQSuccess(null);
    setQError(null);

    try {
      const constraintsArr = qFormData.constraints
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const examplesArr = qFormData.exampleInput
        ? [
            {
              input: qFormData.exampleInput,
              output: qFormData.exampleOutput,
              explanation: qFormData.exampleExplanation,
            },
          ]
        : [];

      const res = await fetch("/api/admin/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: qFormData.title,
          topic: qFormData.topic,
          difficulty: qFormData.difficulty,
          description: qFormData.description,
          constraints: constraintsArr,
          examples: examplesArr,
          expectedComplexity: {
            time: qFormData.timeComplexity,
            space: qFormData.spaceComplexity,
          },
          starterCode: {
            cpp: qFormData.cppStarter,
            python: qFormData.pythonStarter,
            java: qFormData.javaStarter,
            javascript: qFormData.jsStarter,
          },
          leetcodeUrl: qFormData.leetcodeUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create question");

      setQSuccess(`Question "${qFormData.title}" successfully added to curriculum.`);
      setStats((prev) => ({ ...prev, totalQuestions: prev.totalQuestions + 1 }));
      setQFormData({
        title: "",
        topic: "Arrays",
        difficulty: "Easy",
        timeComplexity: "O(N)",
        spaceComplexity: "O(1)",
        description: "",
        constraints: "",
        exampleInput: "",
        exampleOutput: "",
        exampleExplanation: "",
        leetcodeUrl: "",
        cppStarter: `class Solution {\npublic:\n    // Write solution\n};\n`,
        pythonStarter: `class Solution:\n    def solve(self):\n        pass\n`,
        javaStarter: `class Solution {\n    // Write solution\n}\n`,
        jsStarter: `function solve() {\n  // Write solution\n}\n`,
      });
    } catch (err: any) {
      setQError(err.message || "Failed to add question");
    } finally {
      setQSaving(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 3: RESOURCES STATE (VIDEO LINK UPLOAD)
  // -------------------------------------------------------------
  const [resFormData, setResFormData] = useState({
    title: "",
    description: "",
    type: "youtube",
    topic: "Arrays",
    url: "",
  });
  const [resSaving, setResSaving] = useState(false);
  const [resSuccess, setResSuccess] = useState<string | null>(null);
  const [resError, setResError] = useState<string | null>(null);
  const [uploadedResources, setUploadedResources] = useState<any[]>([]);

  const fetchResources = async () => {
    try {
      const res = await fetch("/api/admin/resources");
      if (res.ok) {
        const data = await res.json();
        setUploadedResources(data.data || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUploadResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setResSaving(true);
    setResSuccess(null);
    setResError(null);

    try {
      const res = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resFormData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload resource");

      setResSuccess(`Resource "${resFormData.title}" successfully uploaded.`);
      setStats((prev) => ({ ...prev, totalResources: prev.totalResources + 1 }));
      setResFormData({
        title: "",
        description: "",
        type: "youtube",
        topic: "Arrays",
        url: "",
      });
      fetchResources();
    } catch (err: any) {
      setResError(err.message || "Failed to upload resource");
    } finally {
      setResSaving(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 4: SUBMISSIONS REVIEW STATE
  // -------------------------------------------------------------
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState<SubmissionStatus>("Pending Review");
  const [editFeedback, setEditFeedback] = useState("");
  const [subSaving, setSubSaving] = useState(false);
  const [subSaveSuccess, setSubSaveSuccess] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setSubLoading(true);
    try {
      const res = await fetch("/api/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubLoading(false);
    }
  };

  const handleSaveReview = async () => {
    if (!selectedSub) return;
    setSubSaving(true);
    setSubSaveSuccess(null);

    try {
      const res = await fetch(`/api/submissions/${selectedSub._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          adminFeedback: editFeedback,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save review");

      setSubSaveSuccess("Review status and mentor feedback recorded.");
      fetchSubmissions();
      setSelectedSub((prev: any) => ({
        ...prev,
        status: editStatus,
        adminFeedback: editFeedback,
      }));
    } catch (e: any) {
      alert(e.message || "Failed to save review");
    } finally {
      setSubSaving(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMembers();
    fetchResources();
    fetchSubmissions();
  }, []);

  const pendingList = members.filter((m) => m.status === "pending");
  const filteredMembers = members.filter((m) => {
    return (
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase()) ||
      (m.collegeId && m.collegeId.toLowerCase().includes(memberSearch.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
              Authorized Administrator Console
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-400 font-mono">
              1 of 4 System Administrators
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            RoundCode Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Welcome, <strong className="text-zinc-200">{adminUser.name}</strong> ({adminUser.email}).
            Approve signups, add curriculum problems, upload video links, and review member code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="secondary" size="sm">
              Member Console
            </Button>
          </Link>
          <Link href="/questions">
            <Button variant="outline" size="sm">
              View Problems
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Pending Approvals */}
        <Card
          onClick={() => setActiveTab("members")}
          className={`cursor-pointer transition-all border-zinc-800 ${
            activeTab === "members" ? "border-amber-500/60 bg-amber-950/10" : "bg-[#0c0d12]"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Pending Signups</span>
              <Users className="h-4 w-4 text-amber-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-amber-400 tracking-tight">
                {stats.pendingMembers}
              </span>
              <span className="text-xs text-zinc-500 font-mono">Requests</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Require approval to login</p>
          </CardContent>
        </Card>

        {/* DSA Questions */}
        <Card
          onClick={() => setActiveTab("questions")}
          className={`cursor-pointer transition-all border-zinc-800 ${
            activeTab === "questions" ? "border-indigo-500/60 bg-indigo-950/10" : "bg-[#0c0d12]"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">DSA Questions</span>
              <Code2 className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stats.totalQuestions + 10}
              </span>
              <span className="text-xs text-zinc-500 font-mono">Active</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Curriculum challenges</p>
          </CardContent>
        </Card>

        {/* Learning Resources */}
        <Card
          onClick={() => setActiveTab("resources")}
          className={`cursor-pointer transition-all border-zinc-800 ${
            activeTab === "resources" ? "border-rose-500/60 bg-rose-950/10" : "bg-[#0c0d12]"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Video & Guides</span>
              <Video className="h-4 w-4 text-rose-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stats.totalResources + 6}
              </span>
              <span className="text-xs text-zinc-500 font-mono">Resources</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Uploaded videos & links</p>
          </CardContent>
        </Card>

        {/* Submissions Pending */}
        <Card
          onClick={() => setActiveTab("submissions")}
          className={`cursor-pointer transition-all border-zinc-800 ${
            activeTab === "submissions" ? "border-emerald-500/60 bg-emerald-950/10" : "bg-[#0c0d12]"
          }`}
        >
          <CardContent className="p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-mono uppercase">Code Reviews</span>
              <FileCode className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                {submissions.filter((s) => s.status === "Pending Review").length}
              </span>
              <span className="text-xs text-zinc-500 font-mono">In Queue</span>
            </div>
            <p className="mt-1 text-[11px] text-zinc-500">Awaiting code review</p>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab("members")}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
            activeTab === "members"
              ? "bg-zinc-100 text-zinc-950 font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <UserCheck className="h-4 w-4" />
          <span>Member Approvals</span>
          {stats.pendingMembers > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500 text-zinc-950 font-bold text-[10px]">
              {stats.pendingMembers}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab("questions")}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
            activeTab === "questions"
              ? "bg-zinc-100 text-zinc-950 font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add DSA Question</span>
        </button>

        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
            activeTab === "resources"
              ? "bg-zinc-100 text-zinc-950 font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <Video className="h-4 w-4" />
          <span>Upload Video / Resources</span>
        </button>

        <button
          onClick={() => setActiveTab("submissions")}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
            activeTab === "submissions"
              ? "bg-zinc-100 text-zinc-950 font-semibold"
              : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
          }`}
        >
          <FileCode className="h-4 w-4" />
          <span>Review Submitted Code</span>
        </button>
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* TAB 1: MEMBER APPROVALS */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === "members" && (
        <div className="space-y-6">
          {memberMessage && (
            <div className="flex items-center gap-2 rounded-md border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{memberMessage}</span>
            </div>
          )}

          {/* Pending Signups Section */}
          <Card className="border-amber-900/40 bg-[#0c0d12]">
            <CardHeader className="pb-3 border-b border-zinc-900">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <CardTitle className="text-base text-amber-300">
                      Pending Signup Requests ({pendingList.length})
                    </CardTitle>
                  </div>
                  <CardDescription className="text-xs">
                    Users cannot login until an administrator approves their application
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm" onClick={fetchMembers} className="text-xs">
                  Refresh Queue
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {pendingList.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                  No pending signup requests at this time. All applicants have been processed.
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {pendingList.map((user) => (
                    <div
                      key={user._id}
                      className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-zinc-900/40 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">
                            {user.name}
                          </span>
                          <Badge variant="pending">Pending Review</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 font-mono">
                          <span>Email: <strong className="text-zinc-200">{user.email}</strong></span>
                          <span>College ID: <strong className="text-zinc-200">{user.collegeId || "N/A"}</strong></span>
                          <span>Branch: <strong className="text-zinc-200">{user.branch}</strong></span>
                          <span>Year: <strong className="text-zinc-200">{user.year}</strong></span>
                          <span>Phone: <strong className="text-zinc-200">{user.phone}</strong></span>
                        </div>
                        <p className="text-[11px] text-zinc-500">
                          Registered on {new Date(user.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                        <Button
                          size="sm"
                          disabled={actionLoadingId === user._id}
                          onClick={() => handleMemberStatusChange(user._id, "approved")}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs gap-1.5"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Approve Account
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={actionLoadingId === user._id}
                          onClick={() => handleMemberStatusChange(user._id, "rejected")}
                          className="text-xs gap-1.5"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* All Members Management Section */}
          <Card className="border-zinc-800 bg-[#0c0d12]">
            <CardHeader className="pb-3 border-b border-zinc-900">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <CardTitle className="text-base">All Registered Members</CardTitle>
                  <CardDescription className="text-xs">
                    Search, inspect, and manage member statuses (Approved, Suspended, Rejected)
                  </CardDescription>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                  <Input
                    placeholder="Search name, email, ID..."
                    value={memberSearch}
                    onChange={(e) => setMemberSearch(e.target.value)}
                    className="h-8 pl-8 text-xs bg-zinc-950/80"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {filteredMembers.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  No members found matching your search.
                </div>
              ) : (
                <div className="divide-y divide-zinc-900 max-h-[400px] overflow-y-auto">
                  {filteredMembers.map((m) => (
                    <div
                      key={m._id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-zinc-900/30"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-zinc-200">
                            {m.name}
                          </span>
                          <Badge
                            variant={
                              m.status === "approved"
                                ? "approved"
                                : m.status === "pending"
                                ? "pending"
                                : "rejected"
                            }
                          >
                            {m.status}
                          </Badge>
                          <span className="text-xs font-mono text-zinc-500">
                            ({m.role})
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-zinc-400 font-mono">
                          <span>{m.email}</span>
                          <span>·</span>
                          <span>ID: {m.collegeId || "N/A"}</span>
                          <span>·</span>
                          <span>{m.branch} (Yr {m.year})</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {m.status !== "approved" && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="h-7 text-xs text-emerald-400 hover:text-emerald-300"
                            onClick={() => handleMemberStatusChange(m._id, "approved")}
                          >
                            Approve
                          </Button>
                        )}
                        {m.status !== "suspended" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-zinc-400 hover:text-rose-400"
                            onClick={() => handleMemberStatusChange(m._id, "suspended")}
                          >
                            Suspend
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 2: ADD DSA QUESTION */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === "questions" && (
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PlusCircle className="h-4 w-4 text-indigo-400" />
              <span>Add New DSA Question to Curriculum</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Newly created questions will be instantly available in the problem directory for members to solve in Monaco Editor
            </CardDescription>
          </CardHeader>
          <CardContent>
            {qSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{qSuccess}</span>
              </div>
            )}
            {qError && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                <span>{qError}</span>
              </div>
            )}

            <form onSubmit={handleCreateQuestion} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-zinc-300">Problem Title</label>
                  <Input
                    required
                    placeholder="e.g. Subarray Sum Equals K"
                    value={qFormData.title}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Topic</label>
                  <select
                    value={qFormData.topic}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, topic: e.target.value }))
                    }
                    className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    {[
                      "Arrays",
                      "Strings",
                      "Linked List",
                      "Stack",
                      "Queue",
                      "Binary Search",
                      "Trees",
                      "BST",
                      "Heap",
                      "Graphs",
                      "Dynamic Programming",
                      "Greedy",
                      "Backtracking",
                      "Bit Manipulation",
                    ].map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Difficulty</label>
                  <select
                    value={qFormData.difficulty}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, difficulty: e.target.value }))
                    }
                    className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Target Time Complexity</label>
                  <Input
                    placeholder="e.g. O(N) or O(N log N)"
                    value={qFormData.timeComplexity}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, timeComplexity: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Target Space Complexity</label>
                  <Input
                    placeholder="e.g. O(1) or O(N)"
                    value={qFormData.spaceComplexity}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, spaceComplexity: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Problem Description</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide full problem formulation, definitions, and requirements..."
                  value={qFormData.description}
                  onChange={(e) =>
                    setQFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-sans leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Constraints (one per line)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="1 <= nums.length <= 10^5&#10;-10^4 <= nums[i] <= 10^4"
                    value={qFormData.constraints}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, constraints: e.target.value }))
                    }
                    className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 p-2.5 text-xs font-mono text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">
                    Optional External LeetCode URL
                  </label>
                  <Input
                    placeholder="https://leetcode.com/problems/..."
                    value={qFormData.leetcodeUrl}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, leetcodeUrl: e.target.value }))
                    }
                  />
                  <p className="text-[11px] text-zinc-500">
                    Allows members to reference test setups if desired.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-900">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Example Input</label>
                  <Input
                    placeholder="nums = [1,1,1], k = 2"
                    value={qFormData.exampleInput}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, exampleInput: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Example Output</label>
                  <Input
                    placeholder="2"
                    value={qFormData.exampleOutput}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, exampleOutput: e.target.value }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Example Explanation</label>
                  <Input
                    placeholder="Subarrays [1,1] at index 0 and 1"
                    value={qFormData.exampleExplanation}
                    onChange={(e) =>
                      setQFormData((prev) => ({ ...prev, exampleExplanation: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <Button
                  type="submit"
                  disabled={qSaving}
                  className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-xs px-6 gap-2"
                >
                  {qSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving Question...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Publish Question
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 3: UPLOAD VIDEO LINK / RESOURCES */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === "resources" && (
        <div className="space-y-6">
          <Card className="border-zinc-800 bg-[#0c0d12]">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="h-4 w-4 text-rose-400" />
                <span>Upload Video Link or Learning Resource</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Add YouTube video links, interactive cheat sheets, or articles for member learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resSuccess && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-emerald-900/60 bg-emerald-950/40 p-3 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{resSuccess}</span>
                </div>
              )}
              {resError && (
                <div className="mb-4 flex items-center gap-2 rounded-md border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                  <span>{resError}</span>
                </div>
              )}

              <form onSubmit={handleUploadResource} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-300">Resource Title</label>
                    <Input
                      required
                      placeholder="e.g. Graph BFS & DFS Complete Video Guide"
                      value={resFormData.title}
                      onChange={(e) =>
                        setResFormData((prev) => ({ ...prev, title: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Resource Type</label>
                    <select
                      value={resFormData.type}
                      onChange={(e) =>
                        setResFormData((prev) => ({ ...prev, type: e.target.value }))
                      }
                      className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                    >
                      <option value="youtube">YouTube / Video Link</option>
                      <option value="leetcode">LeetCode / Problem Sheet</option>
                      <option value="article">Technical Article / Guide</option>
                      <option value="pdf">Reference PDF / Documentation</option>
                      <option value="other">Interactive Tool / Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-300">Video / Resource URL</label>
                    <Input
                      required
                      type="url"
                      placeholder="https://youtube.com/watch?v=... or https://..."
                      value={resFormData.url}
                      onChange={(e) =>
                        setResFormData((prev) => ({ ...prev, url: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">Topic</label>
                    <Input
                      required
                      placeholder="e.g. Graphs or Dynamic Programming"
                      value={resFormData.topic}
                      onChange={(e) =>
                        setResFormData((prev) => ({ ...prev, topic: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Brief summary of what this video or learning link covers..."
                    value={resFormData.description}
                    onChange={(e) =>
                      setResFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={resSaving}
                    className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-xs px-6 gap-2"
                  >
                    {resSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Upload Video Resource
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Currently Uploaded Resources List */}
          <Card className="border-zinc-800 bg-[#0c0d12]">
            <CardHeader className="pb-3 border-b border-zinc-900">
              <CardTitle className="text-base">Uploaded Video Links & Resources ({uploadedResources.length})</CardTitle>
              <CardDescription className="text-xs">
                Resources stored in database and served to members
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {uploadedResources.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500 font-mono">
                  No custom resources uploaded yet. Add a YouTube link above to share with members.
                </div>
              ) : (
                <div className="divide-y divide-zinc-900">
                  {uploadedResources.map((item) => (
                    <div
                      key={item._id}
                      className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-zinc-900/30"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-zinc-100">
                            {item.title}
                          </span>
                          <Badge variant="secondary" className="capitalize text-[11px]">
                            {item.type}
                          </Badge>
                          <span className="text-xs font-mono text-zinc-500">
                            {item.topic}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0"
                      >
                        <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                          <span>Open Link</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* TAB 4: CODE REVIEW CONSOLE */}
      {/* ----------------------------------------------------------------- */}
      {activeTab === "submissions" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-mono text-zinc-400">
                Submissions Queue ({submissions.length})
              </span>
              <Button variant="ghost" size="sm" onClick={fetchSubmissions} className="text-xs h-7">
                Refresh
              </Button>
            </div>

            {subLoading ? (
              <div className="py-12 text-center text-xs font-mono text-zinc-500">
                Loading submission queue...
              </div>
            ) : submissions.length === 0 ? (
              <Card className="border-zinc-800 bg-[#0c0d12] p-8 text-center text-xs text-zinc-500">
                No code submissions found in the database.
              </Card>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {submissions.map((sub) => {
                  const isSelected = selectedSub?._id === sub._id;
                  return (
                    <div
                      key={sub._id}
                      onClick={() => {
                        setSelectedSub(sub);
                        setEditStatus(sub.status);
                        setEditFeedback(sub.adminFeedback || "");
                        setSubSaveSuccess(null);
                      }}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "border-zinc-400 bg-[#12141c]"
                          : "border-zinc-800/80 bg-[#0c0d12] hover:border-zinc-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-semibold text-zinc-200 truncate">
                          {sub.questionTitle}
                        </span>
                        <Badge
                          variant={
                            sub.status === "Approved"
                              ? "approved"
                              : sub.status === "Under Review"
                              ? "under_review"
                              : sub.status === "Needs Revision"
                              ? "needs_revision"
                              : "pending_review"
                          }
                        >
                          {sub.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                        <span>{sub.userName} ({sub.userCollegeId || "ID: N/A"})</span>
                        <span className="uppercase text-zinc-500">{sub.language}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-zinc-500 font-mono">
                        {new Date(sub.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Code Inspection & Review Decision Panel */}
          <div className="lg:col-span-7">
            {selectedSub ? (
              <Card className="border-zinc-800 bg-[#0c0d12] space-y-4">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {selectedSub.questionTitle}
                      </CardTitle>
                      <CardDescription className="text-xs font-mono mt-1">
                        Submitted by {selectedSub.userName} ({selectedSub.userEmail})
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="uppercase font-mono text-xs">
                      {selectedSub.language}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <span className="text-xs font-mono text-zinc-400 block mb-1.5">
                      Submitted Solution Code:
                    </span>
                    <pre className="rounded-lg border border-zinc-800 bg-[#08090d] p-4 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[300px] leading-relaxed">
                      <code>{selectedSub.code}</code>
                    </pre>
                  </div>

                  <div className="pt-2 border-t border-zinc-900 space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Assign Review Status:
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(
                          [
                            "Pending Review",
                            "Under Review",
                            "Approved",
                            "Needs Revision",
                          ] as SubmissionStatus[]
                        ).map((status) => (
                          <button
                            key={status}
                            type="button"
                            onClick={() => setEditStatus(status)}
                            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                              editStatus === status
                                ? "bg-zinc-100 text-zinc-950 font-semibold"
                                : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-zinc-300">
                        Admin / Mentor Feedback:
                      </label>
                      <textarea
                        rows={4}
                        value={editFeedback}
                        onChange={(e) => setEditFeedback(e.target.value)}
                        placeholder="Leave algorithmic observations, time/space complexity notes, and advice for iteration..."
                        className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-sans leading-relaxed"
                      />
                    </div>

                    {subSaveSuccess && (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{subSaveSuccess}</span>
                      </div>
                    )}

                    <div className="flex justify-end pt-2">
                      <Button
                        onClick={handleSaveReview}
                        disabled={subSaving}
                        className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-xs px-5 gap-1.5"
                      >
                        {subSaving ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Saving Review...
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5" />
                            Save Review Decision
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-zinc-800 bg-[#0c0d12] p-12 text-center text-xs text-zinc-500">
                Select a code submission from the list on the left to inspect code and add review feedback.
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

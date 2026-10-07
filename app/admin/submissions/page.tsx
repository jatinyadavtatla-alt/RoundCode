"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Code2,
  Clock,
  User,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Save,
  Loader2,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ISubmission, SubmissionStatus } from "@/types";

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [isLoading, setIsLoading] = useState(true);

  // Active reviewing submission
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [editStatus, setEditStatus] = useState<SubmissionStatus>("Pending Review");
  const [editFeedback, setEditFeedback] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const url = filterStatus === "All" ? "/api/submissions" : `/api/submissions?status=${encodeURIComponent(filterStatus)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.data || []);
      }
    } catch (e) {
      console.error("Failed to load submissions", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [filterStatus]);

  const handleSelectSubmission = (sub: any) => {
    setSelectedSub(sub);
    setEditStatus(sub.status);
    setEditFeedback(sub.adminFeedback || "");
    setSaveSuccess(null);
  };

  const handleSaveReview = async () => {
    if (!selectedSub) return;
    setIsSaving(true);
    setSaveSuccess(null);

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
      if (!res.ok) {
        throw new Error(data.error || "Failed to update review.");
      }

      setSaveSuccess("Review status and feedback saved successfully.");
      // Refresh list
      fetchSubmissions();
      // Update local state
      setSelectedSub((prev: any) => ({
        ...prev,
        status: editStatus,
        adminFeedback: editFeedback,
      }));
    } catch (e: any) {
      alert(e.message || "Error saving review");
    } finally {
      setIsSaving(false);
    }
  };

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
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-amber-400">
              Admin Portal
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500 font-mono">
              Faculty & Society Reviewers
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Code Review Console
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Inspect submitted member solutions, provide line feedback, and update review statuses
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Member Console
            </Button>
          </Link>
          <Link href="/questions">
            <Button variant="secondary" size="sm">
              Problem Directory
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="h-4 w-4 text-zinc-500 mr-1" />
        {["All", "Pending Review", "Under Review", "Approved", "Needs Revision"].map(
          (status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                filterStatus === status
                  ? "bg-zinc-200 text-zinc-950 font-semibold"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {status}
            </button>
          )
        )}
      </div>

      {/* Main Review Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left List of Submissions */}
        <div className="lg:col-span-5 space-y-3">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-mono text-zinc-500">
              Loading submission queue...
            </div>
          ) : submissions.length === 0 ? (
            <Card className="border-zinc-800 bg-[#0c0d12] p-8 text-center text-xs text-zinc-500">
              No submissions match this filter.
            </Card>
          ) : (
            submissions.map((sub) => {
              const isSelected = selectedSub?._id === sub._id;
              return (
                <div
                  key={sub._id}
                  onClick={() => handleSelectSubmission(sub)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "border-zinc-500 bg-[#12141c]"
                      : "border-zinc-800/80 bg-[#0c0d12] hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-zinc-200 truncate">
                      {sub.questionTitle}
                    </span>
                    {getStatusBadge(sub.status)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono mb-1">
                    <User className="h-3 w-3 text-zinc-500" />
                    <span>{sub.userName}</span>
                    <span className="text-zinc-600">({sub.userCollegeId || "ID: N/A"})</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono">
                    <span className="uppercase">{sub.language}</span>
                    <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Code & Feedback Panel */}
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
                {/* Code Box */}
                <div>
                  <span className="text-xs font-mono text-zinc-400 block mb-1.5">
                    Member Implementation:
                  </span>
                  <pre className="rounded-lg border border-zinc-800 bg-[#08090d] p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-[300px] leading-relaxed">
                    <code>{selectedSub.code}</code>
                  </pre>
                </div>

                {/* Review Controls Form */}
                <div className="pt-2 border-t border-zinc-900 space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-300">
                      Update Review Status:
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
                      placeholder="Leave detailed algorithmic critique, time/space complexity observations, and improvement hints..."
                      className="w-full rounded-md border border-zinc-800 bg-zinc-950/80 p-3 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-sans leading-relaxed"
                    />
                  </div>

                  {saveSuccess && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>{saveSuccess}</span>
                    </div>
                  )}

                  <div className="flex justify-end pt-2">
                    <Button
                      onClick={handleSaveReview}
                      disabled={isSaving}
                      className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-xs px-5 gap-1.5"
                    >
                      {isSaving ? (
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
              Select a submission from the queue to inspect code and add review feedback.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

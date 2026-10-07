"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Code2,
  Clock,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCode,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ISubmission } from "@/types";

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<ISubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubmissions() {
      try {
        const res = await fetch("/api/submissions");
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.data || []);
        }
      } catch (e) {
        console.error("Failed to load submissions", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSubmissions();
  }, []);

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

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Code Submissions
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-indigo-400 font-mono">
              Review & Mentorship
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Submission History
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Track the review status of your solutions and read feedback from administrators
          </p>
        </div>

        <Link href="/questions">
          <Button className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium">
            Solve More Problems
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Submissions List */}
      {isLoading ? (
        <div className="py-20 text-center text-zinc-500 font-mono text-sm">
          Loading your submission records...
        </div>
      ) : submissions.length === 0 ? (
        <Card className="border-zinc-800 bg-[#0c0d12] p-12 text-center">
          <FileCode className="mx-auto h-10 w-10 text-zinc-600 mb-3" />
          <h3 className="text-base font-medium text-zinc-200">
            No submissions yet
          </h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-sm mx-auto">
            Open any problem from the curriculum, write your solution in Monaco Editor, and submit for faculty review.
          </p>
          <div className="mt-5">
            <Link href="/questions">
              <Button size="sm" variant="secondary">
                Browse Problems
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((sub) => {
            const isExpanded = expandedId === sub._id;
            return (
              <Card
                key={sub._id}
                className="border-zinc-800/80 bg-[#0c0d12] transition-colors hover:border-zinc-700/80"
              >
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 mt-0.5">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-zinc-100">
                            {sub.questionTitle}
                          </h3>
                          {getStatusBadge(sub.status)}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono">
                          <span className="uppercase text-zinc-400">
                            {sub.language}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Submitted {new Date(sub.submittedAt).toLocaleDateString()}
                          </span>
                          {sub.reviewedAt && (
                            <>
                              <span>•</span>
                              <span className="text-zinc-400">
                                Reviewed {new Date(sub.reviewedAt).toLocaleDateString()}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Link href={`/questions/${sub.questionId}`}>
                        <Button variant="secondary" size="sm" className="gap-1 text-xs">
                          <RotateCcw className="h-3 w-3" />
                          Improve & Resubmit
                        </Button>
                      </Link>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpand(sub._id)}
                        className="text-xs text-zinc-400 hover:text-white"
                      >
                        {isExpanded ? (
                          <>
                            Hide Details
                            <ChevronUp className="ml-1 h-3.5 w-3.5" />
                          </>
                        ) : (
                          <>
                            View Details
                            <ChevronDown className="ml-1 h-3.5 w-3.5" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Code & Feedback Drawer */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-zinc-900 space-y-4">
                      {/* Admin Feedback Box */}
                      {sub.adminFeedback ? (
                        <div className="rounded-lg border border-indigo-900/40 bg-indigo-950/20 p-4">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1.5">
                            <MessageSquare className="h-4 w-4" />
                            <span>Administrator Review Feedback:</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {sub.adminFeedback}
                          </p>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-zinc-900 bg-zinc-950/40 p-3 text-xs text-zinc-500 italic">
                          No feedback left yet. Administrator review is pending.
                        </div>
                      )}

                      {/* Submitted Code Viewer */}
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-mono text-zinc-400">
                            Submitted Code ({sub.language}):
                          </span>
                        </div>
                        <pre className="rounded-lg border border-zinc-800 bg-[#08090d] p-4 text-xs font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                          <code>{sub.code}</code>
                        </pre>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

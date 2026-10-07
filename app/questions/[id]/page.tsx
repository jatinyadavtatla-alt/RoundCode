"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  Send,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { QUESTIONS_DATA, ProblemDetail } from "@/lib/data/questions";

// Dynamic import for Monaco Editor to avoid SSR window issues
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#090a0f] text-xs font-mono text-zinc-500">
      Loading Monaco Editor...
    </div>
  ),
});

const LANGUAGE_MAP: Record<string, { monacoLang: string; label: string }> = {
  cpp: { monacoLang: "cpp", label: "C++" },
  java: { monacoLang: "java", label: "Java" },
  python: { monacoLang: "python", label: "Python" },
  javascript: { monacoLang: "javascript", label: "JavaScript" },
};

export default function QuestionSolvePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const staticProblem: ProblemDetail | undefined = QUESTIONS_DATA[id];
  const [currentProblem, setCurrentProblem] = useState<ProblemDetail | undefined>(
    staticProblem || QUESTIONS_DATA["1"]
  );

  const [language, setLanguage] = useState<"cpp" | "java" | "python" | "javascript">("cpp");
  const [code, setCode] = useState<string>(
    (staticProblem || QUESTIONS_DATA["1"])?.starterCode.cpp || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [latestSubmission, setLatestSubmission] = useState<any>(null);

  // Load custom DB problem if not in static dictionary
  useEffect(() => {
    if (!staticProblem) {
      async function loadDbProblem() {
        try {
          const res = await fetch("/api/admin/questions");
          if (res.ok) {
            const data = await res.json();
            const found = data.data?.find((q: any) => q._id === id);
            if (found) {
              const formatted: ProblemDetail = {
                id: found._id,
                title: found.title,
                topic: found.topic,
                difficulty: found.difficulty,
                description: found.description,
                constraints: found.constraints || [],
                examples: found.examples || [],
                expectedComplexity: found.expectedComplexity || { time: "O(N)", space: "O(1)" },
                starterCode: found.starterCode || {
                  cpp: "// C++ Solution\n",
                  java: "// Java Solution\n",
                  python: "# Python Solution\n",
                  javascript: "// JS Solution\n",
                },
                leetcodeUrl: found.leetcodeUrl,
              };
              setCurrentProblem(formatted);
              setCode(formatted.starterCode[language] || "");
            }
          }
        } catch (e) {
          console.error(e);
        }
      }
      loadDbProblem();
    }
  }, [id, staticProblem, language]);

  // Sync starter code when language changes
  const handleLanguageChange = (newLang: "cpp" | "java" | "python" | "javascript") => {
    setLanguage(newLang);
    if (currentProblem) {
      setCode(currentProblem.starterCode[newLang] || "");
    }
  };

  // Reset to starter code
  const handleReset = () => {
    if (currentProblem && confirm("Reset code to default starter template?")) {
      setCode(currentProblem.starterCode[language] || "");
    }
  };

  // Fetch latest submission status for this problem
  useEffect(() => {
    async function fetchLatest() {
      try {
        const res = await fetch(`/api/submissions?questionId=${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            setLatestSubmission(data.data[0]);
          }
        }
      } catch (e) {
        // Silently catch in dev
      }
    }
    fetchLatest();
  }, [id, submitSuccess]);

  // Submit code for review
  const handleSubmitCode = async () => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: id,
          code,
          language,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit code.");
      }

      setSubmitSuccess("Solution submitted! Queued for administrator review.");
    } catch (err: any) {
      setSubmitError(err.message || "Unable to submit code. Please log in first.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Approved":
        return "approved";
      case "Under Review":
        return "under_review";
      case "Needs Revision":
        return "needs_revision";
      default:
        return "pending_review";
    }
  };

  if (!currentProblem) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
        <h1 className="text-xl font-bold text-white">Problem not found</h1>
        <Link href="/questions" className="mt-4">
          <Button variant="secondary">Back to Problems</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-[calc(100vh-4rem)] bg-[#08090d] overflow-hidden">
      {/* Top Problem Bar */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0c0d12] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link href="/questions">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-zinc-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-1" />
              All Problems
            </Button>
          </Link>
          <div className="h-4 w-[1px] bg-zinc-800" />
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <span>{currentProblem.id}.</span>
            <span>{currentProblem.title}</span>
          </h2>
          <Badge
            variant={
              currentProblem.difficulty === "Easy"
                ? "easy"
                : currentProblem.difficulty === "Medium"
                ? "medium"
                : "hard"
            }
          >
            {currentProblem.difficulty}
          </Badge>
          <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
            Topic: {currentProblem.topic}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {currentProblem.leetcodeUrl && (
            <a
              href={currentProblem.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
            >
              <Button variant="ghost" size="sm" className="h-8 text-xs text-zinc-400 hover:text-white gap-1">
                LeetCode
                <ExternalLink className="h-3 w-3" />
              </Button>
            </a>
          )}
          <Link href="/submissions">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              My Submissions
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
        {/* Left Column: Problem Details & Review Feedback (Scrollable) */}
        <div className="lg:col-span-5 border-r border-zinc-800 overflow-y-auto p-6 space-y-6 bg-[#08090d]">
          {/* Latest Review Feedback Card (if exists) */}
          {latestSubmission && (
            <Card className="border-zinc-800 bg-[#0e1017]">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-xs font-mono text-zinc-400">Latest Review Status:</span>
                  </div>
                  <Badge variant={getStatusBadgeVariant(latestSubmission.status)}>
                    {latestSubmission.status}
                  </Badge>
                </div>

                {latestSubmission.adminFeedback ? (
                  <div className="mt-2 rounded-md border border-zinc-800 bg-zinc-950/70 p-3 text-xs">
                    <div className="flex items-center gap-1.5 text-zinc-300 font-medium mb-1">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Admin Feedback:</span>
                    </div>
                    <p className="text-zinc-400 whitespace-pre-wrap leading-relaxed">
                      {latestSubmission.adminFeedback}
                    </p>
                  </div>
                ) : (
                  <p className="text-[11px] text-zinc-500 italic">
                    Awaiting administrator inspection and feedback.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Description */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
              Problem Description
            </h3>
            <p className="text-sm text-zinc-300 whitespace-pre-line leading-relaxed">
              {currentProblem.description}
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Examples
            </h3>
            {currentProblem.examples.map((ex, index) => (
              <div
                key={index}
                className="rounded-lg border border-zinc-800/80 bg-[#0e1017] p-3 text-xs font-mono space-y-1.5"
              >
                <div className="text-zinc-400">
                  <span className="text-zinc-500">Example {index + 1}:</span>
                </div>
                <div>
                  <span className="text-zinc-500">Input: </span>
                  <span className="text-zinc-200">{ex.input}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Output: </span>
                  <span className="text-emerald-400">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <div className="text-zinc-400 text-[11px] font-sans pt-1 border-t border-zinc-900">
                    <span className="text-zinc-500 font-mono">Explanation: </span>
                    {ex.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500">
              Constraints
            </h3>
            <ul className="list-disc list-inside space-y-1 text-xs text-zinc-400 font-mono">
              {currentProblem.constraints.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>

          {/* Expected Complexity */}
          <div className="rounded-lg border border-zinc-800/80 bg-[#0e1017] p-3.5 space-y-1">
            <h4 className="text-xs font-medium text-zinc-300">
              Expected Complexity Target:
            </h4>
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
              <span>Time: <strong className="text-indigo-300">{currentProblem.expectedComplexity.time}</strong></span>
              <span>·</span>
              <span>Space: <strong className="text-indigo-300">{currentProblem.expectedComplexity.space}</strong></span>
            </div>
          </div>
        </div>

        {/* Right Column: Monaco Editor + Language Selector + Submit Code */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#090a0f] overflow-hidden">
          {/* Editor Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 bg-[#0c0d12] px-4 py-2">
            <div className="flex items-center gap-2">
              <label className="text-xs font-mono text-zinc-400">Language:</label>
              <select
                value={language}
                onChange={(e) =>
                  handleLanguageChange(
                    e.target.value as "cpp" | "java" | "python" | "javascript"
                  )
                }
                className="h-8 rounded-md border border-zinc-800 bg-zinc-900 px-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-500"
              >
                <option value="cpp">C++ (GCC)</option>
                <option value="java">Java (OpenJDK)</option>
                <option value="python">Python 3</option>
                <option value="javascript">JavaScript (Node.js)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-8 text-xs text-zinc-400 hover:text-zinc-200 gap-1"
                title="Reset code to starter template"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
          </div>

          {/* Monaco Code Editor Canvas */}
          <div className="flex-1 relative min-h-[350px]">
            <Editor
              height="100%"
              theme="vs-dark"
              language={LANGUAGE_MAP[language].monacoLang}
              value={code}
              onChange={(value) => setCode(value || "")}
              options={{
                fontSize: 13,
                fontFamily: "var(--font-mono), monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: "on",
                automaticLayout: true,
                tabSize: 4,
                wordWrap: "on",
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>

          {/* Submission Feedback & Submit Bar */}
          <div className="border-t border-zinc-800 bg-[#0c0d12] p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs min-h-[20px] w-full sm:w-auto">
              {submitSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{submitSuccess}</span>
                </div>
              )}
              {submitError && (
                <div className="flex items-center gap-1.5 text-rose-400 font-mono">
                  <AlertCircle className="h-4 w-4" />
                  <span>{submitError}</span>
                </div>
              )}
              {!submitSuccess && !submitError && (
                <span className="text-zinc-500 font-mono text-[11px]">
                  Submitting stores your solution for faculty & admin code review.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <Button
                onClick={handleSubmitCode}
                disabled={isSubmitting || !code.trim()}
                className="w-full sm:w-auto bg-zinc-100 text-zinc-950 hover:bg-white font-medium px-6 gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 text-zinc-700" />
                    Submit Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

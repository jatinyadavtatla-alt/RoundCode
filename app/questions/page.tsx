"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Code2, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface QuestionItem {
  id: string;
  title: string;
  topic: string;
  difficulty: "Easy" | "Medium" | "Hard";
  acceptance: string;
  leetcodeUrl?: string;
  isSolved?: boolean;
}

const SAMPLE_QUESTIONS: QuestionItem[] = [
  {
    id: "1",
    title: "Two Sum",
    topic: "Arrays",
    difficulty: "Easy",
    acceptance: "52.4%",
    leetcodeUrl: "https://leetcode.com/problems/two-sum/",
    isSolved: true,
  },
  {
    id: "2",
    title: "Valid Parentheses",
    topic: "Stack",
    difficulty: "Easy",
    acceptance: "40.8%",
    leetcodeUrl: "https://leetcode.com/problems/valid-parentheses/",
  },
  {
    id: "3",
    title: "Reverse Linked List",
    topic: "Linked List",
    difficulty: "Easy",
    acceptance: "74.1%",
    leetcodeUrl: "https://leetcode.com/problems/reverse-linked-list/",
    isSolved: true,
  },
  {
    id: "4",
    title: "Longest Substring Without Repeating Characters",
    topic: "Strings",
    difficulty: "Medium",
    acceptance: "34.6%",
    leetcodeUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
  },
  {
    id: "5",
    title: "Binary Tree Level Order Traversal",
    topic: "Trees",
    difficulty: "Medium",
    acceptance: "66.2%",
    leetcodeUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
  },
  {
    id: "6",
    title: "Coin Change",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    acceptance: "43.5%",
    leetcodeUrl: "https://leetcode.com/problems/coin-change/",
  },
  {
    id: "7",
    title: "Number of Islands",
    topic: "Graphs",
    difficulty: "Medium",
    acceptance: "58.7%",
    leetcodeUrl: "https://leetcode.com/problems/number-of-isants/",
  },
  {
    id: "8",
    title: "LRU Cache",
    topic: "Linked List",
    difficulty: "Medium",
    acceptance: "42.0%",
    leetcodeUrl: "https://leetcode.com/problems/lru-cache/",
  },
  {
    id: "9",
    title: "Trapping Rain Water",
    topic: "Arrays",
    difficulty: "Hard",
    acceptance: "61.2%",
    leetcodeUrl: "https://leetcode.com/problems/trapping-rain-water/",
  },
  {
    id: "10",
    title: "Merge k Sorted Lists",
    topic: "Heap",
    difficulty: "Hard",
    acceptance: "51.8%",
    leetcodeUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
  },
];

const TOPICS = [
  "All",
  "Arrays",
  "Strings",
  "Linked List",
  "Stack",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Heap",
];

const DIFFICULTIES = ["All", "Easy", "Medium", "Hard"];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<QuestionItem[]>(SAMPLE_QUESTIONS);
  const [search, setSearch] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  useEffect(() => {
    async function loadDbQuestions() {
      try {
        const res = await fetch("/api/admin/questions");
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            const formatted = data.data.map((item: any, idx: number) => ({
              id: item._id,
              title: item.title,
              topic: item.topic,
              difficulty: item.difficulty,
              acceptance: "Review Workflow",
              leetcodeUrl: item.leetcodeUrl,
            }));
            setQuestions([...formatted, ...SAMPLE_QUESTIONS]);
          }
        }
      } catch (e) {
        // Fallback
      }
    }
    loadDbQuestions();
  }, []);

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch =
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase());
    const matchesTopic =
      selectedTopic === "All" || q.topic === selectedTopic;
    const matchesDifficulty =
      selectedDifficulty === "All" || q.difficulty === selectedDifficulty;
    return matchesSearch && matchesTopic && matchesDifficulty;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-zinc-900">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Problem Directory
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-emerald-400 font-mono">
              {SAMPLE_QUESTIONS.length} Curated Challenges
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            DSA Problem Library
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Topic-wise algorithmic challenges with Monaco Editor and faculty code review
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/submissions">
            <Button variant="secondary" size="sm">
              My Submissions
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search problems or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-950/90"
          />
        </div>

        {/* Difficulty Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {DIFFICULTIES.map((diff) => (
            <button
              key={diff}
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1 text-xs rounded-md font-medium transition-colors ${
                selectedDifficulty === diff
                  ? "bg-zinc-200 text-zinc-950 font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Topic Filter Pills */}
      <div className="mt-4 flex flex-wrap gap-1.5 pb-2">
        {TOPICS.map((topic) => (
          <button
            key={topic}
            onClick={() => setSelectedTopic(topic)}
            className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
              selectedTopic === topic
                ? "bg-indigo-600/30 text-indigo-300 border border-indigo-500/50"
                : "bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Problem List */}
      <div className="mt-6 space-y-2">
        {filteredQuestions.length === 0 ? (
          <Card className="p-8 text-center border-zinc-800">
            <p className="text-sm text-zinc-400">
              No problems found matching your filters.
            </p>
          </Card>
        ) : (
          filteredQuestions.map((q) => (
            <Card
              key={q.id}
              className="group hover:border-zinc-700/80 transition-all border-zinc-800/70 bg-[#0a0c10]/80"
            >
              <CardContent className="p-4 sm:p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-700">
                    <Code2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-zinc-100 group-hover:text-white truncate">
                        {q.id}. {q.title}
                      </h3>
                      {q.isSolved && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                      <span>{q.topic}</span>
                      <span>•</span>
                      <span>Review Workflow</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={
                      q.difficulty === "Easy"
                        ? "easy"
                        : q.difficulty === "Medium"
                        ? "medium"
                        : "hard"
                    }
                  >
                    {q.difficulty}
                  </Badge>

                  <Link href={`/questions/${q.id}`}>
                    <Button size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-white text-xs font-medium">
                      Solve & Submit
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

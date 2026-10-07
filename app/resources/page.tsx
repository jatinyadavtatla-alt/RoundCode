"use client";

import { useState, useEffect } from "react";
import { BookOpen, Video, ExternalLink, FileText, Code2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ResourceItem {
  id: string;
  title: string;
  description: string;
  type: "youtube" | "leetcode" | "pdf" | "article" | "other";
  topic: string;
  url: string;
}

const SAMPLE_RESOURCES: ResourceItem[] = [
  {
    id: "1",
    title: "Striver's SDE Sheet — Top Coding Interview Problems",
    description: "Curated 190+ high-yield interview questions spanning Arrays, Linked Lists, Recursion, Trees, and DP.",
    type: "leetcode",
    topic: "Comprehensive",
    url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
  },
  {
    id: "2",
    title: "NeetCode 150 Roadmap & Video Explanations",
    description: "Structured progressive roadmap with visual line-by-line algorithm walkthroughs.",
    type: "youtube",
    topic: "Comprehensive",
    url: "https://neetcode.io/roadmap",
  },
  {
    id: "3",
    title: "MIT 6.006: Introduction to Algorithms",
    description: "Foundational university lecture series covering algorithmic proofs, asymptotic analysis, and data structures.",
    type: "youtube",
    topic: "Algorithms",
    url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/",
  },
  {
    id: "4",
    title: "CP-Algorithms — Advanced Data Structures & Math",
    description: "In-depth reference notes on segment trees, Fenwick trees, graph algorithms, and number theory.",
    type: "article",
    topic: "Advanced DSA",
    url: "https://cp-algorithms.com/",
  },
  {
    id: "5",
    title: "Dynamic Programming Patterns & Memoization Guide",
    description: "Comprehensive categorization of DP problems: Knapsack, LCS, LIS, Matrix Chain, and State Machine DP.",
    type: "article",
    topic: "Dynamic Programming",
    url: "https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns",
  },
  {
    id: "6",
    title: "VisuAlgo — Visualizing Data Structures and Algorithms",
    description: "Interactive visual simulation of sorting algorithms, binary search trees, graph traversals, and flows.",
    type: "other",
    topic: "Visualizations",
    url: "https://visualgo.net/en",
  },
];

const RESOURCE_TYPES = ["All", "youtube", "leetcode", "article", "other"];

export default function ResourcesPage() {
  const [resources, setResources] = useState<ResourceItem[]>(SAMPLE_RESOURCES);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");

  useEffect(() => {
    async function loadDbResources() {
      try {
        const res = await fetch("/api/admin/resources");
        if (res.ok) {
          const data = await res.json();
          if (data.data && data.data.length > 0) {
            const formatted = data.data.map((item: any) => ({
              id: item._id,
              title: item.title,
              description: item.description,
              type: item.type,
              topic: item.topic,
              url: item.url,
            }));
            setResources([...formatted, ...SAMPLE_RESOURCES]);
          }
        }
      } catch (e) {
        // Fallback to sample
      }
    }
    loadDbResources();
  }, []);

  const filtered = resources.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.topic.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === "All" || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "youtube":
        return <Video className="h-4 w-4 text-rose-400" />;
      case "leetcode":
        return <Code2 className="h-4 w-4 text-amber-400" />;
      case "pdf":
      case "article":
        return <FileText className="h-4 w-4 text-blue-400" />;
      default:
        return <BookOpen className="h-4 w-4 text-emerald-400" />;
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="pb-8 border-b border-zinc-900">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            Learning Resources
          </span>
          <span className="text-zinc-700">·</span>
          <span className="text-xs text-indigo-400 font-mono">
            Curated Guides & References
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Curated DSA Knowledge Base
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Handpicked tutorials, algorithm cheat sheets, and academic course materials
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search resources, topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-zinc-950/90"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {RESOURCE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1 text-xs rounded-md font-medium capitalize transition-colors ${
                selectedType === type
                  ? "bg-zinc-200 text-zinc-950 font-semibold"
                  : "bg-zinc-900/80 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((r) => (
          <Card
            key={r.id}
            className="flex flex-col justify-between border-zinc-800/80 bg-[#0a0c10]/90 hover:border-zinc-700 transition-all group"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800">
                    {getTypeIcon(r.type)}
                  </div>
                  <Badge variant="secondary" className="capitalize text-[11px]">
                    {r.type}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-zinc-500">
                  {r.topic}
                </span>
              </div>

              <h3 className="text-base font-semibold text-zinc-100 group-hover:text-white line-clamp-2">
                {r.title}
              </h3>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed line-clamp-3">
                {r.description}
              </p>
            </CardContent>

            <div className="p-6 pt-0">
              <a
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-block"
              >
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full justify-between text-xs"
                >
                  <span>Open Resource</span>
                  <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                </Button>
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

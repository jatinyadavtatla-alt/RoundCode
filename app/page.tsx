import Link from "next/link";
import {
  Code2,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Layers,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background subtle radial gradient & grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f242f15_1px,transparent_1px),linear-gradient(to_bottom,#1f242f15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8">
        {/* Status Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/80 px-3.5 py-1 text-xs text-zinc-300 backdrop-blur">
          <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
          <span className="font-mono tracking-tight text-[11px] uppercase text-zinc-400">
            DSA Practice Platform
          </span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-300 font-medium">Topic-Wise Coding Curriculum</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl sm:leading-[1.1] max-w-4xl">
          Master Algorithms & Elevate Your Problem Solving.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg leading-relaxed">
          RoundCode provides a focused environment for mastering Data Structures & Algorithms.
          Practice curated coding questions, test your solutions against comprehensive test cases, and track your progress.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-zinc-100 text-zinc-950 hover:bg-white font-medium px-7 shadow-lg shadow-zinc-950/50">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/questions" className="w-full sm:w-auto">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto px-7">
              Browse Problems
            </Button>
          </Link>
        </div>

        {/* Highlights */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Curated DSA Roadmaps</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Code2 className="h-4 w-4 text-indigo-400" />
            <span>Monaco Editor Workspace</span>
          </div>
          <div className="flex items-center gap-1.5">
            <GitBranch className="h-4 w-4 text-amber-400" />
            <span>Mentor Code Reviews</span>
          </div>
        </div>

        {/* Mock Terminal / Code Preview */}
        <div className="mt-14 w-full max-w-4xl overflow-hidden rounded-xl border border-zinc-800 bg-[#0d0e14] shadow-2xl text-left">
          <div className="flex items-center justify-between border-b border-zinc-800/80 bg-[#090a0f] px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <div className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="ml-2 font-mono text-xs text-zinc-400">
                problem_042_two_sum_optimized.cpp
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="easy">Easy</Badge>
              <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Status: Approved
              </span>
            </div>
          </div>
          <div className="p-5 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto">
            <p className="text-zinc-500">// RoundCode Member Solution Submission</p>
            <p className="text-zinc-500">
              // Target Complexity: O(N) Time · O(N) Space
            </p>
            <p className="mt-2 text-indigo-300">
              <span className="text-rose-400">vector</span>&lt;int&gt; twoSum(
              <span className="text-rose-400">const vector</span>&lt;int&gt;&amp; nums, <span className="text-rose-400">int</span> target) &#123;
            </p>
            <p className="pl-4 text-zinc-300">
              unordered_map&lt;int, int&gt; lookup;
            </p>
            <p className="pl-4 text-zinc-300">
              for (int i = 0; i &lt; nums.size(); ++i) &#123;
            </p>
            <p className="pl-8 text-zinc-300">
              int complement = target - nums[i];
            </p>
            <p className="pl-8 text-zinc-300">
              if (lookup.count(complement)) return &#123;lookup[complement], i&#125;;
            </p>
            <p className="pl-8 text-zinc-300">lookup[nums[i]] = i;</p>
            <p className="pl-4 text-zinc-300">&#125;</p>
            <p className="pl-4 text-zinc-400">return &#123;&#125;;</p>
            <p className="text-indigo-300">&#125;</p>
          </div>
        </div>
      </section>

      {/* Core Workflow Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 w-full border-t border-zinc-900">
        <div className="text-center mb-12">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-500">
            How It Works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            From Problem Solving to Mentored Mastery
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 mb-4">
                <Layers className="h-5 w-5 text-indigo-400" />
              </div>
              <h3 className="text-base font-semibold text-white">
                1. Topic-Wise Practice
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Structured problems sorted by topic and difficulty — from Arrays and Trees to Dynamic Programming and Graphs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 mb-4">
                <Code2 className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="text-base font-semibold text-white">
                2. Monaco Editor & Submission
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Code in C++, Java, Python, or JavaScript with syntax highlighting and submit directly to MongoDB for mentor review.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 mb-4">
                <GitBranch className="h-5 w-5 text-amber-400" />
              </div>
              <h3 className="text-base font-semibold text-white">
                3. Admin Feedback & Iteration
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                Faculty and administrators review your code structure, leave actionable feedback, and approve your optimal implementations.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

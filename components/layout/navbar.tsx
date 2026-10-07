"use client";

import Link from "next/link";
import { useState } from "react";
import { Terminal, Menu, X, ArrowRight, Code2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: {
    name: string;
    role: string;
    status: string;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#08090d]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-900/90 text-zinc-100 shadow-inner transition-colors group-hover:border-zinc-500 group-hover:bg-zinc-800">
            <Terminal className="h-4 w-4 text-zinc-200 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-zinc-100 group-hover:text-white flex items-center gap-1.5">
              RoundCode
              <span className="inline-block rounded px-1.5 py-0.2 text-[10px] font-mono tracking-normal bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                v1.0
              </span>
            </span>
            <span className="text-[11px] text-zinc-500 font-mono tracking-tight -mt-0.5">
              DSA & Coding Platform
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-zinc-400">
          <Link
            href="/questions"
            className="transition-colors hover:text-zinc-100 flex items-center gap-1.5"
          >
            <Code2 className="h-3.5 w-3.5 text-zinc-500" />
            Problems
          </Link>
          <Link
            href="/resources"
            className="transition-colors hover:text-zinc-100 flex items-center gap-1.5"
          >
            <BookOpen className="h-3.5 w-3.5 text-zinc-500" />
            Resources
          </Link>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-zinc-400 font-mono">
                {user.name} ({user.role})
              </span>
              <Link href={user.role === "admin" || user.role === "superadmin" ? "/admin" : "/dashboard"}>
                <Button size="sm" variant="secondary">
                  Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-zinc-100 text-zinc-950 hover:bg-white font-medium">
                  Sign Up
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 text-zinc-700" />
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-[#08090d] px-4 py-4 space-y-3">
          <div className="flex flex-col space-y-2 text-sm text-zinc-300">
            <Link
              href="/questions"
              className="py-1.5 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Problems
            </Link>
            <Link
              href="/resources"
              className="py-1.5 hover:text-white"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resources
            </Link>
          </div>
          <div className="pt-3 border-t border-zinc-900 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="secondary" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
              <Button size="sm" className="w-full">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;

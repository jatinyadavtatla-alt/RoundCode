import Link from "next/link";
import { Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-900 bg-[#06070a] py-8 text-xs text-zinc-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-zinc-600" />
          <span className="font-semibold text-zinc-400">RoundCode</span>
          <span className="text-zinc-700">|</span>
          <span>DSA Learning & Coding Practice</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 font-mono text-[11px] text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500/80"></span>
            All Systems Operational
          </span>
          <Link
            href="/questions"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Problems
          </Link>
          <Link
            href="/resources"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Resources
          </Link>
          <Link
            href="/login"
            className="text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

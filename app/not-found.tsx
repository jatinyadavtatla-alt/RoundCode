import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 mb-6">
        <Terminal className="h-6 w-6 text-zinc-400" />
      </div>
      <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
        404 — Node Not Found
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        This route does not exist.
      </h1>
      <p className="mt-4 max-w-md text-sm text-zinc-400">
        The requested path could not be resolved in the RoundCode directory. Verify the target URI or return to the platform home.
      </p>
      <div className="mt-8">
        <Link href="/">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to RoundCode
          </Button>
        </Link>
      </div>
    </div>
  );
}

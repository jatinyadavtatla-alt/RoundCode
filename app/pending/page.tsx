import Link from "next/link";
import { Clock, ArrowRight, ShieldAlert, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-900/50 bg-amber-950/30 text-amber-400 mb-5 shadow-inner">
              <Clock className="h-7 w-7" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-900/50 bg-amber-950/40 px-3 py-0.5 text-xs font-mono text-amber-300 mb-3">
              <ShieldAlert className="h-3 w-3" />
              <span>Pending Administrator Approval</span>
            </div>

            <h1 className="text-2xl font-bold text-white tracking-tight">
              Application Submitted
            </h1>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              Your registration request has been queued for administrator review. Once an administrator approves your account, you will be able to sign in immediately.
            </p>

            <div className="mt-8 flex flex-col gap-2.5">
              <Link href="/login">
                <Button className="w-full bg-zinc-100 text-zinc-950 hover:bg-white font-medium text-xs">
                  Try Signing In
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm" className="w-full text-zinc-400 hover:text-white text-xs">
                  <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                  Return Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

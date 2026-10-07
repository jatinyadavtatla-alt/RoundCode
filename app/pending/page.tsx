import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PendingPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <div className="w-full max-w-md text-center">
        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardContent className="p-8">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-amber-900/50 bg-amber-950/30 text-amber-400 mb-4">
              <Clock className="h-6 w-6" />
            </div>

            <h1 className="text-xl font-bold text-white">
              Account Verification
            </h1>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
              If your account is pending review, society administrators will verify your details shortly.
            </p>

            <div className="mt-6">
              <Link href="/">
                <Button variant="secondary" size="sm" className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
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

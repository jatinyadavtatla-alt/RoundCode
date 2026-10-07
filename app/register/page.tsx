"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Terminal, Lock, Mail, User, IdCard, GraduationCap, ArrowRight, AlertCircle, Loader2, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    collegeId: "",
    branch: "Computer Science",
    year: "2",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          collegeId: formData.collegeId,
          branch: formData.branch,
          year: formData.year,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create account.");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-100">
              <Terminal className="h-5 w-5 text-zinc-200" />
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Create your RoundCode Account
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Join the platform to practice DSA questions and track your progress
          </p>
        </div>

        <Card className="border-zinc-800 bg-[#0c0d12]">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-lg">Registration</CardTitle>
            <CardDescription>
              Fill out your details to get started immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 flex items-center gap-2 rounded-md border border-rose-900/60 bg-rose-950/40 p-3 text-xs text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      name="name"
                      required
                      placeholder="Alan Turing"
                      className="pl-9"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="email"
                      name="email"
                      required
                      placeholder="student@univ.edu"
                      className="pl-9"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      className="pl-9"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">College / Student ID</label>
                  <div className="relative">
                    <IdCard className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      name="collegeId"
                      required
                      placeholder="CS-2024-042"
                      className="pl-9 uppercase"
                      value={formData.collegeId}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Branch / Major</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="text"
                      name="branch"
                      required
                      placeholder="Computer Science"
                      className="pl-9"
                      value={formData.branch}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Academic Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950/80 px-3 py-1 text-sm text-zinc-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:border-zinc-700"
                  >
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="password"
                      name="password"
                      required
                      placeholder="••••••••"
                      className="pl-9"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-zinc-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                      type="password"
                      name="confirmPassword"
                      required
                      placeholder="••••••••"
                      className="pl-9"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-zinc-100 text-zinc-950 hover:bg-white font-medium mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Complete Registration
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 border-t border-zinc-900 pt-4 text-center text-xs text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-zinc-300 hover:text-white underline">
                Sign in here
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

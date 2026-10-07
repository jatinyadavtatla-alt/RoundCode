import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getSessionUser } from "@/lib/auth/session";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoundCode — Learn. Practice. Grow.",
  description:
    "RoundCode is the platform for DSA mastery, interactive problem solving, and member skill development.",
  keywords: [
    "DSA",
    "Data Structures",
    "Algorithms",
    "Competitive Programming",
    "Technical Society",
    "Coding Platform",
    "RoundCode",
  ],
  authors: [{ name: "RoundCode" }],
};

export const viewport: Viewport = {
  themeColor: "#08090d",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let sessionUser = null;
  try {
    sessionUser = await getSessionUser();
  } catch {
    sessionUser = null;
  }

  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[#08090d] text-zinc-100 font-sans antialiased">
        <Navbar
          user={
            sessionUser
              ? {
                  name: sessionUser.name,
                  role: sessionUser.role,
                  status: sessionUser.status,
                }
              : null
          }
        />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

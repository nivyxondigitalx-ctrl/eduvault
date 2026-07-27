import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DemoProvider } from "../lib/context";
import { Toaster } from "sonner";
import { ErrorBoundary } from "../components/shared/ErrorBoundary";
import { AiChatbot } from "../components/shared/AiChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KalviNest - University & College Study Material Marketplace",
  description: "Discover and download notes, question papers, and study material organized by university, college, course, and semester.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#0F172A]">
        <ErrorBoundary>
          <DemoProvider>
            {children}
            <AiChatbot />
            <Toaster position="top-right" richColors />
          </DemoProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}


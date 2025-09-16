import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "@/globals.css";
import { Header } from "@/components/features/header";

const font = Outfit({
  weight: "400",
  subsets: ["latin"]
});


export const metadata: Metadata = {
  title: "Nature Programming Language",
  description: "A modern programming language designed for elegant, efficient, and reliable software development",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.className}`}>
      <body className="antialiased min-h-screen flex flex-col font-body">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}

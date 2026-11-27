import type { Metadata } from "next";
import "@/globals.css";
import { Header } from "@/components/features/header";
import { ibmPlexMono, outfit } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Playground - Nax 编程语言",
  description: "在线编写并运行 Nax 程序",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${outfit.variable} ${ibmPlexMono.variable}`}>
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        <footer className="flex h-9 items-center justify-center border-t bg-white text-xs text-muted-foreground">
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            豫ICP备2025125748号-1
          </a>
        </footer>
      </body>
    </html>
  );
}

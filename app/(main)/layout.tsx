import type { Metadata } from "next";
import "@/globals.css";
import { Header } from "@/components/features/header";
import { SiteFooter } from "@/components/features/site-footer";
import { ibmPlexMono, outfit } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Nax 编程语言",
  description: "通用系统型编程语言与编译器，用简洁优雅的方式构建高性能、安全可靠、跨平台软件",
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

        <SiteFooter />
      </body>
    </html>
  );
}

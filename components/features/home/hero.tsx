'use client';

import { useState } from "react";
import Link from "next/link";
import { CodeBlock, type Mode } from "@/components/features/code-block";

// Hero entrance helper; the keyframes live in the page's <style>.
const rise = (i: number) => ({ "--i": i }) as React.CSSProperties;

// n is the paper hero, x the ink one. The red panel and the red button stay the same in both.
const THEME = {
  n: {
    section: "bg-white",
    text: "text-[#2F3437]",
    strong: "text-[#111112]",
    secondary: "border-[#111112] text-[#111112] hover:bg-[#111112] hover:text-white",
  },
  x: {
    section: "bg-[#111112]",
    text: "text-zinc-300",
    strong: "text-white",
    secondary: "border-white text-white hover:bg-white hover:text-[#111112]",
  },
};

// The mode is chosen with the two file tabs of the code window, and the whole hero follows it.
export function Hero() {
  const [mode, setMode] = useState<Mode>("n");
  const t = THEME[mode];
  // The title is Nax: the N is the .n mode and the x is the .x mode. The letter of the chosen mode is red, the rest follows the theme.
  const letter = (m: Mode) => `transition-colors duration-500 ${mode === m ? "text-nax-red" : t.strong}`;

  return (
    <section className={`relative isolate overflow-hidden transition-colors duration-500 ${t.section}`}>
      {/* the red panel behind the right half, dotted like the ellipsis and fading out at the edge it shares with the band below */}
      <div aria-hidden className="absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-[#D93A36] lg:block">
        <div className="absolute inset-0 [background-image:radial-gradient(rgba(0,0,0,0.18)_1.5px,transparent_1.5px)] [background-size:18px_18px] [mask-image:linear-gradient(to_bottom,#000_45%,transparent)]" />
      </div>

      <div className="container mx-auto px-4 pb-24 pt-14 lg:pb-32 lg:pt-20">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <h1
              style={rise(0)}
              className={`nax-rise text-[88px] font-bold leading-[0.88] tracking-[-0.05em] transition-colors duration-500 sm:text-[112px] lg:text-[132px] ${t.strong}`}
            >
              <span className={letter("n")}>N</span>a<span className={letter("x")}>x</span> ...
            </h1>

            <p
              style={rise(1)}
              className={`nax-rise mt-9 max-w-[30em] text-pretty text-[19px] leading-[1.9] transition-colors duration-500 sm:text-xl sm:leading-[1.9] ${t.text}`}
            >
              通用系统型编程语言与编译器，期望用
              <span className={`whitespace-nowrap font-semibold transition-colors duration-500 ${t.strong}`}>简洁优雅</span>
              的方式构建高性能、安全可靠、跨平台软件。
            </p>

            <div style={rise(2)} className="nax-rise mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/docs/get-started"
                className="inline-flex h-12 items-center gap-2 border-2 border-nax-red bg-nax-red px-7 text-[15px] font-semibold text-white transition hover:bg-[#D93A36] active:scale-[0.98]"
              >
                快速开始
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/playground"
                className={`inline-flex h-12 items-center border-2 px-7 text-[15px] font-semibold transition active:scale-[0.98] ${t.secondary}`}
              >
                在浏览器中尝试
              </Link>
            </div>
          </div>

          <div style={rise(3)} className="nax-rise min-w-0 lg:col-span-7">
            <CodeBlock mode={mode} onModeChange={setMode} />
          </div>
        </div>
      </div>
    </section>
  );
}

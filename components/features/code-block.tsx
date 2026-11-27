'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Play } from "lucide-react";
import { CodeSnippet } from "@/components/features/home/code-snippet";
import { EXAMPLES } from "@/components/features/home/examples";
import { PLAYGROUND_TIMEOUT_MS, runPlayground, type PlaygroundMode } from "@/lib/playground-api";

export type Mode = PlaygroundMode;

const MODES: Mode[] = ["n", "x"];

// The tabs of each run mode, labeled with the example ids from examples.ts, left in English. The five in the middle are
// language features that both modes support, so they appear in both lists in the same order. The last tab shows how the
// mode calls the other one.
const SHARED = ["error", "nullable", "match", "generics", "interface"];
const IDS: Record<Mode, string[]> = {
  n: ["http", "coroutine", "channel", "json", ...SHARED, "interop"],
  x: ["arena", "heap", "vec", "libc", ...SHARED, "interop"],
};

const find = (mode: Mode, id: string) => EXAMPLES.find((e) => e.id === id && e.file.endsWith(`.${mode}`))!;

type RunState =
  | { kind: "idle" }
  | { kind: "running" }
  | { kind: "done"; output: string; elapsedMs: number }
  | { kind: "error"; message: string };

// n is the light editor, x the dark one; the hero switches both together.
const THEME = {
  n: {
    snippet: "light" as const,
    frame: "border-black/10 bg-white shadow-[0_40px_90px_-30px_rgba(70,12,10,0.55)]",
    line: "border-[#EFEFED]",
    dot: "bg-[#DEDEDA]",
    bar: "bg-[#F4F3F0]",
    file: "text-[#6B6A67] hover:text-[#111111]",
    fileOn: "bg-white text-[#111111]",
    copy: "text-[#6B6A67] hover:text-[#111111]",
    tabs: "bg-white",
    tab: "text-[#6B6A67] hover:text-[#111111]",
    tabOn: "font-medium text-[#111111]",
    underline: "bg-nax-red",
    scroll: "[scrollbar-color:#D4D4D0_transparent]",
    out: "bg-[#FBFBFA]",
    cmd: "text-[#6B6A67]",
    prompt: "text-[#9A9894]",
    result: "text-[#111111]",
    muted: "text-[#6B6A67]",
    error: "text-[#CF222E]",
    live: "text-[#116329]",
  },
  x: {
    snippet: "dark" as const,
    frame: "border-white/10 bg-[#171718] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.75)]",
    line: "border-white/[0.08]",
    dot: "bg-white/15",
    bar: "bg-[#0E0E0F]",
    file: "text-zinc-500 hover:text-zinc-200",
    fileOn: "bg-[#171718] text-white",
    copy: "text-zinc-400 hover:text-white",
    tabs: "bg-[#171718]",
    tab: "text-zinc-400 hover:text-white",
    tabOn: "font-medium text-white",
    underline: "bg-nax-red",
    scroll: "[scrollbar-color:#3A3A3E_transparent]",
    out: "bg-[#121213]",
    cmd: "text-zinc-400",
    prompt: "text-zinc-600",
    result: "text-zinc-100",
    muted: "text-zinc-400",
    error: "text-[#FF7B72]",
    live: "text-[#9FE3B6]",
  },
};

// The hero code window. The two file tabs on top are the run modes (the suffix decides the mode) and switch the whole hero;
// below them is one tab per example of the chosen mode, the program, and a terminal panel that can run it live.
export function CodeBlock({ mode, onModeChange }: { mode: Mode; onModeChange: (mode: Mode) => void }) {
  // each mode remembers the example tab that was open last
  const [picked, setPicked] = useState<Record<Mode, string>>({ n: IDS.n[0], x: IDS.x[0] });
  const [copied, setCopied] = useState(false);
  const [runState, setRunState] = useState<RunState>({ kind: "idle" });
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeRun = useRef<AbortController | null>(null);
  const t = THEME[mode];
  const activeId = picked[mode];
  const example = find(mode, activeId);

  const clearCopyState = () => {
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
      copyTimer.current = null;
    }
    setCopied(false);
  };

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
      activeRun.current?.abort();
    };
  }, []);

  useEffect(() => {
    clearCopyState();
    activeRun.current?.abort();
    activeRun.current = null;
    setRunState({ kind: "idle" });
  }, [mode, activeId]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(example.code);
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
      setCopied(true);
      copyTimer.current = setTimeout(() => {
        copyTimer.current = null;
        setCopied(false);
      }, 1600);
    } catch {
      // clipboard may be unavailable; the code stays selectable
    }
  };

  const runLive = async () => {
    if (!example.browser || runState.kind === "running") {
      return;
    }

    activeRun.current?.abort();
    const controller = new AbortController();
    activeRun.current = controller;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, PLAYGROUND_TIMEOUT_MS);

    const startedAt = performance.now();
    setRunState({ kind: "running" });

    try {
      const output = await runPlayground(example.code, mode, controller.signal);
      if (activeRun.current !== controller) {
        return;
      }
      setRunState({
        kind: "done",
        output: output.replace(/\r?\n$/, ""),
        elapsedMs: Math.round(performance.now() - startedAt),
      });
    } catch (error) {
      if (controller.signal.aborted && !timedOut) {
        return;
      }
      if (activeRun.current !== controller) {
        return;
      }
      const message = timedOut
        ? "请求超时"
        : error instanceof Error
          ? error.message
          : String(error);
      setRunState({ kind: "error", message });
    } finally {
      clearTimeout(timeoutId);
      if (activeRun.current === controller) {
        activeRun.current = null;
      }
    }
  };

  const isRunning = runState.kind === "running";

  return (
    <div className={`overflow-hidden rounded-xl border transition-colors duration-500 ${t.frame}`}>
      <div className={`flex h-11 items-stretch border-b pl-3 pr-2.5 transition-colors duration-500 sm:pl-4 sm:pr-3 ${t.line} ${t.bar}`}>
        <div className="mr-4 hidden items-center gap-1.5 sm:flex" aria-hidden>
          <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${t.dot}`} />
          <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${t.dot}`} />
          <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${t.dot}`} />
        </div>
        <div role="tablist" aria-label="运行模式" className="flex shrink-0 items-stretch">
          {MODES.map((m) => {
            const selected = m === mode;
            return (
              <button
                key={m}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="hero-panel"
                onClick={() => onModeChange(m)}
                className={`relative -mb-px flex items-center whitespace-nowrap border-x border-t-2 px-3.5 font-mono text-[13px] transition-colors duration-300 sm:px-5 ${
                  selected ? `${t.line} border-t-nax-red ${t.fileOn}` : `border-transparent ${t.file}`
                }`}
              >
                main<span className="text-nax-red">.{m}</span>
              </button>
            );
          })}
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-1.5 self-center sm:gap-2">
          {/* only show the playground link when this example can run in the single-file playground */}
          {example.browser && (
            <Link
              href={
                mode === "x"
                  ? `/playground#mode=x&code=${encodeURIComponent(example.code)}`
                  : `/playground#code=${encodeURIComponent(example.code)}`
              }
              className={`whitespace-nowrap rounded px-1.5 py-0.5 text-xs transition-colors ${t.copy}`}
            >
              在浏览器中尝试
            </Link>
          )}
          <button
            type="button"
            onClick={copy}
            className={`whitespace-nowrap rounded px-1.5 py-0.5 text-xs transition-colors ${t.copy}`}
          >
            {copied ? "已复制" : "复制"}
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="语法示例"
        className={`flex flex-wrap border-b px-2 transition-colors duration-500 ${t.line} ${t.tabs}`}
      >
        {IDS[mode].map((id) => {
          const selected = id === activeId;
          return (
            <button
              key={id}
              role="tab"
              type="button"
              id={`hero-tab-${mode}-${id}`}
              aria-selected={selected}
              aria-controls="hero-panel"
              onClick={() => setPicked((p) => ({ ...p, [mode]: id }))}
              className={`relative px-2.5 py-2.5 text-[13px] transition-colors ${selected ? t.tabOn : t.tab}`}
            >
              {id}
              {selected && <span aria-hidden className={`absolute inset-x-2.5 -bottom-px h-[2px] ${t.underline}`} />}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id="hero-panel"
        aria-labelledby={`hero-tab-${mode}-${activeId}`}
        className={`h-[448px] overflow-auto px-5 py-4 [scrollbar-width:thin] ${t.scroll}`}
      >
        <CodeSnippet code={example.code} theme={t.snippet} className="text-[13px] leading-[1.75]" />
      </div>

      <div
        className={`min-h-[84px] border-t px-5 py-3 font-mono text-[12.5px] leading-6 transition-colors duration-500 ${t.line} ${t.out}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className={`min-w-0 truncate ${t.cmd}`}>
            <span className={`select-none ${t.prompt}`}>$ </span>
            {example.cmd}
            {runState.kind === "done" && (
              <span className={`ml-2.5 font-sans text-[11px] font-medium ${t.live}`}>
                实时 · {(runState.elapsedMs / 1000).toFixed(1)}s
              </span>
            )}
          </div>
          {example.browser && (
            <button
              type="button"
              onClick={runLive}
              disabled={isRunning}
              className="inline-flex h-7 shrink-0 items-center gap-1.5 border border-nax-red bg-nax-red px-2.5 font-sans text-[12px] font-semibold text-white transition hover:bg-[#D93A36] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              <Play aria-hidden className="h-3 w-3 fill-current" />
              {isRunning ? "运行中..." : "运行"}
            </button>
          )}
        </div>
        <div aria-live="polite" className={`mt-1 max-h-[120px] overflow-auto whitespace-pre-wrap break-words [scrollbar-width:thin] ${t.scroll}`}>
          {runState.kind === "running" && <span className={t.muted}>沙箱运行中...</span>}
          {runState.kind === "error" && <span className={t.error}>错误：{runState.message}</span>}
          {runState.kind === "done" && <span className={t.result}>{runState.output}</span>}
          {runState.kind === "idle" && example.output && <span className={t.result}>{example.output}</span>}
        </div>
      </div>
    </div>
  );
}

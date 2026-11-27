'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink, Play, RotateCw } from "lucide-react";
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
    iconBtn: "text-[#6B6A67] hover:bg-black/[0.06] hover:text-[#111111]",
    tabs: "bg-white",
    tab: "text-[#6B6A67] hover:text-[#111111]",
    tabOn: "font-medium text-[#111111]",
    underline: "bg-nax-red",
    scroll: "[scrollbar-color:#D4D4D0_transparent]",
    out: "bg-[#FBFBFA]",
    cmd: "text-[#6B6A67]",
    cmdHover: "hover:text-[#111111]",
    prompt: "text-[#9A9894]",
    result: "text-[#111111]",
    muted: "text-[#6B6A67]",
    run: "text-[#111112] hover:text-nax-red",
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
    iconBtn: "text-zinc-400 hover:bg-white/[0.08] hover:text-white",
    tabs: "bg-[#171718]",
    tab: "text-zinc-400 hover:text-white",
    tabOn: "font-medium text-white",
    underline: "bg-nax-red",
    scroll: "[scrollbar-color:#3A3A3E_transparent]",
    out: "bg-[#121213]",
    cmd: "text-zinc-400",
    cmdHover: "hover:text-zinc-100",
    prompt: "text-zinc-600",
    result: "text-zinc-100",
    muted: "text-zinc-400",
    run: "text-zinc-100 hover:text-nax-red",
    error: "text-[#FF7B72]",
    live: "text-[#9FE3B6]",
  },
};

// The hero code window. Every band keeps a fixed height so switching modes, tabs, or running live never shifts the hero.
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
      <div className={`flex h-11 items-stretch border-b pl-3 pr-3 transition-colors duration-500 sm:pl-4 sm:pr-4 ${t.line} ${t.bar}`}>
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
        <div className="ml-auto flex shrink-0 items-center gap-1 self-center">
          {example.browser && (
            <Link
              href={
                mode === "x"
                  ? `/playground#mode=x&code=${encodeURIComponent(example.code)}`
                  : `/playground#code=${encodeURIComponent(example.code)}`
              }
              title="在 Playground 中打开"
              aria-label="在 Playground 中打开"
              className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${t.iconBtn}`}
            >
              <ExternalLink aria-hidden className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            type="button"
            onClick={copy}
            title={copied ? "已复制" : "复制"}
            aria-label={copied ? "已复制" : "复制"}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-md transition-colors ${copied ? t.live : t.iconBtn}`}
          >
            {copied ? <Check aria-hidden className="h-3.5 w-3.5" /> : <Copy aria-hidden className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="语法示例"
        className={`no-scrollbar flex h-[41px] flex-nowrap items-stretch overflow-x-auto border-b px-2 transition-colors duration-500 ${t.line} ${t.tabs}`}
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
              className={`relative shrink-0 whitespace-nowrap px-2.5 text-[13px] transition-colors ${selected ? t.tabOn : t.tab}`}
            >
              {id}
              {selected && <span aria-hidden className={`absolute inset-x-2.5 bottom-0 h-[2px] ${t.underline}`} />}
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
        className={`flex h-[104px] flex-col border-t px-5 py-3 font-mono text-[12.5px] leading-6 transition-colors duration-500 ${t.line} ${t.out}`}
      >
        <div className="flex shrink-0 items-center justify-between gap-3">
          {example.browser ? (
            <button
              type="button"
              onClick={runLive}
              disabled={isRunning}
              className={`min-w-0 truncate text-left transition-colors disabled:pointer-events-none ${t.cmd} ${t.cmdHover}`}
            >
              <span className={`select-none ${t.prompt}`}>$ </span>
              {example.cmd}
            </button>
          ) : (
            <div className={`min-w-0 truncate ${t.cmd}`}>
              <span className={`select-none ${t.prompt}`}>$ </span>
              {example.cmd}
            </div>
          )}

          {example.browser && (
            <div className="flex shrink-0 items-center gap-3">
              {runState.kind === "done" && (
                <span className={`font-sans text-[11.5px] font-medium tabular-nums ${t.live}`}>
                  {(runState.elapsedMs / 1000).toFixed(1)}s
                </span>
              )}
              <button
                type="button"
                onClick={runLive}
                disabled={isRunning}
                className={`inline-flex items-center gap-1.5 font-sans text-[12.5px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 ${
                  runState.kind === "done" || runState.kind === "error" ? t.copy : t.run
                }`}
              >
                {runState.kind === "done" || runState.kind === "error" ? (
                  <>
                    <RotateCw aria-hidden className="h-3 w-3" />
                    {runState.kind === "error" ? "重试" : "重新运行"}
                  </>
                ) : (
                  <>
                    <Play aria-hidden className="h-2.5 w-2.5 fill-nax-red text-nax-red" />
                    {isRunning ? "运行中..." : "运行"}
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        <div
          aria-live="polite"
          className={`mt-1 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words [scrollbar-width:thin] ${t.scroll}`}
        >
          {runState.kind === "running" && <span className={t.muted}>沙箱运行中...</span>}
          {runState.kind === "error" && <span className={t.error}>错误：{runState.message}</span>}
          {runState.kind === "done" && <span className={t.result}>{runState.output}</span>}
          {runState.kind === "idle" && !example.browser && example.output && (
            <span className={t.result}>{example.output}</span>
          )}
        </div>
      </div>
    </div>
  );
}

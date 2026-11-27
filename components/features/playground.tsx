'use client';

import { useEffect, useRef, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Play } from "lucide-react";
import { MONO, naxEditor } from "@/components/features/nax-codemirror";
import { PLAYGROUND_TIMEOUT_MS, runPlayground, type PlaygroundMode } from "@/lib/playground-api";

type Mode = PlaygroundMode;

const MODES: Mode[] = ["n", "x"];

const MODE_STORAGE_KEY = "naxPlaygroundMode";
const CODE_STORAGE_KEY: Record<Mode, string> = {
  n: "naxPlaygroundCode",
  x: "naxPlaygroundCodeX",
};

const DEFAULT_CODE: Record<Mode, string> = {
  n: `fn main() {
    println('hello world')
}`,
  x: `import allocator.arena

type book_t = struct{
    string title
    int pages
}

fn main() {
    var ar = arena.init(4096)
    defer ar.deinit()

    var b = ar.new(book_t{title: 'nax', pages: 42})
    println(b.title, b.pages)
}`,
};

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStorage = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage may be unavailable (e.g. private browsing or quota exceeded)
  }
};

// The landing page hands a program over in the URL hash (#code=... or #mode=x&code=...); otherwise the last draft is restored.
// The playground builds a single main.n or main.x according to the active file tab.
export function Playground() {
  const [mode, setMode] = useState<Mode>("n");
  const [drafts, setDrafts] = useState<Record<Mode, string> | null>(null);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.slice(1));
    const sharedCode = params.get("code");
    const hashMode = params.get("mode");
    const savedMode = readStorage(MODE_STORAGE_KEY);
    const initialMode: Mode =
      hashMode === "x" || hashMode === "n"
        ? hashMode
        : sharedCode !== null
          ? "n"
          : savedMode === "x"
            ? "x"
            : "n";

    const nextDrafts: Record<Mode, string> = {
      n: readStorage(CODE_STORAGE_KEY.n) ?? DEFAULT_CODE.n,
      x: readStorage(CODE_STORAGE_KEY.x) ?? DEFAULT_CODE.x,
    };

    if (sharedCode !== null) {
      nextDrafts[initialMode] = sharedCode;
      writeStorage(CODE_STORAGE_KEY[initialMode], sharedCode);
    }
    if (sharedCode !== null || hashMode !== null) {
      writeStorage(MODE_STORAGE_KEY, initialMode);
      // a reload must not bring the original program back over later edits
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    setMode(initialMode);
    setDrafts(nextDrafts);
  }, []);

  useEffect(() => {
    return () => {
      activeRequest.current?.abort();
    };
  }, []);

  const code = drafts ? drafts[mode] : null;

  const selectMode = (nextMode: Mode) => {
    if (nextMode === mode || isLoading) {
      return;
    }
    setMode(nextMode);
    setOutput("");
    writeStorage(MODE_STORAGE_KEY, nextMode);
  };

  const onChange = (value: string) => {
    setDrafts((prev) => (prev ? { ...prev, [mode]: value } : prev));
    writeStorage(CODE_STORAGE_KEY[mode], value);
  };

  const runCode = async () => {
    if (code === null || isLoading) {
      return;
    }

    const controller = new AbortController();
    activeRequest.current = controller;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, PLAYGROUND_TIMEOUT_MS);

    setIsLoading(true);
    setOutput("运行中...");

    try {
      const data = await runPlayground(code, mode, controller.signal);
      setOutput(data);
    } catch (error) {
      if (controller.signal.aborted && !timedOut) {
        return;
      }
      console.error("Error running code:", error);
      const message = timedOut
        ? "请求超时"
        : error instanceof Error
          ? error.message
          : String(error);
      setOutput(`错误：${message}`);
    } finally {
      clearTimeout(timeoutId);
      if (activeRequest.current === controller) {
        activeRequest.current = null;
        setIsLoading(false);
      }
    }
  };

  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      void runCode();
    }
  };

  return (
    <div className="bg-[#F6F5F2] p-4 lg:h-[calc(100vh-102px)] lg:min-h-[560px] lg:p-5">
      <h1 className="sr-only">在线运行</h1>

      <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        <section className="flex h-[440px] min-h-0 flex-col border-2 border-[#111112] bg-white lg:h-auto">
          <h2 className="sr-only">代码编辑</h2>
          <div className="flex h-12 shrink-0 items-stretch justify-between border-b border-[#EFEFED] bg-[#F4F3F0] pl-4 pr-2.5">
            <div role="tablist" aria-label="运行模式" className="flex items-stretch">
              {MODES.map((m) => {
                const selected = m === mode;
                return (
                  <button
                    key={m}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    disabled={isLoading}
                    onClick={() => selectMode(m)}
                    className={`relative -mb-px flex items-center whitespace-nowrap border-x border-t-2 px-5 font-mono text-[13px] transition-colors disabled:opacity-60 ${
                      selected
                        ? "border-[#EFEFED] border-t-nax-red bg-white text-[#111111]"
                        : "border-transparent text-[#6B6A67] hover:text-[#111111]"
                    }`}
                  >
                    main<span className="text-nax-red">.{m}</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={runCode}
              disabled={isLoading || code === null}
              title="运行 (Ctrl/Cmd + Enter)"
              className="inline-flex h-9 items-center gap-2 self-center border-2 border-nax-red bg-nax-red px-5 text-[14px] font-semibold text-white transition hover:bg-[#D93A36] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? "运行中..." : "运行"}
              <Play aria-hidden className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
          <div className="min-h-0 flex-1" onKeyDownCapture={handleEditorKeyDown}>
            {code !== null && (
              <CodeMirror
                value={code}
                onChange={onChange}
                readOnly={isLoading}
                className="h-full"
                theme="none"
                basicSetup={{ tabSize: 4, foldGutter: false }}
                extensions={naxEditor}
              />
            )}
          </div>
        </section>

        <section className="flex h-[320px] min-h-0 flex-col border-2 border-[#111112] bg-[#171718] lg:h-auto">
          <div className="flex h-12 shrink-0 items-center border-b border-white/[0.08] bg-[#0E0E0F] px-5">
            <h2 className="text-[13px] font-medium text-zinc-300">运行结果</h2>
          </div>
          <div
            className="min-h-0 flex-1 overflow-auto px-5 py-4 text-[13.5px] leading-7 [scrollbar-color:#3A3A3E_transparent] [scrollbar-width:thin]"
            style={{ fontFamily: MONO }}
          >
            <div className="text-zinc-400">
              <span className="select-none text-zinc-600">$ </span>nax build main.{mode} &amp;&amp; ./main
            </div>
            <pre aria-live="polite" className="whitespace-pre-wrap break-words text-zinc-100" style={{ fontFamily: "inherit" }}>
              {output}
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}

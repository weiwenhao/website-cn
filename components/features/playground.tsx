'use client';

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { Play } from "lucide-react";
import { MONO, naxEditor } from "@/components/features/nax-codemirror";

// The playground server runs on its own box (nginx in front, docker sandboxes behind) with the current nax compiler.
const API = "https://019f791d26bb77fdba1492fdca11ab05.ap-southeast-1.a8g1v3.xyz/api/playgrounds/run";
const STORAGE_KEY = "naxPlaygroundCode";

const DEFAULT_CODE = `fn main() {
    println('hello world')
}`;

// The landing page hands a program over in the URL hash (#code=...); otherwise the last draft is restored.
// The playground builds a single main.n, so the editor always holds one .n file.
export function Playground() {
  const [code, setCode] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const shared = new URLSearchParams(window.location.hash.slice(1)).get("code");
    if (shared !== null) {
      localStorage.setItem(STORAGE_KEY, shared);
      // a reload must not bring the original program back over later edits
      history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    setCode(shared ?? localStorage.getItem(STORAGE_KEY) ?? DEFAULT_CODE);
  }, []);

  const onChange = (value: string) => {
    setCode(value);
    localStorage.setItem(STORAGE_KEY, value);
  };

  const runCode = async () => {
    setIsLoading(true);
    setOutput("Running...");

    try {
      const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: code,
      });

      if (!response.ok) {
        // the server says what went wrong in {"error": ...} (busy, too long, exit code); the gateway in front of it answers in plain text
        const reason = await response.json().then((body) => body.error).catch(() => undefined);
        throw new Error(reason ?? `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setOutput(result.data);
    } catch (error) {
      console.error("Error running code:", error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#F6F5F2] p-4 lg:h-[calc(100vh-65px)] lg:min-h-[560px] lg:p-5">
      <h1 className="sr-only">Playground</h1>

      <div className="grid h-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        <section className="flex h-[440px] min-h-0 flex-col border-2 border-[#111112] bg-white lg:h-auto">
          <h2 className="sr-only">代码编辑</h2>
          <div className="flex h-12 shrink-0 items-stretch justify-between border-b border-[#EFEFED] bg-[#F4F3F0] pl-4 pr-2.5">
            <div className="relative -mb-px flex items-center border-x border-t-2 border-[#EFEFED] border-t-nax-red bg-white px-5 font-mono text-[13px] text-[#111111]">
              main<span className="text-nax-red">.n</span>
            </div>
            <button
              type="button"
              onClick={runCode}
              disabled={isLoading}
              className="inline-flex h-9 items-center gap-2 self-center border-2 border-nax-red bg-nax-red px-5 text-[14px] font-semibold text-white transition hover:bg-[#D93A36] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {isLoading ? "运行中..." : "运行"}
              <Play aria-hidden className="h-3.5 w-3.5 fill-current" />
            </button>
          </div>
          <div className="min-h-0 flex-1">
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
              <span className="select-none text-zinc-600">$ </span>nax build main.n &amp;&amp; ./main
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

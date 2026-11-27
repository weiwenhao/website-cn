'use client';

import { Highlight } from "prism-react-renderer";
import { Prism, naxDarkTheme, naxLightTheme } from "@/components/features/home/nax-prism";
import { MONO_FONT_STACK } from "@/lib/fonts";

const MONO = MONO_FONT_STACK;

export function CodeSnippet({
  code,
  theme = "light",
  className = "",
  showLineNumbers = false,
}: {
  code: string;
  theme?: "light" | "dark";
  className?: string;
  showLineNumbers?: boolean;
}) {
  return (
    <Highlight prism={Prism} theme={theme === "dark" ? naxDarkTheme : naxLightTheme} code={code} language="nax">
      {({ tokens, getLineProps, getTokenProps }) => (
        <pre
          className={`m-0 bg-transparent text-[13px] leading-[1.72] ${className}`}
          style={{ fontFamily: MONO }}
        >
          {tokens.map((line, i) => {
            const lineProps = getLineProps({ line });
            return (
              <div
                key={i}
                {...lineProps}
                className={`${lineProps.className ?? ""} ${showLineNumbers ? "flex" : ""}`}
              >
                {showLineNumbers && (
                  <span
                    aria-hidden="true"
                    className={`mr-4 inline-block w-5 shrink-0 select-none text-right text-[11.5px] tabular-nums ${
                      theme === "dark" ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    {i + 1}
                  </span>
                )}
                <span className="min-w-0">
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            );
          })}
        </pre>
      )}
    </Highlight>
  );
}

import { Prism, type PrismTheme } from "prism-react-renderer";
import { KEYWORDS, TYPES } from "@/components/features/nax-words";

// Prism grammar tailored for nax keywords, types, structs and methods.

if (!Prism.languages.nax) {
  Prism.languages.nax = {
    comment: [
      { pattern: /\/\*[\s\S]*?\*\//, greedy: true },
      { pattern: /\/\/.*/, greedy: true },
    ],
    string: { pattern: /(["'`])(?:\\[\s\S]|(?!\1)[^\\])*\1/, greedy: true },
    keyword: new RegExp(`\\b(?:${KEYWORDS.join("|")})\\b`),
    builtin: new RegExp(`\\b(?:${TYPES.join("|")})\\b`),
    "class-name": [
      { pattern: /(\btype\s+)[A-Za-z_]\w*/, lookbehind: true },
      { pattern: /(\bfn\s+)[A-Za-z_]\w*(?=(?:<[^>]*>)?\.)/, lookbehind: true },
      /\b[a-z_][a-z0-9_]*_t\b/,
    ],
    constant: /\b[A-Z][A-Z0-9_]{2,}\b/,
    function: /\b[a-z_][a-z0-9_]*(?=\s*\()/,
    number: /\b(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)\b/,
    operator: /->|\.\.|[-+*/%=!<>&|^?:]+/,
    punctuation: /[{}[\](),.;]/,
  };
}

// Crisp light palette for white/paper surfaces.
export const naxLightTheme: PrismTheme = {
  plain: { color: "#1E293B", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "#64748B", fontStyle: "italic" } },
    { types: ["keyword"], style: { color: "#CF222E" } },
    { types: ["string"], style: { color: "#116329" } },
    { types: ["number", "constant"], style: { color: "#9A3412" } },
    { types: ["function"], style: { color: "#6639BA" } },
    { types: ["builtin", "class-name"], style: { color: "#225B91" } },
    { types: ["operator", "punctuation"], style: { color: "#475569" } },
  ],
};

// Luminous dark palette for borderless code floating on deep space ink (#161B26).
export const naxDarkTheme: PrismTheme = {
  plain: { color: "#E6EDF3", backgroundColor: "transparent" },
  styles: [
    { types: ["comment"], style: { color: "#7D8CA3", fontStyle: "italic" } },
    { types: ["keyword"], style: { color: "#FF7B72" } },
    { types: ["string"], style: { color: "#9FE3B6" } },
    { types: ["number", "constant"], style: { color: "#79C0FF" } },
    { types: ["function"], style: { color: "#D2A8FF" } },
    { types: ["builtin", "class-name"], style: { color: "#FFA657" } },
    { types: ["operator", "punctuation"], style: { color: "#94A3B8" } },
  ],
};

export { Prism };

import { HighlightStyle, StreamLanguage, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";
import { EditorView, type Extension } from "@uiw/react-codemirror";
import { KEYWORDS, TYPES } from "@/components/features/nax-words";

export const MONO = '"IBM Plex Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

const keywords = new Set(KEYWORDS);
const types = new Set(TYPES);

type State = { comment: boolean; afterType: boolean };

// A small tokenizer for nax. It follows the Prism grammar of the landing page (home/nax-prism.ts),
// so a program is colored the same in the hero window and in the playground.
const language = StreamLanguage.define<State>({
  startState: () => ({ comment: false, afterType: false }),

  token(stream, state) {
    if (state.comment) {
      if (stream.match(/^.*?\*\//)) {
        state.comment = false;
      } else {
        stream.skipToEnd();
      }
      return "comment";
    }

    if (stream.eatSpace()) {
      return null;
    }

    const afterType = state.afterType;
    state.afterType = false;

    if (stream.match("//")) {
      stream.skipToEnd();
      return "comment";
    }

    if (stream.match("/*")) {
      if (stream.match(/^.*?\*\//)) {
        return "comment";
      }
      state.comment = true;
      stream.skipToEnd();
      return "comment";
    }

    const quote = stream.peek();
    if (quote === "'" || quote === '"' || quote === "`") {
      stream.next();
      let escaped = false;
      for (let ch = stream.next(); ch != null; ch = stream.next()) {
        if (ch === quote && !escaped) {
          break;
        }
        escaped = !escaped && ch === "\\";
      }
      return "string";
    }

    if (stream.match(/^(?:0x[\da-fA-F]+|\d+(?:\.\d+)?)/)) {
      return "number";
    }

    if (stream.match(/^[A-Za-z_]\w*/)) {
      const word = stream.current();
      if (keywords.has(word)) {
        state.afterType = word === "type";
        return "keyword";
      }
      if (afterType || types.has(word) || word.endsWith("_t")) {
        return "type";
      }
      if (/^[A-Z][A-Z0-9_]{2,}$/.test(word)) {
        return "constant";
      }
      if (stream.match(/^\s*\(/, false)) {
        return "function";
      }
      return "variable";
    }

    if (stream.match(/^(?:->|\.\.|[-+*/%=!<>&|^?:]+)/)) {
      return "operator";
    }

    stream.next();
    return "punctuation";
  },

  tokenTable: {
    type: tags.typeName,
    constant: tags.constant(tags.variableName),
    function: tags.function(tags.variableName),
    variable: tags.variableName,
    operator: tags.operator,
    punctuation: tags.punctuation,
  },
});

// The light palette of the landing page code window.
const highlight = HighlightStyle.define([
  { tag: tags.comment, color: "#64748B", fontStyle: "italic" },
  { tag: tags.keyword, color: "#CF222E" },
  { tag: tags.string, color: "#116329" },
  { tag: [tags.number, tags.constant(tags.variableName)], color: "#9A3412" },
  { tag: tags.function(tags.variableName), color: "#6639BA" },
  { tag: tags.typeName, color: "#225B91" },
  { tag: [tags.operator, tags.punctuation], color: "#475569" },
]);

const theme = EditorView.theme({
  "&": { height: "100%", backgroundColor: "#FFFFFF", color: "#1E293B", fontSize: "14px" },
  "&.cm-focused": { outline: "none" },
  ".cm-scroller": { fontFamily: MONO, lineHeight: "1.75" },
  ".cm-content": { padding: "16px 0", caretColor: "#ED4845" },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: "#ED4845", borderLeftWidth: "2px" },
  ".cm-gutters": { backgroundColor: "#FFFFFF", color: "#B4B3AE", border: "none", paddingLeft: "8px" },
  ".cm-activeLine": { backgroundColor: "rgba(237, 72, 69, 0.05)" },
  ".cm-activeLineGutter": { backgroundColor: "transparent", color: "#111112" },
  "&.cm-focused .cm-selectionBackground, & .cm-selectionLayer .cm-selectionBackground, .cm-content ::selection": {
    background: "rgba(237, 72, 69, 0.18) !important",
  },
  "&.cm-focused .cm-matchingBracket": { backgroundColor: "rgba(237, 72, 69, 0.18)", outline: "none" },
});

export const naxEditor: Extension[] = [language, syntaxHighlighting(highlight), theme];

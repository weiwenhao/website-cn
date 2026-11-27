// The words of the nax language that syntax highlighting cares about, shared by the Prism grammar of the landing page
// and the CodeMirror grammar of the playground.
export const KEYWORDS = [
  "fn", "var", "const", "type", "import", "pub", "return", "if", "else", "for", "in", "break", "continue", "match",
  "select", "catch", "throw", "errdef", "defer", "go", "as", "is", "new", "struct", "interface", "enum", "union",
  "test", "true", "false", "null", "self",
];

export const TYPES = [
  "int", "uint", "i8", "i16", "i32", "i64", "u8", "u16", "u32", "u64", "float", "f32", "f64", "bool", "string", "void",
  "any", "vec", "map", "set", "tup", "chan", "ptr", "ref", "anyptr",
];

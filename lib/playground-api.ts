export type PlaygroundMode = "n" | "x";

// The playground server runs on its own box (nginx in front, docker sandboxes behind) with the current nax compiler.
export const PLAYGROUND_API =
  process.env.NEXT_PUBLIC_PLAYGROUND_API ||
  "https://019f791d26bb77fdba1492fdca11ab05.ap-southeast-1.a8g1v3.xyz/api/playgrounds/run";

export const PLAYGROUND_TIMEOUT_MS = 30_000;

export async function runPlayground(
  code: string,
  mode: PlaygroundMode,
  signal?: AbortSignal,
): Promise<string> {
  const endpoint = mode === "x" ? `${PLAYGROUND_API}?mode=x` : PLAYGROUND_API;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: code,
    signal,
  });

  if (!response.ok) {
    // the server says what went wrong in {"error": ...} (busy, too long, exit code); the gateway in front answers in plain text
    const reason = await response
      .json()
      .then((body) => (typeof body?.error === "string" ? body.error : undefined))
      .catch(() => undefined);
    throw new Error(reason ?? `HTTP ${response.status}`);
  }

  const result = await response.json();
  return typeof result?.data === "string" ? result.data : "";
}

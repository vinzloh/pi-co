import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { isToolCallEventType, VERSION } from "@earendil-works/pi-coding-agent";

const TRAILER_KEY = "Assisted-by";

export default function (pi: ExtensionAPI) {
  pi.on("tool_call", async (event, ctx) => {
    if (!isToolCallEventType("bash", event)) return;

    const cmd = event.input.command;
    if (!hasGitCommit(cmd)) return;

    const modelName = ctx.model ? `${ctx.model.provider}/${ctx.model.id}` : "unknown";
    event.input.command = injectTrailers(cmd, modelName, VERSION);
  });
}

export function hasGitCommit(cmd: string): boolean {
  return splitShellSegments(cmd).parts.some(isGitCommitSegment);
}

export function injectTrailers(cmd: string, modelName: string, piVersion: string): string {
  const trailer = `${TRAILER_KEY}: pi@${piVersion} + ${modelName}`;
  const flag = `--trailer ${shellDoubleQuote(trailer)}`;
  const { parts, seps } = splitShellSegments(cmd);

  const next = parts.map((part) => {
    if (!isGitCommitSegment(part) || hasAssistedByTrailer(part)) return part;
    return appendToSegment(part, flag);
  });

  return joinShellSegments(next, seps);
}

/** Quote-aware split on unquoted `&&` `||` `;` `|` `&` newline. */
export function splitShellSegments(cmd: string): { parts: string[]; seps: string[] } {
  const parts: string[] = [];
  const seps: string[] = [];
  let current = "";
  let i = 0;
  let quote: "'" | '"' | null = null;

  while (i < cmd.length) {
    const c = cmd[i];

    if (quote) {
      current += c;
      if (c === "\\" && quote === '"' && i + 1 < cmd.length) {
        current += cmd[++i];
      } else if (c === quote) {
        quote = null;
      }
      i++;
      continue;
    }

    if (c === "'" || c === '"') {
      quote = c;
      current += c;
      i++;
      continue;
    }

    // line continuation — keep inside segment
    if (c === "\\" && cmd[i + 1] === "\n") {
      current += "\\\n";
      i += 2;
      continue;
    }

    if (c === "&" && cmd[i + 1] === "&") {
      parts.push(current);
      seps.push("&&");
      current = "";
      i += 2;
      continue;
    }
    if (c === "|" && cmd[i + 1] === "|") {
      parts.push(current);
      seps.push("||");
      current = "";
      i += 2;
      continue;
    }
    if (c === ";" || c === "\n" || c === "|" || c === "&") {
      parts.push(current);
      seps.push(c);
      current = "";
      i++;
      continue;
    }

    current += c;
    i++;
  }

  parts.push(current);
  return { parts, seps };
}

function joinShellSegments(parts: string[], seps: string[]): string {
  let out = parts[0] ?? "";
  for (let i = 0; i < seps.length; i++) {
    out += seps[i] + (parts[i + 1] ?? "");
  }
  return out;
}

function isGitCommitSegment(segment: string): boolean {
  const normalized = segment.replace(/\\\n/g, " ");
  return /\bgit\s+commit\b/.test(normalized);
}

function hasAssistedByTrailer(segment: string): boolean {
  return new RegExp(
    `--trailer\\s+(?:"${TRAILER_KEY}:|'${TRAILER_KEY}:|${TRAILER_KEY}:)`,
  ).test(segment);
}

function appendToSegment(segment: string, flag: string): string {
  const trailingWs = segment.match(/\s*$/)?.[0] ?? "";
  const core = segment.slice(0, segment.length - trailingWs.length);
  if (!core) return `${flag}${trailingWs}`;
  return `${core} ${flag}${trailingWs}`;
}

function shellDoubleQuote(value: string): string {
  return `"${value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\$/g, "\\$")
    .replace(/`/g, "\\`")}"`;
}

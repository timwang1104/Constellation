const { spawn } = require("node:child_process");

function openUrl(url) {
  if (!url) return;

  const normalizedUrl = url.replace("0.0.0.0", "localhost");

  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", normalizedUrl], {
      stdio: "ignore",
      detached: true,
    }).unref();
    return;
  }

  if (process.platform === "darwin") {
    spawn("open", [normalizedUrl], { stdio: "ignore", detached: true }).unref();
    return;
  }

  spawn("xdg-open", [normalizedUrl], { stdio: "ignore", detached: true }).unref();
}

function pickUrlFromLine(line) {
  if (!line) return null;

  const matches = line.match(/https?:\/\/[^\s]+/g);
  if (!matches || matches.length === 0) return null;

  const localhostMatch = matches.find((u) => u.includes("localhost"));
  if (localhostMatch) return localhostMatch;

  const anyHttp = matches.find((u) => u.startsWith("http://") || u.startsWith("https://"));
  return anyHttp ?? null;
}

const nextArgs = ["dev", ...process.argv.slice(2)];
const child =
  process.platform === "win32"
    ? spawn("cmd.exe", ["/d", "/s", "/c", "next", ...nextArgs], {
        stdio: ["inherit", "pipe", "pipe"],
      })
    : spawn("next", nextArgs, { stdio: ["inherit", "pipe", "pipe"] });

let opened = false;
function maybeOpenFromChunk(chunk) {
  if (opened) return;
  const text = chunk.toString();
  const lines = text.split(/\r?\n/);
  for (const line of lines) {
    const url = pickUrlFromLine(line);
    if (url) {
      opened = true;
      openUrl(url);
      break;
    }
  }
}

child.stdout.on("data", (chunk) => {
  process.stdout.write(chunk);
  maybeOpenFromChunk(chunk);
});

child.stderr.on("data", (chunk) => {
  process.stderr.write(chunk);
  maybeOpenFromChunk(chunk);
});

child.on("exit", (code, signal) => {
  if (typeof code === "number") process.exit(code);
  if (signal) process.exit(1);
  process.exit(1);
});

child.on("error", () => {
  process.exit(1);
});

function forwardSignal(signal) {
  if (child.killed) return;
  child.kill(signal);
}

process.on("SIGINT", () => forwardSignal("SIGINT"));
process.on("SIGTERM", () => forwardSignal("SIGTERM"));

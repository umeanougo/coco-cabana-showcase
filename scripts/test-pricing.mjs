import { createRequire } from "node:module";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
const require = createRequire(import.meta.url);
const viteRequire = createRequire(require.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const directory = await mkdtemp(join(tmpdir(), "coco-tests-"));
try {
  const outfile = join(directory, "pricing.test.mjs");
  await build({
    entryPoints: ["tests/pricing.test.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    define: { "import.meta.env": "{}" },
    outfile,
  });
  const result = spawnSync(process.execPath, ["--test", outfile], { stdio: "inherit" });
  process.exitCode = result.status ?? 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}

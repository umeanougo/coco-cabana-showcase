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
  await build({
    entryPoints: [
      "tests/pricing.test.ts",
      "tests/pricing-manager.test.ts",
      "tests/pricing-ux.test.ts",
    ],
    bundle: true,
    platform: "node",
    format: "esm",
    banner: {
      js: 'import { createRequire as testCreateRequire } from "node:module"; const require = testCreateRequire(import.meta.url);',
    },
    define: { "import.meta.env": "{}" },
    outdir: directory,
    outExtension: { ".js": ".mjs" },
  });
  const result = spawnSync(
    process.execPath,
    [
      "--test",
      join(directory, "pricing.test.mjs"),
      join(directory, "pricing-manager.test.mjs"),
      join(directory, "pricing-ux.test.mjs"),
    ],
    { stdio: "inherit" },
  );
  process.exitCode = result.status ?? 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}

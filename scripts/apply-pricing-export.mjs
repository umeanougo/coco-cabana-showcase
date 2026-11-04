import { createRequire } from "node:module";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { pathToFileURL } from "node:url";
const args = process.argv.slice(2);
const file = args[0];
const version = args[args.indexOf("--version") + 1];
if (!file || !args.includes("--version") || !version || version.startsWith("--")) {
  console.error(
    "Usage: node scripts/apply-pricing-export.mjs FILE --version NEW_CATALOG_VERSION [--write]",
  );
  process.exit(1);
}
const require = createRequire(import.meta.url);
const viteRequire = createRequire(require.resolve("vite/package.json"));
const { build } = viteRequire("esbuild");
const directory = await mkdtemp(join(tmpdir(), "coco-pricing-apply-"));
try {
  const outfile = join(directory, "schema.mjs");
  await build({
    entryPoints: ["src/lib/pricing-calculator/configuration.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
  });
  const { readPricingImport, configurationSchema, pricingChanges } = await import(
    pathToFileURL(outfile).href
  );
  const incoming = readPricingImport(await readFile(file, "utf8"));
  const target = "src/config/pricing-catalog.json";
  const current = configurationSchema.parse(JSON.parse(await readFile(target, "utf8")));
  if (incoming.baseCatalogVersion !== current.catalogVersion)
    throw new Error(
      "Base catalog differs from current website. Review and reconcile against a fresh export before applying; automatic overwrite refused.",
    );
  if (version === current.catalogVersion)
    throw new Error("Choose a new catalog version so stale estimates and drafts are detected.");
  const next = configurationSchema.parse({
    ...incoming.configuration,
    catalogVersion: version,
    items: incoming.configuration.items.map((item) => ({ ...item, version })),
  });
  console.log(pricingChanges(current, incoming.configuration));
  console.log(`Catalog: ${current.catalogVersion} → ${version}`);
  if (args.includes("--write")) {
    await writeFile(target, JSON.stringify(next, null, 2) + "\n");
    console.log(
      "Updated canonical configuration. Run tests, typecheck, lint and build; inspect diff before PR. Nothing deployed.",
    );
  } else console.log("Validation only. Add --write to update the repository configuration.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await rm(directory, { recursive: true, force: true });
}

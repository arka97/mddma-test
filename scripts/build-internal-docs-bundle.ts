// Regenerates supabase/functions/get-internal-doc/content.ts from the markdown
// files in supabase/functions/get-internal-doc/content/*.md.
// Run after editing any of those markdown files:
//   bunx tsx scripts/build-internal-docs-bundle.ts

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve("supabase/functions/get-internal-doc/content");
const out = resolve("supabase/functions/get-internal-doc/content.ts");

const files = readdirSync(dir).filter((f) => f.endsWith(".md")).sort();

const lines: string[] = [
  "// AUTO-GENERATED from ./content/*.md — do not edit by hand.",
  "// Run `bunx tsx scripts/build-internal-docs-bundle.ts` after editing the markdown sources.",
  "export const CONTENT: Record<string, string> = {",
];

for (const f of files) {
  const body = readFileSync(resolve(dir, f), "utf8");
  lines.push(`  ${JSON.stringify(f)}: ${JSON.stringify(body)},`);
}

lines.push("};", "");

writeFileSync(out, lines.join("\n"));
console.log(`content.ts rebuilt — ${files.length} docs`);

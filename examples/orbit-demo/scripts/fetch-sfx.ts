/**
 * Downloads the sound effects Sfx.tsx plays into public/sfx, once, so renders
 * work offline. Skips files that are already there.
 *
 *   pnpm sfx
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import type { SfxName } from '../src/ui/Sfx';

const NAMES: SfxName[] = ['whoosh', 'mouse-click', 'ding', 'switch', 'page-turn'];
const OUT_DIR = 'public/sfx';

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const name of NAMES) {
    const file = `${OUT_DIR}/${name}.wav`;
    if (existsSync(file)) continue;
    const response = await fetch(`https://remotion.media/${name}.wav`);
    if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
    writeFileSync(file, Buffer.from(await response.arrayBuffer()));
    console.log(`  ${file}`);
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});

/**
 * Downloads the sound effects Sfx.tsx plays from remotion.media into
 * public/sfx, once, so renders work offline. Skips files already there.
 * (impact, pop and riser are synthesised by `pnpm audio` instead.)
 *
 *   pnpm sfx
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { REMOTE_SFX } from '../src/ui/Sfx';

const OUT_DIR = 'public/sfx';

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });
  for (const name of REMOTE_SFX) {
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

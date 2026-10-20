import { loadFont as loadGeist } from '@remotion/google-fonts/Geist';
import { loadFont as loadGeistMono } from '@remotion/google-fonts/GeistMono';

/**
 * A real app would ship its own woff2 files (see the template's fonts.ts).
 * Orbit is made up, so it borrows Geist from Google Fonts; Remotion holds the
 * first frame until the faces are ready.
 */
export function loadFonts(): void {
  loadGeist('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
  loadGeistMono('normal', { weights: ['500'], subsets: ['latin'] });
}

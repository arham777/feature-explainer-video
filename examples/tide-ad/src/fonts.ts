import { loadFont as loadJakarta } from '@remotion/google-fonts/PlusJakartaSans';
import { loadFont as loadGeistMono } from '@remotion/google-fonts/GeistMono';

/**
 * A real app would ship its own font files. Tide is made up, so it borrows
 * Plus Jakarta Sans from Google Fonts; Remotion holds the first frame until
 * the faces are ready.
 */
export function loadFonts(): void {
  loadJakarta('normal', { weights: ['500', '600', '700', '800'], subsets: ['latin'] });
  loadGeistMono('normal', { weights: ['500'], subsets: ['latin'] });
}

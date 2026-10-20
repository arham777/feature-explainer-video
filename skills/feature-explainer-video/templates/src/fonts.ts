import { continueRender, delayRender, staticFile } from 'remotion';

/**
 * The app's own faces, from the same woff2 files it ships (copied into
 * public/fonts). These are the reference build's; swap in the app's.
 */
const FACES = [
  ['Satoshi', 'Satoshi-Medium.woff2', '500'],
  ['Satoshi', 'Satoshi-Bold.woff2', '700'],
  ['Geist', 'Geist-Regular.woff2', '400'],
  ['Geist', 'Geist-Medium.woff2', '500'],
  ['Geist', 'Geist-SemiBold.woff2', '600'],
  ['Geist', 'Geist-Bold.woff2', '700'],
  ['Geist Mono', 'GeistMono-Medium.woff2', '500'],
  ['Geist Mono', 'GeistMono-Bold.woff2', '700'],
] as const;

let requested = false;

/** Holds the first frame until every face is ready, so nothing renders in a fallback font. */
export function loadFonts(): void {
  if (requested) return;
  requested = true;
  const handle = delayRender('Loading brand fonts');
  Promise.all(
    FACES.map(async ([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {
        weight,
      });
      await face.load();
      document.fonts.add(face);
    }),
  )
    .then(() => continueRender(handle))
    .catch((error: unknown) => {
      console.error('Brand font failed to load', error);
      continueRender(handle);
    });
}

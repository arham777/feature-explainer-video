import path from 'node:path';
import type { WebpackOverrideFn } from '@remotion/bundler';

/**
 * Labels, hint copy and maths come from the app's own shared code, so the
 * video can never say something the product does not. Point the alias at the
 * app's shared package and keep tsconfig.json `paths` in step. Shared by the
 * CLI config and the stills script so both bundle the same way.
 */
export const webpackOverride: WebpackOverrideFn = (config) => ({
  ...config,
  resolve: {
    ...config.resolve,
    alias: {
      ...(config.resolve?.alias ?? {}),
      '@app/shared': path.resolve(process.cwd(), '../packages/shared/src/index.ts'),
    },
  },
});

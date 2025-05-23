import { defineConfig } from 'tsup'

export default defineConfig((options) => ({
  entry: ['src/**/*.ts'],
  sourcemap: true,
  clean: true,
  onSuccess: options.watch
    ? 'NODE_ENV=dev node --enable-source-maps -r tsconfig-paths/register dist/index.cjs | pino-pretty'
    : undefined,
  watch: options.watch ? './src/*' : undefined,
  platform: 'node',
  target: 'node20',
  format: 'cjs',
}))

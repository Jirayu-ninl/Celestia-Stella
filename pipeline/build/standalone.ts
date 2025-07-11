await Bun.build({
  entrypoints: ['./src/index.ts'],
  outdir: './dist',
  target: 'bun',
  format: 'esm',
  sourcemap: 'external',
  minify: true,
  splitting: false,
  external: [],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})

export {}

import { env } from '../../global/env'

async function runBuild() {
  console.log('🔨 Starting build process...\n')

  try {
    const result = await Bun.build({
      entrypoints: ['./src/index.ts'],
      outdir: './dist',
      target: 'bun',
      format: 'esm',
      sourcemap: 'external',
      minify: true,
      splitting: true,
      external: [],
      naming: {
        // default values
        entry: '[dir]/[name].[ext]',
        chunk: '[name]-[hash].[ext]',
        asset: '[name]-[hash].[ext]',
      },
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    })

    if (!result.success) {
      console.error('❌ Build failed:')
      for (const message of result.logs) {
        console.error(message)
      }
      process.exit(1)
    }

    console.log('✅ Build completed successfully!')
    console.log(`📦 Output: ${result.outputs.length} files generated`)

    // Optional: Log build artifacts
    if (env.NODE_ENV === 'development') {
      console.log('\n📄 Build artifacts:')
      for (const output of result.outputs) {
        console.log(`  - ${output.path}`)
      }
    }

    console.log('\n🎉 Build process completed!\n')
  } catch (error) {
    console.error(
      '💥 Build process failed:',
      error instanceof Error ? error.message : error,
    )
    process.exit(1)
  }
}

// Only run build if this file is executed directly
if (import.meta.main) {
  runBuild()
}

export { runBuild }

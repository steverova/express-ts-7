/// <reference types="node" />
import { readFileSync } from 'node:fs'
import { build, context } from 'esbuild'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as {
	dependencies?: Record<string, string>
}

const external = Object.keys(pkg.dependencies ?? {})

const options = {
	entryPoints: ['src/index.ts'],
	bundle: true,
	platform: 'node' as const,
	target: 'node24',
	format: 'esm' as const,
	outdir: 'dist',
	sourcemap: true,
	minify: false,
	external,
	alias: {
		'#lib': './src/lib',
		'#config': './src/config',
		'#middlewares': './src/middlewares',
		'#features': './src/features'
	}
}

const isWatch = process.argv.includes('--watch')

if (isWatch) {
	const ctx = await context({
		...options,
		plugins: [
			{
				name: 'rebuild-notify',
				setup(build) {
					build.onEnd((result) => {
						if (result.errors.length > 0) {
							console.error('Build failed:', result.errors)
						} else {
							console.log('Build succeeded')
						}
					})
				}
			}
		]
	})
	await ctx.watch()
	console.log('Watching for changes...')
} else {
	await build(options)
}

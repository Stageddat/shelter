import { defineConfig } from 'tsup';

export default defineConfig({
	entry: ['./src/**/*.ts'],
	format: 'esm',
	clean: true,
	minify: true,
	outDir: 'dist',
	bundle: false,
	esbuildOptions(options) {
		options.outbase = './src';
	},
	dts: false,
	sourcemap: false,
});

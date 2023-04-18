import { defineConfig } from "vite";
import multiple from 'vite-plugin-multiple'
import build from './lib/build.json';

export default defineConfig({
  plugins: [
    multiple([
      {
        name: 'js',
        config: 'lib/main.js',
        command: 'build'
      }
    ]),
  ],
  build: {
    cssMinify: false,
    minify: false,
    copyPublicDir: false,
    lib: {
      entry: {
        'plyr-vr':'./src/plugin.js',
      },
      name: 'PlyrVr',
      formats: ['umd'],
      fileName: (format, entryName) => {
        const suffix = format == 'es'? '.es':'';
        return entryName+suffix+'.js';
      },
    },
    rollupOptions: {
      external: (id) => Object.keys(build.js["plyr-vr.js"].externals['umd']).some((ext) => id === ext),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: build.js["plyr-vr.js"].externals['umd'],
      },
    },
  }
})
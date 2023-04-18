import { defineConfig } from "vite";
import build from './build.json';

export default defineConfig({
  build: {
    copyPublicDir: false,
    emptyOutDir: false,
    outDir: 'dist',
    lib: {
      entry: {
        'plyr-vr':'./src/plugin.js',
      },
      name: 'PlyrVr',
      formats: ['es'],
      fileName: (format, entryName) => {
        const suffix = format == 'es'? '.es':'';
        return entryName+suffix+'.js';
      },
    },
    rollupOptions: {
      external: (id) => Object.keys(build.js["plyr-vr.js"].externals['es']).some((ext) => id.startsWith(ext)),
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: build.js["plyr-vr.js"].externals['es'],
      },
    },
  }
})
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        // Fichiers séparés et stables : une mise à jour de l'app ne force plus
        // le re-téléchargement de React, Supabase ou du catalogue de stickers.
        manualChunks(id) {
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules/@supabase')) return 'supabase';
          // (les effectifs src/data/squads/<album>.ts restent à part : un petit fichier par album, chargé à l'ouverture)
          if (/\/src\/data\/(stickers|squads|teams|photos)\.ts$/.test(id)) return 'stickers';
        },
      },
    },
  },
});

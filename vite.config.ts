import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon48.png'],
      manifest: {
        name: 'Scoreboard',
        short_name: 'Scoreboard',
        description: 'Ứng dụng tính điểm thi đấu cầu lông, bóng bàn...',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'fullscreen',
        start_url: '/scoreboard/',
        scope: '/scoreboard/',
        icons: [
          {
            purpose: 'maskable',
            sizes: '512x512',
            src: '/scoreboard/icon512_maskable.png',
            type: 'image/png',
          },
          {
            purpose: 'any',
            sizes: '512x512',
            src: '/scoreboard/icon512_rounded.png',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/scoreboard/',
});

import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    permissions: ['storage', 'alarms', 'declarativeNetRequest'],
    host_permissions: ['<all_urls>'],
    action: {
      default_title: 'RSS Blocks を開く',
    },
    name: 'RSS Blocks',
    version: '1.0.0',
    description: '複数のRSS/Atomフィードをブロック形式で一覧表示します',
  },
  srcDir: 'src',
  publicDir: 'src/public',
  alias: {
    '@': '/src',
  },
  dev: {
    server: {
      host: '0.0.0.0',
      port: 3000,
    },
  },
  webExt: {
    // Use devcontainer for development
    disabled: true,
  },
  vite: () => ({
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true,
      hmr: {
        port: 3000,
      },
    },
    plugins: [vanillaExtractPlugin()],
  }),
  modules: ['@wxt-dev/module-react', '@wxt-dev/auto-icons'],
});

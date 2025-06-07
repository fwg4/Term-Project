// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 本機 dev server 代理：/api/taipower → 台電 OpenData
      '/api/taipower': {
        target: 'https://service.taipower.com.tw',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/taipower/, ''),
      },
      // 本機 dev server 代理：/api/datagov → data.gov.tw API
      '/api/datagov': {
        target: 'https://data.gov.tw',
        changeOrigin: true,
        // 把 /api/datagov 開頭改成真正的檔案路徑
        rewrite: path =>
          path.replace(
            /^\/api\/datagov/,
            '/api/v1/rest/datastore/301000000A-000082-053'
          ),
      },
    },
  },
});

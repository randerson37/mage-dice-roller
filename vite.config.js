import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'


// Custom middleware to serve wasm files with the correct MIME type
const wasmMiddleware = () => {
  return {
    name: 'wasm-middleware',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && req.url.endsWith('.wasm')) {
          const wasmPath = path.join(__dirname, 'assets/ammo', path.basename(req.url));
          const wasmFile = fs.readFileSync(wasmPath);
          res.setHeader('Content-Type', 'application/wasm');
          res.end(wasmFile);
          return;
        }
        next();
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.wasm'],
  base: "/mage-dice-roller/"
})

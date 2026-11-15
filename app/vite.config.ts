import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import { fileURLToPath } from 'url'
import { createHtmlPlugin } from 'vite-plugin-html' //@ts-ignore
import { createTranslationPlugin } from "./src/translator"

// 适配ES Module规范获取当前文件路径，避免云端__dirname未定义报错
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  base: '/coai/', // 替换为你的GitHub仓库名称，解决部署后静态资源404问题
  plugins: [
    react(),
    createHtmlPlugin({
      minify: true,
    }),
    createTranslationPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    mainFields: ['module', 'main'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
  optimizeDeps: {
    include: ["antd-style", "@lobehub/icons"],
    force: true // 强制触发预构建，避免云端依赖缓存异常
  },
  build: {
    manifest: true,
    chunkSizeWarningLimit: 2048,
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].[hash].js`,
        chunkFileNames: `assets/[name].[hash].js`,
        assetFileNames: `assets/[name].[hash].[ext]`
      },
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8094",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
        ws: true,
      },
      "/v1": {
        target: "http://localhost:8094",
        changeOrigin: true,
      }
    }
  }
});

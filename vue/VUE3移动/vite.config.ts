import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// 组件自动注册
import Components from 'unplugin-vue-components/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
// svg
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// html
import { createHtmlPlugin } from 'vite-plugin-html'

export default defineConfig({
  server: {
    port: 80,
    host: true,
    open: true
  },
  plugins: [
    vue(),
    // 组件自动注册
    Components({
      dts: false,
      resolvers: [VantResolver({ importStyle: false })]
    }),
    // svg
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/icons')]
    }),
    // html
    createHtmlPlugin()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

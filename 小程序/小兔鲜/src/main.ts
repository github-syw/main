import { createSSRApp } from 'vue'
import pinia from './stores'

import App from './App.vue'
export function createApp() {
  // 创建vue实例
  const app = createSSRApp(App)
  // 使用pinia
  app.use(pinia)
  return {
    app,
  }
}

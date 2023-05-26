import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

const pinia = createPinia()
pinia.use(persist)
export default pinia

// 完整写法
// import { xxx } from 'xxx'
// export { xxx }
export * from './modules/user'
export * from './modules/consult'

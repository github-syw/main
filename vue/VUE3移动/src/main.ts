// 引入的不再是vue构造函数，而是一个名为createApp的工厂函数。区别：构造函数需要new调用；工厂函数不需要new调用。
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'

import 'virtual:svg-icons-register'
import 'vant/lib/index.css'
import './styles/main.scss'
import './mock'

// 创建应用实例对象app，类似于之前的vm，但是比vm'轻'
const app = createApp(App)
app.use(pinia)
app.use(router)
// 应用实例对象上有个方法mount，挂载
app.mount('#app')

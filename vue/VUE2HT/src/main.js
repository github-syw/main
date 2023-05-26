import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router'

import 'normalize.css/normalize.css'
import '@/styles/index.scss'
import '@/permission'
import '@/icons'

import ELEMENT from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 将一个模块中的全部按需导出，都导入进来
import * as directives from '@/directives'
import components from '@/components'
import Print from 'vue-print-nb'

Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

Vue.use(components)
Vue.use(ELEMENT)
Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

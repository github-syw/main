import { useUserStore } from '@/stores'
import { createRouter, createWebHistory } from 'vue-router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false })

const Room = () => import('@/views/Room/index.vue')
const User = () => import('@/views/User/index.vue')
const Home = () => import('@/views/Home/index.vue')
const Login = () => import('@/views/Login/index.vue')
const Layout = () => import('@/views/Layout/index.vue')
const ConsultDetail = () => import('@/views/User/ConsultDetail.vue')
const ConsultIllness = () => import('@/views/Consult/ConsultIllness.vue')
const OrderLogistics = () => import('@/views/Order/OrderLogistics.vue')
const OrderPayResult = () => import('@/views/Order/OrderPayResult.vue')
const LoginCallback = () => import('@/views/Login/LoginCallback.vue')
const ConsultFast = () => import('@/views/Consult/ConsultFast.vue')
const ConsultDep = () => import('@/views/Consult/ConsultDep.vue')
const ConsultPay = () => import('@/views/Consult/ConsultPay.vue')
const OrderDetail = () => import('@/views/Order/OrderDetail.vue')
const PatientPage = () => import('@/views/User/PatientPage.vue')
const ConsultPage = () => import('@/views/User/ConsultPage.vue')
const OrderPay = () => import('@/views/Order/OrderPay.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home, meta: { title: '首页' } },
        { path: '/user', component: User, meta: { title: '个人中心' } }
      ]
    },
    {
      path: '/room',
      component: Room,
      meta: { title: '问诊室' },
      // 支付失败
      beforeEnter(to) {
        if (to.query.payResult === 'false') return '/user/consult'
      }
    },
    { path: '/login', component: Login, meta: { title: '登录' } },
    { path: '/order/pay', component: OrderPay, meta: { title: '药品支付' } },
    {
      path: '/order/logistics/:id',
      component: OrderLogistics,
      meta: { title: '物流详情' }
    },
    {
      path: '/order/pay/result',
      component: OrderPayResult,
      meta: { title: '药品支付结果' }
    },
    {
      path: '/login/callback',
      component: LoginCallback,
      meta: { title: 'QQ登录-绑定手机' }
    },
    {
      path: '/consult/illness',
      component: ConsultIllness,
      meta: { title: '病情描述' }
    },
    {
      path: '/user/consult/:id',
      component: ConsultDetail,
      meta: { title: '问诊详情' }
    },
    {
      path: '/order/:id',
      component: OrderDetail,
      meta: { title: '药品订单详情' }
    },
    {
      path: '/user/consult',
      component: ConsultPage,
      meta: { title: '问诊记录' }
    },
    {
      path: '/user/patient',
      component: PatientPage,
      meta: { title: '家庭档案' }
    },
    {
      path: '/consult/fast',
      component: ConsultFast,
      meta: { title: '极速问诊' }
    },
    {
      path: '/consult/dep',
      component: ConsultDep,
      meta: { title: '选择科室' }
    },
    {
      path: '/consult/pay',
      component: ConsultPay,
      meta: { title: '问诊支付' }
    }
  ]
})

// 全局前置导航守卫
router.beforeEach((to) => {
  NProgress.start()
  const store = useUserStore()
  // 白名单，不需要登录就可以访问的页面
  const whiteList = ['/login', '/login/callback', '/register']
  // 没有token并且不在白名单，重定向到登录页
  if (!store.user?.token && whiteList.includes(to.path) === false)
    return '/login'
  else return true // 其它情况
})

/**
 * 全局后置导航守卫
 * 注意：vue2里，当重定向时，后置守卫不执行
 */
router.afterEach((to) => {
  document.title = `${to.meta.title || ''} - ${import.meta.env.VITE_APP_TITLE}`
  NProgress.done()
})

export default router

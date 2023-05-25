import axios, { AxiosError, type Method } from 'axios'
import { useUserStore } from '@/stores'
import { showToast } from 'vant'
import router from '@/router'

const baseURL = 'https://consult-api.itheima.net/'
const instance = axios.create({ baseURL, timeout: 5000 })

// jwt身份认证？是一个基于token令牌的身份认证机制
// 登录请求后，后台返回token，前端该如何操作？将token存储于本地，下次请求时在请求头中携带
// 在前后端分离模式的开发中，服务器如何知道来访者的身份呢？基于token令牌，包含身份信息的字符串
instance.interceptors.request.use(
  (config) => {
    const store = useUserStore()
    if (store.user?.token && config.headers)
      config.headers.Authorization = `Bearer ${store.user.token}`
    return config
  },
  (err) => Promise.reject(err)
)

instance.interceptors.response.use(
  (res) => {
    if (res.data.code !== 10000) {
      showToast('响应成功，但是业务失败!!!' + res.data.message)
      return Promise.reject(res.data)
    }
    return res.data
  },
  (err: AxiosError) => {
    // token失效，清除本地用户信息，跳转到登录页面，携带当前页面的地址（包含参数）
    if (err.response?.status === 401) {
      const store = useUserStore()
      store.delUser()
      router.push({
        path: '/login',
        query: { returnUrl: router.currentRoute.value.fullPath }
      })
    }
    return Promise.reject(err)
  }
)

type Date<T> = {
  code: number
  message: string
  data: T
}
const request = <T>(
  url: string,
  method: Method = 'GET',
  submitData?: object
) => {
  return instance.request<any, Date<T>>({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}

export { request, baseURL }

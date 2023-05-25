import { useMemberStore } from '@/stores'

// 基地址
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 请求拦截器
const httpInterceptor = {
  // options就是{}里的参数。uni.request({method: '', url: '', header: '', ...})
  invoke(options: UniApp.RequestOptions) {
    if (!options.url.startsWith('http')) options.url = baseURL + options.url // 1. 非http开头需要拼接
    options.timeout = 10000 // 2. 超时时间，默认60s
    // 3. 添加小程序端请求头标识
    options.header = {
      ...options.header, // 在发起请求时，如果添加了请求头，这里是覆盖的写法，所以先展开之前的
      'source-client': 'miniapp',
    }
    // 4. 添加token请求头标识
    const memberStore = useMemberStore()
    if (memberStore.profile?.token) options.header.Authorization = memberStore.profile?.token
  },
}
// 拦截request + uploadFile上传请求，因为都是同一个服务器，所以可以共用一个配置
uni.addInterceptor('request', httpInterceptor)
uni.addInterceptor('uploadFile', httpInterceptor)

interface Data<T> {
  code: string
  msg: string
  result: T
}
export const http = <T>(options: UniApp.RequestOptions) => {
  // 返回promise对象
  return new Promise<Data<T>>((resolve, reject) => {
    // 在promise内部包装一下uni.request()这个函数
    uni.request({
      ...options,
      // 服务器只要有响应，就会进入到这里面，服务器挂了或者网络失败才会进入到fail里
      // eg：我们没有token，但是调用了一个需要token的接口，也会进入到成功里
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>) // 提取核心数据res.data，uniapp里的联合类型指定成我需要的类型
        } else if (res.statusCode === 401) {
          // 401错误 -> 清理用户信息，跳转到登录页
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          // 其它错误 -> 根据后端错误信息轻提示
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '数据加载失败，请稍后',
          })
          reject(res)
        }
      },
      fail(err) {
        uni.showToast({ icon: 'none', title: '网络错误，换个网络试试' })
        reject(err)
      },
    })
  })
}

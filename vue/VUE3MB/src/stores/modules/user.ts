import type { User } from '@/types/user'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore(
  'user',
  () => {
    // 1. 用户信息
    const user = ref<User>()
    // 2. 登录成功后，保存用户信息
    const setUser = (u: User) => (user.value = u)
    // 3. 退出登录时，清空用户信息
    const delUser = () => (user.value = undefined)

    // 1. 回调地址
    const returnUrl = ref('')
    // 2. 存储回调地址
    const updateReturnUrl = (url: string) => (returnUrl.value = url)

    return { user, returnUrl, setUser, delUser, updateReturnUrl }
  },

  { persist: true }
)

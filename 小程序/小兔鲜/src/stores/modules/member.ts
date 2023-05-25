import type { LoginResult } from '@/types/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMemberStore = defineStore(
  'member',
  () => {
    const profile = ref<LoginResult>()
    const setProfile = (val: LoginResult) => {
      profile.value = val
    }
    const clearProfile = () => {
      profile.value = undefined
    }
    return { profile, setProfile, clearProfile }
  },

  {
    persist: {
      storage: {
        // 获取
        getItem(key) {
          return uni.getStorageSync(key)
        },
        // 设置
        setItem(key, value) {
          uni.setStorageSync(key, value)
        },
      },
    },
  },
)

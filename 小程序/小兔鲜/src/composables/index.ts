import type { XtxGuessInstance } from '@/types/components'
import { ref } from 'vue'

/**
 * 猜你喜欢 - 上拉加载（滚动触底）
 */
export const useGuesslist = () => {
  // 获取猜你喜欢组件实例
  const guessRef = ref<XtxGuessInstance>()
  // scroll-view组件滚动触底时触发的事件
  const onScrolltolower = () => {
    guessRef.value?.getHomeGoodsGuessLikeData()
  }

  return { guessRef, onScrolltolower }
}

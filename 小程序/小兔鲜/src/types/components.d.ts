import XtxSwiper from '@/components/XtxSwiper.vue'
import XtxGuess from '@/components/XtxGuess.vue'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XtxSwiper: typeof XtxSwiper
    XtxGuess: typeof XtxGuess
  }
}

// 获取组件实例类型，可以在ref使用时，有更好的提示
// typeof XtxGuess：获取到组件的类型
// InstanceType：ts的工具方法
export type XtxGuessInstance = InstanceType<typeof XtxGuess>

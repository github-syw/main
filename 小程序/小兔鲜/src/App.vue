<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
// 应用生命周期
onLaunch(() => {
  console.log('小程序启动时会执行 1 次')
})
onShow(() => {
  console.log('小程序处于前台运行时执行')
})
onHide(() => {
  console.log('小程序处于后台运行时执行')
})
</script>

<style lang="scss">
@import '@/styles/fonts.scss';

view,
navigator,
input,
scroll-view {
  box-sizing: border-box;
}

button::after {
  border: none;
}

swiper,
scroll-view {
  flex: 1;
  height: 100%;
  overflow: hidden;
}

image {
  width: 100%;
  height: 100%;
  vertical-align: middle;
}

// 两行省略
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>

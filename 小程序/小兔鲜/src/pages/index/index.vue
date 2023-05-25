<script setup lang="ts">
import { getHomeBannerAPI, getHomeCategoryMutliAPI, getHomeHotMutliAPI } from '@/services/home'
import CategoryPanel from './components/CategoryPanel.vue'
import type { CategoryItem, HotItem } from '@/types/home'
import PageSkeleton from './components/PageSkeleton.vue'
import CustomNavbar from './components/CustomNavbar.vue'
import HotPanel from './components/HotPanel.vue'
import type { BannerItem } from '@/types/home'
import { useGuesslist } from '@/composables'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// API - 首页-广告区域-小程序
const bannerList = ref<BannerItem[]>([])
const getHomeBannerData = async () => {
  const res = await getHomeBannerAPI()
  bannerList.value = res.result
}
// API - 首页-前台分类-小程序
const categoryList = ref<CategoryItem[]>([])
const getHomeCategoryMutliData = async () => {
  const res = await getHomeCategoryMutliAPI()
  categoryList.value = res.result
}
// API - 首页-热门推荐-小程序
const hotList = ref<HotItem[]>([])
const getHomeHotMutliData = async () => {
  const res = await getHomeHotMutliAPI()
  hotList.value = res.result
}

// HOOK - 猜你喜欢 - 上拉加载（滚动触底）
const { guessRef, onScrolltolower } = useGuesslist()

// scroll-view组件的下拉刷新事件
// 下拉刷新时，重新调用下接口方法就可以了，但是触底加载事件需要重置页码等数据
const isTriggered = ref(false) // scroll-view组件下拉刷新时，不会自动关闭，我手动关闭
const onRefresherrefresh = async () => {
  isTriggered.value = true // 请求前开始动画
  guessRef.value?.resetData() // 重置猜你喜欢数据
  // Promise.all等所有数据加载完毕，这几个请求会同时发送
  await Promise.all([
    getHomeBannerData(),
    getHomeHotMutliData(),
    getHomeCategoryMutliData(),
    guessRef.value?.getHomeGoodsGuessLikeData(),
  ])
  isTriggered.value = false // 数据加载完毕结束动画
}

// 控制骨架屏
const isLoading = ref(false)
// 页面加载时
onLoad(async () => {
  isLoading.value = true // 数据初始化前，开启骨架屏
  await Promise.all([getHomeBannerData(), getHomeHotMutliData(), getHomeCategoryMutliData()])
  isLoading.value = false // 数据加载完毕后，关闭骨架屏
})
</script>

<template>
  <!-- 导航栏 -->
  <CustomNavbar />

  <!-- 滚动容器 -->
  <scroll-view
    scroll-y
    refresher-enabled
    class="scroll-view"
    @scrolltolower="onScrolltolower"
    :refresher-triggered="isTriggered"
    @refresherrefresh="onRefresherrefresh"
  >
    <!-- 骨架屏 -->
    <PageSkeleton v-if="isLoading" />
    <template v-else>
      <!-- 轮播图 -->
      <XtxSwiper :list="bannerList" />
      <!-- 分类 -->
      <CategoryPanel :list="categoryList" />
      <!-- 热门推荐 -->
      <HotPanel :list="hotList" />
      <!-- 猜你喜欢 -->
      <XtxGuess ref="guessRef" />
    </template>
  </scroll-view>
</template>

<style lang="scss">
// 滚动容器的高度设置
page {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f7f7f7;
}

.scroll-view {
  flex: 1;
}
</style>

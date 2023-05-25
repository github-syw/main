<script setup lang="ts">
import { getHotPreferenceAPI } from '@/services/hot'
import type { SubTypeItem } from '@/types/hot'
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

// 动态设置当前页面的标题
const hotMap = [
  { type: '1', title: '特惠推荐', url: '/hot/preference' },
  { type: '2', title: '爆款推荐', url: '/hot/inVogue' },
  { type: '3', title: '一站买全', url: '/hot/oneStop' },
  { type: '4', title: '新鲜好物', url: '/hot/new' },
]
const query = defineProps<{ type: string }>()
const currUrlMap = hotMap.find((item) => item.type === query.type)
uni.setNavigationBarTitle({ title: currUrlMap!.title })

// API - 热门推荐
const bannerPic = ref('') // 推荐封面图
const subTypes = ref<(SubTypeItem & { finished?: boolean })[]>([]) // 推荐选项
const getHotPreferenceData = async () => {
  const res = await getHotPreferenceAPI(currUrlMap!.url, {
    page: import.meta.env.DEV ? 30 : 1, // 环境变量：开发环境，修改初始页码方便调试
    pageSize: 10,
  })
  bannerPic.value = res.result.bannerPicture
  subTypes.value = res.result.subTypes
}
onLoad(() => {
  getHotPreferenceData()
})

// tab栏切换，高亮下标
const activeIndex = ref(0)
// scroll-view的滚动触底
const onScrolltolower = async () => {
  const curr = subTypes.value[activeIndex.value] // 获取当前滚动的滚动容器
  // 5. 分页结束条件：page（页码） < pages（页总数） 1. 当前页码累加
  if (curr.goodsItems.page < curr.goodsItems.pages) curr.goodsItems.page++
  else {
    curr.finished = true // 给当前滚动容器标记结束
    return uni.showToast({ icon: 'none', title: '没有更多数据了~' }) // 退出并提示
  }
  // 2. 调用API传参
  const res = await getHotPreferenceAPI(currUrlMap!.url, {
    subType: curr.id, // 当前选项对应的id
    page: curr.goodsItems.page, // 当前选项对应的页码
    pageSize: curr.goodsItems.pageSize, // 每页几条
  })
  const newSubTypes = res.result.subTypes[activeIndex.value] // 3. 新的列表选项
  curr.goodsItems.items.push(...newSubTypes.goodsItems.items) // 4. 数组追加，追加到当前选项
}
</script>

<template>
  <view class="viewport">
    <!-- 推荐封面图 -->
    <view class="cover">
      <image :src="bannerPic" />
    </view>

    <!-- 推荐选项tab栏 -->
    <view class="tabs">
      <text
        class="text"
        :key="item.id"
        @tap="activeIndex = index"
        v-for="(item, index) in subTypes"
        :class="{ active: activeIndex === index }"
      >
        {{ item.title }}
      </text>
    </view>

    <!-- 推荐列表 -->
    <scroll-view
      scroll-y
      :key="item.id"
      class="scroll-view"
      v-show="activeIndex === index"
      @scrolltolower="onScrolltolower"
      v-for="(item, index) in subTypes"
    >
      <view class="goods">
        <navigator
          :key="goods.id"
          class="navigator"
          hover-class="none"
          v-for="goods in item.goodsItems.items"
          :url="`/pages/goods/goods?id=${goods.id}`"
        >
          <image class="thumb" :src="goods.picture" />
          <view class="name ellipsis">{{ goods.name }}</view>
          <view class="price">
            <text class="symbol">¥</text>
            <text class="number">{{ goods.price }}</text>
          </view>
        </navigator>
      </view>
      <view class="loading-text">{{ item.finished ? '没有更多数据了~' : '正在加载中...' }}</view>
    </scroll-view>
  </view>
</template>

<style lang="scss">
page {
  height: 100%;
  background-color: #f4f4f4;
}

.viewport {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 180rpx 0 0;
  position: relative;
}

.cover {
  width: 750rpx;
  height: 225rpx;
  border-radius: 0 0 40rpx 40rpx;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.scroll-view {
  flex: 1;
}

.tabs {
  display: flex;
  justify-content: space-evenly;
  height: 100rpx;
  line-height: 90rpx;
  margin: 0 20rpx;
  font-size: 28rpx;
  border-radius: 10rpx;
  box-shadow: 0 4rpx 5rpx rgba(200, 200, 200, 0.3);
  color: #333;
  background-color: #fff;
  position: relative;
  z-index: 9;

  .text {
    margin: 0 20rpx;
    position: relative;
  }

  .active {
    &::after {
      content: '';
      width: 40rpx;
      height: 4rpx;
      transform: translate(-50%);
      background-color: #27ba9b;
      position: absolute;
      left: 50%;
      bottom: 24rpx;
    }
  }
}

.goods {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx 20rpx;

  .navigator {
    width: 345rpx;
    padding: 20rpx;
    margin-top: 20rpx;
    border-radius: 10rpx;
    background-color: #fff;
  }

  .thumb {
    width: 305rpx;
    height: 305rpx;
  }

  .name {
    height: 88rpx;
    font-size: 26rpx;
  }

  .price {
    line-height: 1;
    color: #cf4444;
    font-size: 30rpx;
  }

  .symbol {
    font-size: 70%;
  }

  .decimal {
    font-size: 70%;
  }
}

.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0 50rpx;
}
</style>

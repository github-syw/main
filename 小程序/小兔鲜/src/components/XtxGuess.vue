<script setup lang="ts">
import { getHomeGoodsGuessLikeAPI } from '@/services/home'
import type { PageParams } from '@/types/global'
import type { GuessItem } from '@/types/home'
import { ref, onMounted } from 'vue'

// 调用接口需要传递的分页参数
// 这里的ts类型我设置成了必选，不然下面页码累加会报错
const pageParams: Required<PageParams> = {
  page: 1, // 默认值是1，所以这里写的是1，其它也行
  pageSize: 10, // 默认值是10，所以这里写的是10，其它也行
}
const finish = ref(false) // 结束标记
const guessList = ref<GuessItem[]>([]) // 接收后台返回的数据
const getHomeGoodsGuessLikeData = async () => {
  // 4. 退出判断
  if (finish.value === true) return uni.showToast({ title: '没有更多数据了~', icon: 'none' })
  // 1. 发起请求并携带分页参数
  const res = await getHomeGoodsGuessLikeAPI(pageParams)
  // 2. 因为做的是分页，所以数据是数组追加的（记得展开数组）
  guessList.value.push(...res.result.items)
  // 3. 下次触底时，再次触发了scroll-view的事件，所以页码累加，根据新的页码加载新的数据，但是页码累加是有条件的。分页条件：页码是否小于页总数
  if (pageParams.page < res.result.pages) pageParams.page++
  else finish.value = true // 大于代表没有数据了，没有数据了给个标记
}

// scroll-view下拉刷新时，需要重置触底加载的参数，因为有页码
const resetData = () => {
  pageParams.page = 1
  guessList.value = []
  finish.value = false
}

// 组件挂载完毕
onMounted(() => {
  getHomeGoodsGuessLikeData()
})
defineExpose({ getHomeGoodsGuessLikeData, resetData })
</script>

<template>
  <view class="caption">
    <text class="text">猜你喜欢</text>
  </view>

  <view class="guess">
    <navigator
      :key="item.id"
      class="guess-item"
      v-for="item in guessList"
      :url="`/pages/goods/goods?id=${item.id}`"
    >
      <image class="image" mode="aspectFill" :src="item.picture" />
      <view class="name">{{ item.name }}</view>
      <view class="price">
        <text class="small">¥</text>
        <text>{{ item.price }}</text>
      </view>
    </navigator>
  </view>

  <view class="loading-text">{{ finish ? '没有更多数据了~' : '正在加载中...' }}</view>
</template>

<style lang="scss">
:host {
  display: block;
}

/* 分类标题 */
.caption {
  display: flex;
  justify-content: center;
  line-height: 1;
  padding: 36rpx 0 40rpx;
  font-size: 32rpx;
  color: #262626;

  .text {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 28rpx 0 30rpx;

    &::before,
    &::after {
      content: '';
      width: 20rpx;
      height: 20rpx;
      background-image: url(@/static/images/bubble.png);
      background-size: contain;
      margin: 0 10rpx;
    }
  }
}

/* 猜你喜欢 */
.guess {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20rpx;

  .guess-item {
    width: 345rpx;
    padding: 24rpx 20rpx 20rpx;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
    overflow: hidden;
    background-color: #fff;
  }

  .image {
    width: 304rpx;
    height: 304rpx;
  }

  .name {
    height: 75rpx;
    margin: 10rpx 0;
    font-size: 26rpx;
    color: #262626;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .price {
    line-height: 1;
    padding-top: 4rpx;
    color: #cf4444;
    font-size: 26rpx;
  }

  .small {
    font-size: 80%;
  }
}

// 加载提示文字
.loading-text {
  text-align: center;
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 0;
}
</style>

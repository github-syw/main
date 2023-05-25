<script setup lang="ts">
import type { BannerItem } from '@/types/home'
import { ref } from 'vue'

/** list：使用此组件时，传入list，list是轮播图的数据 */
defineProps<{ list: BannerItem[] }>()

// 指示点逻辑
// 当swiper下标发生变化时触发此函数，然后动态设置activeIndex
const activeIndex = ref(0)
const onChange: UniHelper.SwiperOnChange = (e) => {
  activeIndex.value = e.detail.current
}
</script>

<template>
  <view class="carousel">
    <swiper :circular="true" :autoplay="false" :interval="3000" @change="onChange">
      <swiper-item v-for="item in list" :key="item.id">
        <navigator url="/pages/index/index" hover-class="none" class="navigator">
          <image mode="aspectFill" class="image" :src="item.imgUrl" />
        </navigator>
      </swiper-item>
    </swiper>

    <!-- 自定义的指示点，比原生好看点 -->
    <view class="indicator">
      <text
        class="dot"
        :key="item.id"
        v-for="(item, index) in list"
        :class="{ active: index === activeIndex }"
      />
    </view>
  </view>
</template>

<style lang="scss">
:host {
  display: block;
  height: 280rpx;
}

/* 轮播图 */
.carousel {
  height: 100%;
  position: relative;
  overflow: hidden;
  transform: translateY(0);
  background-color: #efefef;

  .indicator {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 16rpx;
    display: flex;
    justify-content: center;

    .dot {
      width: 30rpx;
      height: 6rpx;
      margin: 0 8rpx;
      border-radius: 6rpx;
      background-color: rgba(255, 255, 255, 0.4);
    }

    .active {
      background-color: #fff;
    }
  }

  .navigator,
  .image {
    width: 100%;
    height: 100%;
  }
}
</style>

<script setup lang="ts">
import { getUnreadMessageCountAPI } from '@/services/user'
import { onMounted } from 'vue'
import { ref } from 'vue'

const count = ref<number>()
const getUnreadMessageCount = async () => {
  try {
    const { data } = await getUnreadMessageCountAPI()
    count.value = data
  } catch (error) {
    //
  }
}
onMounted(() => {
  getUnreadMessageCount()
})
</script>

<template>
  <div class="layout-page">
    <router-view />

    <van-tabbar route>
      <van-tabbar-item to="/home">
        首页
        <template #icon="{ active }">
          <cp-icon :name="`home-index-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>

      <van-tabbar-item :badge="count || ''">
        消息通知
        <template #icon="{ active }">
          <cp-icon :name="`home-notice-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>

      <van-tabbar-item to="/user">
        我的
        <template #icon="{ active }">
          <cp-icon :name="`home-mine-${active ? 'active' : 'default'}`" />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<style lang="scss" scoped>
.layout-page {
  :deep() {
    .van-tabbar-item {
      &__icon {
        font-size: 21px;
      }

      &__text {
        font-size: 11px;
      }
    }
  }
}
</style>

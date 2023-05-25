<script setup lang="ts">
import type { ConsultType } from '@/enums'
import type { ConsultOrderItem, ConsultOrderListParams } from '@/types/consult'
import { getConsultOrderListAPI } from '@/services/consult'
import ConsultItem from './ConsultItem.vue'
import { ref } from 'vue'

const props = defineProps<{
  type: ConsultType
}>()

// 获取数据
const list = ref<ConsultOrderItem[]>([])
const loading = ref(false)
const finished = ref(false)
const params = ref<ConsultOrderListParams>({
  current: 1,
  pageSize: 5,
  type: props.type
})
// vant提供的加载更多
const onLoad = async () => {
  try {
    const res = await getConsultOrderListAPI(params.value)
    list.value.push(...res.data.rows)
    if (params.value.current < res.data.pageTotal) params.value.current++
    else finished.value = true
    loading.value = false
  } catch (error) {
    //
  }
}
// 删除订单
const onDelete = (id: string) => {
  list.value = list.value.filter((item) => item.id !== id)
}
</script>

<template>
  <div class="consult-list">
    <van-list
      v-model:loading="loading"
      finished-text="没有更多了"
      :finished="finished"
      @load="onLoad"
    >
      <consult-item
        v-for="item in list"
        :key="item.id"
        :item="item"
        @on-delete="onDelete"
      />
    </van-list>
  </div>
</template>

<style lang="scss" scoped>
.consult-list {
  padding: 10px 15px;
}
</style>

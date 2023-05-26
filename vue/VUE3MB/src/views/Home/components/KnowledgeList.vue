<template>
  <div class="knowledge-list">
    <van-list
      v-model:loading="loading"
      finished-text="没有更多了"
      :finished="finished"
      @load="onLoad"
    >
      <KnowledgeCard v-for="item in list" :key="item.id" :item="item" />
    </van-list>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { getKnowledgePageAPI } from '@/services/consult'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import KnowledgeCard from './KnowledgeCard.vue'

// 当组件滚动到底部时，会触发load事件并自动将loading设置成true，此时可以发起异步操作并更新数据
const loading = ref(false)
const finished = ref(false)
const list = ref<KnowledgeList>([])
const props = defineProps<{
  type: KnowledgeType
}>()
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 5
})
const onLoad = async () => {
  try {
    const res = await getKnowledgePageAPI(params.value)
    list.value.push(...res.data.rows)
    // 若数据已全部加载完毕，则直接将finished设置成true
    // 现在的页码 >=  后台给的最大页码，代表数据加载完毕
    if (params.value.current >= res.data.pageTotal) finished.value = true
    else params.value.current++
    // 数据更新完毕后，将loading设置成false
    loading.value = false
  } catch (error) {
    //
  } finally {
    //
  }
}
</script>

<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>

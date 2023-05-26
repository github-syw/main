<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
    @click-left="onClickLeft"
    @click-right="emit('click-right')"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()
const emit = defineEmits<{
  (e: 'click-right'): void
}>()

const onClickLeft = () => {
  if (props.back) return props.back()
  // 有访问历史记录就正常回退
  if (history.state?.back) router.back()
  // 没有访问历史记录就跳转到首页
  else router.push('/')
}
</script>

<style lang="scss" scoped>
// ::v-deep() {}
:deep() {
  .van-nav-bar {
    // &连接符
    // .van-nav-bar__arrow {}
    // .van-nav-bar__text {}
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }

    &__text {
      font-size: 15px;
    }
  }
}
</style>

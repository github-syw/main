<template>
  <svg aria-hidden="true" class="cp-icon">
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
defineProps<{
  name: string
}>()
</script>

<style lang="scss" scoped>
.cp-icon {
  // 之前用的字体图标，可以通过font-size控制大小
  // 这里是图片不可以使用font-size，但是我还是想通过font-size控制，可以用em设置
  width: 1em;
  height: 1em;
}
</style>

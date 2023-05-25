<template>
  <svg :style="{ width, height }">
    <use :xlink:href="`#icon-${name}`" />
  </svg>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    name: string
    width?: string
    height?: string
  }>(),
  {
    // 之前用的字体图标，可以通过font-size控制大小
    // 这里是图片不可以使用font-size，但是我还是想通过font-size控制，可以用em设置
    width: '1em',
    height: '1em'
  }
)
</script>

<template>
  <div class="order-detail">
    <van-cell-group>
      <van-cell title="药品金额" :value="`￥${orderPre.payment}`" />
      <van-cell title="运费" :value="`￥${orderPre.expressFee}`" />
      <van-cell title="优惠券" :value="`-￥${orderPre.couponDeduction}`" />
      <van-cell
        title="实付款"
        :value="`￥${orderPre.actualPayment}`"
        class="price"
      />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import type { OrderPre } from '@/types/order'

defineProps<{
  orderPre: OrderPre
}>()
</script>

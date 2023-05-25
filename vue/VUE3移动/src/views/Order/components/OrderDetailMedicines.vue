<template>
  <div class="order-detail">
    <van-cell-group>
      <van-cell title="药品金额" :value="`￥${order.payment}`" />
      <van-cell title="运费" :value="`￥${order.expressFee}`" />
      <van-cell title="优惠券" :value="`-￥${order.couponDeduction}`" />
      <van-cell
        title="实付款"
        :value="`￥${order.actualPayment}`"
        class="price"
      />
      <van-cell title="订单编号" :value="order.orderNo" />
      <van-cell title="创建时间" :value="order.createTime" />
      <van-cell title="支付时间" :value="order.payTime" />
      <van-cell
        title="支付方式"
        :value="order.paymentMethod === 0 ? '微信' : '支付宝'"
      />
    </van-cell-group>
  </div>
</template>

<script setup lang="ts">
import type { OrderDetail } from '@/types/order'

defineProps<{
  order: OrderDetail
}>()
</script>

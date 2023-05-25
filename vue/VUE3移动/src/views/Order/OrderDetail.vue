<template>
  <!-- 支付成功，查看订单详情页 -->
  <div class="order-detail-page" v-if="order">
    <!-- 头部 -->
    <cp-nav-bar :title="`药品订单详情-${order.statusValue}`" />
    <!-- 物流信息 -->
    <div class="order-head" v-if="order.expressInfo">
      <div class="card" @click="router.push(`/order/logistics/${order?.id}`)">
        <div class="logistics">
          <p>{{ order.expressInfo.content }}</p>
          <p>{{ order.expressInfo.time }}</p>
        </div>
        <van-icon name="arrow" />
      </div>
    </div>
    <!-- 预支付 -->
    <OrderDetailMedicines :order="order" />
    <!-- 按钮功能 -->
    <van-action-bar>
      <van-action-bar-button type="primary" text="按钮功能没做" />
    </van-action-bar>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useOrderDetail } from '@/composable'
import OrderDetailMedicines from './components/OrderDetailMedicines.vue'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// HOOK - 药品订单
const { order } = useOrderDetail(route.params.id as string)
</script>

<style lang="scss" scoped>
.order-detail-page {
  padding-top: 46px;
  padding-bottom: 65px;
}

.order-head {
  position: relative;
  padding: 15px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(
      180deg,
      rgba(44, 181, 165, 0),
      rgba(44, 181, 165, 0.2)
    );
    border-bottom-left-radius: 150px 20px;
    border-bottom-right-radius: 150px 20px;
  }

  .card {
    height: 74px;
    background-color: #fff;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: center;
    padding: 0 15px;
    box-shadow: 0px 0px 22px 0px rgba(229, 229, 229, 0.5);

    .logistics {
      flex: 1;

      p {
        &:first-child {
          color: var(--cp-primary);
        }

        &:last-child {
          color: var(--cp-tag);
          font-size: 13px;
          margin-top: 5px;
        }
      }
    }

    .van-icon {
      color: var(--cp-tip);
    }
  }
}

:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
    flex: none;
    width: 100px;
  }

  .van-cell__value {
    font-size: 16px;
  }

  &.price {
    .van-cell__value {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}

.van-action-bar {
  padding: 0 10px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

  .price {
    padding: 0 10px;

    > span {
      font-size: 18px;
      color: var(--cp-price);
    }
  }
}
</style>

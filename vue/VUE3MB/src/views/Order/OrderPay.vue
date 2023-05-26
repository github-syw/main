<template>
  <!-- 药品支付页面 -->
  <div class="order-pay-page" v-if="address && orderPre">
    <!-- 头部 -->
    <cp-nav-bar title="药品支付" />
    <!-- 地址 -->
    <div class="order-address">
      <p class="area">
        <van-icon name="location" />
        <span
          >{{ address.province }} {{ address.city }} {{ address.county }}</span
        >
      </p>
      <p class="detail">{{ address.addressDetail }}</p>
      <p>
        {{ address.receiver }}
        {{ address.mobile.replace(/^(\d{3})(?:\d{4})(\d{4})$/, '\$1****\$2') }}
      </p>
    </div>
    <!-- 假一赔十 -->
    <OrderPayMedical :medicines="orderPre.medicines" />
    <!-- 预付款 -->
    <OrderPayVanCellGroup :order-pre="orderPre" />
    <!-- 购买须知 -->
    <div class="order-tip">
      <p class="tip">
        由于药品的特殊性，如非错发、漏发药品的情况，药品一经发出，不得退换，请核对药品信息无误后下单。
      </p>
      <van-checkbox v-model="agree"
        >我已同意<a href="javascript:;">支付协议</a></van-checkbox
      >
    </div>
    <!-- 提交订单 -->
    <van-submit-bar
      :loading="loading"
      @submit="onSubmit"
      :price="orderPre.actualPayment * 100"
      button-type="primary"
      button-text="提交订单"
      text-align="left"
    />
    <CpPaySheet
      :actual-payment="orderPre.actualPayment"
      payCallback="/order/pay/result"
      v-model:show="show"
      :order-id="orderId"
    />
  </div>

  <!-- 骨架屏 -->
  <div class="order-pay-page" v-else>
    <cp-nav-bar title="药品支付" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
    <van-skeleton title :row="4" style="margin-top: 30px" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import {
  getMedicalOrderPreAPI,
  getAddressListAPI,
  createMedicalOrderAPI
} from '@/services/order'
import OrderPayVanCellGroup from './components/OrderPayVanCellGroup.vue'
import OrderPayMedical from './components/OrderPayMedical.vue'
import type { OrderPre, AddressItem } from '@/types/order'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'

const route = useRoute()

// 预支付
const orderPre = ref<OrderPre>()
const getMedicalOrderPre = async () => {
  try {
    const { data } = await getMedicalOrderPreAPI({
      prescriptionId: route.query.id as string
    })
    orderPre.value = data
  } catch (error) {
    //
  }
}
// 收货地址
const address = ref<AddressItem>()
const getAddressList = async () => {
  try {
    const res = await getAddressListAPI()
    // 如果有默认地址，用默认地址，没有用第一个
    if (res.data.length) {
      const def = res.data.find((item) => item.isDefault === 1)
      if (def) address.value = def
      else address.value = res.data[0]
    }
  } catch (error) {
    //
  }
}
onMounted(() => {
  getMedicalOrderPre()
  getAddressList()
})

// 生成订单ID
const orderId = ref('')
const loading = ref(false)
const agree = ref(false)
const show = ref(false)
const onSubmit = async () => {
  if (!agree.value) return showToast('请阅读并勾选用户支付协议')
  if (!address.value?.id) return showToast('请选择收获地址')
  // 如果已经生成订单了，就没有必要再次生成订单，没有订单是再去生成订单
  if (!orderId.value) {
    // 是否显示将按钮显示为加载中状态
    loading.value = true
    try {
      const res = await createMedicalOrderAPI({
        id: orderPre.value?.id as string,
        addressId: address.value?.id
      })
      orderId.value = res.data.id
      show.value = true
    } catch (e) {
      //
    } finally {
      loading.value = false
    }
  } else {
    show.value = true
  }
}
</script>

<style lang="scss" scoped>
:deep(.van-nav-bar) {
  background-color: var(--cp-primary);

  .van-nav-bar__arrow,
  .van-nav-bar__title {
    color: #fff;
  }
}

:deep(.van-cell) {
  .van-cell__title {
    font-size: 16px;
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

:deep(.van-submit-bar) {
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

  .van-button {
    width: 200px;
  }
}

.order-pay-page {
  padding: 46px 0 65px;
}

.order-address {
  padding: 15px 15px 0 15px;
  background-color: #fff;
  font-size: 13px;

  .area {
    color: var(--cp-tag);
    margin-bottom: 5px;

    .van-icon-location {
      color: #ff7702;
      font-size: 14px;
    }
  }

  .detail {
    font-size: 17px;
    margin-bottom: 5px;
  }

  &::after {
    content: '';
    display: block;
    height: 12px;
    background-color: var(--cp-bg);
    margin: 0 -15px;
    margin-top: 15px;
  }
}

.order-tip {
  padding: 0 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 10px;

  .tip {
    font-size: 12px;
    color: var(--cp-tag);
    width: 100%;

    &::before {
      content: '*';
      color: var(--cp-price);
      font-size: 14px;
    }

    margin-bottom: 30px;
  }

  .van-checkbox {
    a {
      color: var(--cp-primary);
    }
  }
}

:deep(.van-submit-bar) {
  .van-button {
    width: 120px;
    height: 30px;
  }

  .van-button__text {
    font-size: 14px;
  }
}
</style>

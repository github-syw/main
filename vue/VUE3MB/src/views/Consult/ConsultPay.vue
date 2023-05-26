<template>
  <div class="consult-pay-page" v-if="payInfo && patient">
    <cp-nav-bar title="支付" />
    <van-cell-group>
      <van-cell title="优惠券" :value="`-¥${payInfo.couponDeduction}`" />
      <van-cell title="积分抵扣" :value="`-¥${payInfo.pointDeduction}`" />
      <van-cell
        title="实付款"
        :value="`¥${payInfo.actualPayment}`"
        class="pay-price"
      />
    </van-cell-group>
    <div class="pay-space"></div>
    <van-cell-group>
      <van-cell
        title="患者信息"
        :value="`${patient?.name} | ${patient?.genderValue} | ${patient?.age}岁`"
      />
      <van-cell title="病情描述" :label="store.consult.illnessDesc" />
    </van-cell-group>
    <div class="pay-schema">
      <van-checkbox v-model="agree"
        >我已同意 <span class="text">支付协议</span></van-checkbox
      >
    </div>
    <van-submit-bar
      @click="submit"
      :loading="loading"
      button-type="primary"
      :price="payInfo.actualPayment * 100"
      button-text="立即支付"
      text-align="left"
    />
    <CpPaySheet
      :order-id="orderId"
      v-model:show="show"
      :on-close="onClose"
      pay-callback="/room"
      :actual-payment="payInfo.actualPayment"
    />
  </div>
  <div class="consult-pay-page" v-else>
    <van-skeleton title :row="4" />
    <van-skeleton title :row="4" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useConsultStore } from '@/stores'
import {
  getPatientDetailAPI,
  createConsultOrderAPI,
  getCounsultOrderPreAPI
} from '@/services/consult'
import { showConfirmDialog, showDialog, showToast } from 'vant'
import type { ConsultOrderPreData, PartialConsult } from '@/types/consult'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import type { Patient } from '@/types/user'

const store = useConsultStore()
const router = useRouter()

// 预支付信息
const payInfo = ref<ConsultOrderPreData>()
const loadPayInfo = async () => {
  const res = await getCounsultOrderPreAPI({
    type: store.consult.type,
    illnessType: store.consult.illnessType
  })
  payInfo.value = res.data
  store.setCoupon(res.data.couponId)
}
// 患者详情
const patient = ref<Patient>()
const loadPatient = async () => {
  if (store.consult.patientId) {
    const { data } = await getPatientDetailAPI(store.consult.patientId)
    patient.value = data
  }
}

type Key = keyof PartialConsult
onMounted(() => {
  // 点击立即支付，生成了订单ID，清空了store中的数据，然后在当前页面刷新，会报错
  // 防止在当前页面刷新，问诊记录已经被清空，组件初始化需要校验
  const validKeys: Key[] = [
    'type',
    'illnessType',
    'depId',
    'illnessDesc',
    'illnessTime',
    'consultFlag',
    'patientId'
  ]
  const valid = validKeys.every((item) => store.consult[item] !== undefined)
  if (!valid) {
    return showDialog({
      title: '温馨提示',
      message:
        '问诊信息不完整请重新填写，如有未支付的问诊订单可在问诊记录中继续支付',
      closeOnPopstate: false
    })
      .then(() => {
        router.push('/')
      })
      .catch(() => {})
  }
  loadPayInfo()
  loadPatient()
})

// 生成订单ID，记录订单ID，清空pinia，打开支付面板
const agree = ref(false)
const loading = ref(false)
const show = ref(false)
const orderId = ref('')
const submit = async () => {
  if (!agree.value) return showToast('请阅读并勾选我已同意支付协议')
  loading.value = true
  const { data } = await createConsultOrderAPI(store.consult)
  orderId.value = data.id
  loading.value = false
  store.clear()
  show.value = true
}
// 引导用户
const onClose = () => {
  return showConfirmDialog({
    title: '温馨提示',
    message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
    cancelButtonText: '仍要关闭',
    confirmButtonText: '继续支付'
  })
    .then(() => {
      return false
    })
    .catch(() => {
      orderId.value = ''
      router.push('/user/consult')
      return true
    })
}
// 不管是浏览器的回退按钮，还是自己的回退按钮，都是在操作路由
onBeforeRouteLeave(() => {
  // 有了订单iD就不让回退，引导用户
  if (orderId.value) return false
})
</script>

<style lang="scss" scoped>
.consult-pay-page {
  padding: 46px 0 50px 0;
}

.pay-info {
  display: flex;
  padding: 15px;
  flex-wrap: wrap;
  align-items: center;

  .tit {
    width: 100%;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .img {
    margin-right: 10px;
    width: 38px;
    height: 38px;
    border-radius: 4px;
    overflow: hidden;
  }

  .desc {
    flex: 1;

    > span {
      display: block;
      color: var(--cp-tag);

      &:first-child {
        font-size: 16px;
        color: var(--cp-text2);
      }
    }
  }
}

.pay-price {
  ::v-deep() {
    .vam-cell__title {
      font-size: 16px;
    }

    .van-cell__value {
      font-size: 16px;
      color: var(--cp-price);
    }
  }
}

.pay-space {
  height: 12px;
  background-color: var(--cp-bg);
}

.pay-schema {
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  .text {
    color: var(--cp-primary);
  }
}

::v-deep() {
  .van-submit-bar__button {
    font-weight: normal;
    width: 160px;
  }
}
</style>

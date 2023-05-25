import { onMounted, onUnmounted, ref, type Ref } from 'vue'
import { showImagePreview, showToast, type FormInstance } from 'vant'
import {
  cancelOrderAPI,
  deleteOrderAPI,
  followDoctorAPI,
  getPrescriptionPicAPI
} from '@/services/consult'
import type { ConsultOrderItem, FollowType } from '@/types/consult'
import { getMedicalOrderDetailAPI } from '@/services/order'
import { sendMobileCodeAPI } from '@/services/user'
import type { OrderDetail } from '@/types/order'
import type { CodeType } from '@/types/user'
import { OrderType } from '@/enums'

// 关注｜取消关注用的同一个接口
export const useFollow = (type: FollowType = 'doc') => {
  const loading = ref(false)
  const follow = async (obj: { id: string; likeFlag: 0 | 1 }) => {
    loading.value = true
    try {
      await followDoctorAPI(type, obj.id)
      // 请求成功后，后端的数据改了，前端也要修改
      obj.likeFlag = obj.likeFlag === 1 ? 0 : 1
    } catch (error) {
      //
    } finally {
      loading.value = false
    }
  }
  return { loading, follow }
}

// 查看处方
export const useShowPrescription = () => {
  const showPrescription = async (id?: string) => {
    if (id) {
      try {
        const {
          data: { url }
        } = await getPrescriptionPicAPI(id)
        showImagePreview([url])
      } catch (error) {
        //
      }
    }
  }
  return { showPrescription }
}

// 取消问诊(订单)
export const useCancelOrder = () => {
  const loadig = ref(false)
  const cancelConsultOrder = async (item: ConsultOrderItem) => {
    loadig.value = true
    try {
      await cancelOrderAPI(item.id)
      item.status = OrderType.ConsultCancel
      item.statusValue = '已取消'
      showToast('取消成功')
    } catch (error) {
      showToast('取消失败')
    } finally {
      loadig.value = false
    }
  }
  return { loadig, cancelConsultOrder }
}

// 删除订单
export const useDeleteOrder = (cb: (id: string) => void) => {
  const loading = ref(false)
  const deleteConsultOrder = async (item: ConsultOrderItem) => {
    loading.value = true
    try {
      await deleteOrderAPI(item.id)
      if (cb) cb(item.id)
      showToast('删除成功')
    } catch (error) {
      showToast('删除失败')
    } finally {
      loading.value = false
    }
  }
  return { loading, deleteConsultOrder }
}

// 药品订单
export const useOrderDetail = (id: string) => {
  const order = ref<OrderDetail>()
  const loading = ref(false)
  onMounted(async () => {
    loading.value = true
    try {
      const res = await getMedicalOrderDetailAPI(id)
      order.value = res.data
    } catch (e) {
      //
    } finally {
      loading.value = false
    }
  })
  return { order, loading }
}

// 发送验证码
export const useMobileCode = (mobile: Ref<string>, type: CodeType) => {
  // 定时器
  let timeId: number
  // 表单
  const form = ref<FormInstance>()
  // 倒计时时间
  const time = ref(0)
  // 发送验证码点击事件
  const send = async () => {
    if (time.value > 0) return // 倒计时大于0，说明正在倒计时，就return
    try {
      await form.value?.validate('mobile') // 校验手机号
      await sendMobileCodeAPI(mobile.value, type) // 校验通过，发送http请求
      showToast('发送成功') // 提示用户
      time.value = 60 // 发送成功开启倒计时
      if (timeId) clearInterval(timeId) // 开启定时器之前清理定时器
      // 开启倒计时
      timeId = setInterval(() => {
        time.value--
        if (time.value <= 0) clearInterval(timeId) // 倒计时结束，清理定时器
      }, 1000)
    } catch (error) {
      //
    }
  }
  onUnmounted(() => {
    clearInterval(timeId) // 组件销毁时，清理定时器
  })
  return { time, form, send }
}

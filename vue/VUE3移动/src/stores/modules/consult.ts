import type { ConsultType } from '@/enums'
import type { ConsultIllness, PartialConsult } from '@/types/consult'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConsultStore = defineStore(
  'consult',
  () => {
    const consult = ref<PartialConsult>({})

    // 就诊类型
    const setType = (type: ConsultType) => (consult.value.type = type)
    // 极速问诊类型
    const setIllnessType = (illnessType: 0 | 1) =>
      (consult.value.illnessType = illnessType)
    // 选择的科室
    const setDep = (depId: string) => (consult.value.depId = depId)
    // 记录病情
    const setIllness = (illness: ConsultIllness) => {
      consult.value.illnessDesc = illness.illnessDesc
      consult.value.illnessTime = illness.illnessTime
      consult.value.consultFlag = illness.consultFlag
      consult.value.pictures = illness.pictures
    }
    // 患者id
    const setPatient = (patientId: string) =>
      (consult.value.patientId = patientId)
    // 优惠券
    const setCoupon = (couponId: string) => (consult.value.couponId = couponId)

    // 清空数据
    const clear = () => (consult.value = {})

    return {
      consult,
      setDep,
      setType,
      setIllnessType,
      setIllness,
      setPatient,
      setCoupon,
      clear
    }
  },

  { persist: true }
)

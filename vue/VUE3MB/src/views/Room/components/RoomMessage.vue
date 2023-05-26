<script setup lang="ts">
import { useShowPrescription } from '@/composable'
import { MsgType, PrescriptionStatus } from '@/enums'
import type { Message, Prescription } from '@/types/room'
import {
  getIllnessTimeText,
  getConsultFlagText,
  onPreviewImage,
  formatTime
} from '@/utils/filter'
import RoomComment from './RoomComment.vue'
import { useUserStore } from '@/stores'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'

const store = useUserStore()
const router = useRouter()

defineProps<{
  list: Message[]
}>()

// HOOK - 原始处方
const { showPrescription } = useShowPrescription()

// 购买药品
// pre：处方信息
const buy = (pre?: Prescription) => {
  if (!pre) return
  if (pre.status === PrescriptionStatus.Invalid) return showToast('处方已失效')
  if (pre.status === PrescriptionStatus.NotPayment && !pre.orderId)
    return router.push(`/order/pay?id=${pre.id}`)
  router.push(`/order/${pre.orderId}`)
}
</script>

<template>
  <template
    v-for="{ createTime, msgType, toAvatar, from, msg, id } in list"
    :key="id"
  >
    <!-- 患者卡片 -->
    <div class="msg msg-illness" v-if="msgType === MsgType.CardPat">
      <div class="patient van-hairline--bottom">
        <p>
          {{ msg.consultRecord?.patientInfo.name }}
          {{ msg.consultRecord?.patientInfo.genderValue }}
          {{ msg.consultRecord?.patientInfo.age }}岁
        </p>
        <p>
          {{ getIllnessTimeText(msg.consultRecord?.illnessTime) }}|
          {{ getConsultFlagText(msg.consultRecord?.consultFlag) }}
        </p>
      </div>
      <van-row>
        <van-col span="6">病情描述</van-col>
        <van-col span="18">{{ msg.consultRecord?.illnessDesc }}</van-col>
        <van-col span="6">图片</van-col>
        <van-col span="18" @click="onPreviewImage(msg.consultRecord?.pictures)"
          >点击查看</van-col
        >
      </van-row>
    </div>
    <!-- 普通通知 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.Notify">
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 温馨提示 -->
    <div class="msg msg-tip" v-if="msgType === MsgType.NotifyTip">
      <div class="content">
        <span class="green">温馨提示：</span>
        <span>{{ msg.content }}</span>
      </div>
    </div>

    <!-- 我发送的文字 -->
    <div
      class="msg msg-to"
      v-if="msgType === MsgType.MsgText && store.user?.id === from"
    >
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 医生发送的文字 -->
    <div
      class="msg msg-from"
      v-if="msgType === MsgType.MsgText && store.user?.id !== from"
    >
      <van-image :src="toAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <div class="pao">{{ msg.content }}</div>
      </div>
    </div>
    <!-- 我发送的图片 -->
    <div
      class="msg msg-to"
      v-if="msgType === MsgType.MsgImage && store.user?.id === from"
    >
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
      <van-image :src="store.user?.avatar" />
    </div>
    <!-- 医生发送的图片 -->
    <div
      class="msg msg-from"
      v-if="msgType === MsgType.MsgImage && store.user?.id !== from"
    >
      <van-image :src="toAvatar" />
      <div class="content">
        <div class="time">{{ formatTime(createTime) }}</div>
        <van-image fit="contain" :src="msg.picture?.url" />
      </div>
    </div>

    <!-- 处方 -->
    <div class="msg msg-recipe" v-if="msgType === MsgType.CardPre">
      <div class="content">
        <div class="head van-hairline--bottom">
          <div class="head-tit">
            <h3>电子处方</h3>
            <p @click="showPrescription(msg.prescription?.id)">
              查看处方<van-icon name="arrow" />
            </p>
          </div>
          <p>
            {{ msg.prescription?.name }} {{ msg.prescription?.genderValue }}
            {{ msg.prescription?.age }}岁
            {{ msg.prescription?.diagnosis }}
          </p>
          <p>开方时间：{{ msg.prescription?.createTime }}</p>
        </div>
        <div class="body">
          <div
            class="body-item"
            v-for="med in msg.prescription?.medicines"
            :key="med.id"
          >
            <div class="durg">
              <p>{{ med.name }} {{ med.specs }}</p>
              <p>{{ med.usageDosag }}</p>
            </div>
            <div class="num">x{{ med.quantity }}</div>
          </div>
        </div>
        <div class="foot" @click="buy(msg.prescription)">
          <span>购买药品</span>
        </div>
      </div>
    </div>
    <!-- 医生关闭问诊室 -->
    <div
      class="msg msg-tip msg-tip-cancel"
      v-if="msgType === MsgType.NotifyCancel"
    >
      <div class="content">
        <span>{{ msg.content }}</span>
      </div>
    </div>
    <!-- 评论 -->
    <div
      class="msg msg-comment"
      v-if="msgType === MsgType.CardEva || msgType === MsgType.CardEvaForm"
    >
      <RoomComment :evaluateDoc="msg.evaluateDoc" />
    </div>
  </template>
</template>

<style lang="scss" scoped>
@import '@/styles/room.scss';
</style>

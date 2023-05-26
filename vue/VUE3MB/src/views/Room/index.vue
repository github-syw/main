<script setup lang="ts">
import RoomStatus from './components/RoomStatus.vue'
import RoomAction from './components/RoomAction.vue'
import RoomMessage from './components/RoomMessage.vue'
import { getConsultOrderDetailAPI } from '@/services/consult'
import type { ConsultOrderItem, Image } from '@/types/consult'
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import type { Message, TimeMessages } from '@/types/room'
import type { Socket } from 'socket.io-client'
import { MsgType, OrderType } from '@/enums'
import { baseURL } from '@/utils/request'
import { useUserStore } from '@/stores'
import { io } from 'socket.io-client'
import { useRoute } from 'vue-router'
import { showToast } from 'vant'
import dayjs from 'dayjs'

const store = useUserStore()
const route = useRoute()

onUnmounted(() => {
  socket.close()
})

// 问诊-查询订单详情信息-找医生、极速问诊和开药问诊
const consult = ref<ConsultOrderItem>()
const getConsultOrderDetail = async () => {
  const res = await getConsultOrderDetailAPI(route.query.orderId as string)
  consult.value = res.data
}
onMounted(() => {
  getConsultOrderDetail()
})

const list = ref<Message[]>([])
const initialMsg = ref(true)
const loading = ref(false)
let socket: Socket
onMounted(() => {
  // 建立连接
  socket = io(baseURL, {
    auth: { token: `Bearer ${store.user?.token}` },
    query: { orderId: route.query.orderId }
  })
  // 连接成功，再次连接socket时，清空数组，避免有重复的数据，是个好习惯
  socket.on('connect', () => (list.value = []))
  socket.on('error', () => {}) // 连接失败
  socket.on('disconnect', () => {}) // 断开链接
  // 接收消息
  socket.on('chatMsgList', ({ data }: { data: TimeMessages[] }) => {
    const arr: Message[] = []
    data.forEach((item, i) => {
      // 记录消息分组第一组的时间，作为下次获取聊天记录的时间
      if (i === 0) time.value = item.createTime
      arr.push({
        id: item.createTime,
        msgType: MsgType.Notify,
        createTime: item.createTime,
        msg: { content: item.createTime }
      })
      arr.push(...item.items)
    })
    list.value.unshift(...arr)
    // loading是vant组件的下拉刷新，数据加载完设置为false
    loading.value = false
    if (!data.length) showToast('没有更多聊天记录了')
    if (initialMsg.value) {
      // 一进入页面就把消息设置为已读
      socket.emit('updateMsgStatus', arr[arr.length - 1].id)
      // 第一次需要滚动到最底部，上拉刷新不需要滚动到最底部
      nextTick(() => {
        window.scrollTo(0, document.body.scrollHeight)
        initialMsg.value = false
      })
    }
  })

  // 监听订单状态变化
  socket.on('statusChange', () => getConsultOrderDetail())
  // 接收聊天消息
  socket.on('receiveChatMsg', (e) => {
    // 每收到一条消息也需要把消息设置为已读
    socket.emit('updateMsgStatus', e.id)
    list.value.push(e)
    // 等页面渲染完之后再操作dom
    nextTick(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
  })
})

// 发送文字
const sendText = (text: string) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgText,
    msg: { content: text }
  })
}
// 发送图片
const sendImage = (img: Image) => {
  socket.emit('sendChatMsg', {
    from: store.user?.id,
    to: consult.value?.docInfo?.id,
    msgType: MsgType.MsgImage,
    msg: { picture: img }
  })
}

// 聊天记录：根据vant的组件做的下拉刷新
const time = ref(dayjs().format('YYYY-MM-DD HH:mm:ss')) // 先用当前时间
const onRefresh = () =>
  socket.emit('getChatMsgList', 2, time.value, consult.value?.id)

// 提供给评论组件用
const completeEva = (score: number) => {
  const target = list.value.find((item) => item.msgType === MsgType.CardEvaForm)
  if (target) {
    target.msg.evaluateDoc = { score }
    target.msgType = MsgType.CardEva
  }
}
provide('consult', consult)
provide('completeEva', completeEva)
</script>

<template>
  <div class="room-page">
    <cp-nav-bar title="问诊室" />
    <room-status :status="consult?.status" :countdown="consult?.countdown" />
    <van-pull-refresh v-model="loading" @refresh="onRefresh">
      <room-message :list="list" />
    </van-pull-refresh>
    <room-action
      @send-text="sendText"
      @send-image="sendImage"
      :disabled="consult?.status !== OrderType.ConsultChat"
    />
  </div>
</template>

<style scoped lang="scss">
.room-page {
  padding-top: 90px;
  padding-bottom: 60px;
  min-height: 100vh;
  box-sizing: border-box;
  background-color: var(--cp-bg);

  .van-pull-refresh {
    width: 100%;
    min-height: calc(100vh - 150vh);
  }
}
</style>

import { timeOptions, flagOptions } from '@/services/constants'
import { showImagePreview, showToast } from 'vant'
import type { Image } from '@/types/consult'
import type { IllnessTime } from '@/enums'
import dayjs from 'dayjs'

// 患病时长
export const getIllnessTimeText = (time?: IllnessTime) =>
  timeOptions.find((item) => item.value === time)?.label
// 就诊情况
export const getConsultFlagText = (flag?: 0 | 1) =>
  flagOptions.find((item) => item.value === flag)?.label
// 预览图片
export const onPreviewImage = (pic?: Image[]) => {
  if (pic && pic.length) showImagePreview(pic.map((item) => item.url))
  else showToast('暂无图片')
}
// 格式化日期
export const formatTime = (time: string) => dayjs(time).format('HH:mm:ss')
// 图片加载需要时间，刚开始发送图片会显示在底部，但是不会完全显示，所以需要等图片加载完了之后，在去重新滚到底部
// 但是在聊天记录里，又有一个问题，上拉加载更多时，如果聊天记录里有图片，也会触发这个函数，我的本意是不想在上拉加载时触发
export const load = (notScroll?: boolean) => {
  // 判断聊天记录的是图片，就不滚动
  if (notScroll === true) return
  window.scrollTo(0, document.body.scrollHeight)
}

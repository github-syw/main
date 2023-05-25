import CpIcon from '@/components/CpIcon.vue'
import CpNavBar from '@/components/CpNavBar.vue'
import CpRadioBtn from '@/components/CpRadioBtn.vue'
import CpConsultMore from '@/components/CpConsultMore.vue'
import CpPaySheet from '@/components/CpPaySheet.vue'

declare module 'vue' {
  interface GlobalComponents {
    CpIcon: typeof CpIcon
    CpRadioBtn: typeof CpRadioBtn
    CpConsultMore: typeof CpConsultMore
    CpPaySheet: typeof CpPaySheet
    CpNavBar: typeof CpNavBar
  }
}

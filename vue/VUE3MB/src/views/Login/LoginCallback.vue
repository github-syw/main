<template>
  <div class="login-page" v-if="isBind">
    <cp-nav-bar title="手机绑定" />
    <van-form autocomplete="off" ref="form" @submit="bind">
      <van-field
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
        v-model="mobile"
      />
      <van-field
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
        v-model="code"
      >
        <template #button>
          <span class="btn-send" @click="send" :class="{ active: time > 0 }">
            {{ time > 0 ? `${time}s后再次发送` : '发送验证码' }}
          </span>
        </template>
      </van-field>
      <div class="cp-cell">
        <van-button block type="primary" native-type="submit" size="small"
          >立即绑定</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mobileRules, codeRules } from '@/utils/rules'
import { bindMobileAPI, loginByQQAPI } from '@/services/user'
import { useMobileCode } from '@/composable'
import type { User } from '@/types/user'
import { showSuccessToast } from 'vant'
import { useUserStore } from '@/stores'
const store = useUserStore()
const router = useRouter()

const openId = ref('')
const isBind = ref(false)
onMounted(() => {
  /* global QC */
  if (QC.Login.check()) {
    QC.Login.getMe((id) => {
      openId.value = id
      loginByQQAPI(id)
        .then((res) => {
          // 登录成功，用户已经绑定qq，不可以看到此页面
          loginSuccess(res)
        })
        .catch(() => {
          // 登录失败，用户没有绑定过qq，可以看到此页面
          isBind.value = true
        })
    })
  }
})

// 绑定手机号
const code = ref('')
const mobile = ref('')
const bind = async () => {
  try {
    const res = await bindMobileAPI({
      code: code.value,
      mobile: mobile.value,
      openId: openId.value
    })
    loginSuccess(res)
  } catch (error) {
    //
  }
}

// 成功的逻辑封装成了一个函数
const loginSuccess = (res: { data: User }) => {
  store.setUser(res.data)
  router.replace(store.returnUrl || '/home')
  store.updateReturnUrl('')
  showSuccessToast('登录成功')
}

// HOOk - 验证码
const { time, form, send } = useMobileCode(mobile, 'bindMobile')
</script>

<style lang="scss" scoped>
@import '@/styles/login.scss';
</style>

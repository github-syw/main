<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <el-card class="login-card">
        <h1>登录</h1>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules">

          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" type="text" />
          </el-form-item>

          <el-form-item prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" type="password" />
          </el-form-item>

          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">用户平台使用协议</el-checkbox>
          </el-form-item>

          <el-button :loading="loading" type="primary" style="width:350px;" @click="handleLogin">
            登录
          </el-button>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { validMobile } from '@/utils/validate'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: '13800000002',
        password: '123456',
        isAgree: false
      },
      loginRules: {
        mobile: [
          // trigger校验的触发方式只有两个选项blur/change
          { required: true, trigger: 'blur', message: '手机号不能为空' },
          // rule校验规则；value校验的值；callback函数。
          { validator: (rule, value, callback) => { validMobile(value) ? callback() : callback(new Error('手机号格式不正确')) }, trigger: 'blur' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' },
          { trigger: 'blur', min: 6, max: 16, message: '密码长度为6-16位之间' }
        ],
        isAgree: [
          { validator: (rule, value, callback) => { value ? callback() : callback(new Error('请阅读并勾选用户协议')) } }
        ]
      },
      loading: false
    }
  },

  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async isOK => {
        if (isOK) {
          try {
            this.loading = true
            await this.$store.dispatch('user/login', this.loginForm)
            this.$message.success('登录成功')
            // 怎么拿到退出登录时（主动和被动），回传的登录未遂的地址
            // this.$route.query，vue-router内会把？后面参数字符串转成对象，挂在query属性上
            // 前面有地址就跳转回登录未遂地址，没有证明就是第一次登录，就用后面的地址，跳转到首页
            // decodeURIComponent(this.$route.query.redirect) 编码解码这里用不用都行
            this.$router.replace(this.$route.query.redirect || '/')
          } catch (error) {
          } finally {
            this.loading = false
          }
        }
      })
    }
  }
}
</script>

<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;

  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png) no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;

    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center / contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }

    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }

  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;

    .el-card {
      border: none;
      padding: 0;
    }

    h1 {
      padding-left: 20px;
      font-size: 24px;
    }

    .el-input {
      width: 350px;
      height: 44px;

      .el-input__inner {
        background: #f4f5fb;
      }
    }

    .el-checkbox {
      color: #606266;
    }
  }
}
</style>

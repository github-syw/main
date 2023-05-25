import validate from "wechat-validate"
const app = getApp()

Page({
  data: {
    code: "",
    mobile: "",
    countDownVisible: false, // 控制倒计时是否显示
  },
  onLoad({ redirectURL }) {
    this.redirectURL = redirectURL
  },

  // 表单校验
  behaviors: [validate],
  rules: {
    mobile: [
      { required: true, message: "请填写手机号码!" },
      { pattern: /^1[3-8]\d{9}$/, message: "请检查手机号码是否正确!" },
    ],
    code: [
      { required: true, message: "请填写短信验证码!" },
      { pattern: /^\d{6}$/, message: "请检查短信验证码是否正确!" },
    ],
  },

  // 获取验证码
  async getCode() {
    // 校验手机号
    const { valid, message } = this.validate("mobile")
    if (!valid) return wx.utils.toast(message)
    // 显示倒计时组件
    this.setData({ countDownVisible: true })
    // API - 登录-发送验证码
    const { code } = await wx.http.get("/code", { mobile: this.data.mobile })
    if (code !== 10000) return wx.utils.toast("发送失败，请稍后重试！")
  },
  // vant：倒计时结束时触发
  onFinish() {
    this.setData({ countDownVisible: false })
  },

  // 登录
  async onLogin() {
    // 表单整体校验
    const isAllValid = this.validate()
    if (!isAllValid) return
    // API - 登录-手机号+验证码登录
    const { code, data } = await wx.http.post("/login", { mobile: this.data.mobile, code: this.data.code })
    if (code !== 10000) return wx.utils.toast("登录失败，请稍后重试！")
    app.setToken("token", data.token)
    app.setToken("refreshToken", data.refreshToken)
    wx.redirectTo({ url: this.redirectURL })
  },
})

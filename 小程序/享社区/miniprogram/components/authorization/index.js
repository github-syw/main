const app = getApp()

Component({
  data: {
    isLogin: false,
  },

  lifetimes: {
    attached() {
      // 检查用户是否登录
      const isLogin = !!app.token
      this.setData({ isLogin })
      const { route } = getCurrentPages().pop()
      if (!isLogin) wx.redirectTo({ url: "/pages/login/index?redirectURL=/" + route })
    },
  },
})

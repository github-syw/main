import "./utils/utils"
import "./utils/http"

App({
  onLaunch() {
    this.getToken()
  },

  getToken() {
    this.token = wx.getStorageSync("token")
  },
  setToken(key, token) {
    wx.setStorageSync(key, token)
    this[key] = token
  },
})

wx.utils = {
  /**
   * 消息提示框(轻提示)
   * @param {string} title 文字提示内容
   */
  toast(title = "网络错误，请稍后") {
    wx.showToast({ title, mask: true, icon: "none" })
  },
}

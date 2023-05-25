Page({
  data: {
    notices: [],
  },
  onLoad() {
    this.getNotices()
  },
  async getNotices() {
    // API - 社区公告列表
    const { code, data: notices } = await wx.http.get("/announcement")
    if (code !== 10000) return wx.utils.toast()
    this.setData({ notices })
  },
})

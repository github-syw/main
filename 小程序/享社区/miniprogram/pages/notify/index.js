Page({
  data: {
    noticeDetail: {},
  },
  onLoad({ id }) {
    this.getNoticeDetail(id)
  },
  // API - 社区公告详情
  async getNoticeDetail(id) {
    if (!id) return
    const { code, data: noticeDetail } = await wx.http.get(`/announcement/${id}`)
    if (code !== 10000) return wx.utils.toast()
    this.setData({ noticeDetail })
  },
})

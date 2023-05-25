import http from "wechat-http"

http.baseURL = "https://live-api.itheima.net" // 基础路径
http.intercept.response = ({ data }) => data // 响应拦截器

wx.http = http

import Mock from 'mockjs'
import qs from 'qs'

Mock.setup({
  timeout: '500-1000'
})
Mock.mock(/\/patient\/message\/sys\/list/, 'get', (config) => {
  const params = qs.parse(config.url.split('?')[1])
  const items = []
  for (let i = 0; i < Number(params.pageSize); i++) {
    items.push(
      Mock.mock({
        id: '@id',
        name: '@ctitle(10,20)',
        desc: '@ctitle(4,10)',
        price: '@float(100,200,2,2 )',
        picture: '@image(300X200)'
      })
    )
  }

  return {
    msg: 'mock数据成功',
    code: 10000,
    result: {
      counts: 30, // 总数
      pageSize: Number(params.pageSize), // 一页几条数据
      page: Number(params.page), // 页码
      items
    }
  }
})

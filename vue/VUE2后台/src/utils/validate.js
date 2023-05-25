// 判断传入path是否为外部链接地址
export const isExternal = path => /^(https?:|mailto:|tel:)/.test(path)

// 正则校验手机号
export const validMobile = str => /^1[3-9]\d{9}$/.test(str)

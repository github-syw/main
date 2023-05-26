/** 用户信息 */
export type User = {
  /** token令牌 */
  token: string
  /** 用户ID */
  id: string
  /** 用户名称 */
  account: string
  /** 手机号 */
  mobile: string
  /** 头像 */
  avatar: string
}

/** 短信验证码类型，登录|注册|修改手机号|忘记密码|绑定手机号 */
export type CodeType =
  | 'login'
  | 'register'
  | 'changeMobile'
  | 'forgetPassword'
  | 'bindMobile'

/** 用户信息 */
type OmitUser = Omit<User, 'token'>
export type UserInfo = OmitUser & {
  /** 关注 */
  likeNumber: number
  /** 收藏 */
  collectionNumber: number
  /** 积分 */
  score: number
  /** 优惠券 */
  couponNumber: number
  orderInfo: {
    /** 待付款 */
    paidNumber: number
    /** 待发货 */
    receivedNumber: number
    /** 待收货 */
    shippedNumber: number
    /** 已完成 */
    finishedNumber: number
  }
}

/** 问诊-查询患者列表信息/家庭档案-患者信息 */
export type Patient = {
  name: string // 患者名称
  idCard: string // 身份证号
  defaultFlag: 0 | 1 // 0不默认1默认
  gender: 0 | 1 // 0女1男
  genderValue?: string // 性别文字
  age?: number // 年龄
  id?: string // 患者ID
}

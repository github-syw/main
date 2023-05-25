import { request } from '@/utils/request'

type Params = {
  page: number
  pageSize: number
  collectType: number
}
export const getMockAPI = (data: Params) =>
  request('/member/collect', 'get', data)

import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/config/list',
    method: 'get',
    params
  })
}
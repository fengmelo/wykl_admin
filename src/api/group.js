import request from '@/utils/request'
import Qs from 'qs'

export function getGroup(params) {
  return request({
    url: '/group/list',
    method: 'get',
    params
  })
}
export function addGroup(data) {
  return request({
    url: '/group/add',
    method: 'post',
    data: Qs.stringify(data)
  })
}


export function editGroup(data) {
  return request({
    url: '/group/edit',
    method: 'post',
    data: Qs.stringify(data)
  })
}


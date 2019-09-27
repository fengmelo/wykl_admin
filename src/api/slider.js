import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/slider/list',
    method: 'get',
    params
  })
}
export function createSlider(data) {
  return request({
    url: '/slider/create',
    method: 'post',
    data
  })
}
export function editSlider(data) {
  return request({
    url: '/slider/edit',
    method: 'post',
    data
  })
}

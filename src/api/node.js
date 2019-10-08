import request from '@/utils/request'
import Qs from 'qs'

export function getNode(params) {
  return request({
    url: '/node/list',
    method: 'get',
    params
  })
}

export function getNodeTree(params) {
  return request({
    url: '/node/tree',
    method: 'get',
    params
  })
}

export function addNode(data) {
  return request({
    url: '/node/add',
    method: 'post',
    data: Qs.stringify(data)
  })
}


export function editNode(data) {
  return request({
    url: '/node/edit',
    method: 'post',
    data: Qs.stringify(data)
  })
}


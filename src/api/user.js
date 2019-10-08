import request from '@/utils/request'
import Qs from 'qs'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function getUser(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params
  })
}
export function addUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data: Qs.stringify(data)
  })
}


export function editUser(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data: Qs.stringify(data)
  })
}



export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

import request from '@/utils/request'
import Qs from 'qs'
import {
	MessageBox,
	Message
} from 'element-ui'

export function createProduct(data) {
	return request({
		url: '/product/create',
		method: 'post',
		data: Qs.stringify(data)
	})
}

export function editProduct(data) {
	return request({
		url: '/product/edit',
		method: 'post',
		data: Qs.stringify(data)
	})
}

export function handleProduct(data) {
	return request({
		url: '/product/handle',
		method: 'post',
		data: Qs.stringify(data)
	})
}

export function fetchProductList(params) {
	return request({
		url: '/product/list',
		method: 'get',
		params
	})
}
export function fetchProductDetail(params) {
	return request({
		url: '/product/detail',
		method: 'get',
		params
	})
}
import axios from 'axios'
import {
	Message
} from 'element-ui'
import store from '@/store'
import {
	getToken
} from '@/utils/auth'


// create an axios instance
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	// withCredentials: true, // send cookies when cross-domain requests
	timeout: 5000 // request timeout
})


service.interceptors.request.use(
	config => {
		if (store.getters.token) {
			config.headers['X-Token'] = getToken()
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
	response => {
		const res = response.data
		if (res.code !== 20000) {
			Message({
				message: res.message || 'Error',
				type: 'error',
				duration: 5 * 1000
			})
			return Promise.reject(new Error(res.message || 'Error'))
		} else {
			return res
		}
	},
	error => {
		return {
			data: {}
		};
	}
)

export default service
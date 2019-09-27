import Vue from 'vue'
import Cookies from 'js-cookie'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui'
import './styles/element-variables.scss'


Vue.config.productionTip = false
Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import '@/styles/index.scss' // global css

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters


Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

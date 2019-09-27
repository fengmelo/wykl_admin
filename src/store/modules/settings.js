import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import Cookies from 'js-cookie'
const { showSettings, tagsView, fixedHeader, sidebarLogo } = defaultSettings

const state = {
	title: defaultSettings.title,
  theme: Cookies.get('theme') ? Cookies.get('theme') : variables.theme,
  showSettings:  showSettings,
  tagsView: Cookies.get('tagsView')!==undefined ? JSON.parse(Cookies.get('tagsView')) :tagsView,
  fixedHeader: Cookies.get('fixedHeader')!==undefined ? JSON.parse(Cookies.get('fixedHeader')) :fixedHeader,
  sidebarLogo: Cookies.get('sidebarLogo')!==undefined ? JSON.parse(Cookies.get('sidebarLogo')) :sidebarLogo
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
			if(['theme','tagsView','fixedHeader','sidebarLogo'].includes(key)){
				Cookies.set(key,value)
			}
      state[key] = value
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}


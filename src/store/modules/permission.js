import router from '@/router'

const state = {
	codes:[],
	routes:[]
}

const mutations = {
  SET_CODES: (state, codes) => {
    state.codes = codes
	},
	SET_ROUTES: (state, routes) => {
    state.routes = routes
  }
}

const actions = {
  setCodes({ commit }, codes) {	
		commit('SET_CODES', codes)
		commit('SET_ROUTES', router.options.routes)
	}
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

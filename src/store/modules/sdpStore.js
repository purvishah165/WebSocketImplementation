import Vue from 'vue'
import * as types from '@/store/mutation-types'
import smartlink from '@/services/smartlink'

const state = {
  smart_link: {
    email: '',
    active: 1
  },
  state: '',
  code: ''
}

// getters
const getters = {
  smartLink: state => state.smart_link,
  state: state => state.state,
  code: state => state.code
}

// const actions
const actions = {
  async updateSmartLink ({ commit }, payload) {
    commit(types.UPDATE_SMART_LINK, payload)
  },
  async getState ({ commit }, payload) {
    await smartlink.getSdpState(payload.context).then(sdpResponse => {
      commit(types.GET_STATUS, { sdpResponse })
    })
  },
  async updateState ({ commit }, payload) {
    await smartlink.updateSdpState(payload.context, payload.params).then(sdpResponse => {
      commit(types.UPDATE_STATUS, { sdpResponse })
    })
  }
}

const mutations = {
  [types.UPDATE_SMART_LINK] (state, sdpResponse) {
    Vue.set(state, 'smart_link', JSON.parse(JSON.stringify(sdpResponse.body.data.smart_link)))
  },
  [types.GET_STATUS] (state, { sdpResponse }) {
    Vue.set(state, 'code', sdpResponse.status)
    if (sdpResponse.status === 200) {
      Vue.set(state, 'state', JSON.parse(JSON.stringify(sdpResponse.body.data.state)))
    } else {
      Vue.set(state, 'state', '')
    }
  },
  [types.UPDATE_STATUS] (state, { sdpResponse }) {
    // if (sdpResponse.status === 200) {
    // Vue.set(state, 'state', JSON.parse(JSON.stringify(sdpResponse.body.data.state)))
    // }
    // if (state.user_services_busy) {
    //   state.user_services_busy = !state.user_services_busy
    // }
  }
}

export default {
  getters,
  state,
  actions,
  mutations
}

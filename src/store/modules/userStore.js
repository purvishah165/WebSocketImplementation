import Vue from 'vue'
import * as types from '@/store/mutation-types'
import userServices from '@/services/user'
import router from '@/router'
import { LoadingState } from '@/main'
const state = {
  user: {
  },
  subscriptions: [],
  billing_address: {},
  cart: {},
  order: {},
  products: [],
  user_services_busy: false
}

// getters
const getters = {
  userDetails: state => state.user,
  cartDetails: state => state.cart,
  subscriptions: state => state.subscriptions,
  address: state => state.billing_address
}

const actions = {
  async getProduct ({ commit }, payload) {
    await userServices.getProductDetails(payload.context).then(userResponse => {
      commit(types.GET_PRODUCTS, { userResponse })
    })
  },
  async createCart ({ commit, dispatch }, payload) {
    await userServices.createCart(payload.context).then(async userResponse => {
      if (userResponse.status === 200) {
        await userServices.getProductDetails(payload.context).then(response => {
          let updateRequest = {
            context: payload.context,
            prod: { products: response.body.data },
            id: userResponse.body.data.id
          }
          dispatch('updateCartWithProduct', updateRequest)
        })
      }
    })
  },
  async getCart ({ commit }, payload) {
    await userServices.getCart(payload.context, payload.id).then(userResponse => {
      if (userResponse.status === 200) {
        commit(types.GET_CART_STORE, { userResponse })
      }
    })
  },
  async updateCartWithProduct ({ commit }, payload) {
    await userServices.updateCart(payload.context, payload.prod, payload.id).then(userResponse => {
      if (userResponse.status === 200) {
        commit(types.UPDATE_CART_STORE, { userResponse })
      }
    })
  },
  async prepareUserDetail ({ commit }, payload) {
    await userServices.getUserprofile(payload.context).then(userResponse => {
      if (userResponse.status === 200) {
        commit(types.UPDATE_STORE_WITH_USER_DATA, { userResponse })
      }
    })
  },
  async updateUserDetail ({ commit }, payload) {
    await userServices.getUserprofile(payload.context).then(userResponse => {
      if (userResponse.status === 200) {
        commit(types.UPDATE_STORE_WITH_USER_DATA, { userResponse })
      }
    })
  },
  async clearStore ({ commit }, payload) {
    commit(types.CLEAR_STORE, { })
  }

}

const mutations = {
  [types.UPDATE_CART_STORE] (state, { userResponse }) {
    console.log(userResponse.body.data)
    Vue.set(state, 'cart', JSON.parse(JSON.stringify(userResponse.body.data)))
    LoadingState.$emit('toggle', false)
    router.push('/cart/' + userResponse.body.data.id)
    // if (state.user_services_busy) {
    //   state.user_services_busy = !state.user_services_busy
    // }
  },
  [types.GET_CART_STORE] (state, { userResponse }) {
    console.log(userResponse.body.data)
    Vue.set(state, 'cart', JSON.parse(JSON.stringify(userResponse.body.data)))
    // if (state.user_services_busy) {
    //   state.user_services_busy = !state.user_services_busy
    // }
  },
  [types.UPDATE_STORE_WITH_USER_DATA] (state, { userResponse }) {
    console.log(userResponse.body.data)
    Vue.set(state, 'user', JSON.parse(JSON.stringify(userResponse.body.data.user)))
    Vue.set(state, 'subscriptions', JSON.parse(JSON.stringify(userResponse.body.data.subscriptions)))
    Vue.set(state, 'billing_address', JSON.parse(JSON.stringify(userResponse.body.data.billing_address)))
  },
  [types.CLEAR_STORE] (state, { userResponse }) {
    Vue.set(state, 'user', { email: null })
    Vue.set(state, 'subscriptions', [])
    Vue.set(state, 'billing_address', {})
  }
}

export default {
  getters,
  state,
  actions,
  mutations
}

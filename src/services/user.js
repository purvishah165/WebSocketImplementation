import auth from '@/services/auth'
export default {
  async getProductDetails (context) {
    return context.$http.get(process.env.VUE_APP_API_URL + '/product').then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async createCart (context) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/cart').then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getCart (context, id) {
    return context.$http.get(process.env.VUE_APP_API_URL + '/cart/' + id).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async updateCart (context, productList, id) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/cart/' + id, productList).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async updateCartWithCoupon (context, coupon, id) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/cart/' + id + '/applycoupon', coupon).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async deleteCartWithCoupon (context, coupon, id) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/cart/' + id + '/detachecoupon', coupon).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async checkout (context, id, params) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/cart/' + id + '/checkout', params).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getUserprofile (context) {
    return context.$http.get(process.env.VUE_APP_API_URL + '/user', { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  async updateUserprofile (context, profile) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/user', profile, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  async updateBillingAddress (context, address) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/user/billing_address', address, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  async getOrder (context, id) {
    return context.$http.get(process.env.VUE_APP_API_URL + '/order/' + id, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  async cancelSubscription (context, id) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/subscription/' + id + '/cancel', {}, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  async reactivateSubscription (context, id, params) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/subscription/' + id + '/reactive', params, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }, (err) => {
      return err
    })
  }
}

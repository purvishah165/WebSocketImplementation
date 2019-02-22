import auth from '@/services/auth'
export default {
  async storeUserAndSendEmail (context, reports) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/store_smart_link', reports).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async storeAndSendEmail (context, reports) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/auth/store_smart_link', reports, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async sendContactForm (context, contactDetails) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/landing/submit_contact_form', contactDetails).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async checkFreeTrial (context, email) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/get_reports', email).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async checkFreeTrialForLogged (context) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/auth/get_reports', {}, { headers: auth.getAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async authorizeSmartLink (context, params) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/authorize_smart_link', params).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getSdpByUrlForExistingToken (context, params) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/get_by_tinyurl', params, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getChosenReports (context) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/chosen_reports', {}, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getSdpState (context) {
    return context.$http.get(process.env.VUE_APP_API_URL + '/sdp/state', { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async updateSdpState (context, state) {
    return context.$http.put(process.env.VUE_APP_API_URL + '/sdp/state', state, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getPositions (context, state) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/positions', state, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  }

}

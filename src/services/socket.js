export default {
  async storeSocketAuth (context, payload) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/socket/auth', payload).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  }
}

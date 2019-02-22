/* import SLTool from 'sl-tool-package'; */
// import md5 from 'md5'
import { ErrorMessage, LoadingState, DialogueState, DataState } from '@/main'
import router from '@/router'
// import { setCookie, getCookie, deleteCookie } from '../util'

const conf = process.env

// URL and endpoint constants
const LOGIN_URL = conf.VUE_APP_API_URL + '/auth/login'
const LOGOUT_URL = conf.VUE_APP_API_URL + '/auth/logout'
const CHANGE_PASSWORD = conf.VUE_APP_API_URL + '/auth/resetpassword'
const FORGOT_PASSWORD = conf.VUE_APP_API_URL + '/auth/resetpassword/recover'
const VERIFY_TOKEN = conf.VUE_APP_API_URL + '/auth/resetpassword/'
const RESET_PASSWORD = conf.VUE_APP_API_URL + '/auth/resetpassword/reset'

export default {
  // authentication status
  // for test set role to Accountant
  user: {
    authenticated: null,
    role: '',
    is_active: '',
    status: '',
    is_temporary: false,
    owner: null,
    services_busy: false
  },
  checkAuth () {
    let jwt = window.localStorage.getItem('id_token')
    console.log('jwt', jwt)
    if (jwt !== '' && jwt !== null && jwt !== undefined && jwt !== 'undefined') {
      this.user.authenticated = true
    } else {
      this.user.authenticated = false
    }
    // console.log(this.user.authenticated);
    return this.user.authenticated
  },
  // The object to be passed as a header for authenticated requests
  getAuthHeader () {
    // console.log('window.localStorage.getItem')
    // console.log(window.localStorage.getItem('id_token'))
    if (window.localStorage.getItem('id_token')) {
      return {
        'authorization': 'Bearer ' + window.localStorage.getItem('id_token')
      }
    } else {
      return {}
    }
  },
  getTempAuthHeader () {
    // console.log('window.localStorage.getItem')
    // console.log(window.localStorage.getItem('id_token'))
    if (window.localStorage.getItem('temp_token')) {
      return {
        'authorization': 'Bearer ' + window.localStorage.getItem('temp_token')
      }
    } else {
      return {}
    }
  },

  localStoreSupport () {
    let testKey = 'test'
    try {
      window.localStorage.setItem(testKey, '1')
      window.localStorage.removeItem(testKey)
      return true
    } catch (error) {
      return false
    }
  },
  // Send a request to the login URL and save the returned JWT
  login (context, creds) {
    let onSuccessSignIn = response => {
      console.log('login response body')
      console.log(response.body)
      if (this.localStoreSupport()) {
        window.localStorage.setItem('id_token', response.body.data.token)
      }
      this.user.authenticated = true
      DataState.$emit('userAuth', true)
      DialogueState.$emit('closeLogin', {})
      LoadingState.$emit('toggle', false)
      return response
    }
    //
    let onFailedSignIn = response => {
      // error callback
      console.log(response.body.message)
      LoadingState.$emit('toggle', false)
      ErrorMessage.$emit('error', response.body.message)
    }

    LoadingState.$emit('toggle', true)
    creds = JSON.parse(JSON.stringify(creds))
    return context.$http.post(LOGIN_URL, creds).then(onSuccessSignIn, onFailedSignIn)
  },
  // To log out
  logout (context) {
    // localStorage.removeItem('id_token');
    // this.user.authenticated = false;
    // context.$router.push({ path: '/Login' });
    LoadingState.$emit('toggle', true)
    context.$http.post(LOGOUT_URL, {}, {
      headers: this.getAuthHeader()
    }).then((response) => {
      if (response.body.success) {
        console.log(response)
        window.localStorage.removeItem('id_token')
        this.user.authenticated = false
        LoadingState.$emit('toggle', false)
        DataState.$emit('logoutSuccess', true)
        context.$nextTick(function () {
          router.push('/')
        })
      }
    }, (response) => {
      console.log(response.body)
      LoadingState.$emit('toggle', false)
    })
  },
  resetPassword (context, creds) {
    return context.$http.post(CHANGE_PASSWORD, creds, { headers: this.getAuthHeader() }).then((response) => {
      window.localStorage.setItem('id_token', response.body.data.token)
      return response
    }, (err) => {
      return err
    })
  },
  forgotPassword (context, creds) {
    return context.$http.post(FORGOT_PASSWORD, creds).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  verifyToken (context, token) {
    return context.$http.get(VERIFY_TOKEN + token).then((response) => {
      return response
    }, (err) => {
      return err
    })
  },
  verifyPassword (context, creds) {
    return context.$http.post(RESET_PASSWORD, creds).then((response) => {
      return response
    }, (err) => {
      return err
    })
  }
}

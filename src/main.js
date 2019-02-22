import Vue from 'vue'
import App from './App.vue'
import router from './router'
import BootstrapVue from 'bootstrap-vue'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'
import VueSmoothScroll from 'vue-smooth-scroll'
import VueRecaptcha from 'vue-recaptcha'
import './registerServiceWorker'
import VueMask from 'v-mask'
Vue.use(BootstrapVue)
Vue.use(VueResource)
Vue.use(VueSmoothScroll)
Vue.use(VueMask)
const moment = require('moment')
require('moment/locale/en-au')

Vue.use(require('vue-moment'), {
  moment
})
Vue.config.productionTip = false
const veeValidateConfig = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'inputs ', // Default is fields
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  enableAutoClasses: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true
}
export const DialogueState = new Vue() // for dialogue modals
export const LoadingState = new Vue() // for loading events
export const PageState = new Vue() // for identifying pages
export const DataState = new Vue() // for emitting data
export const Datapass = new Vue() // for data passing

// Pass Error Message
export const ErrorMessage = new Vue()
Vue.use(VeeValidate, veeValidateConfig)
Vue.component('vue-recaptcha', VueRecaptcha)
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
  next()
})
new Vue({// eslint-disable-line no-new
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

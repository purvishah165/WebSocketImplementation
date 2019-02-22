import Vue from 'vue'

import loader from '@/components/Loader/Loader'

export const Loading = new Vue({

  components: {
    loader
  },

  data () {
    return {
      ismainloaded: true
    }
  },

  mounted () {
    window.context = this
    window.addEventListener('main_load_ready', function (e) {
      console.log('main_load_ready', e)
      if (e.detail) {
        console.log(e.context)
        window.context.ismainloaded = false
      }
    })
  }

}).$mount('#loading')

<template>
    <div class="content-area col-sm-12 main-content-section">
        <div class="sdp-container" v-show="!linkExpired && !jwtError">
            <router-view></router-view>
        </div>
        <div v-show="linkExpired">
            <error-template-link-expired></error-template-link-expired>
        </div>
        <div class="sdp-container" v-show="jwtError">
            <error-template></error-template>
        </div>
    </div>
</template>

<script>
import { PageState, DataState, LoadingState } from '@/main'
import ErrorTemplate from './ErrorTemplate/ErrorTemplate'
import ErrorTemplateLinkExpired from './ErrorTemplate/ErrorTemplateLinkExpired'
import { mapGetters } from 'vuex'
import router from '@/router'
export default {
  components: {
    ErrorTemplate, ErrorTemplateLinkExpired
  },
  name: 'secure-document-portal',
  computed: {
    ...mapGetters({
      state: 'state'
    })
  },
  data () {
    return {
      code: 200,
      error_jwt: false,
      linkExpired: false,
      jwtError: false
    }
  },
  watch: {
    state: {
      handler: function (val) {
        console.log('state changed------', val)
      },
      deep: true
    }
  },
  methods: {
    async getState () {
      // LoadingState.$emit('toggle', true)
      await this.$store.dispatch('getState', { context: this })
      this.code = this.$store.state.sdpStore.code

      if (this.code === 400) {
        DataState.$emit('jwtError', true)
      } else if (this.code === 404) {
        DataState.$emit('linkExpired', true)
      }
    }
  },
  created () {
    this.getState()
  },
  mounted () {
    // Redirect if expired
    if (this.$store.state.sdpStore.state === 'submitted') {
      router.push('/')
    }
    PageState.$emit('issdp', true)
    PageState.$emit('ishome', false)
    PageState.$emit('isAccount', false)

    DataState.$on('linkExpired', (payload) => {
      this.linkExpired = payload
      LoadingState.$emit('toggle', false)
    })

    DataState.$on('jwtError', (payload) => {
      this.jwtError = payload
      LoadingState.$emit('toggle', false)
    })
  },
  destroyed () {
    DataState.$off('linkExpired')
    DataState.$off('jwtError')
  }
}
</script>

<style scoped>

</style>

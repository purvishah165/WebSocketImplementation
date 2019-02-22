<template>
    <div class="content" v-if="linkExpired">
        <error-template></error-template>
    </div>
    <div v-else class="content-area col-sm-12 main-content-section"></div>
</template>

<script>
import { PageState, LoadingState } from '@/main'
import smartLinkService from '@/services/smartlink'
import router from '@/router'
import ErrorTemplate from '../SecureDocumentPortal//ErrorTemplate/ErrorTemplateLinkExpired'

export default {
  name: 'validate-smart-link',
  components: { ErrorTemplate },
  data () {
    return {
      name: null,
      number: null,
      linkExpired: false
    }
  },
  methods: {
    async verify (token) {
      window.localStorage.removeItem('temp_token')
      LoadingState.$emit('toggle', true)
      // No token set
      if (!window.localStorage.getItem('temp_token')) {
        let response = await smartLinkService.authorizeSmartLink(this, token)
        // Success
        if (response.status === 200) {
          LoadingState.$emit('toggle', false)
          window.localStorage.setItem('temp_token', response.body.data.jwt.token)
          this.$store.dispatch('updateSmartLink', response)
          router.push('/sdp')
        } else {
          this.linkExpired = true
        }
      // Token set
      } else {
        let response = await smartLinkService.getSdpByUrlForExistingToken(this, token)
        // success callback
        if (response.status === 200) {
          LoadingState.$emit('toggle', false)
          this.$store.dispatch('updateSmartLink', response)
          router.push('/sdp')
        } else if (response.status === 404) {
          console.log('[SL] Expired')
          window.localStorage.removeItem('temp_token')
          this.linkExpired = true
        } else if (response.status === 400) {
          window.localStorage.removeItem('temp_token')
          let response = await smartLinkService.authorizeSmartLink(this, token)
          if (response.body.message === 'Smart link active') {
            LoadingState.$emit('toggle', false)
            window.localStorage.setItem('temp_token', response.body.data.jwt.token)
            this.$store.dispatch('updateSmartLink', response)
            router.push('/sdp')
          } else {
            this.linkExpired = true
          }
        }
      }
      LoadingState.$emit('toggle', false)
    }
  },
  created () {
    if ((this.$route.params.name !== '' || this.$router.params.name !== undefined) && (this.$route.params.number !== '' || this.$router.params.number !== undefined)) {
      this.name = this.$route.params.name
      this.number = this.$route.params.number
      let verifyObject = {
        name: this.name,
        number: this.number
      }
      if (window.localStorage.getItem('tiny_url')) {
        window.localStorage.removeItem('tiny_url')
      }
      let currentPath = window.location.pathname
      let currentUrl = process.env.VUE_APP_API_URL + currentPath
      window.localStorage.setItem('tiny_url', currentUrl)
      window.localStorage.setItem('accounting_package_url', window.location.href)
      // this.role_type = auth.checkroleType()
      this.verify(verifyObject)
    }
  },
  mounted () {
    PageState.$emit('isAccount', true)
    PageState.$emit('ishome', false)
    PageState.$emit('isSDP', false)
  }
}
</script>

<style scoped>

</style>

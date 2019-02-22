<template>
    <div id="link-expired" class="error-template col-lg-6 col-md-6 col-sm-8 col-xs-12 offset-lg-3 offset-md-3 offset-sm-2 offset-xs-0 text-center background-white border-curved">
        <h2 class="text-bold">Your session has expired</h2>
        <h4>This session is time restricted for security reasons, allowing you up to 30 minutes to complete it.
            <br>Please restart your session, or contact us for further assistance.</h4>
        <div class="error-actions">
            <a href="https://fastfinancials.com/#contact-us" target="_blank" class="btn btn-violet border-curved">Contact Us</a>
            <a @click="restartSession" class="btn btn-violet border-curved">Restart Session</a>
        </div>
    </div>
</template>

<script>
import router from '@/router'
import { DataState } from '@/main'
export default {
  name: 'error-template',
  methods: {
    goToContact () {
      router.push('/#contact-us')
    },
    removeHelp () {
      let payload = {
        display: false
      }
      DataState.$emit('displayHelpButton', payload)
    },
    restartSession () {
      DataState.$emit('resetSocket', true)
    }
  },
  mounted () {
    this.removeHelp()
  }
}
</script>

<style scoped>
</style>

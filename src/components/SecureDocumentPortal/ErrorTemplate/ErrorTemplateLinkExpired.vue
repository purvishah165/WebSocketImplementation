<template>
    <div class="content-area col-sm-12 main-content-section">
        <div class="sdp-container">
            <div id="link-expired" class="error-template col-lg-6 col-md-6 col-sm-8 col-xs-12 offset-lg-3 offset-md-3 offset-sm-2 offset-xs-0 text-center background-white border-curved">
                <h2 class="text-bold">This link is no longer valid.</h2>
                <h4>It might have been already used once or expired.<br>Please contact us for further assistance.</h4>
                <div class="error-actions">
                    <a @click="goToContact" class="btn btn-violet border-curved">Contact Us</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import router from '@/router'
  import { DataState } from '@/main'
  export default {
    name: 'error-template-link-expired',
    methods: {
      goToContact () {
        router.push('/#contact-us')
      },
      removeHelp () {
        let payload = {
          display: false
        }
        DataState.$emit('displayHelpButton', payload)
      }
    },
    mounted () {
      this.removeHelp()
    }
  }
</script>

<style scoped>
</style>

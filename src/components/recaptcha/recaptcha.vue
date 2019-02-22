<template>
    <div>
        <vue-recaptcha ref="recaptcha" @verify="markRecaptchaAsVerified" @expired="recaptchaExpired"
                       sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI">
        </vue-recaptcha>
    </div>
</template>

<script>
import { DataState } from '@/main'
export default {
  name: 'recaptcha',
  methods: {
    markRecaptchaAsVerified (response) {
      this.$emit('grecaptcha', response)
      this.recaptcha = response
      // this.loginForm.pleaseTipckRecaptchaMessage = '';
      // this.loginForm.recaptchaVerified = true;
    },
    recaptchaExpired () {
      this.$refs.recaptcha.reset()
      DataState.$emit('recaptchaExpired', true)
    }
  },
  mounted () {
    DataState.$on('resetCaptcha', (payload) => {
      if (this.$refs.recaptcha) {
        this.$refs.recaptcha.reset()
      }
    })
  }
}
</script>

<style scoped>
</style>

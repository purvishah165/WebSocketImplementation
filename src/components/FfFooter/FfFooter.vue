<template>
    <div class="container-fluid footer-background">

        <div class="container">

            <div class="row transparency">
                <div class="col-lg-2 d-none d-lg-block vertically-centered">
                    <small>Powered by</small>
                    <a href="https://streamlending.com.au" target="_blank"><img src="@/assets/FullLogo_Symbol_White-8-768x261.png" class="img-responsive sl-footer-logo" alt="Stream Lending"></a>
                    <small><a href="/terms-privacy-policy" target="_blank" class="sl-secondary-link">Terms &amp; Privacy Policy</a></small>
                </div>

                <div class="col-lg-8 vertically-centered">
                    <a class="remove-outline" @click="openSecurityModal"><img class="sl-security-statements img-responsive" src="@/assets/security-icon-learn-more.svg"></a>
                </div>

                <div class="col-lg-2 vertically-centered">
                    <a href="https://www.linkedin.com/company/stream-lending/" target="_blank"><img class="img-responsive sl-social-icon" src="@/assets/linkedin.svg" alt="LinkedIn"></a>
                </div>
                <div class="col-lg-2 d-lg-none vertically-centered">
                    <small>Powered by</small>
                    <a href="https://streamlending.com.au" target="_blank"><img src="@/assets/FullLogo_Symbol_White-8-768x261.png" class="img-responsive sl-footer-logo" alt="Stream Lending"></a><br>
                    <small><a class="sl-secondary-link" href="/terms-privacy-policy" target="_blank">Terms &amp; Privacy Policy</a></small>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { DialogueState } from '@/main.js'
export default {
  name: 'ff-footer',
  methods: {
    openSecurityModal () {
      DialogueState.$emit('securitymodal', {})
    }
  }
}
</script>

<style scoped>

</style>

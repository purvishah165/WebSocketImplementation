<template>
    <b-modal centered size="lg" ref="security_modal">
        <div slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">
            <!--                <h2 class="modal-title text-center centered-header">Information</h2>-->
            <button type="button" class="close close-pricing-modal" @click="hideModal">&times;</button>
        </div>

        <div class="col-12 text-center mb-4">
            <img src="@/assets/security-icon-popup-new.svg" class="img-responsive cursor-pointer">
        </div>
        <ul class="text-left">
            <li>We never store online financial credentials or passwords.</li>
            <li>Our service is independently tested and audited by external security experts.</li>
            <li>Financial information is only provided to the person requesting the financial information.</li>
            <li>We do not provide access to your information outside of the reports requested and act as an independent provider.</li>
        </ul>
        <div slot="modal-footer" class="modal-no-border">
            <div class="col-12 text-center">
                <a class="btn btn-violet btn-lg border-curved" @click="hideModal">Close</a>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState } from '@/main.js'
export default {
  name: 'security-modal',
  methods: {
    hideModal () {
      this.$refs.security_modal.hide()
    }
  },
  mounted () {
    DialogueState.$on('securitymodal', (payload) => {
      if (this.$refs.security_modal) {
        this.$refs.security_modal.show()
      }
    })
  }
}
</script>

<style scoped>

</style>

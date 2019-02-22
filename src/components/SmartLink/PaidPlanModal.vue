<template>
    <b-modal centered ref="paid_modal">
        <div slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">
            <!--                <h2 class="modal-title text-center centered-header">Information</h2>-->
            <button type="button" class="close close-pricing-modal" @click="hideModal">&times;</button>
        </div>
        <div class="col-lg-12 text-secondary text-center">
            <p>Please check out our "Pricing" page for more information and to upgrade your plan.</p>
        </div>
        <div slot="modal-footer" class="w-100 text-center">
            <router-link to="pricing" class="btn btn-violet border-curved pricing-modal-button" exact>Pricing</router-link>
        </div>


    </b-modal>


</template>

<script>
import { DialogueState } from '@/main.js'
export default {
  data () {
    return {
      email: null
    }
  },
  name: 'paid-plan-modal',
  methods: {
    hideModal () {
      this.$refs.paid_modal.hide()
      DialogueState.$emit('reportSelection', {
        dialogue_type: 'report',
        email: this.email
      })
    }
  },
  mounted () {
    DialogueState.$on('paidplan', (payload) => {
      if (this.$refs.paid_modal) {
        this.$refs.paid_modal.show()
        this.email = payload.email
      }
    })
  }
}
</script>

<style scoped>

</style>

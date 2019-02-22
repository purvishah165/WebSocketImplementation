<template>
    <b-modal centered size="md" ref="logout_modal" :no-fade=true>
        <h2 class="text-bold text-center">Confirmation</h2>
        <div class="text-center">
            <div v-html="dialogue_message"></div>
        </div>
        <div slot="modal-footer" class="w-100">
            <div class="d-flex">
                <div class="col-6 d-flex justify-content-center">
                    <a class="btn btn-violet-inverse" @click='hideModal'>Cancel</a>
                </div>
                <div class="col-6 d-flex justify-content-center">
                    <a class="btn btn-violet" @click='confirm'>{{confirm_btn_name}}</a>
                </div>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState } from '@/main'
import auth from '@/services/auth'
export default {
  name: 'logout',
  data () {
    return {
      dialogue_type: 'confirmation',
      action_name: '',
      dialogue_message: '',
      confirm_btn_name: 'Confirm',
      content_type: ''
    }
  },
  methods: {
    confirm () {
      // this.hideModal();
      auth.logout(this)
      this.$refs.logout_modal.hide()
    },
    hideModal () {
      this.$refs.logout_modal.hide()
    }
  },
  mounted () {
    DialogueState.$on('openLogoutDialogue', (payload) => {
      console.log('logout')
      this.action_name = payload.action_name
      this.dialogue_message = payload.dialogue_message
      this.content_type = payload.content_type
      if (payload.confirm_btn_name) {
        this.confirm_btn_name = payload.confirm_btn_name
      } else {
        this.confirm_btn_name = 'Confirm'
      }
      if (this.$refs.logout_modal) {
        this.$refs.logout_modal.show()
      }
    })
  }
}
</script>

<style scoped>

</style>

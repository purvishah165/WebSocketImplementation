<template>
    <b-modal centered ref="forgot_modal" :no-fade=true :class="dialogue_type">
        <div slot="modal-header" class="d-flex w-100 justify-content-center">
            <h2 class="w-100 text-center">Reset Password</h2>
            <button type="button" class="close" @click="hideModal">&times;</button>
        </div>
        <div v-if="dialogue_type === 'reset'">
        <div v-html="dialogue_message">
            <!--{{dialogue_message}}-->
        </div>
        <div class="alert alert-danger" v-if="errorReset">
            <p>{{ errorReset }}</p>
        </div>
        <div>
            <input name="email" v-model="email_id" v-validate data-vv-rules="required|email" class="input-centre app-admin-input input form-control" type="text"  aria-describedby="emailHelp" placeholder="Enter email">
        </div>
        </div>
        <div v-if="dialogue_type === 'success'">
            <p class="text-center">{{success}}</p>
        </div>
        <div slot="modal-footer" class="w-100">
            <div class="d-flex" v-if="dialogue_type === 'reset'">
                <div class="col-6 d-flex justify-content-center">
                    <a class="btn btn-violet-inverse" @click='hideModal'>Cancel</a>
                </div>
                <div class="col-6 d-flex justify-content-center">
                    <a class="btn btn-violet" @click='confirm'>{{confirm_btn_name}}</a>
                </div>
            </div>
            <div class="col-lg-12 text-center" v-if="dialogue_type === 'success'">
                <button type="button" class=" btn btn-violet input-curved text-bold" @click='hideModal'>Close</button>

            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState, LoadingState } from '@/main'
import auth from '@/services/auth'
export default {
  name: 'forgot-password',
  data () {
    return {
      dialogue_type: 'confirmation',
      action_name: '',
      action: null,
      dialogue_message: '',
      confirm_btn_name: 'Confirm',
      email_id: '',
      from_step: null,
      errorReset: null,
      success: null
    }
  },
  methods: {
    confirm () {
      this.$validator.validateAll().then(async success => {
        if (!success) {
          // handle error
          console.log('inside validate error')
          return
        }
        LoadingState.$emit('toggle', true)
        const forgotResponse = await auth.forgotPassword(this, { email: this.email_id })
        if (forgotResponse.status === 200) {
          LoadingState.$emit('toggle', false)
          this.dialogue_type = 'success'
          this.success = forgotResponse.body.message
        } else {
          LoadingState.$emit('toggle', false)
          this.errorReset = forgotResponse.body.message
        }
      })
    },
    hideModal () {
      this.$refs.forgot_modal.hide()
    }
  },
  mounted () {
    DialogueState.$on('openForgotPassword', (payload) => {
      this.action_name = payload.action_name
      this.dialogue_message = payload.dialogue_message
      this.content_type = payload.content_type
      this.from_step = payload.from_step
      this.dialogue_type = payload.dialogue_type
      if (payload.confirm_btn_name) {
        this.confirm_btn_name = payload.confirm_btn_name
      } else {
        this.confirm_btn_name = 'Confirm'
      }
      if (this.$refs.forgot_modal) {
        this.$refs.forgot_modal.show()
      }
    })
  }
}
</script>

<style scoped>

</style>

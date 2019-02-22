<template>
    <b-modal centered ref="login_modal" size="md" >
        <div slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">

            <!--                <h2 class="modal-title text-center centered-header">Information</h2>-->
            <button type="button" class="close" @click="hideModal">&times;</button>
        </div>

        <div>
            <div class="alert alert-danger" v-if="error">
                <p>{{ formatError(error) }}</p>
            </div>
            <form @submit.prevent="validateBeforeSubmit">
                <div class="d-flex justify-content-center mb-4">
                    <!--<div class="col-5">-->
                        <!--<label for="email" class="field-label">Email Address</label>-->
                    <!--</div>-->
                    <div class="col-10">
                        <input class="app-admin-input form-control" name="email" v-model="email" v-validate="'required|email'" :class="{'is-danger': errors.has('email') }" type="text"  aria-describedby="emailHelp" placeholder="Enter email">
                        <p v-show="errors.has('email')" class="text-danger">Valid email required</p>
                    </div>
                </div>
                <div class=" d-flex justify-content-center mb-4">
                    <!--<div class="col-5">-->
                        <!--<label for="password" class="field-label">Password</label>-->
                    <!--</div>-->
                    <div class="col-10">
                        <input class="app-admin-input form-control" name="password" v-model="password" v-validate="'required|min:6'" :class="{'is-danger': errors.has('password') }" type="password" placeholder="Password">
                        <p v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</p>
                    </div>
                </div>
                <div id="login-check"></div>
                <div class="d-flex justify-content-center">
                    <div class="col-10 flex-padding">
                        <button class="btn btn-violet w-100" type="submit">Log In</button>
                        <a class="d-flex text-center cursor-pointer" @click="forgotPassword"><span class="field-small-label mr-0 w-100">Forgot Password ?</span></a>
                    </div>
                </div>
            </form>
        </div>


        <div slot="modal-footer" class="modal-no-border">
        </div>
    </b-modal>
</template>

<script>
import { DialogueState, ErrorMessage } from '@/main'
import auth from '@/services/auth'
export default {
  name: 'login-modal',
  data () {
    return {
      // initial the component with properties that will be used
      email: '',
      password: '',
      error: '',
      formSubmitted: false,
      emailForReset: '',
      state: ''
    }
  },

  methods: {
    hideModal () {
      if (this.state === 'reportSelection') {
        DialogueState.$emit('reportSelection', {
          dialogue_type: 'report',
          email: this.email
        })
      }
      this.$refs.login_modal.hide()
    },
    forgotPassword () {
      DialogueState.$emit('openForgotPassword', {
        dialogue_type: 'reset',
        action_name: 'Reset',
        from_step: 'loginmodal',
        confirm_btn_name: 'Reset Password',
        dialogue_message: '<p class="">Lost your password? Please enter your email address. You will receive mail with link to set new password.</p>'
        // email_id : this.emailForReset
      })
    },

    validateBeforeSubmit () {
      console.log('called validate')
      this.$validator.validateAll().then(() => {
        this.submit()
        console.log('From Submitted!')
      }).catch(() => {
        this.error = 'Please correct the errors below'
      })
    },

    async submit () {
      const credentials = {
        email: this.email.trim(),
        password: this.password,
        client_ref: process.env.VUE_APP_CLIENT_REF
      }

      // pass component's this context to properly make use of http in auth service
      console.log('called login service')
      await auth.login(this, credentials)
      this.formSubmitted = true
    },

    formatError (value) {
      if (value !== null) {
        let tempCatName = value.replace(/\_/g, ' ').toLowerCase()
        if (tempCatName && tempCatName.length > 0) {
          return tempCatName[0].toUpperCase() + tempCatName.slice(1)
        }
        return ''
      }
    }
  },

  mounted () {
    DialogueState.$on('loginmodal', (payload) => {
      console.log('login')
      if (payload.fromPage === 'reportSelection') {
        this.state = payload.fromPage
        this.email = payload.email
      }
      if (this.$refs.login_modal) {
        this.$refs.login_modal.show()
      }
    })
    DialogueState.$on('closeLogin', (payload) => {
      this.hideModal()
    })
    ErrorMessage.$on('error', (error) => {
      console.log(error)
      this.error = error
      // this.resetgrecaptcha();
    })
  },
  destroyed () {
    console.log(this.$validator)
    this.$validator.detach('password')
    this.$validator.detach('email')
  }
}
</script>

<style scoped>
.field-small-label{
    padding: 0.375rem 0.75rem;
}
</style>

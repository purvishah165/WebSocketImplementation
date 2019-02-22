<template>
    <div class="content-area col-sm-12 main-account-section">
        <div class="container">
            <div class="alert alert-danger" v-if="error">
                <p>{{ error }}</p>
            </div>
            <form @submit.prevent="validateBeforeSubmit" v-if="verified && !formSubmitted">
                <div class="form-group row">
                    <label class="col-5 field-label" for="password">New Password</label>
                    <div :class="{ 'col-7': true }">
                        <input name="password" class="app-admin-input" v-model="password" v-validate="'required|alpha_num|min:6|confirmed:passwordRef'" :class="{'input': true, 'form-control': true, 'is-danger': errors.has('password') }" type="password" id="password" placeholder="New Password">
                        <span v-show="errors.has('password')" class="text-danger">{{ errors.first('password') }}</span>
                    </div>
                </div>
                <div class="form-group row">
                    <label class="col-5 field-label" for="pw_confirm">Confirm Password</label>
                    <div :class="{ 'col-7': true }">
                        <input ref="passwordRef" name="pw_confirm" class="app-admin-input" v-model="c_password" :class="{'input': true, 'form-control': true, 'is-danger': errors.has('pw_confirm') }" type="password" id="pw_confirm" placeholder="Confirm Password">
                        <span v-show="errors.has('pw_confirm')" class="text-danger">{{ errors.first('pw_confirm') }}</span>
                    </div>
                </div>
                  <button class="col-3 btn btn-violet" type="submit">Reset</button>
            </form>
            <div v-if="formSubmitted && verified">
                <h3 class="mb-2">{{title}}</h3>
                <div v-html="counter"></div>
            </div>
        </div>
    </div>
</template>

<script>
import { PageState, LoadingState } from '@/main'
import auth from '@/services/auth'
import router from '@/router'
import timer from '@/components/Toolkit/timer'
export default {
  name: 'verify-account',
  data () {
    return {
      email: null,
      token: null,
      password: null,
      c_password: null,
      error: null,
      verified: false,
      formSubmitted: false,
      title: 'Congratulations!',
      message: null,
      counter: null,
      duration: 5,
      counterId: 'counter'
    }
  },
  methods: {
    async verify (token) {
      LoadingState.$emit('toggle', true)
      console.log('token')
      console.log(token)
      let response = await auth.verifyToken(this, token)
      // success callback
      console.log('verify reset token response')
      console.log(response.body)
      if (response.status === 200) {
        this.email = response.body.data.email
        this.token = response.body.data.token
        this.verified = true
        LoadingState.$emit('toggle', false)
        // window.localStorage.setItem('temp_token', response.body.data.jwt.token)
        // router.push('/sdp')
      } else {
        // TODO error handling
        this.error = response.body.message
        this.verified = false
        LoadingState.$emit('toggle', false)
      }
      this.formSubmitted = false
    },
    validateBeforeSubmit () {
      this.$validator.validateAll().then(success => {
        if (!success) {
          // handle error
          return
        }
        this.submit()
        console.log('From Submitted!')
      })
    },
    async getCountDown () {
      for (let counter = this.duration; counter >= 0; counter--) {
        console.log(counter)
        if (document.getElementById(this.counterId) !== null) {
          document.getElementById(this.counterId).innerHTML = counter
        }
        if (counter === 0) {
          router.push('/')
          break
        } else {
          if (counter === 1) {
            let second = document.getElementById('second')
            if (second !== null && second !== undefined) {
              document.getElementById('second').innerHTML = 'second'
            }
          }
          await timer.sleep(1000)
        }
      }
    },
    async submit () {
      LoadingState.$emit('toggle', true)
      let credentials = {
        email: this.email,
        token: this.token,
        password: this.password,
        c_password: this.c_password
      }
      const passwordResponse = await auth.verifyPassword(this, credentials)
      if (passwordResponse.status === 200) {
        LoadingState.$emit('toggle', false)
        this.formSubmitted = true
        this.title = 'Your password has been reset.'
        this.counter = 'You will be redirected to the home page in <b id="' + this.counterId + '">' + this.duration + '</b> <span id="second">seconds</span>'
        this.getCountDown()
      } else {
        this.error = passwordResponse.body.message
        this.formSubmitted = false
        LoadingState.$emit('toggle', false)
      }
    }
  },
  created () {
    if (this.$route.params.token !== '' || this.$router.params.token !== undefined) {
      this.token = this.$route.params.token
      console.log(this.$route.params.token)
      // this.role_type = auth.checkroleType()
      this.verify(this.token)
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

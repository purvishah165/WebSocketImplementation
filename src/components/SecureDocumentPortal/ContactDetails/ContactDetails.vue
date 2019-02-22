<template>
  <div>
      <div v-if="!jwtError">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="text-white">Secure Document Portal​</h1>
      </div>
    </div>
    <div class="row centered-containers">
      <div class="col-lg-5 col-md-6 col-sm-8 col-xs-1 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-0 text-center background-white border-curved distance integration-container">
        <form id="form_submit_documents" v-if="!success_submit">
          <div class="form-row">
            <div class="form-group col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-10 offset-sm-1 col-xs-8 offset-xs-2">
              <label for="name">Name:</label>
              <input id="name" name="name" v-model="name" v-validate="'required|max:40'" :class="{'form-control': true, 'input': true, 'is-danger': errors.has('name') }" type="text" placeholder="Name">
              <div v-show="errors.has('name')" class="help text-left text-danger">{{ errors.first('name') }}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-10 offset-sm-1 col-xs-8 offset-xs-2">
              <label for="position">Position:</label>
              <select id="position" name="position" v-model="position" v-validate="'required:true'" :class="{'form-control': true, 'input': true, 'is-danger': errors.has('position') }">
                <option value="Accountant" selected>Accountant</option>
                <option value="Director">Director</option>
                <option value="Tax Agent">Tax Agent</option>
                <option value="Bookkeeper">Bookkeeper</option>
                <option value="other">Other</option>
              </select>

              <div v-show="errors.has('position')" class="help text-left text-danger is-danger">{{ errors.first('position') }}</div>
              <input placeholder="Enter Your Position" v-if="show_position_input" type="text" name="custom_position" v-validate="'required|max:40'" v-model="custom_position" :class="{'form-control': true, 'input': true, 'is-danger': errors.has('custom_position')}">
              <div v-show="errors.has('custom_position')" class="help text-left text-danger">Custom position name is required</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-10 offset-sm-1 col-xs-8 offset-xs-2 text-left">
              <input id="confirmation" name="confirmation" v-model="confirmed" class="mr-1" type="checkbox" v-validate="'required'">
              <label class="text-bold checkbox-approvement-label" for="confirmation">I approve the information I provided is correct</label>
              <div class="help text-left text-danger" v-show="errors.has('confirmation')">{{ errors.first('confirmation') }}</div>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-lg-10 offset-lg-1 d-flex justify-content-center">
              <recaptcha @grecaptcha="verifyRecaptcha"></recaptcha>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-lg-8 offset-lg-2">
              <button type="button" class="btn btn-lg btn-violet-inverse border-curved btn-space" @click="backToUpload"><i class="fa fa-chevron-left"></i> Back</button>
              <button type="button" class="btn btn-lg btn-violet border-curved btn-space" id="submit_documents" v-bind:class="{ disabled: disabled }" @click="submitDocuments">Submit <i class="fa fa-chevron-right"></i></button>
            </div>
          </div>
        </form>

        <div v-else>
          <h1 class="text-default">Success!</h1>
          <h3>Your documents were successfully sent.</h3>
          <p><a href="/" class="btn btn-lg btn-violet border-curved"><i class="fa fa-home"></i> Home</a></p>
        </div>

        <div v-show="error" class="alert alert-danger" id="contact_form_response">Can not submit your smart link. Please try again later.</div>

      </div>
    </div>
      </div>
      <div v-else>
          <error-template></error-template>
      </div>
  </div>
</template>

<script>
  import { DialogueState, DataState, LoadingState } from '@/main'
  // import smartLinkService from '@/services/smartlink.js'
  import sdpService from '@/services/securedocumentportal.js'
  import smartlink from '@/services/smartlink'
  import Recaptcha from '../../recaptcha/recaptcha'
  import router from '@/router'
  import ErrorTemplate from '@/components/SecureDocumentPortal/ErrorTemplate/ErrorTemplate.vue'

  export default {
    components: {
      ErrorTemplate,
      Recaptcha },
    name: 'upload',
    data () {
      return {
        position: 'Accountant',
        reportGrecaptcha: '',
        name: null,
        custom_position: null,
        confirmed: false,
        disabled: true,
        success_submit: false,
        show_position_input: false,
        error: false,
        jwtError: false
      }
    },
    watch: {
      name: {
        handler: function (val) {
          this.updateSubmitButton()
        }
      },
      position: {
        handler: function (val) {
          if (val !== 'other') {
            this.show_position_input = false
            if (val && this.name && this.confirmed && this.reportGrecaptcha) {
              this.disabled = false
            }
          } else {
            this.show_position_input = true
            if (this.custom_position && this.confirmed && this.reportGrecaptcha) {
              this.disabled = false
            } else {
              this.disabled = true
            }
          }
          this.updateSubmitButton()
        }
      },
      custom_position: {
        handler: function (val) {
          this.updateSubmitButton()
        }
      },
      confirmed: {
        handler: function (val) {
          this.updateSubmitButton()
        }
      },
      reportGrecaptcha: {
        handler: function (val) {
          this.updateSubmitButton()
        }
      }
    },
    methods: {

      verifyRecaptcha (response) {
        console.log('verified captcha')
        this.reportGrecaptcha = response
      },

      openUploadDocumentsModal: function () {
        DialogueState.$emit('uploadDocuments', {
          dialogue_type: 'upload'
        })
      },
      backToUpload () {
        router.push('/sdp/upload')
      },
      submitDocuments () {
        this.error = false
        this.$validator.validateAll().then(success => {
          if (this.reportGrecaptcha.length < 1) {
            return
          }
          if (!success) {
            console.log(this.$validator.getErrors())
            return
          }
          let position = this.position
          if (this.show_position_input) {
            position = this.custom_position
          }
          LoadingState.$emit('toggle', true)
          let data = {
            name: this.name,
            position: position,
            captcha: this.reportGrecaptcha
          }
          sdpService.submitReports(this, data).then((response) => {
            this.jwtError = false
            if (response.status === 401) {
              console.log('jwt error')
              this.jwtError = true
              LoadingState.$emit('toggle', false)
              return
            } else if (response.body.success === false) {
              console.log('catched false')
              this.error = true
              LoadingState.$emit('toggle', false)
              return
            } else if (!response.body.message) {
              console.log(response)
            } else {
              console.log('success')
              window.localStorage.clear()
              this.success_submit = true
              this.removeHelpButton()
            }
            LoadingState.$emit('toggle', false)
          }).catch((error) => {
            console.log(error)
            this.error = true
          })
        }).catch((error) => {
          return error
        })
      },
      removeHelpButton () {
        let payload = {
          display: false
        }
        DataState.$emit('displayHelpButton', payload)
      },
      initHelp () {
        let list = [
          'Your Name and Position will be sent to the requester with the documents.'
        ]
        let payload = {
          list: list
        }
        DataState.$emit('helpList', payload)
      },
      updateSubmitButton () {
        this.$validator.validateAll().then(success => {
          if (success) {
            if (this.reportGrecaptcha.length < 1) {
              this.disabled = true
            } else {
              this.disabled = false
            }
          } else {
            this.disabled = true
          }
        }).catch(() => {
          if (this.reportGrecaptcha.length < 1) {
            this.disabled = true
          }
        })
      },
      async getSdpState () {
        LoadingState.$emit('toggle', true)
        let response = await smartlink.getSdpState(this)
        if (response.status === 401) {
          LoadingState.$emit('toggle', false)
          this.jwtError = true
        } else {
          LoadingState.$emit('toggle', false)
          this.jwtError = false
        }
      }
    },
    mounted () {
      this.initHelp()
      this.getSdpState()
      this.success_submit = false
      // this.getSdpState()

      if (!window.localStorage.getItem('temp_token')) {
        router.push('/')
      }

      DataState.$on('recaptchaExpired', (payload) => {
        this.reportGrecaptcha = ''
      })
    }
  }
</script>

<style scoped>
  @media screen and (max-width: 1190px) {
    .checkbox-approvement-label {
      font-size: 70% !important;
    }
  }
  @media screen and (max-width: 1080px) {
    .checkbox-approvement-label {
      font-size: 65% !important;
    }
  }
  @media screen and (max-width: 991px) {
    .checkbox-approvement-label {
      font-size: 90% !important;
    }
  }
  @media screen and (max-width: 796px) {
    .checkbox-approvement-label {
      font-size: 80% !important;
    }
  }
</style>

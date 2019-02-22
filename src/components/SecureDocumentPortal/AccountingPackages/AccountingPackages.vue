<template>
<div>
    <div class="row">
        <div class="col-lg-12 text-center">
            <h1 class="text-white">Secure Document Portal​</h1>
        </div>
    </div>

    <div v-if="showMyob"  class="row centered-containers">
        <div class="col-lg-3 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-2 text-center background-white border-curved distance margin distance integration-container">
            <h2 class="text-bold text-title">MYOB: Choose Company To connect</h2>
            <div class="row">

                <div class="col-lg-12">
                    <div v-if="myobAccountError">
                        <b-alert show variant="danger">You have entered an invalid username or password</b-alert>
                    </div>
                    <form id="myob_auth">
                        <div class="form-group text-left" id="myob_company_wrapper">
                            <select name="chosen_company" v-model="chosen_company" v-validate data-vv-rules="required" :class="{ 'form-control': true, 'is-danger': errors.has('chosen_company') }">
                                <option selected value="" disabled>Choose a company</option>
                                <option v-for="(company_file, index) in company_files" :key="index" :value="company_file">{{company_file.name}}</option>
                            </select>
                            <label v-if="errors.has('chosen_company:required')" class="text-danger text-left">This field is required</label>
                            <i v-if="is_loading" class="fa fa-cog fa-spin"></i>
                        </div>
                        <div class="form-group text-left">
                            <input type="text" id="myob_username" name="myob_username" placeholder="username" v-model="company_file_username" v-validate data-vv-rules="required" :class="{ 'form-control': true, 'is-danger': errors.has('myob_username') }">
                            <label for="myob_username" v-if="errors.has('myob_username:required')" class="text-danger">This field is required</label><br>
                            <input type="password" class="form-control" id="myob_password" name="myob_password" placeholder="password" v-model="company_file_password"><br>
                            <div class="text-center">
                                <a class="btn btn-lg btn-violet border-curved" id="connect-myob-company" @click="submit_myob_choose_company()">Connect</a>
                            </div>
                        </div>
                    </form>

                    <p id="accounting-info-login" class="before-accounting">
                        <img class="upload-success" src="@/assets/info_sl.png"> Please verify your accounting package is up to date before connecting. If you are uncertain - please copy and send the link to your accountant
                        <br>
                    </p>

                    <p class="before-accounting">
                        <a @click="copyUrl" id="copy_url_accounting" class="btn border-curved btn-violet btn-md"><i class="fa fa-copy"></i> Copy Link</a>
                    </p>

                    <p class="text-center">
                        <input type="hidden" readonly class="form-control text-center" id="copy_ac_url" v-model="link">
                    </p>
                    <transition name="fade">
                        <div class="alert alert-success" id="url_copy_success" v-if="urlCopySuccess">Your Link has been copied into the clipboard</div>
                    </transition>

                    <div class="alert alert-danger" id="select-company-error" style="display: none"></div>
                </div>
            </div>
        </div>
    </div>

    <div class="row centered-containers" v-else>
        <div class='col-lg-3 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-2 text-center background-white border-curved distance margin distance integration-container'>
            <h2 class="text-bold text-title">Click your accounting package to connect</h2>
            <div class="row">
                <div class="col-lg-4 pb-lg-0 pb-3">
                    <div id="connect-xero" @click="connectxero()"><img class="img-responsive provider-icons ap-icon" src="@/assets/xero.png" alt="Xero"></div>
                </div>
                <div class="col-lg-4 pb-lg-0 pb-3">
                    <div id="connect-myob" @click="connectmyob()"><img class="img-responsive provider-icons ap-icon border-circle" src="@/assets/myob.png" alt="Myob"></div>
                </div>
                <div class="col-lg-4 pb-lg-0 pb-3">
                    <div id="connect-qb" @click="connectqb()"><img class="img-responsive provider-icons ap-icon" src="@/assets/qb_full.png" alt="QuickBooks"></div>
                </div>
            </div>
            <p></p>

            <p v-if="!showNext" class="text-secondary before-accounting">Securely connect to Xero, MYOB or Quickbooks file</p>
            <transition name="fade">
            <div v-if="showProgress" class="mb-3">
                <b-progress v-model="uploading_progress" :precision="1" :variant="'success'" animated></b-progress>
            </div>
            </transition>
            <p v-if="showNext" id="accounting-success">
                <img class="upload-success" src="@/assets/success_icon.png"> Success! Your accounting package was connected</p>
            <p id="accounting-info" class="before-accounting" v-else>
                <img class="upload-success" src="@/assets/info_sl.png"> Please verify your accounting package is up to date before connecting. If you are uncertain - please copy and send the link to your accountant
                <br>
            </p>
            <p class="before-accounting" v-if="!showNext">
                <a @click="copyUrl" id="copy_url_accounting" class="btn border-curved btn-violet btn-md"><i class="fa fa-copy"></i> Copy Link</a>
            </p>
            <p class="text-center">
                <input type="hidden" readonly class="form-control text-center" id="copy_ac_url" v-model="link">
            </p>
            <transition name="fade">
                <div class="alert alert-success" id="url_copy_success" v-if="urlCopySuccess">Your Link has been copied into the clipboard</div>
            </transition>
        </div>

    </div>
    <div class="row">
        <div class="col-lg-12 text-center padding-top">
            <p v-if="((state === 'authorized' || state === 'choosingaccountingpackage') && !extractionRequired)" id="skip_accounting">
                <a id="skip_accounting_link" @click="goToUpload" class="btn btn-lg btn-white border-curved">Skip</a>
            </p>
            <p id="next">
                <a @click="goToApproveReports" class="btn btn-lg btn-white border-curved" v-if="showNext && !extractionRequired">Next</a>
                <a @click="goToUpload" class="btn btn-lg btn-white border-curved" v-if="showNext && extractionRequired">Next</a>
            </p>
            <p v-if="((state === 'authorized' || state === 'choosingaccountingpackage') && !extractionRequired)">
                <img class="upload-success" src="@/assets/info_sl.png"> <small class="text-bold text-white"> You will also be able to upload documents in the next steps</small>
            </p>
            <p v-if="!showNext && extractionRequired">
                <img class="upload-success" src="@/assets/info_sl.png"> <small class="text-bold text-white"> Please connect to an accounting package to continue</small>
            </p>
        </div>
    </div>
</div>
</template>

<script>
import securedocumentportal from '@/services/securedocumentportal'
import { LoadingState, DataState } from '@/main'
import { mapGetters } from 'vuex'
import router from '@/router'
export default {
  components: { },
  name: 'accounting-packages',
  data () {
    return {
      user_id: null,
      unique_id: null,
      // link: window.localStorage.getItem('tiny_url'),
      link: window.localStorage.getItem('accounting_package_url'),
      urlCopySuccess: false,
      showNext: false,
      interval: null,
      uploading_progress: 0,
      showProgress: false,
      showMyob: false,
      company_files: [],
      chosen_company: '',
      company_file_username: '',
      company_file_password: '',
      is_loading: false,
      extractionRequired: false,
      myobAccountError: false
    }
  },
  computed: {
    ...mapGetters({
      state: 'state'
    })
  },
  methods: {
    goToApproveReports () {
      router.push({ name: 'ar' })
    },
    goToUpload () {
      router.push('/sdp/upload')
    },
    copyUrl () {
      this.urlCopySuccess = false
      let input = document.querySelector('#copy_ac_url')
      input.setAttribute('type', 'text')
      let isiOSDevice = navigator.userAgent.match(/ipad|iphone/i)
      if (isiOSDevice) {
        let editable = input.contentEditable
        // let readOnly = input.readOnly

        input.contentEditable = true
        // input.readOnly = false

        let range = document.createRange()
        range.selectNodeContents(input)
        let selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)

        input.setSelectionRange(0, 999999)
        input.contentEditable = editable
        // input.readOnly = readOnly
      } else {
        input.select()
      }

      document.execCommand('copy')
      this.urlCopySuccess = true
      window.getSelection().removeAllRanges()
    },
    connectxero () {
      if (this.showProgress === false) {
        LoadingState.$emit('toggle', true)
        securedocumentportal.connectXero(this).then(async response => {
          console.log(response)
          if (response.body.message === 'get redirect url successfully') {
            await this.$store.dispatch('updateState', { context: this, params: { state: 'choosingaccountingpackage' } })
            dataLayer.push({
              'package': 'Xero',
              'event': 'accountingPackageSelection'
            })
            window.location = response.body.data.url
          } else {
            LoadingState.$emit('toggle', false)
            DataState.$emit('jwtError', true)
            // this.toast.showToast(response.body.message, { theme: 'error', timeLife: 5000 })
          }
        })
      }
    },
    connectmyob () {
      if (this.showProgress === false) {
        LoadingState.$emit('toggle', true)
        securedocumentportal.connectMyob(this).then(async response => {
          console.log(response)
          if (response.body.message === 'get redirect url successfully') {
            await this.$store.dispatch('updateState', { context: this, params: { state: 'choosingaccountingpackage' } })
            dataLayer.push({
              'package': 'MYOB',
              'event': 'accountingPackageSelection'
            })
            window.location = response.body.data.url
          } else {
            LoadingState.$emit('toggle', false)
            DataState.$emit('jwtError', true)
            // this.toast.showToast(response.body.message, { theme: 'error', timeLife: 5000 })
          }
        })
      }
    },
    connectqb () {
      if (this.showProgress === false) {
        LoadingState.$emit('toggle', true)
        securedocumentportal.connectQb(this).then(async response => {
          console.log(response)
          if (response.body.message === 'get redirect url successfully') {
            await this.$store.dispatch('updateState', { context: this, params: { state: 'choosingaccountingpackage' } })
            dataLayer.push({
              'package': 'QB',
              'event': 'accountingPackageSelection'
            })
            window.location = response.body.data.url
          } else {
            LoadingState.$emit('toggle', false)
            DataState.$emit('jwtError', true)
            // this.toast.showToast(response.body.message, { theme: 'error', timeLife: 5000 })
          }
        })
      }
    },
    getcompanyfiles () {
      this.is_loading = true
      this.company_files = []
      securedocumentportal.getMyobCompanyFiles(this).then(response => {
        if (response.status === 200) {
          let i
          for (i = 0; i < response.body.data.length; i++) {
            this.company_files.push(response.body.data[i])
          }
        } else {
        }
        this.is_loading = false
      })
    },
    async getSdpState () {
    // todo check status -- choosingaccountingpackage or extracted check job status api
      LoadingState.$emit('toggle', true)
      await this.$store.dispatch('getState', { context: this })
      console.log('state in accounting package---', this.state)
      console.log(this.state)
      if (this.state === undefined || this.state === '') {
        DataState.$emit('jwtError', true)
      } else {
        // if (this.state !== undefined && this.state !== 'authorized' && this.state !== 'extracted' && this.state !== 'myobverified') {
        if (this.state === 'downloading') {
          this.showMyob = false
          this.$forceUpdate()
          this.showProgress = true
          this.interval = setInterval(async () => {
            LoadingState.$emit('toggle', false)
            this.uploading_progress = this.uploading_progress + 2
            let response = await securedocumentportal.checkJobStatus(this)
            if (response.status === 200) {
              this.myobAccountError = false
              if (response.body.status === 'downloaded') {
                console.log('reports downloaded')
                this.uploading_progress = 100
                setTimeout(async () => {
                  this.showNext = true
                  this.showProgress = false
                }, 1000)
                clearInterval(this.interval)
              } else if (response.body.status === 'company_files_obtained') {
                this.showMyob = true
                this.myobAccountError = true
                clearInterval(this.interval)
                this.getcompanyfiles()
                LoadingState.$emit('toggle', false)
              }
            } else if (response.status === 401) {
              clearInterval(this.interval)
              DataState.$emit('jwtError', true)
            }
          }, 2000)
        } else if (this.state === 'extracted') {
          this.showNext = true
          LoadingState.$emit('toggle', false)
        } else if (this.state === 'myobverified') {
          this.showMyob = true
          this.getcompanyfiles()
          LoadingState.$emit('toggle', false)
        } else {
          LoadingState.$emit('toggle', false)
        }
      }
      // LoadingState.$emit('toggle', false)
    },
    submit_myob_choose_company () {
      this.$validator.validateAll().then(success => {
        if (!success) {
          // handle error
          // this.isValidationPassed = false
          console.log('this errors in validation', this.errors)
          return
        }
        this.authmyob()
      }).catch(() => {
      })
    },
    async authmyob () {
      LoadingState.$emit('toggle', true)
      // this.$Progress.start()
      let data = {
        company_id: this.chosen_company.id,
        username: this.company_file_username,
        password: this.company_file_password
      }
      console.log(data)
      const myobResponse = await securedocumentportal.updateMyobCompanyFiles(this, data)
      if (myobResponse.status === 200) {
        this.getSdpState()
      } else if (myobResponse.status === 401) {
        DataState.$emit('jwtError', true)
      }
    },
    initHelp () {
      let list = [
        'Click on one of the accounting packages icons to securely connect to it. We will extract the necessary data automatically for you.',
        'By clicking "Copy Link", you can copy the original smart link you received and be able to send it to your accountant or adviser, so they will go through this process instead of you.\n' +
        'By this action, no information will be displayed to them, except for the initial report list you are requested to supply.',
        'After connecting to your accounting package, you will be able to manually upload additional documents.'
      ]
      if (this.extractionRequired === true) {
        list.push('For a Credit Score Check, an accounting package must be connected.')
      } else {
        list.push('If you do not want to securely connect to your accounting package, you can click “Skip” and manually upload your documents instead.')
      }
      let payload = {
        list: list
      }
      DataState.$emit('helpList', payload)
    }
  },
  mounted () {
    if (window.localStorage.getItem('extraction_required') === 'true') {
      this.extractionRequired = true
    }
    this.initHelp()
    this.getSdpState()
  }
}
</script>

<style scoped>

</style>

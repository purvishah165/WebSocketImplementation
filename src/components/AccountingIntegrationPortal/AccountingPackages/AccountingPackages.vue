<template>
<div>
    <!--<div class="row">-->
        <!--<div class="col-lg-12 text-center">-->
            <!--<h1 class="text-white">Secure Document Portal​</h1>-->
        <!--</div>-->
    <!--</div>-->
    <!--<div v-if="showMyob"  class="row centered-containers">-->
        <!--<div class="col-lg-3 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-2 text-center background-white border-curved distance margin distance integration-container">-->
            <!--<h2 class="text-bold text-title">MYOB: Choose Company To connect</h2>-->
            <!--<div class="row">-->

                <!--<div class="col-lg-12">-->
                    <!--<div v-if="myobAccountError">-->
                        <!--<b-alert show variant="danger">You have entered an invalid username or password</b-alert>-->
                    <!--</div>-->
                    <!--<form id="myob_auth">-->
                        <!--<div class="form-group" id="myob_company_wrapper">-->
                            <!--<select name="chosen_company" v-model="chosen_company" v-validate data-vv-rules="required" :class="{ 'form-control': true, 'is-danger': errors.has('chosen_company') }">-->
                                <!--<option selected value="" disabled>Choose a company</option>-->
                                <!--<option v-for="(company_file, index) in company_files" :key="index" :value="company_file">{{company_file.name}}</option>-->
                            <!--</select>-->
                            <!--<i v-if="is_loading" class="fa fa-cog fa-spin"></i>-->
                        <!--</div>-->
                        <!--<div class="form-group">-->
                            <!--<input type="text" class="form-control" id="myob_username" name="myob_username" placeholder="username" v-model="company_file_username" v-validate data-vv-rules="required"><br>-->
                            <!--<input type="password" class="form-control" id="myob_password" name="myob_password" placeholder="password" v-model="company_file_password"><br>-->
                            <!--<a class="btn btn-lg btn-violet border-curved" id="connect-myob-company" @click="submit_myob_choose_company()">Connect</a>-->
                        <!--</div>-->
                    <!--</form>-->
                    <!--<div class="alert alert-danger" id="select-company-error" style="display: none"></div>-->
                <!--</div>-->
            <!--</div>-->
        <!--</div>-->
    <!--</div>-->
    <div class="row centered-containers">
        <div class='col-lg-3 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-2 text-center background-white border-curved distance margin distance-vertical integration-container'>
            <h2 class="text-bold text-title">Click your accounting package to connect</h2>
            <div class="row">

                <div class="col-lg-4 pb-lg-0 pb-3">
                    <div id="connect-xero" @click="connectxero()" ><img class="img-responsive provider-icons ap-icon" src="@/assets/xero.png" alt="Xero" :class="{'disable-click': this.showProgress || this.success}"></div>
                </div>
                <div class="col-lg-4 pb-lg-0 pb-3">
                    <div id="connect-myob" @click="connectmyob()"><img class="img-responsive provider-icons ap-icon border-circle" src="@/assets/myob.png" alt="Myob" :class="{'disable-click': this.showProgress || this.success}"></div>
                </div>
                <div class="col-lg-4 pb-lg-0 pb-3">
                    <div id="connect-qb" @click="connectqb()" ><img class="img-responsive provider-icons ap-icon" src="@/assets/qb_full.png" alt="QuickBooks" :class="{'disable-click': this.showProgress || this.success}"></div>
                </div>
            </div>
            <p class="text-secondary before-accounting mt-3" v-if="!showProgress && !success">Securely connect to Xero, MYOB or Quickbooks file</p>
            <div v-if="showProgress" class="mt-3 mb-3">
                <b-progress v-model="uploading_progress" :precision="1" :variant="'success'" animated></b-progress>
            </div>
            <p v-show="success" id="accounting-success" class="mt-3">
                <img class="upload-success" src="@/assets/success_icon.png"> Success! Your accounting package was connected</p>

        </div>

    </div>

    <!--<div class="row">-->
        <!--<div class="col-lg-12 text-center padding-top">-->
            <!--<p style="display: none" id="skip_accounting"><a  href="/upload" class="btn btn-lg btn-white border-curved">Skip</a></p>-->
            <!--<p style="display: none" id="next"><a href="/approve-reports" class="btn btn-lg btn-white border-curved">Next</a></p>-->
            <!--<p><img class="upload-success" src="@/assets/info_sl.png"> <small class="text-bold text-white">You will also be able to upload documents later on</small></p>-->
        <!--</div>-->
    <!--</div>-->
</div>
</template>

<script>
import securedocumentportal from '@/services/securedocumentportal'
import socketservices from '@/services/socket'
import { LoadingState, DataState, DialogueState } from '@/main'
import io from 'socket.io-client'

export default {
  name: 'accounting-packages',
  data () {
    return {
      identifier: null,
      state: null,
      socket: null,
      status: null,
      socket_client: null,
      auth: null,
      // Progress
      showMyob: false,
      progress_state: undefined,
      showProgress: false,
      company_files: [],
      chosen_company: '',
      company_file_username: '',
      company_file_password: '',
      is_loading: false,
      uploading_progress: 0,
      success: false,
      myobAccountError: false
    }
  },
  methods: {
    emit (eventName, payload) {
      this.socket.emit(eventName, payload)
    },
    myPopup (myURL, title, myWidth, myHeight) {
      let left = window.screenX + window.outerWidth / 2 - myWidth / 2
      let top = (window.screen.height - myHeight) / 4
      window.open(myURL, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + myWidth + ', height=' + myHeight + ', top=' + top + ', left=' + left)
    },
    connectxero () {
      if (this.showProgress === false && !this.success) {
        LoadingState.$emit('toggle', true)
        securedocumentportal.connectXero(this, this.auth).then(async response => {
          console.log(response)
          if (response.body.message === 'get redirect url successfully') {
            this.myPopup(response.body.data.url, 'accounting package auth', 400, 550)
            LoadingState.$emit('toggle', false)
          } else {
            LoadingState.$emit('toggle', false)
            // this.toast.showToast(response.body.message, { theme: 'error', timeLife: 5000 })
          }
        })
      }
    },
    connectmyob () {
      if (this.showProgress === false && !this.success) {
        LoadingState.$emit('toggle', true)
        securedocumentportal.connectMyob(this, this.auth).then(async response => {
          console.log(response)
          if (response.body.message === 'get redirect url successfully') {
            this.myPopup(response.body.data.url, 'accounting package auth', 400, 550)
            LoadingState.$emit('toggle', false)
          } else {
            LoadingState.$emit('toggle', false)
            // this.toast.showToast(response.body.message, { theme: 'error', timeLife: 5000 })
          }
        })
      }
    },
    connectqb () {
      if (this.showProgress === false && !this.success) {
        LoadingState.$emit('toggle', true)
        securedocumentportal.connectQb(this, this.auth).then(async response => {
          console.log(response)
          if (response.body.message === 'get redirect url successfully') {
            this.myPopup(response.body.data.url, 'accounting package auth', 400, 550)
            LoadingState.$emit('toggle', false)
          } else {
            LoadingState.$emit('toggle', false)
            // this.toast.showToast(response.body.message, { theme: 'error', timeLife: 5000 })
          }
        })
      }
    },
    getcompanyfiles () {
      this.is_loading = true
      this.company_files = []
      securedocumentportal.getMyobCompanyFiles(this, this.auth).then(response => {
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
      const myobResponse = await securedocumentportal.updateMyobCompanyFiles(this, data, this.auth)
      if (myobResponse.status === 200) {
        // Success
      }
    },
    openMyob () {
      DialogueState.$emit('myobmodal', {
        auth: this.auth,
        myobAccountError: this.myobAccountError
      })
    }
  },

  mounted () {
    console.log(this.$route)
    if (this.$route.query.state) {
      this.state = this.$route.query.state
    }
    if (this.$route.query.identifier) {
      this.identifier = this.$route.query.identifier
    }
    console.log('this.identifier', this.identifier)
    if (this.status !== 'disconnected') {
      this.socket = io(process.env.VUE_APP_SOCKET_URL)
    }
    this.socket.on('connect', () => {
      this.emit('join')
      this.status = 'connected'
    })

    this.socket.on('joined', socketClient => {
      this.socket_client = socketClient
      console.log(this.socket_client)
      // generate auth
      LoadingState.$emit('toggle', true)
      socketservices.storeSocketAuth(this, {
        id: this.socket_client.id,
        client_ref: this.identifier,
        state: this.state
      }).then(response => {
        console.log(response)
        this.auth = {
          'authorization': 'Bearer ' + response.body.data
        }
        LoadingState.$emit('toggle', false)
      })
    })

    this.socket.on('states', message => {
      console.log(message)
      this.myobAccountError = false
      if (message === 'callBackDone') {
        console.log('reports downloaded')
        this.uploading_progress = 100
        setTimeout(async () => {
          this.success = true
          this.showProgress = false
        }, 1000)
        clearInterval(this.interval)
      } else if (message === 'myobVerified') {
        this.openMyob()
        // this.showMyob = true
        // this.getcompanyfiles()
        LoadingState.$emit('toggle', false)
      } else if (message === 'Verified') {
        this.showMyob = false
        this.showProgress = true
        this.uploading_progress = 1
        this.interval = setInterval(async () => {
          this.uploading_progress = this.uploading_progress + 2
        }, 2000)
        LoadingState.$emit('toggle', false)
      } else if (message === 'AuthFaild') {
        this.myobAccountError = true
        this.showProgress = false
        this.openMyob()
        LoadingState.$emit('toggle', false)
      }
    })
    this.socket.on('error', (err) => {
      console.log('Error connecting to server', err)
      DataState.$emit('jwtError', true)
    })
    this.socket.on('connect_error', () => {
      console.log('connect_error')
      this.emit('disconnect')
      DataState.$emit('jwtError', true)
    })
    this.socket.on('disconnect', () => {
      this.status = 'disconnected'
    })
    DataState.$on('resetSocket', (payload) => {
      window.location.reload()
    })
  },
  destroyed () {
    DataState.$off('jwtError')
  }
}
</script>

<style scoped>

</style>

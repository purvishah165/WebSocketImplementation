<template>
    <b-modal centered size="md" :no-close-on-backdrop=true ref="myob_modal" class="myob-modal">
        <div slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">

            <!--                <h2 class="modal-title text-center centered-header">Information</h2>-->
            <button type="button" class="close" @click="hideModal">&times;</button>
        </div>
    <div class="row centered-containers">
        <div class="text-center background-white border-curved margin myob-distance integration-container">
            <h2 class="text-bold text-title">MYOB: Choose Company To connect</h2>
            <div class="row">

                <div class="col-lg-12">
                    <div v-if="myobAccountError">
                        <b-alert show variant="danger">You have entered an invalid username or password</b-alert>
                    </div>
                    <form id="myob_auth">
                        <div class="form-group" id="myob_company_wrapper">
                            <select name="chosen_company" v-model="chosen_company" v-validate data-vv-rules="required" :class="{ 'form-control': true, 'is-danger': errors.has('chosen_company') }">
                                <option selected value="" disabled>Choose a company</option>
                                <option v-for="(company_file, index) in company_files" :key="index" :value="company_file">{{company_file.name}}</option>
                            </select>
                            <i v-if="is_loading" class="fa fa-cog fa-spin"></i>
                        </div>
                        <div class="form-group mb-0">
                            <input type="text" class="form-control" id="myob_username" name="myob_username" placeholder="username" v-model="company_file_username" v-validate data-vv-rules="required"><br>
                            <input type="password" class="form-control" id="myob_password" name="myob_password" placeholder="password" v-model="company_file_password"><br>
                            <!--<a class="btn btn-lg btn-violet border-curved" id="connect-myob-company" @click="submit_myob_choose_company()">Connect</a>-->
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
        <div slot="modal-footer" class="modal-no-border">
            <div class="col-12 text-center">
                <a class="btn btn-violet btn-lg border-curved" @click="submit_myob_choose_company">Connect</a>
                <p></p>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState, LoadingState } from '@/main.js'
import securedocumentportal from '@/services/securedocumentportal'
export default {
  name: 'myob-popup',
  data () {
    return {
      company_files: [],
      chosen_company: '',
      company_file_username: '',
      company_file_password: '',
      is_loading: false,
      auth: null,
      myobAccountError: false
    }
  },
  methods: {
    hideModal () {
      this.$refs.myob_modal.hide()
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
        this.hideModal()
      }
    }
  },
  mounted () {
    DialogueState.$on('myobmodal', (payload) => {
      this.auth = payload.auth
      this.myobAccountError = payload.myobAccountError
      if (this.$refs.myob_modal) {
        this.$refs.myob_modal.show()
        this.getcompanyfiles()
      }
    })
  }
}
</script>

<style scoped>

</style>

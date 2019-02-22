<template>
    <b-modal centered ref="report_modal" size="lg">
        <div v-if="dialogue_type === 'report'" slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">
            <div class="modal-label">
                <div class="modal-title col-12" v-if="dialogue_type === 'report'">
                    <h2 class="text-center centered-header wizard-header">Choose the reports you need from your customer:</h2>
                    <b class="text-italics text-violet text-center free_trial_notification" v-if="!subscription_required && !logged">First time user? Use all the reports for free!</b>
                </div>
            </div>
            <div class="d-flex align-items-center">
                <a @click='hideModal' class="cursor-pointer"><i class="fa fa-times" aria-hidden="true"></i></a>
            </div>
        </div>
        <div v-if="dialogue_type === 'report'" >
            <div id="choose_reports_step" v-if="!failedResponse">
                <div class="row choose-reports">
                    <div class="col-lg-6 col-sm-12 choose-reports-column">
                        <h3 class="text-bold text-center">Financial Reports</h3>
                        <div class="d-flex justify-content-center">
                            <div class="choose-reports-wrapper">
                                <div class="report-row">
                                    <span><input class="checkbox_option" id="selectAllFR"  v-model="selectAllFR" type="checkbox" ><label for="selectAllFR">(Select All)</label></span>
                                    <!--<span><label class="mb-0">(Select All)</label></span>-->
                                </div>
                                <div class="report-row" v-for="(document, $index) in documentList" :key="document.id">
                                    <span>
                                        <i class='fa fa-lock paid_plan_lock   pricing-modal' @click="openPaidModal" v-if="document.enabled === 0"></i>
                                        <input :id="document.id" class="checkbox_option" name="field" v-model="selectedFinancialDocuments"  v-bind:value="document.id" type="checkbox" v-validate data-vv-rules="required" number v-if="document.enabled !== 0">
                                        <label :for="document.id">{{document.name}}</label>
                                    </span>
                                    <!--<span><label class="mb-0">{{document.name}}</label></span>-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6 col-sm-12 choose-reports-column">
                        <h3 class="text-bold text-center">Insights Loan Hero AI</h3>
                        <div class="d-flex justify-content-center">
                            <div class="choose-reports-wrapper">
                                <div class="report-row">
                                    <span><input class="checkbox_option" id="selectAllIR"  v-model="selectAllIR" type="checkbox" ><label for="selectAllIR">(Select All)</label></span>
                                    <!--<span><label class="mb-0">(Select All)</label></span>-->
                                </div>
                                <div class="report-row" v-for="(document, $index) in analysisList" :key="document.id">
                                    <!--{{ document }}-->
                                    <span>
                                        <i class='fa fa-lock paid_plan_lock pricing-modal' @click="openPaidModal" v-if="document.enabled === 0"></i>
                                        <input :id="document.id" class="checkbox_option" name="field" v-model="selectedInsightDocuments"  v-bind:value="document.id" type="checkbox" v-validate data-vv-rules="required" number v-if="document.enabled !== 0">
                                        <label :for="document.id">{{document.name}}</label>
                                    </span>
                                    <!--<span><label class="mb-0">{{document.name}}</label></span>-->
                                </div>
                            </div>
                            <div class="p-3">
                                <img class="ai-icon" src="@/assets/ai.png">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 more-reports-paid " v-if="subscription_required">
                    <p>&nbsp;</p>
                    <p><a class="cursor-pointer pricing-modal" @click="openPaidModal"><i class="fa fa-lock paid_plan_lock"></i> More Reports available in paid plan</a></p>
                    <p class="login-link-text mb-0" v-if="!logged">Already have a plan?</p>
                    <a class="login-link lrm-login cursor-pointer text-underline" @click="openLoginModal" v-if="!logged">Log in Here</a>
                </div>
                <div class="col-lg-12 d-flex justify-content-center">
                    <recaptcha @grecaptcha="verifyRecaptcha"></recaptcha>
                </div>
            </div>
        </div>
        <div v-if="dialogue_type === 'success'">
            <div class="col-lg-12">
                <h1 class="text-center text-violet modal-header-large">Success!</h1>
            </div>
            <div class="col-lg-12">
                <h4 class="text-center text-bold">
                    An email has been sent to you with your smart link.<br>
                    You can also copy it into your clipboard from the home page.<br>
                </h4>
            </div>
            <div class="col-lg-12 text-center">
                <img src="@/assets/success.png" class="img-responsive img-success">
            </div>
        </div>
        <div slot="modal-footer" class="w-100 justify-content-center d-flex flex-column" >
            <div v-if="dialogue_type === 'report' && !failedResponse" class="col-lg-12 text-center">
                <p id="loading" v-if="sending"><i class="fa fa-cog fa-spin fa-2x"></i></p>
                <p v-else><button type="button" id="submit-email-modal" class="btn btn-violet input-curved" @click="submitEmailModal">Generate and Send Link!</button></p>
            </div>
            <div v-if="dialogue_type === 'report' && !failedResponse" class="col-lg-12 text-center">
                <small>By continuing, you agree to our <a class="text-black text-underline" href="/terms-privacy-policy" target="_blank">Terms & Privacy Policy.</a></small>
                <p v-if="noneSelected" class="text-center error-message">Please choose a report to generate link.</p>
            </div>
            <div v-if="dialogue_type === 'report' && failedResponse" id="error" class="text-center">
                <h3><b id="error_message" class="alert ff-alert-danger">Please contact administrator or try again later</b></h3>
                <button type="button" class="close-link-modal btn btn-violet input-curved text-bold mt-3" @click='hideModal'>Close</button>
            </div>
            <div v-if="dialogue_type === 'success'" class="col-lg-12 text-center">
                <button type="button" class="close-link-modal btn btn-violet input-curved text-bold" @click='emitSuccess'>Close</button>
                <p></p>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState, LoadingState, DataState } from '@/main.js'
import smartLinkService from '@/services/smartlink.js'
import auth from '@/services/auth'
import Recaptcha from '../recaptcha/recaptcha'
export default {
  components: { Recaptcha },
  name: 'reportSelectionModal',
  data () {
    return {
      selectedDocuments: [],
      selectedFinancialDocuments: [],
      selectedInsightDocuments: [],
      dialogue_type: null,
      email: null,
      reportGreptcha: null,
      documentList: [],
      analysisList: [],
      subscription_required: false, // flag to say first time user or user already used it one time
      sending: false,
      failedResponse: false, // flag for any connection errors
      noneSelected: false,
      logged: false
    }
  },
  computed: {
    docLength: function () {
      return this.documentList.length
    },
    selectAllFR: {
      get: function () {
        let count = 0
        console.log(this.documentList)
        this.documentList.forEach((doc, index) => {
          if (doc.enabled === 0) {
            if (!doc.is_paid) {
              count++
            }
          } else {
            count++
          }
        })
        if (this.selectedFinancialDocuments.length === 0) {
          return false
        } else {
          return this.documentList ? this.selectedFinancialDocuments.length === count : false
        }
      },
      set: function (value) {
        var selected = []

        if (value) {
          this.documentList.forEach((doc, index) => {
            // if (doc.enabled || !doc.is_paid) {
            selected.push(doc.id)
            // }
          })
        }
        this.selectedFinancialDocuments = selected
      }
    },
    selectAllIR: {
      get: function () {
        let count = 0
        this.analysisList.forEach((doc, index) => {
          if (doc.enabled !== 0) {
            count++
          }
        })
        if (this.selectedInsightDocuments.length === 0) {
          return false
        } else {
          return this.analysisList ? this.selectedInsightDocuments.length === count : false
        }
      },
      set: function (value) {
        var selected = []
        if (value) {
          this.analysisList.forEach((doc, index) => {
            if (doc.enabled !== 0) {
              selected.push(doc.id)
            }
          })
        }
        this.selectedInsightDocuments = selected
      }
    }
  },
  methods: {
    openLoginModal () {
      DialogueState.$emit('loginmodal', {
        fromPage: 'reportSelection',
        email: this.email
      })
    },
    resetCaptcha () {
      DataState.$emit('resetCaptcha', true)
    },
    openPaidModal () {
      DialogueState.$emit('paidplan', { email: this.email })
    },
    hideModal () {
      this.$refs.report_modal.hide()
    },
    verifyRecaptcha (response) {
      this.reportGreptcha = response
    },
    submitEmailModal () {
      if (this.reportGreptcha && this.reportGreptcha.length > 0) {
        this.sending = true
        let alldocument = []
        this.selectedFinancialDocuments.forEach(function (doc) {
          alldocument.push(doc)
        })
        this.selectedInsightDocuments.forEach((obj) => {
          alldocument.push(obj)
        })
        this.selectedDocuments = alldocument
        if (this.selectedDocuments.length > 0) {
          this.noneSelected = false
          this.sendEmail(this.email, this.selectedDocuments)
        } else {
          this.noneSelected = true
          this.sending = false
        }
      }
    },

    async sendEmail (email, reports) {
      let params = {
        email: email,
        reports: reports,
        captcha: this.reportGreptcha
      }
      let paramsForLogged = {
        reports: reports,
        captcha: this.reportGreptcha
      }
      let sendEmailResponse = null
      if (this.logged) {
        sendEmailResponse = await smartLinkService.storeAndSendEmail(this, paramsForLogged)
      } else {
        sendEmailResponse = await smartLinkService.storeUserAndSendEmail(this, params)
      }
      console.log('****sendEmailResponse response****', sendEmailResponse)
      if (sendEmailResponse.status === 200) {
        this.sending = false
        let payload = {
          generateLink: false,
          tinyUrl: sendEmailResponse.body.data.smart_link.url
        }
        DataState.$emit('showTinyUrl', payload)
        this.dialogue_type = 'success'
        this.selectedFinancialDocuments = [1, 2, 3, 4]
        this.selectedInsightDocuments = []
      } else {
        // TODO handle error
        this.failedResponse = true
        // this.dialogue_type = 'success'
      }
    },
    async checkFreeTrial () {
      let payload = { email: this.email }
      let freeTrialResponse = null
      if (this.logged) {
        freeTrialResponse = await smartLinkService.checkFreeTrialForLogged(this)
        // freeTrialResponse = await smartLinkService.checkFreeTrial(this, payload)
      } else {
        freeTrialResponse = await smartLinkService.checkFreeTrial(this, payload)
      }
      console.log('****get reports response****', freeTrialResponse)
      if (freeTrialResponse.status === 200) {
        this.documentList = freeTrialResponse.body.data.reports.financial_reports
        this.analysisList = freeTrialResponse.body.data.reports.insights_loan_hero_ai
        this.subscription_required = freeTrialResponse.body.data.subscription_required
        // pre select first 4 documents
        this.selectedFinancialDocuments = [1, 2, 3, 4]
      }
      LoadingState.$emit('toggle', false)
    },
    emitSuccess () {
      this.hideModal()
    }
  },
  mounted () {
    DataState.$on('recaptchaExpired', (payload) => {
      this.reportGreptcha = ''
    })
    DialogueState.$on('reportSelection', (payload) => {
      this.dialogue_type = payload.dialogue_type
      this.email = payload.email
      this.sending = false
      this.failedResponse = false
      this.noneSelected = false
      this.reportGreptcha = null
      this.resetCaptcha()
      this.logged = auth.checkAuth()
      if (this.$refs.report_modal) {
        this.$refs.report_modal.show()
        if (this.dialogue_type === 'report') {
          LoadingState.$emit('toggle', true)
          this.checkFreeTrial()
        }
      }
    })
  }
}
</script>

<style scoped>
    .modal-no-border{
        border: 0px;
        width: 100%; /*IE 11*/
    }
    .modal-label{
        width: 100%;
        justify-content: center;
        display: flex;
    }
    .free_trial_notification{
        display: flex;
        justify-content: center;
    }
</style>

<template>
    <div v-if="error_jwt">
        <error-template></error-template>
    </div>
    <div v-else>
        <div>
            <div class="col-lg-12 text-center add-mobile-top" v-if="reports && ready">
                <h1 class="text-white">Welcome to Fast Financials Secure Document Portal</h1>

                <h3 v-if="reports.length > 0" class="sl-home-secondary header-following-documents">You are requested to provide the following documents by {{broker}}</h3>
                <h3 v-else class="sl-home-secondary header-label-score">You are requested to provide information for a Credit Score Check by {{broker}}</h3>
            </div>

            <div class='col-lg-4 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-0 text-center background-white border-curved'>
                <div class="distance">
                    <div class="text-left text-content" v-for="(report, index) in reports" v-bind:key="index">
                        <b v-if="report.id != 8">{{index + 1}}. {{report.name}}</b>
                        <b v-if="report.id == 8">{{index + 1}}. Bank Summary</b>
                    </div>
                </div>

                <div class="padding-bottom">
                    <div id="document_list_loading" style="display: none">
                        <p><i class="fa fa-2x fa-cog fa-spin"></i></p>
                    </div>
                    <div id ='document_list'>
                        <p><a @click="goToAPC" class="btn btn-lg btn-violet border-curved" id="connect-internal-link">Continue to provide documents</a></p>
                        <p class="text-small-secondary">This will take under <b class="large-text-in-row">2</b> minutes </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
import router from '@/router'
import smartLinkService from '@/services/smartlink'
import ErrorTemplate from '../ErrorTemplate/ErrorTemplate'
import { mapGetters } from 'vuex'
import { LoadingState, DataState } from '@/main'
export default {
  components: { ErrorTemplate },
  name: 'welcome-s-d-p',
  data () {
    return {
      broker: null,
      reports: [],
      error_jwt: false,
      ready: false,
      report_iterator: 1
    }
  },
  computed: {
    ...mapGetters({
      state: 'state'
    })
  },
  methods: {
    goToAPC () {
      router.push({ name: 'apc' })
    },
    async getChosenReports () {
      LoadingState.$emit('toggle', true)
      await this.$store.dispatch('getState', { context: this })
      if (this.state !== 'submitted') {
        let response = await smartLinkService.getChosenReports(this)
        console.log('response get reports---------', response)
        if (response.status === 200) {
          this.reports = response.body.data.reports
          this.broker = response.body.data.smart_link.name
          this.error_jwt = false
          this.ready = true
          let extractionRequired = false
          if (this.reports.length === 0) {
            extractionRequired = true
          // } else if (this.reports[0].id === 8) {
          //   extractionRequired = true
          }
          window.localStorage.setItem('extraction_required', extractionRequired)
          let payload = {
            display: true
          }
          DataState.$emit('displayHelpButton', payload)
          LoadingState.$emit('toggle', false)
        } else {
          // show error template if error
          console.log('Sdp submit error')
          this.error_jwt = true
          LoadingState.$emit('toggle', false)
        }
        this.initHelp()
      } else {
        console.log('Sdp already submitted')
        this.error_jwt = true
        LoadingState.$emit('toggle', false)
      }
    },
    initHelp () {
      let list = [
        'In the next steps you will be able to connect to your accounting package to provide the documents.'
      ]
      if (this.reports.length > 0) {
        list.push('You will be able to add comments and decide if you approve to send the documents to ' + this.broker + '.')
      }
      list.push(
        'You will also have an opportunity to manually upload documents from your current device.',
        'This session is time restricted for security reasons, allowing you up to 30 minutes to complete it.'
      )
      let payload = {
        list: list
      }
      DataState.$emit('helpList', payload)
    }
  },
  mounted () {
    this.getChosenReports()
  }
}
</script>

<style scoped>

</style>

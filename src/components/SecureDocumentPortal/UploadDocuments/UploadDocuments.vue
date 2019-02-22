<template>
  <div v-if="!jwtError">
    <div class="row">
      <div class="col-lg-12 text-center">
        <h1 class="text-white">Secure Document Portal​</h1>
      </div>
    </div>
    <div class="row centered-containers" v-show="show_table">
      <div class='col-lg-5 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-2 text-center background-white border-curved distance margin distance integration-container'>
        <h2 class="text-bold text-title">These are the requested reports:</h2>
        <table class="table" v-if="extracted_reports.length === 0">
          <div>
            <h3>Please wait for loading data...</h3>
            <p><i class="fa fa-3x fa-cog fa-spin"></i></p>
          </div>
        </table>
        <table class="table" id="report_list" v-else>
          <thead>
            <tr>
              <th class="align-middle">Report</th>
              <th>Extracted From Accounting Package</th>
              <th>Attached &amp; Approved for Sending</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="extracted_report in extracted_reports">
              <td class="text-left">
                {{ extracted_report.name }}
              </td>
              <td>
                <img src="@/assets/checked.png" v-if="extracted_report.extracted">
                <img src="@/assets/unchecked.png" v-else>
              </td>
              <td>
                <img src="@/assets/checked.png" v-if="extracted_report.approved">
                <img src="@/assets/unchecked.png" v-else>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row centered-containers">
      <div class='col-lg-5 col-md-6 col-sm-8 col-xs-12 offset-lg-4 offset-md-3 offset-sm-2 offset-xs-2 text-center background-white border-curved distance margin distance integration-container'>
        <h2 class="text-bold text-title">Upload documents</h2>
        <div class="row">
          <div class="col-lg-12 pb-lg-3 pt-lg-3">
            <div><img class="img-responsive provider-icons ap-icon" src="@/assets/upload_icon.png" alt="upload"></div>
          </div>
        </div>
        <p class="text-secondary before-accounting">If you have files on your device, simply upload them</p>
        <p>
          <button class="btn btn-lg btn-violet border-curved" @click="openUploadDocumentsModal">Upload</button>
        </p>
        <p id="upload-file-success" v-show="success_upload"><img class="upload-success" src="@/assets/success_icon.png">
          Success! Your files have been uploaded</p>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-12 text-center padding-top">
        <p v-if="upload_required && !success_upload && !allow_next" id="upload_required" class="text-bold text-white">
          <img class="img-responsive upload-success" src="@/assets/info_sl.png"> Please upload a document to continue
        </p>
        <p>
          <a id="back_uploading" class="btn btn-lg btn-white border-curved mx-1" @click="backToApproveReports">Back</a>
          <a v-if="allow_next" id="skip_uploading" @click="goToContact" class="btn btn-lg btn-white border-curved mx-1"><a v-if="display_next">Next</a><a v-if="display_skip">Skip</a></a>
        </p>
      </div>
    </div>
  </div>
  <div v-else>
    <error-template></error-template>
  </div>
</template>

<script>
  import router from '@/router'
  import { DialogueState, DataState } from '@/main'
  import { mapGetters } from 'vuex'
  import sdpService from '@/services/securedocumentportal.js'
  import ErrorTemplate from '../ErrorTemplate/ErrorTemplate'
  export default {
    components: { ErrorTemplate },
    name: 'upload',
    data () {
      return {
        jwtError: false,
        success_upload: false,
        upload_required: false,
        display_next: false,
        display_skip: true,
        allow_next: false,
        extracted_reports: [],
        show_table: true,
        extractionRequired: false
      }
    },
    computed: {
      ...mapGetters({
        state: 'state'
      })
    },
    methods: {
      goToContact () {
        router.push('/sdp/contact-details')
      },
      showExtractReportsTable: function () {
        return sdpService.extractedReportsTable(this).then((response) => {
          if (response.status === 400) {
            this.jwtError = true
          }
          if (!response.body.message) {
          } else {
            // upload required
            this.upload_required = response.body.data.upload_required
            if (!this.upload_required) {
              this.allow_next = true
            } else {
              this.allow_next = false
            }

            // show extracted table
            this.extracted_reports = response.body.data.reports
            const newExtractedReports = response.body.data.reports
            this.extracted_reports = this.extracted_reports.filter(extractedReport => extractedReport.name !== 'Business Bank Statements - 12 months')

            if (this.extracted_reports.length === 0) {
              this.show_table = false
            }

            if (newExtractedReports.length > 0) {
              this.allow_next = this.state !== 'authorized'
            }

            // if (newExtractedReports.length === 1 && newExtractedReports[0].name === 'Business Bank Statements - 12 months') {
            //   this.allow_next = this.state === 'extracted'
            // }
          }
        })
      },

      openUploadDocumentsModal: function () {
        DialogueState.$emit('uploadDocuments', {
          dialogue_type: 'upload'
        })
      },

      backToApproveReports: function () {
        DataState.$emit('backFromUploading', true)

        if (this.upload_required || this.extractionRequired === true) {
          router.push('/sdp/accounting-packages-connect')
        } else {
          router.push('/sdp/approve-reports/?back=1')
        }
      },
      initHelp () {
        let list = []
        if (this.show_table === true) {
          list.push(
            'Please review the summary table with the reports we extracted from your accounting package.'
          )
        }
        list.push(
          'By clicking "Upload", you can upload any additional document you want. It will be sent to the requester along with all the approved reports.',
          'A document must be attached via an accounting package or from your device in order to continue.'
        )
        let payload = {
          list: list
        }
        DataState.$emit('helpList', payload)
      }
    },

    mounted () {
      this.initHelp()
      // extracted reports table
      this.showExtractReportsTable()
      DialogueState.$emit('forceUpdateFileList', true)
      DialogueState.$emit('refreshUploadPageView', true)
      // upload documents
      DataState.$on('uploadResult', (payload) => {
        this.success_upload = payload.success_upload

        // if (this.success_upload || !this.upload_required) {
        //   this.allow_next = true
        //   if (this.success_upload) {
        //     this.display_skip = false
        //     this.display_next = true
        //   } else {
        //     this.display_skip = true
        //     this.display_next = false
        //   }
        // } else {
        //   // this.allow_next = false
        //   this.display_next = false
        //   this.display_skip = true
        // }

        if (!this.allow_next) {
          if (this.success_upload) {
            this.allow_next = true
            this.display_skip = false
            this.display_next = true
          } else {
            this.allow_next = false
            this.display_next = false
          }
        } else {
          if (this.success_upload) {
            this.allow_next = true
            this.display_skip = false
            this.display_next = true
          } else {
            console.log('-----------------')
            console.log(this.allow_next)
            console.log(this.display_skip)
            console.log(this.display_next)
            console.log('-----------------')
            if (this.state !== 'authorized') {
              this.allow_next = true
              this.display_skip = true
            } else {
              this.allow_next = false
              this.display_skip = false
            }
            this.display_next = false
          }
        }
      })
      DialogueState.$on('jwtExpiredUpload', (payload) => {
        this.jwtError = true
      })
      if (window.localStorage.getItem('extraction_required') === 'true') {
        this.extractionRequired = true
      }

      // this.showExtractReportsTable()
    }

  }
</script>

<style scoped>

</style>

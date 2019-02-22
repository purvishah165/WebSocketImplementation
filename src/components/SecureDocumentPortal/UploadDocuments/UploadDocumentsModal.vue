<template>
  <div>
    <b-modal ref="upload_modal" size="lg">
      <div slot="modal-header" class="d-flex w-100 justify-content-end modal-no-border">
        <div class="d-flex align-items-center hide-icon">
          <a @click='hideModal'><i class="fa fa-times arctic-blue" aria-hidden="true"></i></a>
        </div>
      </div>
      <div class="modal-body">
        <div class="col-lg-12">
          <h2 class="text-title text-center">Upload document</h2>
        </div>
        <div class="col-lg-12">
          <div class="text-secondary text-center notes"><p>Document formats allowed:<br>PDF, doc, docx, xls, xlsx, csv, image jpg, png files</p><p> Maximum document size: 10MB</p></div>
        </div>
        <div class="col-lg-12 d-flex justify-content-center">
          <div class="recaptcha">
            <recaptcha @grecaptcha="verifyRecaptcha"></recaptcha>
          </div>
        </div>
        <dropfileuploader v-if="reportUploadGrecaptcha.length > 1 && !uploadBusy" ></dropfileuploader>
        <div v-for="error_message in error_messages">
          <b-alert show variant="danger" v-show="error_message">{{error_message}}</b-alert>
        </div>
        <div class="file-uploading" v-for="item in items" :key="item.id">
          <div class="row font-weight-bold">
            <div class="col-lg-11">
              {{item.name}}
            </div>
            <div class="col-lg-1 d-flex justify-content-end align-items-center" v-if="item.deleting">
              <i class="fa fa-cog fa-spin" aria-hidden="true"></i>
            </div>
            <div class="col-lg-1 d-flex justify-content-end align-items-center hide-icon" v-else-if="item.id" @click="deleteSingleFile(item.id)">
              <i class="fa fa-times" aria-hidden="true"></i>
            </div>
            <div class="col-lg-1 d-flex justify-content-end align-items-center" v-else>
              <i class="fa fa-cog fa-spin" aria-hidden="true"></i>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12" v-if="item.deleting">
              <div class="text-small-secondary">Deleting...</div>
              <b-progress><b-progress-bar :value=100 show-progress animated variant="violet"></b-progress-bar></b-progress>
            </div>
            <div class="col-lg-12" v-else-if="item.id">
              <div class="text-small-secondary">Uploaded</div>
              <b-progress><b-progress-bar :value=100 variant="violet"></b-progress-bar></b-progress>
            </div>
            <div class="col-lg-12" v-else="item.deleting">
              <div class="text-small-secondary">Uploading...</div>
              <b-progress><b-progress-bar :value=100 show-progress animated variant="violet"></b-progress-bar></b-progress>
            </div>
          </div>
          <div v-if="item.id === selected_deleting_id">
            <b-alert class="delete" show variant="danger">
              <div class="d-flex">
                <div class="mr-auto p-2 align-self-center"><h5 class="m-0">Are you sure you want to remove this document?</h5></div>
                <div class="p-2"><a href="#" class="btn btn-sm btn-danger" @click="remove(item.id)">Remove</a></div>
                <div class="p-2"><a href="#" class="btn btn-sm btn-secondary" @click="cancel(item.id)">Cancel</a></div>
              </div>
            </b-alert>
          </div>
        </div>

        <div class="file-uploading" v-for="(uploading_item, index) in uploading_items" :key="index">
          <div class="row font-weight-bold">
            <div class="col-lg-11">
              {{uploading_item.file.name}}
            </div>
            <div class="col-lg-1 d-flex justify-content-end align-items-center">
              <i class="fa fa-cog fa-spin" aria-hidden="true"></i>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-12" v-show="uploading_item.get_files_loading === false">
              <div class="text-small-secondary">Uploading...</div>
              <b-progress><b-progress-bar v-model="uploading_item.uploading_progress" :precision="1" variant="violet" show-progress animated ></b-progress-bar></b-progress>
            </div>
          </div>
        </div>

      </div>
      <div slot="modal-footer" class="d-flex w-100 justify-content-center modal-no-border">
        <div class="col-lg-12 text-center">
          <p><button type="button" class="btn btn-lg btn-violet border-curved" @click='hideModal'>Close</button></p>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue'
import { DialogueState, Datapass, DataState } from '@/main.js'
import sdpService from '@/services/securedocumentportal.js'

// import auth from '@/services/auth'
import { filesUpdate, dropfileuploader } from '../../Toolkit/dropfileuploader'
import Recaptcha from '../../recaptcha/recaptcha'
export default {
  components: {
    // VueToast,
    Recaptcha,
    dropfileuploader
  },
  name: 'uploadDocumentsModal',
  data () {
    return {
      dialogue_type: null,
      reportUploadGrecaptcha: '',
      reqId: '',
      toast: '',
      uploadBusy: false,
      items: [],
      uploading_items: [],
      // get_files_loading: false,
      upload_file_title: '',
      selected_deleting_id: null,
      deleting_id: null,
      error_messages: []
    }
  },

  computed: {
  },

  methods: {

    hideModal () {
      if (this.items.length) {
        DataState.$emit('successUploaded', true)
      } else {
        DataState.$emit('successUploaded', false)
      }
      this.$refs.upload_modal.hide()
    },

    verifyRecaptcha (response) {
      this.reportUploadGrecaptcha = response
      filesUpdate.$emit('verifiedCaptcha')
    },

    async uploadSingleFile (context, data, filename) {
      return sdpService.uploadFile(context, data, filename).then((response) => {
        if (!response.body.message) {
          console.log(response)
        } else {
          this.getUploadedFiles(context)
        }
        filesUpdate.$emit('clearInputValue', true)
      })
    },

    async getUploadedFiles (context) {
      let data = new FormData()
      data.append('id', '')
      data.append('file', '')
      data.append('path', '')
      return sdpService.uploadedFiles(context, data).then((response) => {
        this.uploadBusy = false
        if (!response.body.message) {
          console.log(response)
        } else {
          if (!response.body.data.uploaded_files) {
            console.log(response)
          } else {
            console.log('upload upload')
            console.log(response.body.data.uploaded_files)
            this.items = response.body.data.uploaded_files
            let status = false
            if (this.items.length > 0) {
              status = true
            }
            let payload = {
              success_upload: status
            }

            DataState.$emit('uploadResult', payload)
          }
        }
        filesUpdate.$emit('clearInputValue', true)
      }).catch(() => {
        this.$refs.upload_modal.hide()
        DialogueState.$emit('jwtExpiredUpload', true)
      })
    },

    async uploadFile (file) {
      // Check if it is already uploaded
      let notUploaded = true
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].name === file.name) {
          notUploaded = false
        }
      }
      if (notUploaded) {
        this.uploading_items.push({
          file: file,
          uploading_progress: 0
        })
        let data = new FormData()
        data.append('file', file)
        data.append('captcha', this.reportUploadGrecaptcha)
        this.uploadSingleFile(this, data, file.name)
      } else {
        this.error_messages.push('Sorry, a file with the same name has already been uploaded.')
        filesUpdate.$emit('clearInputValue', true)
      }
    },

    async deleteSingleFile (id) {
      this.error_messages = []
      this.selected_deleting_id = id
      this.deleting_id = '?file_id=' + id
    },

    async remove (id) {
      this.uploadBusy = true
      this.error_messages = []
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id === id) {
          this.items[i].deleting = true
        }
      }
      this.selected_deleting_id = null

      return sdpService.deleteFile(this, this.deleting_id).then((response) => {
        if (!response.body.message) {
          console.log(response)
        } else {
          this.selected_deleting_id = null
          this.getUploadedFiles(this)
        }

        filesUpdate.$emit('clearInputValue', true)
      })
    },

    cancel (id) {
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i].id === id) {
          this.items[i].deleting = false
        }
      }
      console.log(this.items)

      this.selected_deleting_id = null
    }
  },

  mounted () {
    this.error_messages = []

    DataState.$on('recaptchaExpired', (payload) => {
      this.reportUploadGrecaptcha = ''
    })
    Datapass.$on('uploadPercentage', payload => {
      for (let i = 0; i < this.uploading_items.length; i++) {
        if (this.uploading_items[i].file.name === payload.filename) {
          Vue.set(this.uploading_items[i], 'uploading_progress', parseInt(payload.percentage))
        }
        if (this.uploading_items[i].uploading_progress === 100) {
          this.items.push({
            name: this.uploading_items[i]['file']['name'],
            id: ''
          })
          this.uploading_items[i].get_files_loading = true
          this.uploading_items.splice(i, 1)
        }
      }
    })
    filesUpdate.$on('filesUpdate', payload => {
      this.error_messages = []
      if (payload.too_many_files) {
        this.error_messages.push('You selected too many file at once.')
      } else if (payload.filetype_required_notmatching) {
        this.error_messages.push('Your file type is not correct.')
      } else if (payload.oversize) {
        this.error_messages.push('Your file uploading is over 10MB.')
      } else {
        this.uploadFile(payload.file)
      }
    })
    DialogueState.$on('refreshUploadPageView', (payload) => {
      this.dialogue_type = payload.dialogue_type
      if (this.dialogue_type === 'upload') {
        this.error_messages = []
        this.getUploadedFiles(this)
      }
    })
    DialogueState.$on('uploadDocuments', (payload) => {
      this.dialogue_type = payload.dialogue_type
      if (this.$refs.upload_modal) {
        this.$refs.upload_modal.show()
        if (this.dialogue_type === 'upload') {
          this.error_messages = []
          this.getUploadedFiles(this)
        }
      }
    })
    DialogueState.$on('forceUpdateFileList', () => {
      this.getUploadedFiles(this)
    })
  },

  destroyed () {
    Datapass.$off('uploadPercentage')
    filesUpdate.$off('filesUpdate')
  }
}
</script>

<style scoped>

.text-title {
  margin: 0 0 10px 0;
}

.notes {
  margin: 10px 50px;
}
.recaptcha {
  margin: 10px 0;
}

.file-uploading {
  margin: 10px auto;
}

.hide-icon {
  cursor: pointer;
}

.delete {
  line-height: 0px;
  margin: 2px 0;
  padding: 0.75rem;
}

.bg-violet {
  background-color: #793dcf !important;
}
</style>

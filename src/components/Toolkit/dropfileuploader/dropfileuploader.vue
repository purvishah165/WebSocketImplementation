<template>
  <div class="uploadBox">
    <div>
      <div class="uploadBoxMain">
        <div id="drop-area" class="dropArea d-none d-md-block" @ondragover="onChange">
          <p class="text-secondary text-center mb-0">Drop file here<br>or</p>
          <input type="file" id="items" name="items[]" required multiple @change="onChange" @click="reset">
          <button class="btn btn-violet-inverse btn-lg border-curved">Select file</button><br>
        </div>
        <div id="drop-area-mobile" class="dropArea d-md-none d-lg-none d-xl-none">
          <input ref='file_input' type="file" id="items-1" name="items[]" style="display:none" required multiple @change="onChange" @click="reset">
          <button v-show="!uploadBusy" class="btn btn-violet-inverse btn-lg border-curved" @click="open">Select file</button><br>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { filesUpdate } from './filesUpdate'
// import SLTool from 'sl-tool-package'
export default {

  name: 'dropfileuploader',

  props: {
    minItems: {
      type: Number,
      default: 1
    },
    /*
     * @isGlobalModal
     *  Only one GlobalModal In one SPA.
     */
    isGlobalModal: {
      type: Boolean,
      default: false
    }
  },

  /*
   * The component's data.
   */
  data () {
    return {
      uploadBusy: false,
      captchaExpired: false,
      upload_input: null,
      drop_area: null,
      drop_area_mobile: null,
      items: [],
      doc_types: [
        'application/pdf',
        'text/csv',
        'application/vnd.ms-excel',
        'text/plain',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ],
      ext_types: [
        'txt',
        'doc',
        'docx',
        'xlsx',
        'csv',
        'xls',
        'jpg',
        'png',
        'pdf'
      ]
    }
  },

  methods: {
    handleSingleFile (file) {
      console.log('file------------', file)
      let oversize
      let filetypeRequiredNotmatching
      if (file.size < 10490000) {
        oversize = false
      } else {
        oversize = true
      }
      console.log('file.type-------', file.type)
      // adding check of file extension as somewhere file.type is not getting captured
      let fileExt = file.name.split('.').pop()
      console.log('file extension-------', fileExt)
      if (this.doc_types.indexOf(file.type) > -1) {
        filetypeRequiredNotmatching = false
      } else if (this.ext_types.indexOf(fileExt) > -1) {
        filetypeRequiredNotmatching = false
      } else {
        filetypeRequiredNotmatching = true
      }

      filesUpdate.$emit('filesUpdate', {
        is_global_modal: this.isGlobalModal,
        too_many_files: false,
        filetype_required_notmatching: filetypeRequiredNotmatching,
        oversize: oversize,
        file: file
      })

      filesUpdate.$emit('uploadBusy', false)
    },
    open () {
      this.$refs.file_input.click()
      this.uploadBusy = true
    },
    onChange (e) {
      this.uploadBusy = true

      if (this.captchaExpired) {
        this.change_back()
        return
      }

      filesUpdate.$emit('uploadBusy', true)
      let files = e.target.files || e.dataTransfer.files
      this.items = files
      if (files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          let file = files[i]
          this.handleSingleFile(file)
        }
      }
      this.uploadBusy = false
      this.change_back()
    },

    change () {
      this.drop_area.style.backgroundColor = '#1b75bc'
      this.drop_area.style.color = '#fff' //      this.upload_input.value = null
      // this.drop_area_mobile.style.backgroundColor = '#1b75bc'
      // this.drop_area_mobile.style.color = '#fff'
    },

    change_back () {
      this.drop_area.style.backgroundColor = '#eee'
      this.drop_area.style.color = '#1B2432'
      // this.drop_area_mobile.style.backgroundColor = '#1b75bc'
      // this.drop_area_mobile.style.color = '#fff'
    },

    reset () {
      this.upload_input.value = null
    }
  },

  mounted () {
    this.upload_input = document.getElementById('items')
    filesUpdate.$on('clearInputVaule', (clear) => {
      if (clear) {
        this.upload_input.value = null
      }
    })

    filesUpdate.$on('recaptchaExpired', payload => {
      this.captchaExpired = true
    })

    filesUpdate.$on('verifiedCaptcha', payload => {
      this.captchaExpired = false
    })

    this.drop_area = document.getElementById('drop-area')
    this.drop_area_mobile = document.getElementById('drop-area-mobile')
    this.drop_area.addEventListener('dragenter', this.change, false)
    this.drop_area.addEventListener('dragleave', this.change_back, false)
    this.drop_area.addEventListener('drop', this.change_back, false)
    this.drop_area.addEventListener('dragover', this.reset, false)
    this.drop_area_mobile.addEventListener('dragenter', this.change, false)
    this.drop_area_mobile.addEventListener('dragleave', this.change_back, false)
    this.drop_area_mobile.addEventListener('drop', this.change_back, false)
    this.drop_area_mobile.addEventListener('dragover', this.reset, false)
  },

  destroyed () {
    filesUpdate.$off('clearInputValue')
  }
}
</script>

<style>
  .select-button{
    cursor: pointer;
    width: 190px;
    height: 37px;
    margin: auto;
    margin-top: 10px !important;
    margin-bottom: 10px !important;
    font-weight: bold;
    border-radius: 30px !important;
    border: 1px solid #919191 !important;
    background-color: #9E267E!important;
    color: #ffffff!important;
  }
  .uploadBox {
    position: relative;
    background: #eee;
    margin: 20px 0;
  }

  .uploadBoxMain ol li {
    text-align: left;
  }

  .uploadBox .uploadBoxMain {
    position: relative;
  }

  /* Drag and drop */
  .uploadBox .dropArea {
    position: relative;
    width: 100%;
    /*height: 300px;*/
    /*border: 4px dashed #b1b1b1*/
    text-align: center;
    font-size: 2em;
    /*padding-top: 80px;*/
    padding: 50px 30px;
    border: 2px dashed #979797;
    border-radius: 10px;
  }

  .uploadBox .dropArea input {
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  .uploadBox .dropArea p {
    font-size: 0.7em;
  }
  /* End drag and drop */
</style>

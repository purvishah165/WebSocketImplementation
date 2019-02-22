<template>
    <div class="container">
        <div class="col-lg-12 text-center">
            <p>
                <b class="text-white text-bold sl-home-heading">All Financial Reports in One Link!</b>
                <br>
                <br>
            </p>
        </div>
        <div class="padding-top">
            <div class="col-lg-12 text-center">
                <p></p>
                <p>
                    <a class="sl-secondary-link text-bold" href="#how-it-works" v-smooth-scroll>
                        Check Out "How It Works" <i class="fa fa-chevron-right"></i>
                    </a>
                </p>
            </div>
        </div>
        <div class="row text-center">

            <div class="offset-1 col-10 col-md-6 offset-md-3 col-sm-10 offset-sm-1 generate-link-field" v-if="generateLink">
                <small class="sl-home-secondary">Enter your email to which you want to get the link and reports</small>

                <div class="input-group input-group-lg input-generate-link-container col-12">
                    <input name="email" id="email" :disabled="logged" v-model="email" type="text" class="form-control border-violet input-generate-link non-register-email" placeholder="Enter Your Email" aria-label="Enter Your Email" aria-describedby="basic-addon2" v-validate="'required|email'"   :class="{'is-danger': errors.has('email') }">
                    <div class="input-group-append button-generate-link d-none d-sm-block">
                        <button class="btn btn-violet open-email-modal" type="button" @click="openReportModal">Generate Link!</button>
                    </div>

                </div>
                <p v-show="errors.has('email')" class="text-danger">Please enter correct Email Address</p>
                <br>
                <div class="show-mobile col-12 generate-link-field">
                    <div class=""><button type="button" class="d-block d-sm-none open-email-modal btn-lg btn btn-violet form-control h-100" @click="openReportModal">Generate Link!</button></div>
                    <br><br>
                </div>
            </div>

            <div class="offset-1 col-10 col-md-6 offset-md-3 col-sm-10 offset-sm-1" id="tinyurl_link" v-else>
                <br>
                <small class="sl-home-secondary">Your Link is:</small>
                <div class="input-group input-group-lg mb-3 col-12">
                    <input type="text" readonly="" class="form-control border-violet" id="url" v-model="tinyUrl">
                    <div class="input-group-append">
                        <button type="button" class="btn btn-violet d-none d-sm-block copy_url w-100" @click="copyUrl"><i class="fa fa-copy"></i>&nbsp;&nbsp;&nbsp;Copy Link</button>
                    </div>
                </div>
                <div class="col-12">
                    <transition name="fade">
                    <div class="alert alert-success" id="url_copy_success" v-if="urlCopySuccess">Your Link has been copied into the clipboard</div>
                    </transition>
                </div>
                <div class="show-mobile col-12 center-flex">
                    <button type="button" class="btn btn-lg btn-violet d-block d-sm-none copy_url mb-3 form-control" style="min-width: 160px; height: 45px;" @click="copyUrl"><i class="fa fa-copy"></i>&nbsp;&nbsp;&nbsp;Copy Link</button>
                </div>
                <div class="col-12 mb-4">
                    <button type="button" class="generate-new-link-button btn-lg btn btn-violet form-control" @click="generateNewLink">Generate New Link!</button>
                </div>

            </div>
        </div>
        <div class="row">
            <div class="col-lg-2">
            </div>
            <div class="col-lg-8 text-center">
                <p></p>
                <img data-toggle="modal" @click="openSecurityModal" src="@/assets/security-icon-learn-more.svg" class="img-responsive cursor-pointer">
            </div>
            <div class="col-lg-2">
            </div>
        </div>
        <br>
        <div class="row transparency">
            <div class="col-lg-2 text-center">
                <small class="sl-footer-logo-label text-white col-12">Powered by</small>
                <a href="https://streamlending.com.au" target="_blank"><img class="img-responsive sl-footer-logo" src="@/assets/sl.png"></a>
            </div>
            <div class="col-lg-8 text-center">
            </div>
            <div class="col-lg-2 text-center">
                <a href="https://www.linkedin.com/company/stream-lending/" target="_blank"><img class="img-responsive sl-social-icon" src="@/assets/linkedin.svg" alt="LinkedIn"></a>
            </div>
        </div>
    </div>
</template>

<script>
	/* eslint-disable no-tabs */

	import { DialogueState, DataState } from '@/main'
export default {
  name: 'initSmartLink',
  props: ['brokerEmail', 'logged'],
  data () {
    return {
      email: this.brokerEmail,
      generateLink: true,
      tinyUrl: null,
      urlCopySuccess: false
    }
  },
  watch: {
    brokerEmail: {
      handler: function (val) {
        this.email = val
      },
      deep: true
    }
  },
  methods: {
    generateNewLink () {
      this.urlCopySuccess = false
      this.generateLink = true
      if (this.logged) {
        this.email = this.brokerEmail
      } else {
        this.email = ''
      }
    // eslint-disable-next-line no-tabs
    },
    openReportModal: function () {
      this.$validator.validateAll().then(success => {
        if (!success) {
          // handle error
          console.log(this.$validator.getErrors())
          return
        }

        DialogueState.$emit('reportSelection', {
          dialogue_type: 'report',
          email: this.email
        })
      }).catch(() => {
      })
    },
    openSecurityModal () {
      DialogueState.$emit('securitymodal', {
      })
    },
    copyUrl () {
      let input = document.getElementById('url')
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
    }
  },
  mounted () {
    DataState.$on('showTinyUrl', (payload) => {
      this.generateLink = payload.generateLink
      this.tinyUrl = payload.tinyUrl
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.generate-new-link-button{
    height: 45px;
}
</style>

<template>
<div class="contact-us-wrapper">
    <div class="contact-us-container">
        <div>
            <div class="col-12">
                <h2 class="heading-title">Contact Us</h2>
            </div>
        </div>
        <div class="contact-us-form col-lg-6 col-12">
            <div>
                <h4 class="heading-title">Let's get in touch</h4>
            </div>
            <div class="col-lg-12">
                <p>
                <span class="your-name">
                    <input maxlength="100" id="contact_name" placeholder="Your Name" type="text" name="name" v-model="contact_details.name" :class="{'is-danger': errors.has('name') }" class="form-control input-transparent border-curved input-lg contact-form-input" aria-required="true" aria-invalid="false" v-validate.disable="'required|max:100|min:2'">
                 <label v-if="errors.has('name:required')" class="text-contact-danger">This field is required</label>
                <label v-else-if="errors.has('name')" class="text-contact-danger">Please enter at least 2 characters.</label>
                </span>
                </p>
                <p>
                <span class="your-email">
                    <input maxlength="100" id="contact_email" placeholder="Your Email" type="text" name="contact_email" v-model="contact_details.email" :class="{'is-danger': errors.has('contact_email') }" class="input-transparent border-curved form-control input-lg contact-form-input" aria-required="true" aria-invalid="false" v-validate.disable="'required|email|max:100'">
                  <label v-if="errors.has('contact_email:required')" class="text-contact-danger">This field is required</label>
                <label v-else-if="errors.has('contact_email')" class="text-contact-danger">Please enter a valid email address.</label>
                </span>
                </p>
                <p>
                <span class="your-subject">
                    <input maxlength="12" id="contact_phone" placeholder="Your Phone" type="number" name="phone" :class="{'is-danger': errors.has('phone') }" v-model="contact_details.phone" class="form-control  input-transparent border-curved contact-form-input" aria-invalid="false" v-validate.disable="'max:30|min:8'" >
                 <label v-show="errors.has('phone')" class="text-contact-danger">Please enter at least 8 characters.</label>
                </span>
                </p>

                <p>
                <span class="your-subject">
                    <input maxlength="100" id="contact_subject" placeholder="Subject" type="text" name="subject" :class="{'is-danger': errors.has('subject') }" v-model="contact_details.subject" class="form-control  input-transparent border-curved contact-form-input" aria-invalid="false" v-validate.disable="'max:100|min:2'" >
                <label v-if="errors.has('subject')" class="text-contact-danger">Please enter at least 2 characters.</label>
                </span>

                </p>

                <p>
                <span class="your-message">
                    <textarea maxlength="1000" id="contact_message" v-model="contact_details.message" :class="{'is-danger': errors.has('message') }" placeholder="Type Your Message Here" name="message" cols="40" rows="10" class="form-control input-transparent border-curved contact-form-input" aria-invalid="false" v-validate.disable="'required|max:1000|min:5'"></textarea>
                  <label v-if="errors.has('message:required')" class="text-contact-danger">This field is required</label>
                <label v-else-if="errors.has('message')" class="text-contact-danger">Please enter at least 5 characters.</label>
                </span>
                </p>
            </div>
            <div class="col-lg-12 d-flex justify-content-center">
            <recaptcha @expire="showExpire" @grecaptcha="verifyRecaptcha"></recaptcha>
            </div>
            <div class="col-lg-12 d-flex flex-column justify-content-center mt-4">
                <div class="col-12 text-center">
                <a v-if="!contact_loading" class="btn btn-lg border-curved btn-white cursor-pointer" @click="submitContactForm" id="contact_form_submit_button">Send</a>
                </div>
                    <span class="text-center" id="contact_form_loader" v-if="contact_loading"><i class="fa fa-cog fa-spin text-white"></i></span>

                <div v-if="error" class="alert alert-danger" id="contact_form_response">Can not submit contact form. Please try again later.</div>
                <div v-if="success" class="alert ff-alert-success" id="contact_form_success">Thank You for your message. It has been successfully sent and we will get back to you soon.</div>

            </div>
        </div>

    </div>

</div>
</template>

<script>
import Recaptcha from '@/components/recaptcha/recaptcha'
import { DataState } from '@/main'
import smartLinkService from '@/services/smartlink'
export default {
  components: { Recaptcha },
  name: 'contact-us-form',
  data () {
    return {
      contact_details: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        grecaptchaResponse: ''
      },
      success: false,
      successMsg: '',
      error: false,
      errorMsg: '',
      contact_loading: false
    }
  },
  watch: {
    'contact_details.name': {
      handler: function (val) {
        this.$validator.validateAll()
        console.log(val)
      }
    },
    'contact_details.email': {
      handler: function (val) {
        this.$validator.validateAll()
      }
    },
    'contact_details.phone': {
      handler: function (val) {
        this.$validator.validateAll()
      }
    },
    'contact_details.subject': {
      handler: function (val) {
        this.$validator.validateAll()
      }
    },
    'contact_details.message': {
      handler: function (val) {
        this.$validator.validateAll()
      }
    },
    deep: true
  },
  methods: {
    submitContactForm () {
      this.$validator.validateAll().then(async success => {
        if (!success) {
          // handle error
          console.log(this.$validator.getErrors())
          return
        }
        if (this.contact_details.grecaptchaResponse.length > 0) {
          this.contact_loading = true
          const contactResponse = await smartLinkService.sendContactForm(this, this.contact_details)
          console.log('****contact form response****', contactResponse)
          if (contactResponse.status === 200) {
            this.contact_loading = false
            this.success = true
            // this.successMsg = contactResponse.body.message
            this.resetContactForm()
            this.resetCaptcha()
          } else {
            this.contact_loading = false
            this.error = true
            this.errorMsg = contactResponse.message
          }
          // this.suucessMsg = contactResponse.message
        }
      }).catch(() => {
      })
    },
    verifyRecaptcha (response) {
      console.log('recaptcha reesponse caught', response)
      this.contact_details.grecaptchaResponse = response
    },
    resetContactForm () {
      this.contact_details = {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        grecaptchaResponse: ''
      }
      this.$validator.reset()
    },
    resetCaptcha () {
      DataState.$emit('resetCaptcha', true)
    },
    showExpire () {
    }
  },
  mounted () {
    DataState.$on('recaptchaExpired', (payload) => {
      this.contact_details.grecaptchaResponse = ''
    })
  }
}
</script>

<style scoped>

</style>

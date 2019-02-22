<template>
  <div class="home container-fluid mobile-content-spacing">
    <div class="row">
      <div class="container-smart-link">
        <initSmartLink :broker-email="user.email" :logged="isUserAuthenticate"></initSmartLink>
      </div>
      <div class="content-area w-100 main-content-section mt-0">
        <div class="how-it-works-container" id="how-it-works">
          <how-it-works></how-it-works>
        </div>
        <div class="example-container">
          <example-report-widget></example-report-widget>
        </div>
        <div class="ap-container" id="accounting-packages">
          <accounting-packages></accounting-packages>
        </div>
          <div class="testimonial-container">
             <testimonials></testimonials>
          </div>
        <div class="contact-container">
          <div class="d-flex flex-wrap">
            <div class="col-lg-4 col-12 get-in-touch-wrapper">
              <get-in-touch></get-in-touch>
            </div>
            <div class="col-lg-8 col-12 p-0" id="contact-us">
              <contact-us-form></contact-us-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <reportSelectionModal></reportSelectionModal>
    <paid-plan-modal></paid-plan-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import Vue from 'vue'
import { mapGetters } from 'vuex'
import initSmartLink from '@/components/SmartLink/InitSmartLink.vue'
import reportSelectionModal from '@/components/SmartLink/ReportSelectionModal.vue'
import PaidPlanModal from '@/components/SmartLink/PaidPlanModal'
import { PageState, DataState, LoadingState } from '@/main'
import HowItWorks from '@/components/FfHomePage/HowItWorks/HowItWorks'
import ExampleReportWidget from '@/components/FfHomePage/ExampleReports/ExampleReportWidget'
import AccountingPackages from '@/components/FfHomePage/AccountingPackages/AccountingPackages'
import GetInTouch from '@/components/FfHomePage/ContactUs/GetInTouch'
import ContactUsForm from '@/components/FfHomePage/ContactUs/ContactUsForm'
import Testimonials from '@/components/FfHomePage/Testimonials/Testimonials'
import auth from '@/services/auth'
export default {
  name: 'home',
  components: {
    Testimonials,
    ContactUsForm,
    GetInTouch,
    AccountingPackages,
    ExampleReportWidget,
    HowItWorks,
    PaidPlanModal,
    initSmartLink,
    reportSelectionModal
  },
  computed: {
    ...mapGetters({
      userDetails: 'userDetails'
    })
  },
  data () {
    return {
      isUserAuthenticate: false,
      user: {
        email: ''
      }
    }
  },
  watch: {
    userDetails: {
      handler: function (val) {
        Vue.set(this, 'user', JSON.parse(JSON.stringify(val)))
      },
      deep: true
    }
  },
  methods: {
    async getUser () {
      this.isUserAuthenticate = auth.checkAuth()
      if (this.isUserAuthenticate) {
        LoadingState.$emit('toggle', true)
        await this.$store.dispatch('prepareUserDetail', { context: this })
        if (this.userDetails) {
          Vue.set(this, 'user', JSON.parse(JSON.stringify(this.userDetails)))
        } // else {
        //   // this.toast.showToast(user_response.body.message, { theme: 'error', timeLife: 5000 });
        // }
        // TODO handle error scenario from user api
        LoadingState.$emit('toggle', false)
      }
    },
    async clearStore () {
      await this.$store.dispatch('clearStore', { context: this })
      Vue.set(this, 'user', JSON.parse(JSON.stringify(this.userDetails)))
    }
  },
  mounted () {
    PageState.$emit('issdp', false)
    PageState.$emit('isAccount', false)
    PageState.$emit('ishome', true)
    this.getUser()
    DataState.$on('userAuth', (payload) => {
      this.getUser()
    })
    DataState.$on('logoutSuccess', (payload) => {
      this.isUserAuthenticate = false
      this.clearStore()
    })
  }
}
</script>

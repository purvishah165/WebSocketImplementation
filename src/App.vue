<template>
  <div id="app">
    <sdp-header v-if="isSDP" :list="list"></sdp-header>
    <ff-header v-if="isHome" :scroll="scrolled"></ff-header>
    <account-header v-if="isAcc"></account-header>
    <portal-header v-if="isSock"></portal-header>
    <div class="cover-spin" v-if="isLoading"></div>
    <router-view/>
    <security-modal></security-modal>
    <preview-modal></preview-modal>
    <login-modal></login-modal>
    <logout></logout>
    <forgot-password></forgot-password>
    <help-modal></help-modal>
    <comment-modal></comment-modal>
    <uploadDocumentsModal></uploadDocumentsModal>
    <myob-popup></myob-popup>
    <ff-footer></ff-footer>
  </div>
</template>
<script>
import SDPHeader from '@/components/SecureDocumentPortal/SDPHeader/SDPHeader.vue'
import FfFooter from './components/FfFooter/FfFooter'
import { LoadingState, PageState, DataState } from '@/main'
import FfHeader from './components/FfHeader/FfHeader'
import SecurityModal from './components/SecurityModal/SecurityModal'
import PreviewModal from '@/components/FfHomePage/ExampleReports/PreviewModal'
import store from '@/store'
import LoginModal from './components/Login/LoginModal'
import AccountHeader from './components/MyAccount/AccountHeader/AccountHeader'
import Logout from '@/components/Logout/Logout'
import ForgotPassword from './components/ForgotPassword/ForgotPassword'
import HelpModal from '@/components/SecureDocumentPortal/HelpModal/HelpModal'
import CommentModal from '@/components/SecureDocumentPortal/ApproveReports/CommentModal/CommentModal'
import uploadDocumentsModal from '@/components/SecureDocumentPortal/UploadDocuments/UploadDocumentsModal'
import PortalHeader from '@/components/AccountingIntegrationPortal/PortalHeader/PortalHeader'
import MyobPopup from '@/components/AccountingIntegrationPortal/AccountingPackages/MyobPopup/MyobPopup'
export default {
  name: 'App',

  store,

  components: {
    MyobPopup,
    PortalHeader,
    ForgotPassword,
    Logout,
    AccountHeader,
    LoginModal,
    SecurityModal,
    CommentModal,
    HelpModal,
    uploadDocumentsModal,
    FfHeader,
    FfFooter,
    PreviewModal,
    'sdp-header': SDPHeader
  },

  data () {
    return {
      isLoading: false,
      isFlex: false,
      isHome: false,
      isAcc: false,
      isLogin: false,
      isSDP: false,
      isTouchDevice: false,
      toast: null,
      scrolled: false,
      list: [],
      isSock: false
    }
  },
  methods: {
    handleScroll () {
      this.scrolled = window.scrollY > 0
    }
  },
  created () {
    const mainLoad = document.createEvent('CustomEvent')
    mainLoad.initCustomEvent('main_load_ready', true, true, true)
    window.dispatchEvent(mainLoad)
    window.addEventListener('scroll', this.handleScroll)
    LoadingState.$on('toggle', (isLoading) => {
      this.isLoading = isLoading
    })
    PageState.$on('ishome', (ishome) => {
      this.isHome = ishome
    })
    PageState.$on('issdp', (isSDP) => {
      this.isSDP = isSDP
    })
    PageState.$on('isAccount', (isAcc) => {
      this.isAcc = isAcc
    })
    PageState.$on('isSocket', (isSock) => {
      this.isSock = isSock
    })
    DataState.$on('helpList', (payload) => {
      console.log('help list caught', payload)
      this.list = payload.list
    })
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  }

}
</script>
<style lang="scss">
  @import "~@/style";
</style>

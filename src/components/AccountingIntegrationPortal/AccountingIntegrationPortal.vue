<template>
    <div class="content-area col-sm-12 portal-content-section">
        <div class="cover-area" v-show="!jwtError">
        <div class="container">
        <div class="col-lg-12 text-center">
            <p>
                <br><br>
                <b class="text-white text-bold sl-home-heading">All Financial Reports in One Link!</b>
            </p><h3 class="text-white">Easiest way to share your financial information</h3>
        </div>
        </div>
        <div class="portal-container">
            <accounting-packages></accounting-packages>
        </div>
        </div>
        <div class="sdp-container" v-show="jwtError">
            <error-template></error-template>
        </div>
    </div>
</template>

<script>
  import { PageState, DataState } from '@/main'
  import AccountingPackages from './AccountingPackages/AccountingPackages.vue'
  import ErrorTemplate from './ErrorTemplate/ErrorTemplate'

  export default {
    components: {
      ErrorTemplate,
      AccountingPackages
    },
    name: 'secure-document-portal',
    data () {
      return {
        jwtError: false
      }
    },
    mounted () {
      PageState.$emit('isSocket', true)
      PageState.$emit('issdp', false)
      PageState.$emit('ishome', false)
      PageState.$emit('isAccount', false)
      DataState.$on('jwtError', (payload) => {
        this.jwtError = payload
      })
    }
  }
</script>

<style scoped>

</style>

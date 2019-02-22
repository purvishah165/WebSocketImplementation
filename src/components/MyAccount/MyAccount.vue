<template>
    <div class="content-area w-100 main-account-section">
        <div class="col-md-2 col-12">
            <left-navigation-pane></left-navigation-pane>
        </div>
        <div class="col-md-8">
        <router-view :basic_profile="basic_profile" :subscription="basic_subscription" :address="basic_address"></router-view>
        </div>
        <div class="col-md-2">
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { PageState, LoadingState, DataState } from '@/main'
import LeftNavigationPane from './LeftNavigationPane/LeftNavigationPane'
export default {
  components: { LeftNavigationPane },
  name: 'my-account',
  data () {
    return {
      basic_profile: {},
      basic_subscription: {},
      basic_address: {}
    }
  },
  computed: {
    ...mapGetters({
      userDetails: 'userDetails',
      subscriptions: 'subscriptions',
      address: 'address'
    })
  },
  watch: {
    userDetails: {
      handler: function (val) {
        Vue.set(this, 'basic_profile', JSON.parse(JSON.stringify(val)))
      },
      deep: true
    },
    subscriptions: {
      handler: function (val) {
        Vue.set(this, 'basic_subscription', JSON.parse(JSON.stringify(val)))
      },
      deep: true
    },
    address: {
      handler: function (val) {
        Vue.set(this, 'basic_address', JSON.parse(JSON.stringify(val)))
      },
      deep: true
    }
  },
  methods: {
    async getUser () {
      LoadingState.$emit('toggle', true)
      await this.$store.dispatch('prepareUserDetail', { context: this })
      if (this.userDetails) {
        Vue.set(this, 'basic_profile', JSON.parse(JSON.stringify(this.userDetails)))
        Vue.set(this, 'basic_subscription', JSON.parse(JSON.stringify(this.subscriptions)))
        Vue.set(this, 'basic_address', JSON.parse(JSON.stringify(this.address)))
      } // else {
      //   // this.toast.showToast(user_response.body.message, { theme: 'error', timeLife: 5000 });
      // }
      // TODO handle error scenario from user api
      LoadingState.$emit('toggle', false)
    }
  },
  mounted () {
    PageState.$emit('isAccount', true)
    PageState.$emit('ishome', false)
    PageState.$emit('isSDP', false)
    this.getUser()
    DataState.$on('getUser', (payload) => {
      this.getUser()
    })
  }
}
</script>

<style scoped>

</style>

<template>
    <header id="masthead" class="site-header fixed-top navbar-light" role="banner" :class="{'scroll': scroll}">
        <div class="container-fluid container-fluid-less">
            <nav class="navbar navbar-expand-xl p-0">
                <div class="navbar-brand">
                    <a href="/">
                        <img class="img-responsive main-logo" src="@/assets/logo_beta.png">
                    </a>
                </div>


                <b-btn class="navbar-toggler" type="button" v-b-toggle.main-nav aria-controls="" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </b-btn>
                <b-collapse id="main-nav" class="collapse navbar-collapse justify-content-end">
                    <ul id="menu-top-menu" class="main-top-menu navbar-nav">
                        <li class="nav-item ">
                            <router-link v-b-toggle="'main-nav'" title="How It Works?" to="/#how-it-works" class="nav-link" v-smooth-scroll>How It Works?</router-link>
                        </li>
                        <li  class="nav-item ">
                            <router-link v-b-toggle="'main-nav'" title="Example Reports" to="/example-reports" class="nav-link" exact>Example Reports</router-link>
                        </li>
                        <li class="nav-item  ">
                            <router-link v-b-toggle="'main-nav'" title="Accounting Packages" to="/#accounting-packages" class="nav-link" v-smooth-scroll>Accounting Packages</router-link>
                        </li>
                        <li  class="nav-item ">
                            <router-link v-b-toggle="'main-nav'" title="FAQ's" to="/faqs" class="nav-link" exact>FAQ’s</router-link>
                        </li>
                        <li  class="nav-item">
                            <router-link v-b-toggle="'main-nav'" title="Pricing" to="/pricing" class="nav-link" exact>Pricing</router-link>
                        </li>
                        <li  class="nav-item " v-if="!isUserAuthenticate">
                            <a title="Log In" v-b-toggle="'main-nav'" @click="openLoginModal" class="nav-link icon-cursor">Log In</a>
                        </li>
                        <li  class="nav-item " v-if="isUserAuthenticate">
                            <a title="My Account" v-b-toggle="'main-nav'" @click="showLogout" class="nav-link icon-cursor">Log out</a>
                        </li>
                        <li  class="nav-item " v-if="isUserAuthenticate">
                            <router-link v-b-toggle="'main-nav'" title="My Account" to="my-account" class="nav-link" exact>My Account</router-link>
                        </li>
                    </ul>
                </b-collapse>

            </nav>
        </div>
    </header>
</template>

<script>
import { DialogueState, DataState } from '@/main'
// import auth from '@/services/auth'
export default {
  name: 'ff-header',
  props: ['scroll'],
  data () {
    return {
      isUserAuthenticate: false
    }
  },
  methods: {
    openLoginModal () {
      DialogueState.$emit('loginmodal', {})
    },
    showLogout () {
      DialogueState.$emit('openLogoutDialogue', {
        action_name: 'log_out',
        content_type: 'log_out',
        dialogue_message: '<h3 class="text-center">Are you sure you want to log out?</h3>',
        confirm_btn_name: 'Log out'
      })
    }
  },
  mounted () {
    if (window.localStorage.getItem('id_token')) {
      this.isUserAuthenticate = true
    }
    DataState.$on('userAuth', (payload) => {
      this.isUserAuthenticate = true
    })
    DataState.$on('logoutSuccess', (payload) => {
      this.isUserAuthenticate = false
    })
  }
}
</script>

<style scoped>

</style>

<template>
    <nav class="navbar app-sidebar">
        <div class="d-flex flex-column w-100">
            <div class="flex-scroll-wrapper">
                <ul class="nav side-nav flex-column">
                    <li class="nav-item">
                        <router-link class="nav-link" tag="a" to="/my-account/dashboard" exact>
                            <span class="nav-label">Dashboard</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" tag="a" to="/my-account/orders" exact>
                            <span class="nav-label">Orders</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" tag="a" to="/my-account/view-subscription" exact>
                            <span class="nav-label">My Subscription</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" tag="a" to="/my-account/edit-address" exact>
                            <span class="nav-label">Addresses</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link class="nav-link" tag="a" to="/my-account/edit-account" exact >
                            <span class="nav-label">Account Details</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <a @click="showLogout" class="nav-link">
                            <span class="nav-label icon-cursor">Logout</span>
                        </a>
                    </li>
                </ul>
        </div>
        </div>
    </nav>
</template>

<script>
import { DialogueState } from '@/main'
import auth from '@/services/auth'

export default {
  name: 'left-navigation-pane',
  methods: {
    showLogout () {
      DialogueState.$emit('openLogoutDialogue', {
        action_name: 'log_out',
        content_type: 'log_out',
        dialogue_message: '<h3 class="text-center">Are you sure you want to log out?</h3>',
        confirm_btn_name: 'Log out'
      })
    },

    logout () {
      auth.logout(this)
    }
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>

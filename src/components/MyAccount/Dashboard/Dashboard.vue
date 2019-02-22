<template>
    <div class="dashboard-content">
        <p>Hello <strong>{{basic_profile.first_name}} {{basic_profile.last_name}}</strong>
            (not <strong>{{basic_profile.first_name}} {{basic_profile.last_name}}</strong>? <a @click="showLogout" class="link cursor-pointer">Log out</a>)</p>
        <p>From your account dashboard you can view your
            <router-link to="orders" class="link">recent orders</router-link>, manage your
            <router-link to="edit-address" class="link">address</router-link>, and
            <router-link to="edit-account" class="link">edit your password and account details</router-link>.
        </p>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { DialogueState } from '@/main'
export default {
  name: 'dashboard',
  props: ['basic_profile'],
  computed: {
    ...mapGetters({
      userDetails: 'userDetails',
      subscriptions: 'subscriptions',
      address: 'address'
    })
  },
  methods: {
    showLogout () {
      DialogueState.$emit('openLogoutDialogue', {
        action_name: 'log_out',
        content_type: 'log_out',
        dialogue_message: '<h3 class="text-center">Are you sure you want to log out?</h3>',
        confirm_btn_name: 'Log out'
      })
    }
  }
}
</script>

<style scoped>

</style>

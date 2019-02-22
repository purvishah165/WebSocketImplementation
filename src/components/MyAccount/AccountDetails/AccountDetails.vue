<template>
    <div class="container">
        <div class="row">
            <p class="col-6">
                <label class="control-label">First name<i class="fa fa-asterisk required"></i>
                </label>
                <span class="input-wrapper">
                    <input type="text" v-model="basic_profile.first_name" name="First Name" v-validate="'required'"  class="input-text form-control input-lg"/>
                </span>
                <span v-show="errors.has('First Name')" class="text-danger">
                    {{ errors.first('First Name') }}
                </span>
            </p>
            <p class="col-6">
                <label class="control-label">Last name<i class="fa fa-asterisk required"></i>
                </label>
                <span class="input-wrapper"><input type="text" name="Last Name" v-model="basic_profile.last_name" v-validate="'required'" class="input-text form-control input-lg"/></span>
                <span v-show="errors.has('Last Name')" class="text-danger">
                    {{ errors.first('Last Name') }}
                </span>
            </p>
        </div>
        <div class="row">
            <p class="col-12">
                <label class="control-label">Email address<i class="fa fa-asterisk required"></i>
                </label>
                <span class="input-wrapper"><input type="text" v-model="basic_profile.email" disabled class="input-text form-control input-lg"/></span>
            </p>
        </div>
        <fieldset>
            <legend>Password change</legend>

            <p class="">
                <label for="password_current">Current password (leave blank to leave unchanged)</label>
                <input type="password" class=" input-text form-control" v-model="password.old_password" name="Old Password" id="password_current" autocomplete="off" v-validate="password.new_password !== '' ?'required': ''" >
            </p>
            <p v-show="errors.has('Old Password')" class="text-danger">{{ errors.first('Old Password') }}</p>
            <p class="">
                <label for="password_1">New password (leave blank to leave unchanged)</label>
                <input type="password" class=" input-text form-control" v-model="password.new_password" name="New Password" id="password_1" autocomplete="off" v-validate="password.old_password !== '' ? 'required|min:6|confirmed:passwordRef': 'min:6|confirmed:passwordRef' ">
            </p>
            <p v-show="errors.has('New Password')" class="text-danger">{{ errors.first('New Password') }}</p>
            <p class="">
                <label for="password_2">Confirm new password</label>
                <input type="password" ref="passwordRef" class=" input-text form-control" v-model="password.c_password" name="Confirm Password" id="password_2" autocomplete="off" v-validate="password.new_password !== '' ?'required|min:6': 'min:6'" >
            </p>
            <p v-show="errors.has('Confirm Password')" class="text-danger">{{ errors.first('Confirm Password') }}</p>
        </fieldset>
        <div class="d-flex mt-2">
            <a class="btn btn-violet" @click="saveChanges">Save Changes</a>
        </div>
    </div>

</template>

<script>
import { mapGetters } from 'vuex'
import { LoadingState } from '@/main'
import userServices from '@/services/user'
import auth from '@/services/auth'
export default {
  name: 'account-details',
  props: ['basic_profile'],
  data () {
    return {
      password: {
        client_ref: process.env.VUE_APP_CLIENT_REF,
        old_password: '',
        new_password: '',
        c_password: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      userDetails: 'userDetails'
    })
  },
  methods: {
    saveChanges () {
      console.log('inside save')
      this.$validator.validateAll().then(success => {
        if (!success) {
        // handle error
          console.log('inside validate error')
          return
        }
        this.updateUser()
        console.log('Profile Updated')
      })
    },
    async updateUser () {
      LoadingState.$emit('toggle', true)
      await userServices.updateUserprofile(this, this.basic_profile).then(async userResponse => {
        if (userResponse.body.success) {
          // check if password has been entered, then call cahnge password
          if (this.password.old_password !== '') {
            await this.changePassword()
          }
          LoadingState.$emit('toggle', false)
          this.$store.dispatch('updateUserDetail', { context: this })
          // this.toast.showToast('Successfully Updated', { theme: 'success', timeLife: 3000 })
        } else {
          LoadingState.$emit('toggle', false)
          // this.toast.showToast(userResponse.body.message, { theme: 'error', timeLife: 5000 })
        }
      })
    },
    async changePassword () {
      auth.resetPassword(this, JSON.parse(JSON.stringify(this.password))).then(userResponse => {
        if (userResponse.status === 200) {
          this.password.old_password = ''
          this.password.new_password = ''
          this.password.c_password = ''
          // this.toast.showToast('Password successfully changed', { theme: 'success', timeLife: 3000 })
        } else {
          LoadingState.$emit('toggle', false)
          // TODO toast this.toast.showToast(userResponse.body.message, { theme: 'error', timeLife: 5000 })
        }
      })
      console.log('Password Updated')
    }
  }
}
</script>

<style scoped>

</style>

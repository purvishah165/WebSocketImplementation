<template>
    <div class="form-row flex-column" id="customer_details">
        <div class="billing-fields col-sm-10">
            <div class="col-12">
                <h3>Billing details</h3>
            </div>
            <div class="billing_fields_wrapper col-lg-5 col-md-6 col-sm-8 col-xs-12">
                <p>
                    <label for="billing_first_name" class="control-label">First name<i class="fa fa-asterisk required"></i>
                    </label>
                    <span class="input-wrapper">
                                        <input type="text" v-model="accountDetails.first_name" v-validate="'required'" class="input-text form-control input-lg" name="First name" id="billing_first_name"/>
                                    </span>
                    <span v-show="errors.has('First name')" class="text-danger">{{ errors.first('First name') }}</span>
                </p>
                <p>
                    <label for="billing_last_name" class="control-label">Last name<i class="fa fa-asterisk required"></i>
                    </label>
                    <span class="input-wrapper"><input type="text" v-model="accountDetails.last_name" v-validate="'required'" class="input-text form-control input-lg" name="Last name" id="billing_last_name"/></span>
                    <span v-show="errors.has('Last name')" class="text-danger">{{ errors.first('Last name') }}</span>
                </p>
                <p>
                    <label for="billing_company_name" class="control-label">Company name (optional)
                    </label>
                    <span class="input-wrapper"><input type="text" v-model="billingAddress.company" class="input-text form-control input-lg" name="billing_company_name" id="billing_company_name"/></span>
                </p>
                <!--address details-->
                <p>
                    <label for="billing_country" class="control-label">Country<i class="fa fa-asterisk required"></i>
                    </label>
                    <span class="input-wrapper" id="billing_country">
                                    <country-select name="Country" v-model="billingAddress.address_country" :country="billingAddress.address_country" class="form-control" data-default-value="Australia" v-validate="'required'"/>
                                    </span>
                    <span v-show="errors.has('Country')" class="text-danger">{{ errors.first('Country') }}</span>
                </p>
                <p>
                    <label for="billing_address_1" class="control-label">Street address<i class="fa fa-asterisk required"></i></label>
                    <span class="input-wrapper"><input type="text" class="input-text form-control input-lg" name="Address line 1" v-model="billingAddress.address_line1" v-validate="'required'" id="billing_address_1" placeholder="House number and street name"/></span>
                    <span v-show="errors.has('Address line 1')" class="text-danger">{{ errors.first('Address line 1') }}</span>
                </p>
                <p>
                    <span class="input-wrapper"><input type="text" v-model="billingAddress.address_line2" class="input-text form-control input-lg" name="billing_address_2" id="billing_address_2" placeholder="Apartment, suite, unit etc. (optional)"/></span>
                </p>
                <p>
                    <label for="billing_suburb" class="control-label">Suburb<i class="fa fa-asterisk required"></i></label>
                    <span class="input-wrapper"><input type="text" v-model="billingAddress.address_city" class="input-text form-control input-lg" name="Suburb" id="billing_suburb" v-validate="'required'" /></span>
                    <span v-show="errors.has('Suburb')" class="text-danger">{{ errors.first('Suburb') }}</span>
                </p>
                <p>
                    <label for="billing_state" class="control-label">State<i class="fa fa-asterisk required"></i>
                    </label>
                    <span class="input-wrapper" id="billing_state">
                                    <region-select v-model="billingAddress.address_state" :country="billingAddress.address_country" :region="billingAddress.address_state" class="form-control" name="State" v-validate="'required'"/>
                                     </span>
                    <span v-show="errors.has('State')" class="text-danger">{{ errors.first('State') }}</span>
                </p>
                <p>
                    <label for="billing_postcode" class="control-label">Postcode<i class="fa fa-asterisk required"></i></label>
                    <span class="input-wrapper"><input type="text" v-model="billingAddress.address_postcode" class="input-text form-control input-lg" name="Postcode" v-validate="'required|digits:4'" id="billing_postcode" /></span>
                    <span v-show="errors.has('Postcode')" class="text-danger">{{ errors.first('Postcode') }}</span>
                </p>
                <p>
                    <label for="billing_phone" class="control-label">Phone (optional)</label>
                    <span class="input-wrapper"><input type="text" v-model="billingAddress.phone" class="input-text form-control input-lg" name="Phone" id="billing_phone" v-validate="'digits:10'" /></span>
                    <span v-show="errors.has('Phone')" class="text-danger">{{ errors.first('Phone') }}</span>
                </p>
                <p>
                    <label for="billing_email" class="control-label">Email address<i class="fa fa-asterisk required"></i></label>
                    <span class="input-wrapper"><input :disabled="edit === true" type="text" v-model="accountDetails.email" v-validate="'required|email'" class="input-text form-control input-lg" name="Email" id="billing_email" /></span>
                    <span v-show="errors.has('Email')" class="text-danger">{{ errors.first('Email') }}</span>
                </p>
            </div>

        </div>
        <div class="col-sm-10">
            <a class="btn btn-violet" @click="saveAddress" v-if="edit">Save address</a>
        </div>
    </div>
</template>

<script>
import 'vue-country-region-select'
import { LoadingState, DataState } from '@/main'
import userServices from '@/services/user'
export default {
  name: 'edit-address',
  inject: ['$validator'],
  props: ['accountDetails', 'billingAddress', 'edit'],
  methods: {
    saveAddress () {
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
      let profile = {
        first_name: this.accountDetails.first_name,
        last_name: this.accountDetails.last_name
      }
      let address = {
        address_line1: this.billingAddress.address_line1,
        address_line2: this.billingAddress.address_line2,
        address_city: this.billingAddress.address_city,
        address_state: this.billingAddress.address_state,
        address_country: this.billingAddress.address_country,
        address_postcode: this.billingAddress.address_postcode,
        company: this.billingAddress.company,
        phone: this.billingAddress.phone
      }
      await userServices.updateBillingAddress(this, address).then(async response => {
        if (response.body.success) {
          await userServices.updateUserprofile(this, profile).then(async userResponse => {
            if (userResponse.body.success) {
              await this.$store.dispatch('updateUserDetail', { context: this })
              DataState.$emit('editAddress', true)
              LoadingState.$emit('toggle', false)
              // this.toast.showToast('Successfully Updated', { theme: 'success', timeLife: 3000 })
            } else {
              LoadingState.$emit('toggle', false)
              // this.toast.showToast(userResponse.body.message, { theme: 'error', timeLife: 5000 })
            }
          })
        } else {
          console.log('address update error')
          LoadingState.$emit('toggle', false)
        }
      }).catch((err) => {
        // return err
        console.log('err caught', err)
        LoadingState.$emit('toggle', false)
      })
    }
  }
}
</script>

<style scoped>

</style>

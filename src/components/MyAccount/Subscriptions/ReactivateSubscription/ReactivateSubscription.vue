<template>
<div class="container">
    <edit-address :billingAddress="address" :accountDetails="basic_profile"></edit-address>
    <div class="checkout-payment">
        <card-details :card="cardDetail"></card-details>
        <div class="form-row p-4">
            <a class="btn btn-violet" @click="reactivate" id="place_order">Reactivate</a>
        </div>
    </div>

</div>
</template>

<script>
import EditAddress from '../../EditAddress/EditAddress'
import CardDetails from '../../CardDetails/CardDetails'
import { LoadingState, DataState } from '@/main'
import router from '@/router'
import userService from '@/services/user'
export default {
  components: {
    CardDetails,
    EditAddress },
  props: ['address', 'basic_profile'],
  name: 'reactivate-subscription',
  data () {
    return {
      cardDetail: {
        name: '',
        number: '',
        expiry: '',
        expiry_month: '',
        expiry_year: '',
        cvc: ''
      },
      cardToken: null,
      id: null
    }
  },
  methods: {
    async reactivate () {
      this.$validator.validateAll().then(async success => {
        if (!success) {
          // handle error
          console.log('Errors in form')
          return
        }
        LoadingState.$emit('toggle', true)
        let checkoutParams = {
          params: {
            _method: 'POST',
            publishable_api_key: process.env.VUE_APP_KEY,
            number: this.cardDetail.number,
            expiry_month: this.cardDetail.expiry_month,
            expiry_year: this.cardDetail.expiry_year,
            cvc: this.cardDetail.cvc,
            name: this.cardDetail.name,
            address_line1: this.address.address_line1,
            address_line2: this.address.address_line2,
            address_city: this.address.address_city,
            address_postcode: this.address.address_postcode,
            address_state: this.address.address_state,
            address_country: this.address.address_country
          }
        }
        console.log('params-------', checkoutParams)
        await this.$http.jsonp(process.env.VUE_APP_PIN_URL, checkoutParams).then(async (response) => {
          if (response.body.response) {
            console.log('response of success jsonp', response)
            this.cardToken = response.body.response.token
            let params = {
              card_token: this.cardToken
            }
            const reactiveResponse = await userService.reactivateSubscription(this, this.id, params)
            console.log('cehckout------', reactiveResponse)
            LoadingState.$emit('toggle', false)
            if (reactiveResponse.status === 200) {
              DataState.$emit('getUser', true)
              router.push('/my-account/view-subscription')
            }
          } else if (response.body.error) {
            console.log('response of error jsonp', response)
            LoadingState.$emit('toggle', false)
          }
          // return response
        }).catch((err) => {
          // return err
          console.log('err caught', err)
        })
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.id = this.$route.params.id
  }
}
</script>

<style scoped>

</style>

<template>
<div class="content-area col-sm-12 checkout-section">
    <div class="container checkout-container">
        <div class="checkout-error" v-if="checkoutMsgs && checkoutMsgs.length > 0">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            <ul >
                <li v-for="error in checkoutMsgs">{{error}}</li>
            </ul>
        </div>
        <b-card no-body class="mb-1">
            <b-card-header header-tag="header" class="faq-title " role="tab">
                <a v-b-toggle.collapse1><div class="col-12 icon-cursor"><a>Have a coupon? Click here to enter your code</a></div></a>
            </b-card-header>
            <b-collapse id="collapse1"  role="tabpanel">
                <b-card-body>
                    <form class="checkout_coupon woocommerce-form-coupon">

                        <p>If you have a coupon code, please apply it below.</p>

                        <p class="form-row form-row-first">
                            <input v-model="coupon" type="text" name="coupon_code" class="form-control col-4" placeholder="Coupon code" id="coupon_code" value="">
                            <a class="btn btn-violet" v-if="toggleCoupon" value="Remove coupon" @click="removeCoupon">Remove coupon</a>
                            <a class="btn btn-violet" v-if="!toggleCoupon" value="Apply coupon" @click="applyCoupon">Apply coupon</a>

                        </p>
                    </form>
                </b-card-body>
            </b-collapse>
        </b-card>
        <form>
            <div class="row">
                <div class="col-12">
                    <edit-address :accountDetails="accountDetails" :billingAddress="billingAddress"></edit-address>
                    <div class="account-details form-row">
                        <div class="col-sm-10">
                            <div class="col-lg-5 col-md-6 col-sm-8 col-xs-12">
                                <p id="account_username_field">
                                    <label for="account_username" class="control-label">Account username<i class="fa fa-asterisk required"></i></label>
                                    <span class="w-100">
                                    <input type="text" class="form-control input-lg" v-model="accountDetails.email" v-validate="'required|email'" name="Username" id="account_username" placeholder="Username" >
                                    </span>
                                    <span v-show="errors.has('Username')" class="text-danger">{{ errors.first('Username') }}</span>
                                </p>
                                <p id="account_password_field" >
                                    <label for="account_password" class="control-label">Create account password<i class="fa fa-asterisk required"></i></label>
                                    <span class="w-100">
                                    <input type="password" class="form-control input-lg" v-model="accountDetails.password" name="Password" v-validate="'required|min:6|confirmed:passwordRef'" id="account_password" placeholder="Password" >
                                    </span>
                                    <span v-show="errors.has('Password')" class="text-danger">{{ errors.first('Password') }}</span>
                                </p>
                                <p id="account_c_password_field" >
                                    <label for="account_c_password" class="control-label">Confirm password<i class="fa fa-asterisk required"></i></label>
                                    <span class="w-100">
                                    <input type="password" class="form-control input-lg" ref="passwordRef" v-model="accountDetails.c_password" name="Confirm Password" id="account_c_password" placeholder="Confirm Password" v-validate="'required|min:6'" >
                                    </span>
                                    <span v-show="errors.has('Confirm Password')" class="text-danger">{{ errors.first('Confirm Password') }}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="p-2">
                    <h3>Your Order</h3>
                    <plan-table :name="cartDetails.products[0].name" :plan="cartDetails.products[0].plan" :orders="cartDetails.products" :type="'subscription'"></plan-table>
                    </div>
                        <div id="payment" class="checkout-payment">
                        <card-details :card="cardDetail" v-if="cardRequired"></card-details>
                        <div class="form-row place-order">
                            <a class="btn btn-violet" @click="checkout" id="place_order" value="Sign Up Now" data-value="Sign Up Now">Sign Up Now</a>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
</template>

<script>
import 'vue-country-region-select'
import { mapGetters } from 'vuex'
import userService from '@/services/user'
import { LoadingState, PageState, ErrorMessage } from '@/main'
import router from '@/router'
import EditAddress from '../EditAddress/EditAddress'
import CardDetails from '../CardDetails/CardDetails'
import PlanTable from '../PlanTable/PlanTable'
export default {
  components: {
    PlanTable,
    CardDetails,
    EditAddress },
  name: 'checkout',
  data: () => ({
    billingAddress: {
      address_line1: '',
      address_line2: '',
      address_city: '',
      address_postcode: '',
      address_state: '',
      address_country: '',
      company: '',
      phone: ''
    },
    accountDetails: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      c_password: ''
    },
    cardDetail: {
      name: '',
      number: '',
      expiry: '',
      expiry_month: '',
      expiry_year: '',
      cvc: ''
    },
    cardToken: null,
    cartId: null,
    messages: [],
    checkoutMsgs: [],
    coupon: '',
    toggleCoupon: false,
    cardRequired: true
  }),
  computed: {
    ...mapGetters({
      cartDetails: 'cartDetails'
    })
  },
  methods: {
    async applyCoupon () {
      let params = {
        coupon: this.coupon
      }
      const coupon = await userService.updateCartWithCoupon(this, params, this.cartId)
      if (coupon.status === 200) {
        this.toggleCoupon = true
      }
      this.getCart()
    },
    async removeCoupon (coupon) {
      let params = {
        coupon: this.coupon
      }
      const deleteCoupon = await userService.deleteCartWithCoupon(this, params, this.cartId)
      console.log('response-------', deleteCoupon)
      if (deleteCoupon.status === 200) {
        this.toggleCoupon = false
        this.coupon = 0
      }
      this.getCart()
    },
    async getCart () {
      let request = {
        context: this,
        id: this.cartId
      }
      await this.$store.dispatch('getCart', request)
      this.checkCardRequired()
      if (!(this.cartDetails && this.cartDetails.products && this.cartDetails.products.length > 0)) {
        router.push('/pricing')
      }
    },
    checkCardRequired () {
      if (this.cartDetails && this.cartDetails.products && this.cartDetails.products.length > 0) {
      // for now just chekcing for the 1st product if 0 no need for card details
        if (this.cartDetails.products[0].amount === 0) {
          this.cardRequired = false
        } else {
          this.cardRequired = true
        }
      }
    },
    async checkout () {
      this.$validator.validateAll().then(async success => {
        if (!success) {
          // handle error
          console.log('Errors in form')
          return
        }
        LoadingState.$emit('toggle', true)
        if (this.cardRequired) {
          let checkoutParams = {
            params: {
              _method: 'POST',
              publishable_api_key: process.env.VUE_APP_KEY,
              number: this.cardDetail.number,
              expiry_month: this.cardDetail.expiry_month,
              expiry_year: this.cardDetail.expiry_year,
              cvc: this.cardDetail.cvc,
              name: this.cardDetail.name,
              address_line1: this.billingAddress.address_line1,
              address_line2: this.billingAddress.address_line2,
              address_city: this.billingAddress.address_city,
              address_postcode: this.billingAddress.address_postcode,
              address_state: this.billingAddress.address_state,
              address_country: this.billingAddress.address_country
            }
          }
          console.log('params-------', checkoutParams)
          await this.$http.jsonp(process.env.VUE_APP_PIN_URL, checkoutParams).then(async (response) => {
            if (response.body.response) {
              console.log('response of success jsonp', response)
              this.cardToken = response.body.response.token
              let params = {
                client_ref: process.env.VUE_APP_CLIENT_REF,
                card_token: this.cardToken,
                account_details: {
                  first_name: this.accountDetails.first_name,
                  last_name: this.accountDetails.last_name,
                  email: this.accountDetails.email,
                  password: this.accountDetails.password,
                  c_password: this.accountDetails.c_password,
                  company: this.billingAddress.company,
                  phone: this.billingAddress.phone
                }
              }
              const checkOutResponse = await userService.checkout(this, this.cartId, params)
              console.log('cehckout------', checkOutResponse)
              LoadingState.$emit('toggle', false)
              if (checkOutResponse.status === 200) {
                this.checkoutMsgs = []
                window.localStorage.setItem('id_token', checkOutResponse.body.data.token)
                router.push('/my-account/orders')
              } else {
                let message1 = checkOutResponse.body.data
                let message2 = checkOutResponse.body.message
                this.checkoutMsgs.push(message2)
                this.checkoutMsgs.push(message1)
              }
            } else if (response.body.error) {
              console.log('response of error jsonp', response)
              this.messages = response.body.messages
              LoadingState.$emit('toggle', false)
              ErrorMessage.$emit('errorCheckout', this.messages)
            }
            // return response
          }).catch((err) => {
            // return err
            console.log('err caught', err)
          })
        } else {
          let params = {
            client_ref: process.env.VUE_APP_CLIENT_REF,
            account_details: {
              first_name: this.accountDetails.first_name,
              last_name: this.accountDetails.last_name,
              email: this.accountDetails.email,
              password: this.accountDetails.password,
              c_password: this.accountDetails.c_password,
              company: this.billingAddress.company,
              phone: this.billingAddress.phone
            },
            billing_details: {
              address_line1: this.billingAddress.address_line1,
              address_line2: this.billingAddress.address_line2,
              address_city: this.billingAddress.address_city,
              address_postcode: this.billingAddress.address_postcode,
              address_state: this.billingAddress.address_state,
              address_country: this.billingAddress.address_country
            }
          }
          const checkOutResponseWithoutCard = await userService.checkout(this, this.cartId, params)
          console.log('cehckout------', checkOutResponseWithoutCard)
          LoadingState.$emit('toggle', false)
          if (checkOutResponseWithoutCard.status === 200) {
            this.checkoutMsgs = []
            window.localStorage.setItem('id_token', checkOutResponseWithoutCard.body.data.token)
            router.push('/my-account/orders')
          } else {
            let message1 = checkOutResponseWithoutCard.body.data
            let message2 = checkOutResponseWithoutCard.body.message
            this.checkoutMsgs.push(message2)
            this.checkoutMsgs.push(message1)
          }
        }
      })
    }
  },
  mounted () {
    this.cartId = this.$route.params.id
    if (this.cartId !== this.cartDetails.id) {
      // store has been refreshed, so need to get cart again
      this.getCart()
    } else {
      this.checkCardRequired()
    }
    PageState.$emit('isAccount', true)
    PageState.$emit('ishome', false)
    PageState.$emit('isSDP', false)
  }
}
</script>

<style scoped>

</style>

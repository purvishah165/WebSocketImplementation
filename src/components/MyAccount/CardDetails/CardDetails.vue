<template>
    <ul class="wc_payment_methods payment_methods methods">
        <li class="wc_payment_method payment_method_pin_payments">
            <input id="payment_method_pin_payments" type="radio" class="input-radio" name="payment_method" value="pin_payments" checked="checked" data-order_button_text="" style="display: none;">

            <label for="payment_method_pin_payments">
                Pin Payments <img src="@/assets/pin.png" alt="Pin Payments">	</label>
            <div class="payment_box payment_method_pin_payments">
                TEST MODE ENABLED<p></p><p>Pay using credit card</p>
                <div class="checkout-error" v-if="errorMsgs.length > 0">
                    <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
                    <ul >
                        <li v-for="error in errorMsgs">{{error.message}}</li>
                    </ul>
                </div>
                <fieldset>
                    <div class="pin_new_card">
                        <div id="wc-pin_payments-cc-form" class="wc-credit-card-form wc-payment-form">
                            <div class="d-flex">
                                <div class="col-sm-6">
                                    <p class="form-row ">
                                        <label for="pin_payments-card-name">Name on card <i class="fa fa-asterisk required"></i></label>
                                        <input id="pin_payments-card-name" v-model="card.name" v-validate="'required'" class="form-control wc-credit-card-form-card-name" type="text" autocomplete="off" placeholder="" name="Name">
                                        <span v-show="errors.has('Name')" class="text-danger">{{ errors.first('Name') }}</span>
                                    </p>
                                    <p class="form-row ">
                                        <label for="pin_payments-card-number">Card number&nbsp;<i class="fa fa-asterisk required"></i></label>
                                        <input id="pin_payments-card-number" v-model="card.number" v-validate="'required|credit_card'" class="form-control wc-credit-card-form-card-number" inputmode="numeric" autocomplete="cc-number" autocorrect="no" autocapitalize="no" spellcheck="no" type="tel" placeholder="•••• •••• •••• ••••" name="Card Number" @keyup="formatCreditCard" maxlength="19">
                                        <span v-show="errors.has('Card Number')" class="text-danger">{{ errors.first('Card Number') }}</span>
                                    </p>
                                </div>
                            </div>
                            <div class="d-flex flex-wrap">
                                <div class="form-row col-sm-6 flex-column">
                                    <label for="pin_payments-card-expiry">Expiry (MM/YY)&nbsp;<i class="fa fa-asterisk required"></i></label>
                                    <div class="d-flex">
                                        <input minlength="1" maxlength="2" id="pin_payments-card-expirym" v-model="card.expiry_month" v-validate="'required|between:1,12'" class="form-control w-25 " inputmode="numeric" autocomplete="cc-exp" autocorrect="no" autocapitalize="no" spellcheck="no" type="tel" placeholder="MM" name="Expiry Month">
                                        <span class="dash">/</span>
                                        <input minlength="2" maxlength="2" id="pin_payments-card-expiry" v-model="card.expiry_year" v-validate="'required|decimal:2'" class="form-control w-25" inputmode="numeric" autocomplete="cc-exp" autocorrect="no" autocapitalize="no" spellcheck="no" type="tel" placeholder="YY" name="Expiry Year">
                                    </div>
                                    <span v-show="errors.has('Expiry Month')" class="text-danger">{{ errors.first('Expiry Month') }}</span><span v-show="errors.has('Expiry Year')" class="text-danger">{{ errors.first('Expiry Year') }}</span>

                                </div>
                                <p class="form-row col-sm-6 ">
                                    <label for="pin_payments-card-cvc">Card code&nbsp;<i class="fa fa-asterisk required"></i></label>
                                    <input id="pin_payments-card-cvc" v-model="card.cvc" v-validate="'required|numeric|min:3|max:4'" class="form-control wc-credit-card-form-card-cvc" inputmode="numeric" autocomplete="off" autocorrect="no" autocapitalize="no" spellcheck="no" type="tel" maxlength="4" placeholder="CVC" name="cvc">
                                    <span v-show="errors.has('cvc')" class="text-danger">{{ errors.first('cvc') }}</span>
                                </p>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>
                    <div class="clear"></div>
                </fieldset>

            </div>
        </li>
    </ul>
</template>

<script>
import { ErrorMessage } from '@/main'
export default {
  name: 'card-details',
  inject: ['$validator'],
  props: ['card'],
  data () {
    return {
      errorMsgs: []
    }
  },
  methods: {
    formatCreditCard () {
      const re = /^[0-9 ]+$/
      if (this.card.number.match(re)) {
        let str = this.card.number.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        let numberChunks = str.match(/\d{4,16}/g)
        console.log(numberChunks)
        let match = numberChunks && numberChunks[0] || ''
        let parts = []
        let result
        for (let i = 0, len = match.length; i < len; i += 4) {
          parts.push(match.substring(i, i + 4))
        }
        if (parts.length) {
          result = parts.join(' ')
        } else {
          result = this.card.number
        }
        this.card.number = result
      } else {
        this.card.number = ''
      }
    }
  },
  mounted () {
    ErrorMessage.$on('errorCheckout', (error) => {
      console.log(error)
      this.errorMsgs = error
      // this.resetgrecaptcha();
    })
  },
  destroyed () {
    ErrorMessage.$off('errorCheckout')
  }
}
</script>

<style scoped>

</style>

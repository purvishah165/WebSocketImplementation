<template>
    <div class="content-area col-sm-12 account-section">
        <div class="container cart-container">
            <div class="cart-message success" role="alert" v-if="createdCart && !userLogged">
                <i class="fa fa-check-circle" aria-hidden="true"></i> “Pro (Monthly)” has been added to your cart.
                <router-link to="/pricing" class="btn btn-violet float-right">Continue shopping</router-link>
            </div>
            <div class="cart-message exist" role="alert" v-if="existCart && !userLogged">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i>  You cannot add another "Pro (Monthly)" to your cart.
                <!--<router-link to="/pricing" class="btn btn-violet float-right">Continue shopping</router-link>-->
            </div>
            <div class="cart-message exist" role="alert" v-if="userLogged">
                <i class="fa fa-exclamation-circle" aria-hidden="true"></i> Sorry, this product cannot be purchased.
            </div>
            <div v-if="!userLogged" class="w-100">
                <b-table  ref="productTable" stacked="md" outlined :fields="cartfields" :items="getProductList" :busy="isBusy">
                    <template slot="action" slot-scope="data">
                        <div class="prevent-click">
                <span >
                  <a @click="deleteCart(data.item.id)" class="remove">x</a>
                </span>
                        </div>
                    </template>
                    <template slot="product" slot-scope="data">
                        <strong>({{data.item.name}}) {{data.item.plan}}</strong>
                    </template>
                    <template slot="price" slot-scope="data">
                        ${{formatAmount(data.item.amount, data.item.interval, data.item.int_unit)}}
                    </template>
                    <template slot="quantity" slot-scope="data">
                        {{data.item.quantity}}
                    </template>

                    <template slot="total" slot-scope="data">
                        ${{formatAmount((data.item.amount*data.item.quantity), data.item.interval, data.item.int_unit)}}
                    </template>
                </b-table>
                <div class="coupon input-group col-lg-4 col-md-6">
                    <label for="coupon_code"></label>
                    <input type="text" name="coupon_code" v-model="coupon" class="form-control" id="coupon_code" value="" placeholder="Coupon code">
                    <a class="btn btn-violet" name="apply_coupon" @click="applyCoupon">Apply Coupon</a>
                </div>
                <div class="cart-collaterals w-100 d-flex justify-content-end">
                    <div class="cart_totals col-lg-6 col-md-12 ">
                        <h2>Cart totals</h2>
                        <b-table ref="totalStack" outlined stacked :fields="totalfields" :items="items">
                            <template slot="subtotal" slot-scope="data">
                                ${{getCurrency(data.item.amount)}}
                            </template>
                            <template slot="coupon" slot-scope="data">
                                <span v-for="coupon in data.item.savings" style="display: flex;"><span>${{getCurrency(coupon.saving)}} </span> <span @click="removeCoupon(coupon.coupon)" class="remove coupon">x</span></span>
                            </template>
                            <template slot="total" slot-scope="data">
                                ${{getCurrency(data.item.amount*data.item.quantity)}}
                            </template>
                            <template slot="recurring_totals" slot-scope="data">
                            </template>
                            <template slot="recurring_subtotal" slot-scope="data">
                                ${{formatAmount(data.item.amount, data.item.interval, data.item.int_unit)}}
                            </template>
                            <template slot="recurring_date" slot-scope="data">
                                <strong><span class=" amount">${{formatAmount(data.item.amount, data.item.interval, data.item.int_unit)}}</span></strong>
                                <div class="first-payment-date"><small>First renewal: {{data.item.recurring_date | moment(" MMMM D YYYY")}}</small></div>
                            </template>
                        </b-table>
                        <div class="wc-proceed-to-checkout">
                            <a @click="goToCheckout" class="checkout-button btn btn-violet">
                                Proceed to checkout</a>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="wc-proceed-to-checkout">
                    <router-link to="/pricing" class="checkout-button btn btn-violet" exact>
                        Return to shop</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import router from '@/router'
import { PageState } from '@/main'
import auth from '@/services/auth'
import userService from '@/services/user'
import * as types from '@/store/mutation-types'
export default {
  name: 'cart',
  data () {
    return {
      cartfields: {
        action: {
          label: ''
        },
        product: {
          label: 'Product'
        },
        price: {
          label: 'Price'
        },
        quantity: {
          label: 'Quantity'
        },

        total: {
          label: 'Total'
        }
      },
      totalfields: {
        subtotal: {
          label: 'Subtotal'
        },
        coupon: {
          label: 'Coupon'
        },
        total: {
          label: 'Total'
        },
        recurring_totals: {
          label: 'Recurring Totals'
        },
        recurring_subtotal: {
          label: 'Subtotal'
        },

        recurring_date: {
          label: 'Recurring Total'
        }

      },
      items: [],
      prodIdList: [],
      id: this.$route.params.id,
      createdCart: false,
      existCart: false,
      coupon: null,
      isBusy: false,
      couponList: []
    }
  },
  computed: {
    ...mapGetters({
      cartDetails: 'cartDetails'
    }),
    userLogged: function () {
      return auth.checkAuth()
    }
  },
  watch: {
    cartDetails: {
      handler: function (val) {
        console.log('cart updated', val)
        this.$refs.productTable.refresh()
      },
      deep: true
    }
  },
  methods: {
    formatAmount (amount, interval, unit) {
    //    as amount has cent, we need to divide by 100 first
      let dollar = this.getCurrency(amount)

      let plan = ''
      // for now its just one product
      if (interval === 30 && unit === 'day') {
        plan = 'month'
      }
      return dollar + '/' + plan
    },
    getCurrency (amount) {
      let dollar = (amount / 100).toFixed(2)
      return dollar
    },
    async getProductList () {
      this.isBusy = true
      let promise = this.$http.get(process.env.VUE_APP_API_URL + '/cart/' + this.id)
      return promise.then((userResponse) => {
        this.items = []
        this.prodIdlist = []
        this.$store.commit(types.GET_CART_STORE, { userResponse })
        if (userResponse.body.data.coupons && userResponse.body.data.coupons.length > 0) {
          this.coupon = userResponse.body.data.coupons[0].coupon
          this.couponList = userResponse.body.data.coupons
        } else {
          this.couponList = []
        }
        let products = userResponse.body.data.products
        for (
          let appIndex = 0;
          appIndex < products.length;
          appIndex += 1
        ) {
          this.items.push({
            id: products[appIndex].id,
            name: products[appIndex].name,
            plan: products[appIndex].plan,
            quantity: appIndex + 1,
            interval: products[appIndex].interval,
            int_unit: products[appIndex].interval_unit,
            amount: products[appIndex].amount,
            recurring_date: this.getNextMonthDate(),
            savings: this.couponList
          })
        }
        this.isBusy = false
        // console.log('items userUpdateResponse.body.data-------', userUpdateResponse.body.data)
        // this.$store.dispatch('updateCartWithProduct', userUpdateResponse.body.data)
        return (this.items)
      })
    },
    getNextMonthDate () {
      let currentDate = moment(new Date())
      let futureMonth = moment(currentDate).add(1, 'M')
      let futureMonthEnd = moment(futureMonth).endOf('month')
      if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
        futureMonth = futureMonth.add(1, 'd')
      }
      return futureMonth
    },
    async createCart () {
      if (this.cartDetails.id) {
      // cart already exists
        this.existCart = true
        router.push('/cart/' + this.cartDetails.id)
        return
      }
      let request = {
        context: this
      }
      await this.$store.dispatch('createCart', request)
      this.createdCart = true
      // let updateRequest = {
      //   context: this,
      //   prod: { products: this.prodIdlist },
      //   id: this.cartDetails.id
      // }
      // this.$store.dispatch('updateCartWithProduct', updateRequest)
      router.push('/cart/' + this.cartDetails.id)
    },
    async getCart () {
      let request = {
        context: this,
        id: this.id
      }
      await this.$store.dispatch('getCart', request)
      this.createdCart = false
      // this.items = this.cartDetails.products
    },
    goToCheckout () {
      router.push('/cart/' + this.cartDetails.id + '/checkout')
    },
    async afterCartIdChecking () {
      if (!this.id) {
        this.createCart()
      } else if (this.id) {
        this.getCart()
      }
    },
    async applyCoupon () {
      let params = {
        coupon: this.coupon
      }
      const coupon = await userService.updateCartWithCoupon(this, params, this.id)
      console.log('response-------', coupon)
      this.getCart()
      this.$refs.productTable.refresh()
      this.$refs.totalStack.refresh()
    },
    async removeCoupon (coupon) {
      let params = {
        coupon: this.coupon
      }
      const deleteCoupon = await userService.deleteCartWithCoupon(this, params, this.id)
      console.log('response-------', deleteCoupon)
      this.getCart()
      this.$refs.productTable.refresh()
      this.$refs.totalStack.refresh()
    },
    deleteCart (id) {
      this.items.splice(id, 1)
      this.prodIdlist = []
      for (let prod in this.items) {
        this.prodIdlist.push({
          id: prod.id
        })
      }
      let updateRequest = {
        context: this,
        prod: { products: this.prodIdlist },
        id: this.cartDetails.id
      }
      this.$store.dispatch('updateCartWithProduct', updateRequest)
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
    // if (!auth.checkAuth()) {
    //   this.afterCartIdChecking()
    // }
    PageState.$emit('isAccount', true)
    PageState.$emit('ishome', false)
    PageState.$emit('isSDP', false)
  }
}
</script>

<style scoped>

</style>

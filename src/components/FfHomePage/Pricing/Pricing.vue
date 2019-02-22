<template>
    <div class="content-area col-sm-12 main-content-section">
        <div class="container pricing-container">
            <div class="col-lg-12 text-center add-mobile-top">
                <h1 class="heading-title text-white mt-0">Pricing</h1>
            </div>
            <div class="container pricing-box p-0">
                <div class="d-flex flex-wrap">
                    <div class="col-md-4 col-12 pricing-wrapper">
                        <div class="price-margin price-text"><p>0$</p></div>
                        <h2 class="heading-title text-center">Free</h2>
                        <div>
                            <p class="para-text">Everything you need to get started</p>
                        </div>
                        <ul style="margin-left: -10px; padding-bottom: 60px;">
                            <li v-for="(flist, index) in freelist" v-bind:key="index">{{flist}}</li>
                        </ul>
                        <div class="col-12 text-center button-choose button-free-start">
                            <a class="btn btn-lg border-curved btn-violet-inverse cursor-pointer" @click="gotToHome">Get Started!</a>
                        </div>
                    </div>
                    <div class="col-md-4 col-12 pro-box ">
                        <div class="price-margin price-text"><p>19.99$</p></div>
                        <div class="heading-margin"><h2 class="heading-title text-center">Pro</h2></div>
                        <div>
                            <p class="para-text">Everything you need to stand out</p>
                        </div>
                        <ul style="padding-bottom: 60px;">
                            <li v-for="(flist, index) in prolist" v-bind:key="index">{{flist}}</li>
                        </ul>
                        <div class="col-12 text-center button-choose align-bottom button-pro-start">
                            <a class="btn border-curved btn-lg btn-violet" @click="gotToCart">Get Started!</a>
                        </div>
                        <br><br>
                    </div>
                    <div class="col-md-4 col-12 pricing-wrapper">
                        <div class="ep-invisible text-right"><p></p></div>
                        <h2 class="heading-title text-center">Enterprise</h2>
                        <div>
                            <p class="para-text">Customise, build and expand</p>
                        </div>
                        <ul style="padding-bottom: 60px;">
                            <li v-for="(flist, index) in eplist" v-bind:key="index">{{flist}}</li>
                        </ul>
                        <div class="col-12 text-center button-choose">
                            <a class="btn btn-lg border-curved btn-violet-inverse cursor-pointer" @click="gotToContact">Contact Us</a>
                        </div>
                    </div >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { PageState, LoadingState } from '@/main'
import router from '@/router'
// import auth from '@/services/auth'
export default {
  name: 'pricing',
  data () {
    return {
      freelist: [
        'The 4 essential reports you need',
        'Customer Review and Verification Step',
        'Automated financial analysis and movement report',
        'Information Verification Wizard',
        'Unlimited Extractions'
      ],
      prolist: [
        'Access to all financial reports',
        'Customer Review and Verification Step',
        'Access to Insights Loan Hero AI reports',
        'Automated financial analysis and movement report',
        'Information Verification Wizard',
        'Unlimited Extractions'
      ],
      eplist: [
        'Analysis as a Service',
        'White Label customer experience',
        'Customised delivery platform and reports',
        'Loan Hero AI tool',
        'Loan Hero Financial Analysis Platform'
      ]
    }
  },
  computed: {
    ...mapGetters({
      cartDetails: 'cartDetails'
    })
  },
  watch: {
    cartDetails: {
      handler: function (val) {
      },
      deep: true
    }
  },
  methods: {
    gotToHome () {
      router.push('/')
    },
    async createCart () {
      if (this.cartDetails.id) {
        // cart already exists
        router.push('/cart/' + this.cartDetails.id)
        return
      }
      let request = {
        context: this
      }
      await this.$store.dispatch('createCart', request)
    },
    async afterCartIdChecking () {
      if (!this.cartDetails.id) {
        this.createCart()
      } else if (this.cartDetails.id) {
        LoadingState.$emit('toggle', false)
        router.push('/cart/' + this.cartDetails.id)
      }
    },
    gotToCart () {
      LoadingState.$emit('toggle', true)
      this.afterCartIdChecking()
    },
    gotToContact () {
      router.push('/#contact-us')
    }
  },
  mounted () {
    PageState.$emit('issdp', false)
    PageState.$emit('isAccount', false)
    PageState.$emit('ishome', true)
  }
}
</script>

<style scoped>
    .button-choose {
        position: absolute;
        bottom: 25px;
        right: 0;
    }

    @media screen and (max-width: 767px) {
        .button-free-start {
            bottom: 45px !important;
        }
    }

    @media screen and (min-width: 768px) {
        .button-pro-start{
            bottom: 40px !important;
        }
    }

    .heading-margin{
        margin-top: 60px;
    }

</style>

import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/FfHomePage/Home.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from) {
    // for scrolling to anchor tags
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    // scrolls to top on router change
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ x: 0, y: 0 })
      }, 100)
    })
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        title: 'Fast Financials'
      }
    },
    {
      path: '/terms-privacy-policy',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "policy" */ './components/FfHomePage/TermsPrivacyPolicy/TermsPrivacyPolicy.vue'),
      meta: {
        title: 'Terms & Privacy Policy - Fast Financials'
      }
    },
    {
      path: '/example-reports',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "example-reports" */ './components/FfHomePage/ExampleReports/ExampleReports.vue'),
      meta: {
        title: 'Example Reports - Fast Financials'
      }
    },
    {
      path: '/faqs',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "faqs" */ './components/FfHomePage/Faqs/Faqs.vue'),
      meta: {
        title: 'FAQ\'s - Fast Financials'
      }
    },
    {
      path: '/pricing',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "pricing" */ './components/FfHomePage/Pricing/Pricing.vue'),
      meta: {
        title: 'Pricing - Fast Financials'
      }
    },
    {
      path: '/cart',
      component: () => import(/* webpackChunkName: "cart" */ './components/MyAccount/Cart/Cart.vue'),
      name: 'createcart',
      meta: {
        title: 'Cart - Fast Financials'
      }
    },
    {
      path: '/cart/:id',
      component: () => import(/* webpackChunkName: "cart" */ './components/MyAccount/Cart/Cart.vue'),
      name: 'getcart',
      meta: {
        title: 'Cart - Fast Financials'
      }
    },
    {
      path: '/cart/:id/checkout',
      component: () => import(/* webpackChunkName: "checkout" */ './components/MyAccount/Checkout/Checkout.vue'),
      meta: {
        title: 'Checkout - Fast Financials'
      }
    },
    {
      path: '/ff/:number/:name',
      component: () => import(/* webpackChunkName: "validate-sdp" */ './components/SmartLink/ValidateSmartLink.vue')
    },
    {
      path: '/api/password/find/:token',
      meta: {
        title: 'Reset Password - Fast financials'
      },
      component: () => import(/* webpackChunkName: "verify-pw" */ './components/ForgotPassword/VerifyAccount/VerifyAccount.vue')
    },
    {
      path: '/sdp',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "sdp" */ './components/SecureDocumentPortal/SecureDocumentPortal.vue'),
      children: [
        { path: '',
          name: 'sdpwelcome',
          component: () => import(/* webpackChunkName: "sdpwelcome" */ './components/SecureDocumentPortal/WelcomeSDP/WelcomeSDP.vue'),
          meta: {
            title: 'Smart Link - Fast Financials'
          }
        },
        { path: 'accounting-packages-connect',
          name: 'apc',
          meta: {
            title: 'Accounting Packages - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "apc" */ './components/SecureDocumentPortal/AccountingPackages/AccountingPackages.vue')
        },
        { path: 'approve-reports',
          name: 'ar',
          meta: {
            title: 'Approve Reports - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "ar" */ './components/SecureDocumentPortal/ApproveReports/ApproveReports.vue')
        },
        {
          path: 'upload',
          name: 'ud',
          meta: {
            title: 'Upload Documents'
          },
          component: () => import(/* webpackChunkName: "ud" */ './components/SecureDocumentPortal/UploadDocuments/UploadDocuments.vue')
        },
        {
          path: 'contact-details',
          name: 'cd',
          meta: {
            title: 'Contact Details'
          },
          component: () => import(/* webpackChunkName: "cd" */ './components/SecureDocumentPortal/ContactDetails/ContactDetails.vue')
        }

      ]
    },
    {
      path: '/my-account',
      component: () => import(/* webpackChunkName: "myaccount" */ './components/MyAccount/MyAccount.vue'),
      children: [
        { path: '',
          name: 'dashboard',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "dashboard" */ './components/MyAccount/Dashboard/Dashboard.vue')
        },
        { path: 'dashboard',
          name: 'dashboard',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "dashboard" */ './components/MyAccount/Dashboard/Dashboard.vue')
        },
        { path: 'view-order/:id',
          name: 'view-order',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "order-received" */ './components/MyAccount/OrderReceived/OrderReceived.vue')
        },
        { path: 'orders',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "orders" */ './components/MyAccount/OrderDashboard/OrderDashboard.vue')

        },
        {
          path: 'view-subscription',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "view-subscription" */ './components/MyAccount/Subscriptions/Subscriptions.vue')
        },
        {
          path: 'view-subscription/:id/reactivate',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "reactivate-subscription" */ './components/MyAccount/Subscriptions/ReactivateSubscription/ReactivateSubscription.vue')
        },
        { path: 'edit-address',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "edit-address" */ './components/MyAccount/AddressDetails/AddressDetails.vue')
        },
        {
          path: 'edit-account',
          meta: {
            title: 'My Account - Fast Financials'
          },
          component: () => import(/* webpackChunkName: "edit-account" */ './components/MyAccount/AccountDetails/AccountDetails.vue')

        }
      ]
    },
    {
      path: '/accounting-integration-portal',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "sdp" */ './components/AccountingIntegrationPortal/AccountingIntegrationPortal.vue'),
      meta: {
        title: 'Accounting Integration Portal - Fast Financials'
      }
    },
    {
      path: '/test',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "sdp" */ './components/AccountingIntegrationPortal/Test.vue'),
      meta: {
        title: 'Test'
      }
    },
  ]
})

<template>
    <div class="container padding-container">
        <p>Order #<mark >{{order.id}}</mark> was placed on<mark >{{getDate(order.created_at)| moment(" MMMM D YYYY")}}</mark> and is currently <mark >{{order.status}}</mark>. </p>
    <h3>Order Details</h3>
        <plan-table :name="order.subscription.name" :plan="order.subscription.plan" :order="order" :type="'order'"></plan-table>
    <h3>Related Subscriptions</h3>
        <b-table  ref="subTable" stacked="md"  outlined :fields="subfields" :items="getSubscriptions">
            <template slot="subscription" slot-scope="data">
                {{data.item.id}}
            </template>
            <template slot="status" slot-scope="data">
                {{data.item.state}}
            </template>
            <template slot="date" slot-scope="data">
                {{getNextDate(data.item.created_at)| moment(" MMMM D YYYY")}}
            </template>
            <template slot="total" slot-scope="data">
                ${{getCurrency(order.amount)}}
            </template>
            <template slot="action" slot-scope="data">
                <router-link class="btn btn-violet" to="/my-account/view-subscription" exact>View</router-link>
            </template>
        </b-table>
    </div>

</template>

<script>
import { LoadingState } from '@/main'
import userServices from '@/services/user'
import PlanTable from '../PlanTable/PlanTable'
import moment from 'moment'
export default {
  components: { PlanTable },
  name: 'order-received',
  data () {
    return {
      id: null,
      order: {},
      subfields: {
        subscription: {
          label: 'Subscription'
        },
        status: {
          label: 'Status'
        },
        date: {
          label: 'Next Payment Date'
        },
        total: {
          label: 'Total'
        },
        action: {
          label: ''
        }
      }
    }
  },
  methods: {
    getSubscriptions () {
      let items = []
      items.push(this.order.subscription)
      return items
    },
    getCurrency (amount) {
      let dollar = (amount / 100).toFixed(2)
      return dollar
    },
    getDate (date) {
      let dateString = date + ' UTC'
      let dateWithTZ = new Date(dateString)
      return dateWithTZ
    },
    async getOrder () {
      LoadingState.$emit('toggle', true)
      await userServices.getOrder(this, this.id).then(async userResponse => {
        if (userResponse.body.success) {
          LoadingState.$emit('toggle', false)
          this.order = userResponse.body.data
        } else {
          LoadingState.$emit('toggle', false)
          // this.toast.showToast(userResponse.body.message, { theme: 'error', timeLife: 5000 })
        }
      })
    },
    getNextDate (lastorderdate) {
      let dateString = lastorderdate + ' UTC'
      let dateWithTZ = new Date(dateString)
      let currentDate = moment(dateWithTZ)
      let futureMonth = moment(currentDate).add(1, 'M')
      let futureMonthEnd = moment(futureMonth).endOf('month')
      if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
        futureMonth = futureMonth.add(1, 'd')
      }
      return futureMonth
    }
  },
  mounted () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
    this.getOrder()
  }
}
</script>

<style scoped>

</style>

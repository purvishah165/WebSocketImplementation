<template>
<div class="container">
    <b-table ref="subscript" outlined stacked :fields="fields" :items="getSubscriptions">
        <template slot="status" slot-scope="data">
            {{data.item.state}}
        </template>
        <template slot="start_date" slot-scope="data">
            {{getDate(data.item.created_at)| moment(" MMMM D YYYY")}}
        </template>
        <template slot="last_date" slot-scope="data">
            {{getLastOrderDate(data.item.related_orders)| moment(" MMMM D YYYY")}}
        </template>
        <template slot="next_date" slot-scope="data">
            {{getNextDate(data.item, getLastOrderDate(data.item.related_orders) )| moment(" MMMM D YYYY")}}
        </template>
        <template slot="action" slot-scope="data">
            <a v-if="data.item.state === 'Active'" class="btn btn-violet" @click="cancelSubscription(data.item.id)">Cancel</a>
            <a v-if="data.item.state === 'Unsubscribed'" class="btn btn-violet" @click="reactiveSubscription(data.item.id)">Reactivate</a>

        </template>
    </b-table>
    <h2>Subscription Totals</h2>
    <plan-table :name="subscription.name" :plan="subscription.plan" :orders="subscription.related_orders" :type="'subscription'"></plan-table>
    <h2>Related Orders</h2>
    <b-table  ref="orderTable" stacked="md" outlined :fields="orderfields" :show-empty=true :items="getorders">
        <template slot="order" slot-scope="data">
            {{data.item.id}}
        </template>
        <template slot="date" slot-scope="data">
            {{getDate(data.item.created_at)| moment(" MMMM D YYYY")}}
        </template>
        <template slot="status" slot-scope="data">
            {{data.item.status}}
        </template>
        <template slot="total" slot-scope="data">
            ${{getCurrency(data.item.amount)}}
        </template>
        <template slot="action" slot-scope="data">
            <a class="btn btn-violet" @click="viewOrder(data.item.id)">View Order</a>
        </template>
    </b-table>
</div>
</template>

<script>
import moment from 'moment'
import PlanTable from '../PlanTable/PlanTable'
import router from '@/router'
import userService from '@/services/user'
import { LoadingState, DataState } from '@/main'

export default {
  components: { PlanTable },
  name: 'subscriptions',
  props: ['subscription'],
  data () {
    return {
      fields: {
        status: {
          label: 'Status'
        },
        start_date: {
          label: 'Start Date'
        },
        last_date: {
          label: 'Last Order Date'
        },
        next_date: {
          label: 'Next Payment Date'
        },
        action: {
          label: 'Actions'
        }
      },
      items: [],
      orderfields: {
        order: {
          label: 'Order'
        },
        date: {
          label: 'Date'
        },
        status: {
          label: 'Status'
        },
        total: {
          label: 'Total'
        },
        action: {
          label: 'Actions'
        }
      },
      orders: this.subscription.related_orders
    }
  },
  watch: {
    subscription: {
      handler: function (val) {
        this.$refs.subscript.refresh()
        this.$refs.orderTable.refresh()
      },
      deep: true
    }
  },
  methods: {
    viewOrder (id) {
      router.push('/my-account/view-order/' + id)
    },
    getDate (date) {
      let dateString = date + ' UTC'
      let dateWithTZ = new Date(dateString)
      return dateWithTZ
    },
    getNextDate (subscription, lastorderdate) {
      let currentDate = moment(lastorderdate)
      let futureMonth = moment(currentDate).add(1, 'M')
      let futureMonthEnd = moment(futureMonth).endOf('month')
      if (currentDate.date() !== futureMonth.date() && futureMonth.isSame(futureMonthEnd.format('YYYY-MM-DD'))) {
        futureMonth = futureMonth.add(1, 'd')
      }
      return futureMonth
    },
    getLastOrderDate (orders) {
      // find latest created_at date of order from the related_orders array
      // let orders = [{ created_at: '2018-11-18 23:42:27' }, { created_at: '2018-11-16 23:42:27' }, { created_at: '2018-11-19 23:42:27' }]
      if (orders && orders.length > 1) {
        let orderArray = orders.map(function (order) {
          let dateString = order.created_at + ' UTC'
          let dateWithTZ = new Date(dateString)
          return dateWithTZ
        })
        let max = Math.max.apply(null, orderArray)
        console.log('max----', max)
        return new Date(max)
      } else {
        if (orders[0]) {
          return this.getDate(orders[0].created_at)
        }
      }
    },
    getSubscriptions () {
      this.items = []
      this.items.push(this.subscription)
      return this.items
    },
    getorders () {
      let items = []
      items = this.subscription.related_orders
      return items
    },
    getCurrency (amount) {
      let dollar = (amount / 100).toFixed(2)
      return dollar
    },
    async cancelSubscription (id) {
      LoadingState.$emit('toggle', true)
      const subResponse = await userService.cancelSubscription(this, id)
      if (subResponse.status === 200) {
        LoadingState.$emit('toggle', false)
        DataState.$emit('getUser', true)
        this.$refs.subscript.refresh()
      }
    },
    async reactiveSubscription (id) {
      router.push('/my-account/view-subscription/' + id + '/reactivate')
    }
  }
}
</script>

<style scoped>

</style>

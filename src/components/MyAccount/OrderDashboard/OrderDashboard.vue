<template>
    <div class="container">
        <b-table responsive stacked="md" ref="orderTable" :show-empty=true :busy.sync="isBusy"  outlined :fields="fields" :items="getOrders">
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
import router from '@/router'
export default {
  name: 'order-dashboard',
  props: ['basic_profile'],
  data () {
    return {
      fields: {
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
      items: [],
      isBusy: false
    }
  },
  watch: {
    basic_profile: {
      handler: function (val) {
        this.$refs.orderTable.refresh()
      },
      deep: true
    }
  },
  methods: {
    getCurrency (amount) {
      let dollar = (amount / 100).toFixed(2)
      return dollar
    },
    getOrders () {
      console.log('orders ---------', this.basic_profile.order)
      this.isBusy = true
      let items = []
      items = this.basic_profile.order
      this.isBusy = false
      return items
    },
    getDate (date) {
      let dateString = date + ' UTC'
      let dateWithTZ = new Date(dateString)
      return dateWithTZ
    },
    viewOrder (id) {
      router.push('/my-account/view-order/' + id)
    }
  },
  mounted () {
    this.items = this.basic_profile.order
  }
}
</script>

<style scoped>

</style>

<template>
    <table class="plan_table order_details">
        <thead>
        <tr>
            <th class="product-name">Product</th>
            <th class="product-total">Total</th>
        </tr>
        </thead>
        <tbody>
        <tr class="order_item">
            <td class="product-name">
                <b v-if="name">{{name}} ({{plan}})</b> <strong class="product-quantity">× 1</strong>
            </td>
            <td class="product-total">
                <span class="amount">
                    <span class="" v-if="type === 'order'">$ {{getCurrency(order)}}</span>
                     <span class="" v-if="type === 'subscription'">$ {{getAmount(orders)}}</span>
                </span>
                <span v-if="plan === 'monthly'"> / month</span>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <th scope="row">Subtotal:</th>
            <td><span class="amount">
                    <span class="" v-if="order">$ {{getCurrency(order)}}</span>
                 <span class="" v-if="type === 'subscription'">$ {{getAmount(orders)}}</span>
                </span>
            </td>
        </tr>
        <tr>
            <th scope="row">Payment method:</th>
            <td>Pin Payments</td>
        </tr>
        <tr>
            <th scope="row">Total:</th>
            <td>
                <span class="amount">
                    <span class="" v-if="order">$ {{getCurrency(order)}}</span>
                     <span class="" v-if="type === 'subscription'">$ {{getAmount(orders)}}</span>
                </span>
                <span v-if="plan === 'monthly'"> / month</span>
            </td>
        </tr>
        </tfoot>
    </table>
</template>

<script>
export default {
  name: 'plan-table',
  props: ['name', 'plan', 'order', 'orders', 'type'],
  methods: {
    getCurrency (order) {
      let amount = 0
      if (this.type === 'order') {
        amount = order.amount
      } else {
        amount = order
      }
      let dollar = (amount / 100).toFixed(2)
      return dollar
    },
    getAmount (orders) {
      let amount = 0
      for (let i = 0; i < orders.length; i++) {
        amount = amount + orders[i].amount
      }
      console.log('amount total----', amount)
      return this.getCurrency(amount)
    }
  }
}
</script>

<style scoped>

</style>

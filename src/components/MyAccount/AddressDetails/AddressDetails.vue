<template>
    <div class="container">
        <p>
            The following addresses will be used on the checkout page by default.</p>
        <edit-address :accountDetails="basic_profile" :billingAddress="address" :edit="true" v-if="isEdit"></edit-address>
<div v-else>

    <h3>Billing Address</h3>
    <div>
        {{basic_profile.first_name}} {{basic_profile.last_name}}
    </div>
    <div>
        {{address.company}}
    </div>
    <div>
        {{address.address_line1}}
    </div>
    <div>
        {{address.address_line2}}
    </div>
    <div>
        {{address.address_city}}
    </div>
    <div>
        {{address.address_state}}
    </div>
    <div>
        {{address.address_postcode}}
    </div>
    <div>
        {{address.phone}}
    </div>
    <a @click="editAddress" class="btn btn-violet mt-3">Edit</a>
</div>
    </div>

</template>

<script>
import EditAddress from '../EditAddress/EditAddress'
import { DataState } from '@/main'
export default {
  components: { EditAddress },
  name: 'address-details',
  props: ['address', 'basic_profile'],
  data () {
    return {
      isEdit: false
    }
  },
  methods: {
    editAddress () {
      this.isEdit = true
    }
  },
  mounted () {
    DataState.$on('editAddress', (payload) => {
      this.isEdit = false
    })
  }
}
</script>

<style scoped>

</style>

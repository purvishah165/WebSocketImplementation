<template>
    <b-modal centered size="lg" ref="help_modal">
        <div slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">

            <!--                <h2 class="modal-title text-center centered-header">Information</h2>-->
            <button type="button" class="close close-pricing-modal" @click="hideModal">&times;</button>
        </div>



        <div class="col-12 text-center mb-4">
            <h2>Need Some Help?</h2>
        </div>
        <ul class="text-left" v-if="list && list.length > 0 && list.length > 1" >
            <li v-for="l in list">{{l}}</li>
        </ul>

        <div class="text-center" v-if="list && list.length == 1" >
            <p v-for="l in list">{{l}}</p>
        </div>

        <div slot="modal-footer" class="modal-no-border">
            <div class="col-12 text-center">
                <a class="btn btn-violet btn-lg border-curved" @click="hideModal">Close</a>
                <p></p>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState } from '@/main.js'
export default {
  name: 'help-modal',
  data () {
    return {
      list: []
    }
  },
  methods: {
    hideModal () {
      this.$refs.help_modal.hide()
    }
  },
  mounted () {
    DialogueState.$on('helpmodal', (payload) => {
      this.list = payload.list
      if (this.$refs.help_modal) {
        this.$refs.help_modal.show()
      }
    })
  }
}
</script>

<style scoped>

</style>

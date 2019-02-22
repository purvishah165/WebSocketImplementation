<template>
    <b-modal centered ref="preview_modal" size="lg">
        <div slot="modal-header" class="d-flex w-100 justify-content-center modal-no-border">

            <!--                <h2 class="modal-title text-center centered-header">Information</h2>-->
            <button type="button" class="close" @click="hideModal">&times;</button>
        </div>

        <b-container class="text-center no-border report-preview-border">

            <img v-if="type === 'PL'" src="@/assets/ProfitLossYTD.png" class="img-responsive">
            <img v-if="type === 'PL2'" src="@/assets/ProfitLoss2Years.png" class="img-responsive">
            <img v-if="type === 'BS'" src="@/assets/BalanceSheetYTD.png" class="img-responsive">
            <img v-if="type === 'BS2'" src="@/assets/BalanceSheet2Years.png" class="img-responsive">
            <img v-if="type === 'AR'" src="@/assets/AgedReceivablesReport.png" class="img-responsive">
            <img v-if="type === 'AP'" src="@/assets/AgedPayablesReport.png" class="img-responsive">
            <img v-if="type === 'CF'" src="@/assets/Fast Financials - Cashflow Report.png" class="img-responsive">
            <img v-if="type === 'BBS'" src="@/assets/BusinessBankStatements.png" class="img-responsive">
            <img v-if="type === 'BCS'" src="@/assets/credit_score_example.png" class="img-responsive">
            <img v-if="type === 'RA'" src="@/assets/Fast Financials - Ratio Analysis Insight.png" class="img-responsive">
            <img v-if="type === 'BI'" src="@/assets/behavioral_example.png" class="img-responsive">
        </b-container>

        <div slot="modal-footer" class="no-border"></div>

    </b-modal>
</template>

<script>
import { DialogueState } from '@/main.js'
export default {
  name: 'preview-modal',
  data () {
    return {
      type: ''
    }
  },
  methods: {
    hideModal () {
      this.$refs.preview_modal.hide()
    }
  },
  mounted () {
    DialogueState.$on('preview', (payload) => {
      this.type = payload.type
      if (this.$refs.preview_modal) {
        this.$refs.preview_modal.show()
      }
    })
  }
}
</script>

<style scoped>
    .report-preview-border {
        padding: 0rem !important;
    }

</style>

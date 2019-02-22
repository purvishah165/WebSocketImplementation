<template>
    <div class="content-area col-sm-12 main-content-section">
        <div class="container example-report-conatiner">
            <div class="col-lg-12 text-center add-mobile-top">
                <h1 class="heading-title text-white mt-0">Example Reports</h1>
            </div>
            <div class="example-report-box">
                <div v-for="(report, index) in reports" v-bind:key="index">
                    <div class="d-flex flex-wrap p-1 mt-2">
                        <div class="col-md-7 col-12">
                            <p class=""><strong>{{report.title}}</strong></p></div>
                        <div class="col-md-3 col-6 text-right">
                            <a :href="report.path" download>
                                <span class="icon-list-icon">
							        <i class="fa fa-download" aria-hidden="true"></i>
						        </span>
                                <span class="icon-list-text">Download</span>
                            </a>
                        </div>
                        <div class="col-md-2 col-6 icon-cursor" @click="openPreviewModal(report.id)">
                            <span class="icon-list-icon">
							   <i class="fa fa-search" aria-hidden="true"></i>
						    </span>
                            <span class="icon-list-text">Preview</span></div>
                    </div>
                    <div class="d-flex row-border p-1">
                        <div class="d-flex col-12 pr-0">
                        <div class="icon-list-img col-1 p-0">
							    <img src="@/assets/info.png" />
						</div>
                         <div class="icon-list-desc col-11 pr-0">
                                <p class="text-wrap">{{report.desc}}</p>
                          </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
     </div>
</template>

<script>
import { PageState, DialogueState } from '@/main'
export default {
  name: 'example-reports',
  data () {
    return {
      reports: [
        {
          title: 'Profit and Loss – Last 2 Financial Years',
          desc: 'Profit and Loss report for the past 2 financial years',
          id: 'PL2',
          path: require('@/assets/Fast-Financials-5.5-Degrees-Profit-and-Loss-Last-2-Financial-Years.pdf')
        },
        {
          title: 'Balance Sheet – Last 2 Financial Years',
          desc: 'Balance Sheet for the past 2 financial years',
          id: 'BS2',
          path: require('@/assets/Fast-Financials-5.5-Degrees-Balance-Sheet-Last-2-Financial-Years.pdf')

        },
        {
          title: 'Profit and Loss – Year to Date',
          desc: 'Profit and Loss as of the day generated',
          id: 'PL',
          path: require('@/assets/Fast-Financials-5.5-Degrees-Profit-and-Loss-Year-to-Date.pdf')
        },
        {
          title: 'Balance Sheet – Year to Date',
          desc: 'Balance Sheet as of the day generated',
          id: 'BS',
          path: require('@/assets/Fast-Financials-5.5-Degrees-Balance-Sheet-Year-to-Date.pdf')
        },
        {
          title: 'Aged Payables Report',
          desc: 'Report that shows what the business is owed, ageing by Due Date',
          id: 'AP',
          path: require('@/assets/Fast-Financials-5.5-Degrees-Aged-Payables-Report.pdf')
        },
        {
          title: 'Aged Receivables Report',
          desc: 'Report that shows what the business owes, ageing by Due Date',
          id: 'AR',
          path: require('@/assets/Fast-Financials-5.5-Degrees-Aged-Receivables-Report.pdf')
        },
        {
          title: 'Cashflow Report',
          desc: 'Report showing the cashflow of the business',
          id: 'CF',
          path: require('@/assets/Fast Financials - Cashflow Report.pdf')
        },
        {
          title: 'Business Bank Statements – 12 months',
          desc: '12 months of bank statements that have been integrated within the accounting system',
          id: 'BBS',
          path: require('@/assets/Fast-Financials-Test-Data-1.0-Business-Bank-Statements-Bank-Account-Test.pdf')
        },
        {
          title: 'Business Credit Score',
          desc: 'Credit score based off the automated analysis completed on financial information',
          id: 'BCS',
          path: require('@/assets/Fast+Financials+Business+Credit+Score.pdf')
        },
        {
          title: 'Ratio Analysis Insight',
          desc: 'Automatically completes key financial Ratios and provide you with calculations',
          id: 'RA',
          path: require('@/assets/Fast Financials - Ratio Analysis Insight.pdf')
        },
        {
          title: 'Behavioral Insights',
          desc: 'Highlights opportunities, behaviors and other points of interest',
          id: 'BI',
          path: require('@/assets/Fast+Financials+Behavioral+Insights.pdf')
        }
      ]
    }
  },
  methods: {
    openPreviewModal (reportType) {
      console.log('clicked', reportType)
      DialogueState.$emit('preview', {
        type: reportType
      })
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

</style>

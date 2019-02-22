 <template>
    <div class="row centered-containers approve-reports-containers">
    <div class="w-100 mb-5">
        <slot v-if="reports_loading">
            <h3>Please wait for loading data...</h3>
            <p><i class="fa fa-3x fa-cog fa-spin"></i></p>
        </slot>

        <slot v-if="!reports_loading && reports && reports.length > 0">
            <div class="approve-head-bg"></div>
            <div id="carouselExampleControls" class="carousel slide col-sm-12 col-md-11 col-lg-10 m-auto" data-ride="carousel" data-interval="false" data-wrap="false">
                <div class="carousel-inner">
                    <div v-if="value.content" class="carousel-item" :class="{'active': checkActive(report_index, reports.length)}" v-for="(value, report_index) in reports" :key="report_index">
                        <div class="report-header">
                            <h2> {{value.company_name}}</h2>
                            <h2>
                                <slot v-if="value.report_slug==='pl_2_years'">Report {{report_index + 1}} of {{reports.length}}: Profit & Loss (Two Years)</slot>
                                <slot v-if="value.report_slug==='pl_year_to_date'">Report {{report_index + 1}} of {{reports.length}}: Profit & Loss (Year to Date)</slot>
                                <slot v-if="value.report_slug==='bs_2_years'">Report {{report_index + 1}} of {{reports.length}}: Balance Sheet (Two Years)</slot>
                                <slot v-if="value.report_slug==='bs_year_to_date'">Report {{report_index + 1}} of {{reports.length}}: Balance Sheet (Year to Date)</slot>
                                <slot v-if="value.report_slug==='aged_creditors'">Report {{report_index + 1}} of {{reports.length}}: Aged Payables</slot>
                                <slot v-if="value.report_slug==='aged_debtors'">Report {{report_index + 1}} of {{reports.length}}: Aged Receivables</slot>
                            </h2>
                        </div>
                        <slot v-if="value.report_slug==='bs_2_years' || value.report_slug==='bs_year_to_date' || value.report_slug==='pl_2_years' || value.report_slug==='pl_year_to_date'">
                            <div class="report-main">
                                <div class="report-table-head">
                                    <div class="row">
                                        <br>
                                        <div class="col-lg-6 col-sm-6 col-md-6 col-6 align-left">
                                        </div>
                                        <div :class="{ 'col-lg-3 col-sm-3 col-md-3 col-3 double-padding-top' : value.report_slug==='bs_2_years' || value.report_slug==='pl_2_years',
                                                'offset-6 col-6 offset-md-1 col-md-4 offset-sm-1 col-sm-4 double-padding-top single-button-row' : value.report_slug==='bs_year_to_date' || value.report_slug==='pl_year_to_date'}"
                                                v-for="(report_label, l_index) in value.content.COLUMNS_LABELS" :key="l_index">
                                            <div>
                                                {{report_label.TITLE}}
                                            </div>
                                            <div>
                                                <b-dropdown :id="'dropdownMenuLink_' + l_index" right :text="reportLabel(value.report_slug, report_label)" class="m-md-2" no-flip>
                                                    <b-dropdown-item @click="setStatus('Draft (Incomplete)', value.report_slug, l_index)">Draft (Incomplete)</b-dropdown-item>
                                                    <b-dropdown-item @click="setStatus('Management (Internal Use)', value.report_slug, l_index)">Management (Internal Use)</b-dropdown-item>
                                                    <b-dropdown-item @click="setStatus('Accountant Prepared (Prepared)', value.report_slug, l_index)">Accountant Prepared (Prepared)</b-dropdown-item>
                                                    <b-dropdown-item  @click="setStatus('Lodged with Tax Office (Complete)', value.report_slug, l_index)">Lodged with Tax Office (Complete)</b-dropdown-item>
                                                </b-dropdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="report-table-body" :id="'report_' + value.report_slug" :class="{bodyHeight:content_status[value.report_slug]}">
                                    <div v-for="(dataset, cat, index) in value.content.RAW_DATA" v-if="value.content.RAW_DATA" :key="index">
                                        <slot v-if="dataset && dataset.constructor === Object && Object.keys(dataset).length !== 0">
                                            <div class="row" v-if="catFormat(cat) != 'GROSS PROFIT' && catFormat(cat) != 'NET PROFIT' && catFormat(cat) != 'NET ASSETS'">
                                                <div class="col align-left cat-title">
                                                    {{capitalizing(catFormat(cat))}}
                                                </div>
                                            </div>
                                            <div v-for="(sub_dataset, subcat, sub_d_index) in dataset" :key="sub_d_index">
                                                <div v-if="catFormat(subcat) == catFormat(cat)">
                                                    <div v-if="data_key !== 'total'" v-for="(data, data_key, d_index) in sub_dataset" :key="d_index">
                                                        <div class="row indent">
                                                            <div class="col-6 align-left">
                                                                <div class="d-flex flex-nowrap">
                                                                    <div class="py-1">
                                                                        <span class="comment-icon" @click="comment(data_key, value.report_id, data, value.content, value.report_slug)">
                                                                            <img v-if="!data.comment" class="approve-img-add-comment" src="@/assets/add_comment.png">
                                                                            <img v-if="data.comment" class="approve-img-add-comment" src="@/assets/added_comment.png">
                                                                        </span>
                                                                    </div>
                                                                    <div class="p-1">{{data_key}}</div>
                                                                </div>
                                                            </div>
                                                            <div :class="{ 'col-3' : value.report_slug==='bs_2_years' || value.report_slug==='pl_2_years', 'col' : value.report_slug==='bs_year_to_date' || value.report_slug==='pl_year_to_date'}" v-for="(column, c_index) in data.columns" :key="c_index">
                                                                <span v-if="column.value === '-'"> - </span>
                                                                <span v-else>
                                                                    <span v-if="column.value < 0">(</span>{{tolocal(Math.abs(column.value))}}<span v-if="column.value < 0">)</span>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div v-if="sub_dataset.total" class="row indent">
                                                        <div class="col-6 align-left">
                                                            <span v-if="catFormat(Object.keys(dataset)[sub_d_index]) == 'GROSS PROFIT' || catFormat(Object.keys(dataset)[sub_d_index]) == 'NET PROFIT' || catFormat(Object.keys(dataset)[sub_d_index]) == 'NET ASSETS'" class="report-reverse-indent cat-title">
                                                               {{capitalizing(catFormat(Object.keys(dataset)[sub_d_index]))}}
                                                            </span>
                                                            <span v-else class="cat-title report-reverse-indent">
                                                                Total {{capitalizing(catFormat(Object.keys(dataset)[sub_d_index]))}}
                                                            </span>
                                                        </div>
                                                        <div :class="{ 'col-3' : value.report_slug==='bs_2_years' || value.report_slug==='pl_2_years', 'col' : value.report_slug==='bs_year_to_date' || value.report_slug==='pl_year_to_date'}" class="sub-cat-title" v-for="(total, t_index) in sub_dataset.total">
                                                            <span v-if="total.value < 0">(</span>{{tolocal(Math.abs(total.value))}}<span v-if="total.value < 0">)</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <slot v-if="subcat === 'total'">
                                                        <div class="row indent">
                                                            <div class="col-6 align-left cat-title report-reverse-indent">
                                                                Total {{capitalizing(catFormat(cat))}}
                                                            </div>
                                                            <div :class="{ 'col-3' : value.report_slug==='bs_2_years' || value.report_slug==='pl_2_years', 'col' : value.report_slug==='bs_year_to_date' || value.report_slug==='pl_year_to_date'}" class="cat-title" v-for="(s_total, st_index) in sub_dataset">
                                                                <span v-if="s_total.value < 0">(</span>{{tolocal(Math.abs(s_total.value))}}<span v-if="s_total.value < 0">)</span>
                                                            </div>
                                                        </div>
                                                    </slot>
                                                    <slot v-else>
                                                        <div class="row indent">
                                                            <div class="col-3 align-left sub-cat-title">
                                                                {{capitalizing(catFormat(subcat))}}
                                                            </div>
                                                        </div>
                                                        <div v-if="data_key !== 'total'" v-for="(data, data_key, d_index) in sub_dataset" :key="d_index">
                                                            <div class="row indent">
                                                                <div class="col-6 align-left">
                                                                    <div class="d-flex flex-nowrap">
                                                                        <div class="py-1">
                                                                            <span class="comment-icon" @click="comment(data_key, value.report_id, data, value.content, value.report_slug)">
                                                                                <img v-if="!data.comment" class="approve-img-add-comment" src="@/assets/add_comment.png">
                                                                                <img v-if="data.comment" class="approve-img-add-comment" src="@/assets/added_comment.png">
                                                                            </span>
                                                                        </div>
                                                                        <div class="p-1">{{data_key}}</div>
                                                                    </div>
                                                                </div>
                                                                <div :class="{ 'col-3' : value.report_slug==='bs_2_years' || value.report_slug==='pl_2_years', 'col' : value.report_slug==='bs_year_to_date' || value.report_slug==='pl_year_to_date'}" v-for="(column, c_index) in data.columns" :key="c_index">
                                                                    <span v-if="column.value === '-'"> - </span>
                                                                    <span v-else>
                                                                        <span v-if="column.value < 0">(</span>{{tolocal(Math.abs(column.value))}}<span v-if="column.value < 0">)</span>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div v-if="sub_dataset.total" class="row indent">
                                                            <div class="col-6 align-left sub-cat-title">
                                                                Total {{capitalizing(catFormat(Object.keys(dataset)[sub_d_index]))}}
                                                            </div>
                                                            <div :class="{ 'col-3' : value.report_slug==='bs_2_years' || value.report_slug==='pl_2_years', 'col' : value.report_slug==='bs_year_to_date' || value.report_slug==='pl_year_to_date'}" class="sub-cat-title" v-for="(total, t_index) in sub_dataset.total">
                                                                <span v-if="total.value < 0">(</span>{{tolocal(Math.abs(total.value))}}<span v-if="total.value < 0">)</span>
                                                            </div>
                                                        </div>
                                                    </slot>
                                                </div>
                                            </div>
                                        </slot>
                                    </div>
                                </div>
                                <div :class="{ contentToggle: content_status[value.report_slug] }" v-if="need_to_expand[value.report_slug]" >
                                    <a class="btn btn-violet-inverse input-curved m-3 expand-btn" @click="content_status[value.report_slug]=!content_status[value.report_slug]">
                                        <span v-show="content_status[value.report_slug]">
                                            Expand Report  <i class="fa fa-chevron-right"></i>
                                        </span>
                                        <span v-show="!content_status[value.report_slug]">
                                            Collapse Report  <i class="fa fa-chevron-up"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </slot>
                        <slot v-if="value.report_slug==='aged_debtors' || value.report_slug==='aged_creditors'">
                            <div class="report-main">

                                <div class="text-center">
                                    <div class="col-6 offset-3 col-md-4 offset-md-4">
                                        <div class="dropdown dropdown-cell double-padding-top padding-bottom w-50 m-auto">
                                            <b-dropdown :id="'dropdownMenuLink_' +  value.report_slug" :text="reportLabel(value.report_slug, value.content)" class="m-md-2 border-curved w-100" no-flip>
                                                <b-dropdown-item @click="setStatus('Up to Date', value.report_slug)">Up to Date</b-dropdown-item>
                                                <b-dropdown-item @click="setStatus('Not Up to Date', value.report_slug)">Not Up to Date</b-dropdown-item>
                                            </b-dropdown>
                                        </div>
                                    </div>
                                    <small class="d-block d-sm-none text-grey text-bold"><i class="fa fa-chevron-left"></i> SCROLL TO SEE ALL COLUMNS <i class="fa fa-chevron-right"></i></small>
                                </div>

                                <div class="scrollable-horizontal">

                                    <div class="table-report-table-body bodyHeightExtra" :id="'report_' + value.report_slug" :ref="'report_' + value.report_slug" :class="{bodyHeight:content_status[value.report_slug]} ">
                                        <div class="row">
                                            <div class="heading-col cell bold">
                                                <slot v-if="value.report_slug==='aged_creditors'">Payables</slot>
                                                <slot v-if="value.report_slug==='aged_debtors'">Receivables</slot>
                                            </div>
                                            <div class="value-col cell bold">Current</div>
                                            <div class="value-col  cell bold">{{ months.oneMonthAgo }}</div>
                                            <div class="value-col  cell bold">{{ months.twoMonthAgo }}</div>
                                            <div class="value-col  cell bold">{{ months.threeMonthAgo }}</div>
                                            <div class="value-col  cell bold">Older</div>
                                            <div class="value-col  cell bold">Total</div>
                                        </div>
                                        <div v-for="(rows, r_index) in reformated_reports(value.content, value.report_slug)" :key="r_index">
                                           <slot> <div class="row">
                                                <div class="heading-col cell text-left">
                                                    <span v-if="rows.name === 'Total Receivables' || rows.name === 'Total Payables'" class="font-weight-bold">{{rows.name}}</span>
                                                    <span v-else class='text-wrapped'>{{rows.name}}</span>
                                                </div>
                                                <div class="value-col  cell" :class="{ 'bold' : rows.name === 'Total Receivables' || rows.name === 'Total Payables'}"><span v-if="Number(rows.current) < 0">(</span>{{tolocal(Math.abs(rows.current))}}<span v-if="Number(rows.current) < 0">)</span></div>
                                                <div class="value-col  cell" :class="{ 'bold' : rows.name === 'Total Receivables' || rows.name === 'Total Payables'}"><span v-if="Number(rows.onemonthold) < 0">(</span>{{tolocal(Math.abs(rows.onemonthold))}}<span v-if="Number(rows.onemonthold) < 0">)</span></div>
                                                <div class="value-col  cell" :class="{ 'bold' : rows.name === 'Total Receivables' || rows.name === 'Total Payables'}"><span v-if="Number(rows.twomonthold) < 0">(</span>{{tolocal(Math.abs(rows.twomonthold))}}<span v-if="Number(rows.twomonthold) < 0">)</span></div>
                                                <div class="value-col  cell" :class="{ 'bold' : rows.name === 'Total Receivables' || rows.name === 'Total Payables'}"><span v-if="Number(rows.threemonthold) < 0">(</span>{{tolocal(Math.abs(rows.threemonthold))}}<span v-if="Number(rows.threemonthold) < 0">)</span></div>
                                                <div class="value-col  cell" :class="{ 'bold' : rows.name === 'Total Receivables' || rows.name === 'Total Payables'}"><span v-if="Number(rows.older) < 0">(</span>{{tolocal(Math.abs(rows.older))}}<span v-if="Number(rows.older) < 0">)</span></div>
                                                <div class="value-col  cell" :class="{ 'bold' : rows.name === 'Total Receivables' || rows.name === 'Total Payables'}">
                                                    <span v-if="(Number(rows.current) + Number(rows.onemonthold) + Number(rows.twomonthold) + Number(rows.threemonthold) + Number(rows.older)) < 0">(</span>{{tolocal(Math.abs(Number(rows.current) + Number(rows.onemonthold) + Number(rows.twomonthold) + Number(rows.threemonthold) + Number(rows.older)))}}<span v-if="(Number(rows.current) + Number(rows.onemonthold) + Number(rows.twomonthold) + Number(rows.threemonthold) + Number(rows.older)) < 0">)</span>
                                                </div>
                                            </div>
                                           </slot>
                                        </div>
                                    </div>
                                </div>
                                <div :class="{ contentToggle: content_status[value.report_slug] }" v-if="need_to_expand[value.report_slug]">
                                    <a class="btn btn-violet-inverse input-curved m-3 expand-btn" @click="content_status[value.report_slug]=!content_status[value.report_slug]">
                                        <span v-show="content_status[value.report_slug]">
                                            Expand Report  <i class="fa fa-chevron-right"></i>
                                        </span>
                                        <span v-show="!content_status[value.report_slug]">
                                            Collapse Report  <i class="fa fa-chevron-up"></i>
                                        </span>
                                    </a>
                                </div>
                            </div>
                        </slot>
                        <div class="row" v-if="need_to_expand[value.report_slug]" v-show="content_status[value.report_slug]">
                            <div class="col-lg-12 text-center">
                                <p class="text-black margin-bottom-0"><img class="img-responsive upload-success" src="@/assets/info_sl.png">
                                    Please expand to view the full report <span v-show="value.report_slug!=='aged_debtors' && value.report_slug!=='aged_creditors'">and comment</span>
                                </p>
                            </div>
                        </div>
                        <div class="sending-status">
                            <label>
                                <input class="align-self-center btn mr-1 checkbox2" type="checkbox" :id="'checkbox_' + value.report_slug" v-model="approving[value.report_slug]" :true-value="1" :false-value="0"  @change="approveReport(value.report_id, value.content, value.report_slug)">
                                <span class="btn btn-violet-inverse input-curved m-1 expand-btn" >Approved for sending</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="carousel slide col-sm-12 col-md-8 m-auto">
                <div class="col-sm-12 text-center double-padding-top">
                    <a v-if="current_report !== 0 && reports.length > 1" class="btn btn-lg btn-violet-inverse border-curved btn-space" data-slide="prev" @click="prev()"><i class="fa fa-chevron-left"></i> Back </a>
                    <router-link v-if="current_report === reports.length - 1" :to="forwardlink" class="btn btn-lg btn-violet border-curved btn-space" @click="next()">Next <i class="fa fa-chevron-right"></i></router-link>
                    <a  class="btn btn-lg btn-violet border-curved btn-space" data-slide="next" @click="next()" v-else>Next <i class="fa fa-chevron-right"></i></a>
                </div>
            </div>
        </slot>
        <slot v-if="!reports_loading && reports && reports.length === 0">
            <br><br>
            <i class="fa fa-cog fa-spin fa-2x"></i>
        </slot>

        <slot v-if="is_get_reports_error">
            <error-template></error-template>
        </slot>
    </div>
    </div>
</template>

<script>
	/* eslint-disable indent */

import { DialogueState, DataState } from '@/main'
import router from '@/router'
import securedocumentportal from '../../../services/securedocumentportal'
export default {
	components: { },
	name: 'approve-reports',
  data () {
    return {
      jwtError: false,
      init: false,
      current_report: 0,
      current_row: null,
      current_row_data: {
        comment: ''
      },
      current_content: null,
      current_slug: null,
      // approving: true,
      approving: {
        pl_2_years: 1,
        bs_2_years: 1,
        pl_year_to_date: 1,
        bs_year_to_date: 1,
        aged_debtors: 1,
        aged_creditors: 1
      },
      reports: null,
      is_loading: false,
      is_error: false,
      reports_loading: true,
      is_get_reports_error: false,
      content_status: {
        pl_2_years: false,
        bs_2_years: false,
        pl_year_to_date: false,
        bs_year_to_date: false,
        aged_debtors: false,
        aged_creditors: false
      },
      report_height: {
        pl_2_years: 0,
        bs_2_years: 0,
        pl_year_to_date: 0,
        bs_year_to_date: 0,
        aged_debtors: 0,
        aged_creditors: 0
      },
      need_to_expand: {
        pl_2_years: false,
        bs_2_years: false,
        pl_year_to_date: false,
        bs_year_to_date: false,
        aged_debtors: false,
        aged_creditors: false
      },
      bodyHeight: 150,
      months: {
        currentMonth: null,
        oneMonthAgo: null,
        twoMonthAgo: null,
        threeMonthAgo: null
      },
      is_back: false,
      back_from_uploading: false
      // test: {a: 12, b: 13, c: 14}
      // Aged Report
      // message: 'Hello Vue!',
    }
  },

  watch: {
    init (value) {
      if (value) {
        this.$nextTick(function () {
          this.contentToggle()
        })
      }
    }
  },

  computed: {
    backlink () {
      return '/sdp/accounting-packages-connect/'
    },
    forwardlink () {
      return '/sdp/upload/'
    }
  },
  methods: {
    goToContact () {
      router.push('/#contact-us')
    },
    expandReport (report) {
      console.log(report)
      report.expand = !report.expand
      // console.log(report.expand);
      this.$forceUpdate()
    },
    reportLabel (slug, label) {
      // console.log('reportLabel');
      // console.log('label', label)
      label.status = label.status ? label.status : this.getInitStatus(slug, label)
      return label.status
    },
    approveReport (id, report, slug) {
      // report.notapproved = !this.approving[slug]
      this.current_slug = slug
      this.current_content = report
      this.updateReportsByUniqueIdAndSlug(false, id, this.current_content, this.approving[slug])
      this.$forceUpdate()
    },
    comment (key, id, data, displayContent, slug) {
      this.current_row = key
      this.current_row_data = data
      this.current_content = displayContent
      this.current_id = id
      this.is_loading = false
      this.is_error = false
      let payload = {
        current_row: this.current_row,
        current_row_data: this.current_row_data,
        current_content: this.current_content,
        current_id: this.current_id,
        approved: this.approving[slug],
        is_loading: this.is_loading,
        is_error: this.is_error
      }
      // console.log('comment payload', payload)
      DialogueState.$emit('commentmodal', payload)
      // $('#comment-modal').appendTo("body").modal('toggle')
    },
    setStatus (status, slug, index) {
      this.reports.forEach((element) => {
        if (slug === 'aged_debtors') {
          if (element.report_slug === 'aged_debtors') {
            element.content.status = status
            this.updateReportsByUniqueIdAndSlug(false, element.report_id, element.content, element.is_approved)
          }
        } else if (slug === 'aged_creditors') {
          if (element.report_slug === 'aged_creditors') {
            element.content.status = status
            this.updateReportsByUniqueIdAndSlug(false, element.report_id, element.content, element.is_approved)
          }
        } else if (slug === 'pl_2_years' || slug === 'bs_2_years') {
          if (element.report_slug === 'pl_2_years' || element.report_slug === 'bs_2_years') {
            if (element.content.COLUMNS_LABELS.length > index) {
              element.content.COLUMNS_LABELS[index].status = status
              this.updateReportsByUniqueIdAndSlug(false, element.report_id, element.content, element.is_approved)
            }
          }
        } else if (slug === 'pl_year_to_date' || slug === 'bs_year_to_date') {
          if (element.report_slug === 'pl_year_to_date' || element.report_slug === 'bs_year_to_date') {
            if (element.content.COLUMNS_LABELS.length > index) {
              element.content.COLUMNS_LABELS[index].status = status
              this.updateReportsByUniqueIdAndSlug(false, element.report_id, element.content, element.is_approved)
            }
          }
        }
      })
      this.$forceUpdate()
    },

    getInitStatus (slug, label) {
      let initStatus = ''
      let dt = new Date()
      let thisYear = dt.getFullYear()
      // console.log(thisYear)
      if (slug === 'pl_2_years' || slug === 'bs_2_years') {
        if (label.TITLE.indexOf(thisYear) > -1) {
          initStatus = 'Accountant Prepared (Prepared)'
        } else {
          initStatus = 'Lodged with Tax Office (Complete)'
        }
      } else if (slug === 'pl_year_to_date' || slug === 'bs_year_to_date') {
        initStatus = 'Management (Internal Use)'
      } else if (slug === 'aged_debtors' || slug === 'aged_creditors') {
        initStatus = 'Up to Date'
      }
      return initStatus
    },
    initStatus (reports) {
      reports.forEach((element) => {
        if (element.report_slug === 'pl_2_years') {
          if (element.content.COLUMNS_LABELS[0]) {
            element.content.COLUMNS_LABELS[0].status = element.content.COLUMNS_LABELS[0].status ? element.content.COLUMNS_LABELS[0].status : this.getInitStatus('pl_2_years', element.content.COLUMNS_LABELS[0])
          }
          if (element.content.COLUMNS_LABELS[1]) {
            element.content.COLUMNS_LABELS[1].status = element.content.COLUMNS_LABELS[1].status ? element.content.COLUMNS_LABELS[1].status : this.getInitStatus('pl_2_years', element.content.COLUMNS_LABELS[1])
          }
        } else if (element.report_slug === 'bs_2_years') {
          if (element.content.COLUMNS_LABELS[0]) {
            element.content.COLUMNS_LABELS[0].status = element.content.COLUMNS_LABELS[0].status ? element.content.COLUMNS_LABELS[0].status : this.getInitStatus('bs_2_years', element.content.COLUMNS_LABELS[0])
          }
          if (element.content.COLUMNS_LABELS[1]) {
            element.content.COLUMNS_LABELS[1].status = element.content.COLUMNS_LABELS[1].status ? element.content.COLUMNS_LABELS[1].status : this.getInitStatus('bs_2_years', element.content.COLUMNS_LABELS[1])
          }
        } else if (element.report_slug === 'pl_year_to_date') {
          if (element.content.COLUMNS_LABELS[0]) {
            element.content.COLUMNS_LABELS[0].status = element.content.COLUMNS_LABELS[0].status ? element.content.COLUMNS_LABELS[0].status : this.getInitStatus('pl_year_to_date', element.content.COLUMNS_LABELS[0])
          }
        } else if (element.report_slug === 'bs_year_to_date') {
          if (element.content.COLUMNS_LABELS[0]) {
            element.content.COLUMNS_LABELS[0].status = element.content.COLUMNS_LABELS[0].status ? element.content.COLUMNS_LABELS[0].status : this.getInitStatus('bs_year_to_date', element.content.COLUMNS_LABELS[0])
          }
        } else if (element.report_slug === 'aged_debtors') {
          element.content.status = element.content.status ? element.content.status : this.getInitStatus('aged_debtors', element.content)
        } else if (element.report_slug === 'aged_creditors') {
          element.content.status = element.content.status ? element.content.status : this.getInitStatus('aged_creditors', element.content)
        }
        this.updateReportsByUniqueIdAndSlug(false, element.report_id, element.content, element.is_approved)
      })
      this.$forceUpdate()
      console.log(this.reports)
    },
    async getReport () {
      this.reports_loading = true
      this.is_get_reports_error = false
      const response = await securedocumentportal.getAllReports(this)

      if (response.status === 200) {
        if (!response.body.data.reports) {
          console.log('ok')
        }
        response.body.data.reports.forEach((element) => {
          element.content = JSON.parse(element.content)
          if (typeof element.is_approved !== 'undefined') {
            if (element.is_approved === 1) {
              this.approving[element.report_slug] = 1
            } else if (element.is_approved === 0) {
              this.approving[element.report_slug] = 0
            }
          } else {
            console.log('element------', element.report_slug)
            this.approving[element.report_slug] = 1
          }
        })
        this.reports = response.body.data.reports

        // Redirect to next step if there's no reports to accept
        if (this.reports.length === 0) {
          window.location.href = this.forwardlink
        }
        this.initStatus(response.body.data.reports)
        this.reports_loading = false
        this.init = true
        this.isBackFromUploading()
      } else {
        if (response.status === 400 || response.status === 401) {
          window.localStorage.removeItem('temp_token')
          DataState.$emit('jwtError', true)
        }
        if (response.status === 404) {
          DataState.$emit('linkExpired', true)
        }
      }
    },
    tolocal (n, fra) {
      if (!fra) {
        fra = 0
      }
      if (typeof n === 'string') {
        n = Number(n)
      } else {
        // n = n
      }
      if (n !== null && n !== undefined && n !== 0) {
        let str = n.toLocaleString('en-AU', {
          // style: 'currency',
          // currency: 'AUD',
          minimumFractionDigits: fra,
          maximumFractionDigits: fra
        })
        return str
      } else if (n === 0) {
        return '0'
      } else {
        return n
      }
    },
    catFormat (cat) {
      return cat.replace(/_/g, ' ')
    },

    lowerCase (string) {
      return string.toLowerCase()
    },

    capitalizing (string) {
      let lowercaseString = string.toLowerCase()
      // String.prototype.capitalize = function () {
      //   return this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase() })
      // }
      let capitalString = lowercaseString.split(' ').map(function (word) {
        return word.replace(word[0], word[0].toUpperCase())
      }).join(' ')
      let of = capitalString.replace(/Of/g, 'of')
      let and = of.replace(/And/g, 'of')
      return and.replace(/To/g, 'of')
    },
    async updateReportsByUniqueIdAndSlug (inModel, id, content, approved) {
      this.is_loading = true
      let params = {
        report_id: id,
        content: JSON.stringify(content),
        is_approved: approved
      }
      const updateResponse = await securedocumentportal.updateReportById(this, params)
      if (updateResponse.status === 200) {
        this.is_loading = false
      } else {
        this.is_loading = false
        this.is_error = true
      }
    },
    // Aged Report
    reformated_reports (report, slug) {
      // console.log('age report');
      // console.log(report);
      let names = []
      names = names.concat(report.Current ? report.Current : []).concat(report.Older ? report.Older : []).concat(report.OneMonthAgo ? report.OneMonthAgo : []).concat(report.TwoMonthAgo ? report.TwoMonthAgo : []).concat(report.ThreeMonthAgo ? report.ThreeMonthAgo : [])
      let uniqueOnes = names.map(function (el) {
        return (el && el.name) ? el.name : ''
      }).filter(function (value, index, self) {
        return self.indexOf(value) === index
      })
      let tableData = []
      uniqueOnes.forEach(function (element) {
        let rawData = {
          name: element,
          current: 0,
          onemonthold: 0,
          twomonthold: 0,
          threemonthold: 0,
          older: 0
        }
        if (report.Current) {
          report.Current.forEach(function (e) {
            if (e.name === element) {
              rawData.current = e.value
            }
          })
        }
        if (report.OneMonthAgo) {
          report.OneMonthAgo.forEach(function (e) {
            if (e.name === element) {
              rawData.onemonthold = e.value
            }
          })
        }
        if (report.TwoMonthAgo) {
          report.TwoMonthAgo.forEach(function (e) {
            if (e.name === element) {
              rawData.twomonthold = e.value
            }
          })
        }
        if (report.ThreeMonthAgo) {
          report.ThreeMonthAgo.forEach(function (e) {
            if (e.name === element) {
              rawData.threemonthold = e.value
            }
          })
        }
        if (report.Older) {
          report.Older.forEach(function (e) {
            if (e.name === element) {
              rawData.older = e.value
            }
          })
        }
        tableData.push(rawData)
      })
      // calculate total in each column
      let totalCurrent = 0
      let totalOneMonthOld = 0
      let totalTwoMonthOld = 0
      let totalThreeMonthOld = 0
      let totalOlder = 0
      tableData.forEach(function (e) {
        totalCurrent += Number(e.current)
        totalOneMonthOld += Number(e.onemonthold)
        totalTwoMonthOld += Number(e.twomonthold)
        totalThreeMonthOld += Number(e.threemonthold)
        totalOlder += Number(e.older)
      })
      let totalData = {}
      let type = ''
      if (slug === 'aged_debtors') {
        type = 'Receivables'
      } else if (slug === 'aged_creditors') {
        type = 'Payables'
      }
      totalData.name = 'Total ' + type
      totalData.current = totalCurrent
      totalData.onemonthold = totalOneMonthOld
      totalData.twomonthold = totalTwoMonthOld
      totalData.threemonthold = totalThreeMonthOld
      totalData.older = totalOlder
      tableData.push(totalData)
      // console.log(tableData)
      return tableData
    },

    contentToggle () {
      const reports = [
        'pl_2_years',
        'bs_2_years',
        'pl_year_to_date',
        'bs_year_to_date',
        'aged_debtors',
        'aged_creditors'
      ]

      reports.forEach((report) => {
        this.content_status[report] = false
        if (this.report_height[report] === 0) {
          let id = 'report_' + report
          let reportDOM = document.getElementById(id)
          if (reportDOM) {
            this.report_height[report] = reportDOM.clientHeight
          }
        }
        if (this.report_height[report] > this.bodyHeight) {
          this.content_status[report] = true
          this.need_to_expand[report] = true
        } else if (this.report_height[report] === 0) {
          this.content_status[report] = true
          this.need_to_expand[report] = true
        } else {
          this.content_status[report] = false
          this.need_to_expand[report] = false
        }
      })
    },

    prev () {
      this.$nextTick(function () {
        (this.current_report)--
        this.contentToggle()
      })
    },

    next () {
      this.$nextTick(function () {
        (this.current_report)++
        this.contentToggle()
      })
    },

    getDate () {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
      ]

      const d = new Date()

      this.months.currentMonth = monthNames[d.getMonth()]

      if (d.getMonth() - 1 >= 0) {
        this.months.oneMonthAgo = monthNames[d.getMonth() - 1]
      } else {
        this.months.oneMonthAgo = monthNames[12 - d.getMonth() - 1]
      }

      if (d.getMonth() - 2 >= 0) {
        this.months.twoMonthAgo = monthNames[d.getMonth() - 2]
      } else {
        this.months.twoMonthAgo = monthNames[12 - d.getMonth() - 2]
      }

      if (d.getMonth() - 3 >= 0) {
        this.months.threeMonthAgo = monthNames[d.getMonth() - 3]
      } else {
        this.months.threeMonthAgo = monthNames[12 - d.getMonth() - 3]
      }
    },

    checkActive (index, total) {
      if (this.current_report > 0) {
        // TODO  test as changed is_back to current_report
        return index === this.current_report
      } else {
        return index === 0
      }
    },
    initHelp () {
      let list = [
        'Every year (period) has a specific accounting status. You can change it according to the current status.',
        'You can comment on a row if needed.',
        'By checking "Approved for sending", you allow this document and comments to be sent to the requester. If not checked, the document and comments will not be saved or sent.'
      ]
      let payload = {
        list: list
      }
      console.log('help emited')
      DataState.$emit('helpList', payload)
    },

    isBackFromUploading () {
      if (this.$route.query.back) {
        this.current_report = (this.reports.length - 1)
      }
    }
  },

  created () {
    // if ($('#num_reports').val() > 0) {
    //   this.is_back = true
    //   this.current_report = $('#num_reports').val() - 1
    // }
  },
  mounted () {
    this.initHelp()
    this.getReport()
    this.getDate()
    // this.initStatus();
  }
}
</script>

<style scoped>
</style>

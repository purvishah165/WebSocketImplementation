import auth from '@/services/auth'
import { Datapass } from '@/main'

export default {
  async connectXero (context, authDetails) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/slai/xero_auth', {}, { headers: authDetails || auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async connectQb (context, authDetails) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/slai/qb_auth', {}, { headers: authDetails || auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async connectMyob (context, authDetails) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/slai/myob_auth', {}, { headers: authDetails || auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getMyobCompanyFiles (context, authDetails) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/slai/myob_companies', {}, { headers: authDetails || auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async updateMyobCompanyFiles (context, creds, authDetails) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/slai/myob_select_companies', creds, { headers: authDetails || auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async checkJobStatus (context, params) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/slai/job_check_status', {}, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getAllReports (context, params) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/get_reports_content', {}, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async getReportById (context, params) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/get_report_content', params, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },
  async updateReportById (context, params) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/update_report_content', params, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },

  submitReports (context, data) {
    console.log(data)
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/submit_reports', data, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },

  extractedReportsTable (context) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/extracted_reports_table', {}, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },

  uploadFile (context, data, filename) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/upload_file', data, {
      headers: auth.getTempAuthHeader(),
      progress (e) {
        if (e.lengthComputable) {
          Datapass.$emit('uploadPercentage', {
            filename: filename,
            percentage: (e.loaded / e.total * 100)
          })
        }
      }
    }).then((response) => {
      return response
    }, (response) => {
      return response
    })
  },

  uploadedFiles (context, data) {
    return context.$http.post(process.env.VUE_APP_API_URL + '/sdp/uploaded_files', data, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  },

  deleteFile (context, id) {
    return context.$http.delete(process.env.VUE_APP_API_URL + '/sdp/delete_uploaded_file' + id, { headers: auth.getTempAuthHeader() }).then((response) => {
      return response
    }).catch((err) => {
      return err
    })
  }
}

<template>
    <b-modal centered ref="comment_modal">
        <!-- Modal Header -->
        <div slot="modal-header" class="modal-header text-center w-100">
            Add Comment:
            {{current_row}}
            <button type="button" class="close" data-dismiss="modal" @click="hideModal">&times;</button>
        </div>
        <!-- Modal body -->
        <div>
            <div v-if="is_error" class="text-center">
                <h2 class="text-bold">This link is no longer valid.</h2>
                <h4>It might have been already used once or expired.<br>Please contact us for further assistance.</h4>
                <div class="error-actions">
                    <a href="/#contact" class="btn btn-violet border-curved">Contact Us</a>
                </div>
            </div>

            <div v-if="is_loading" class="text-center">
                <h3>Please wait...</h3>
                <p><i class="fa fa-3x fa-cog fa-spin"></i></p>
            </div>
            <slot v-if="!is_loading">
                <div class="align-right">
                    <b>Your comment:</b>
                </div>
                <textarea rows="5" maxlength="250" class="w-100 border-curved comment-wrapper" v-model="current_row_data.comment" placeholder="This is related to…"></textarea>
            </slot>
        </div>
        <!-- Modal footer -->
        <div slot="modal-footer" >
            <div v-if="!is_loading">
                <a class="btn btn-violet input-curved" @click="editComment">Save</a>
                <a class="btn btn-cancel" @click="removeComment">Remove</a>
            </div>
        </div>
    </b-modal>
</template>

<script>
import { DialogueState } from '@/main'
import securedocumentportal from '@/services/securedocumentportal'
export default {
  name: 'comment-modal',
  data () {
    return {
      current_row: null,
      current_row_data: {
        comment: ''
      },
      current_display_content: null,
      current_slug: null,
      current_id: null,
      approved: null,
      is_loading: false,
      is_error: false
    }
  },
  methods: {
    hideModal () {
      this.$refs.comment_modal.hide()
    },
    editComment () {
    // Todo
      console.log('editComment')
      // console.log(this.current_row_data.comment)
      // console.log(this.current_display_content)
      this.updateReportsByUniqueIdAndSlug(this.current_id, this.current_display_content)
    },
    removeComment () {
    // todo
      console.log('removeComment')
      this.current_row_data.comment = undefined
      // console.log(this.current_display_content)
      this.updateReportsByUniqueIdAndSlug(this.current_id, this.current_display_content)
    },
    async updateReportsByUniqueIdAndSlug (id, content) {
      this.is_loading = true
      let params = {
        report_id: id,
        content: JSON.stringify(content),
        is_approved: this.approved
      }
      const updateResponse = await securedocumentportal.updateReportById(this, params)
      if (updateResponse.status === 200) {
        this.is_loading = false
        this.hideModal()
      } else {
        this.is_error = true
        this.is_loading = false
        // this.hideModal()
      }
    }
  },
  mounted () {
    DialogueState.$on('commentmodal', (payload) => {
      this.current_row = payload.current_row
      this.current_row_data = payload.current_row_data
      this.current_display_content = payload.current_content
      this.current_id = payload.current_id
      this.approved = payload.approved
      this.is_loading = payload.is_loading
      this.is_error = payload.is_error
      if (this.$refs.comment_modal) {
        this.$refs.comment_modal.show()
      }
    })
  }
}
</script>

<style scoped>

</style>

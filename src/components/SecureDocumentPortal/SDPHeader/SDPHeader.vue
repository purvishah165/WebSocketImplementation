<template>
    <header id="masthead" class="site-header fixed-top navbar-light sdp-header" role="banner">
    <div class="container-fluid container-fluid-less">
        <nav class="navbar navbar-expand-xl p-0">
            <div class="navbar-brand">
                <a href="/">
                    <img class="img-responsive main-logo" src="@/assets/logo_beta.png" />
                </a>
            </div>
             <ul v-if="displayHelpButton" class="navbar-nav ml-auto">
                <li class="nav-item">
                    <a @click="openHelpModal" class="help-button">
                        <span class="fa-stack fa-2x">
                          <i class="fa fa-square-o fa-stack-2x text-white"></i>
                          <i class="fa fa-question fa-stack-1x text-white"></i>
                        </span>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
    </header>
</template>

<script>
import { DialogueState, DataState } from '@/main'

export default {
  name: 'sdp-header',
  props: ['list'],
  data () {
    return {
      displayHelpButton: true
    }
  },
  methods: {
    openHelpModal () {
      DialogueState.$emit('helpmodal', { list: this.list })
    }
  },
  mounted () {
    DataState.$on('displayHelpButton', (payload) => {
      console.log('payload: ' + payload.display)
      this.displayHelpButton = payload.display
    })
  }
}
</script>

<style scoped>

</style>

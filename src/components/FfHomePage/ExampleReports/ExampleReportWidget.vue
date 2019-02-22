<template>
    <div class="example-wrapper">
        <p>&nbsp;</p>
        <div class="d-flex">
            <div class="w-100 text-center">
                <h2 class="heading-title">Example Reports</h2>
            </div>
        </div>
        <div class="d-flex flex-wrap">
            <div class="col-md-4 col-12 p-0">
                <div class="widget-padding">
                    <div>
                        <h3 class="image-heading-title text-center">
                            Business Credit Score
                        </h3>
                    </div>

                    <p>&nbsp;</p>

                    <div class="ff-image">
                        <img width="300" height="226" src="@/assets/credit_score_miniature.png" class="img-box" />
                    </div>
                    <div class="ff-widget-container">
                        <div class="text-center">
                            <div class="ff-icon zoom" @click="openPreviewModal('BCS')">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-md-4 col-12 p-0">
                <div class="widget-padding">
                    <div>
                        <h3 class=" image-heading-title text-center">
                            Behavioral Insights
                        </h3>
                    </div>

                    <p>&nbsp;</p>

                    <div class="ff-image">
                        <img width="300" height="226" src="@/assets/behavioral_miniature.png" class="img-box" />
                    </div>
                    <div class="ff-widget-container">
                        <div class="text-center">
                            <div class="ff-icon zoom" @click="openPreviewModal('BI')">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4 col-12 p-0">
                <div class="widget-padding">
                    <div>
                        <h3 class=" image-heading-title text-center">
                            Profit and Loss
                        </h3>
                    </div>

                    <p>&nbsp;</p>

                    <div class="ff-image">
                        <img width="300" height="226" src="@/assets/PL300_266.png" class="img-box" />
                    </div>
                    <div class="ff-widget-container">
                        <div class="text-center">
                            <div class="ff-icon zoom" @click="openPreviewModal('PL2')">
                                <i class="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p>&nbsp;</p>
        <div class="d-flex justify-content-center ">
            <router-link class="btn btn-violet btn-home" to="example-reports" role="button">Check Out More Reports</router-link>
        </div>
    </div>
</template>

<script>
    import { DialogueState } from '@/main'

    export default {
      name: 'example-report-widget',
      methods: {
        openPreviewModal (reportType) {
          DialogueState.$emit('preview', {
            type: reportType
          })
        }
      }
    }
</script>

<style scoped>

</style>

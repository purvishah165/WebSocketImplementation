<template>
<div class="how-it-works-wrapper">
    <p>&nbsp;</p>
    <div class="d-flex">
        <div class="w-100 text-center">
            <h2 class="heading-title">How It Works?</h2>
        </div>
    </div>
    <div class="d-flex flex-wrap">
        <div class="col-md-4 col-12">
            <div class="widget-padding">
            <div class="ff-image">
                <img width="300" height="156" src="@/assets/send_link.png" class="attachment-medium size-medium" />
            </div>
            <div>
                <p class="text-center">
                    <b>Generate link and send to your customer</b>
                </p>
            </div>
            </div>
        </div>
        <div class="col-md-4 col-12">
            <div class="widget-padding">
            <div class="ff-image">
                <img width="300" height="156" src="@/assets/accounting_package.png" class="attachment-medium size-medium" />
            </div>
            <div>
                <p class="text-center">
                    <b>Customer connects to his accounting package or upload documents</b>
                </p>
            </div>
            </div>
        </div>
        <div class="col-md-4 col-12">
            <div class="widget-padding">
            <div class="ff-image">
                <img width="300" height="156" src="@/assets/documents_back.png" class="attachment-medium size-medium" />
            </div>
            <div>
                <p class="text-center">
                    <b>You get the documents back sent to your email</b>
                </p>
            </div>
            </div>
        </div>
    </div>

    <p></p>

    <div class="d-flex justify-content-center ">

        <router-link class="btn btn-violet btn-home" to="faqs" role="button">Learn more in our FAQ's page</router-link>
    </div>

    <p>&nbsp;</p>
    <p></p>
</div>
</template>
<script>
    export default {
      name: 'how-it-works'
    }
</script>

<style scoped>

</style>

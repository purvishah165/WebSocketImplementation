<template>
  <div class="load-wrapper"><div class="loader"></div></div>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
  $brand-primary-green: #9B42DA !default;
  .load-wrapper {
  /*background-image: url('/assets/logo_black.png');*/
  //background-color: rgba(0, 0, 0, 0.5);
    background-color: #ffffff;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 200px 200px;
    position: fixed;
    top: 0;
    left: 0;
    display: block;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: 99999;
  }

  .loader {
    font-size: 10px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -100px 0px 0px -100px;
    text-indent: -9999em;
    border-top: 5px solid lighten($brand-primary-green, 35%);
    border-right: 5px solid lighten($brand-primary-green, 35%);
    border-bottom: 5px solid lighten($brand-primary-green, 35%);
    border-left: 5px solid $brand-primary-green;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: loaderSpinner 1.1s infinite linear;
    animation: loaderSpinner 1.1s infinite linear;
  &,
  &:after {
     border-radius: 50%;
     width: 200px;
     height: 200px
   }
  }

  @-webkit-keyframes loaderSpinner {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  @keyframes loaderSpinner {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }

  /*.credabl-loader {*/
    /*background-image: url('~assets/images/credabl-logo-animation.gif');*/
    /*background-color: #ffffff;*/
    /*background-repeat: no-repeat;*/
    /*background-position: center;*/
    /*background-size: 200px 200px;*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*display: block;*/
    /*width: 100%;*/
    /*height: 100%;*/
    /*overflow: hidden;*/
    /*z-index: 99999;*/
  /*}*/
</style>

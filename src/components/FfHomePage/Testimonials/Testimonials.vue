<template>
    <div class="testimonial-wrapper container">
        <div class="d-flex">
            <div class="w-100 text-center">
                <h2 class="heading-title">Testimonials</h2>
                <p class="color-para-gray">What people say about us?</p>
            </div>
        </div>
    <div class="carousel-wrapper">
        <b-carousel id="carousel1"
                    controls
                    indicators
                    background="#d3d3d3"
                    :interval="5000"
                    v-model="slide"
                    @sliding-start="onSlideStart"
                    @sliding-end="onSlideEnd"
        >

            <!-- Text slides with image -->
            <b-carousel-slide class="img-responsive-carousel" img-blank img-alt="Blank image">
                <i class="fa fa-quote-left quotes"></i>
                <h2 class="testimonial-message"><i>“Easiest way to share my financials securely and fast”</i></h2>
                <div class="d-flex justify-content-center">
                    <div>
                        <img width="150" height="150" src="@/assets/CTR-Pacific-Jesse-Ahern-1-150x150.png"   class="tm-image full" alt="" draggable="false">
                    </div>
                    <div class="testimonial-text">

                        <h3 class="text-uppercase testimonial-name">Jesse Ahern, CTR PACIFIC</h3>

                        <div class="tm-author-credentials testimonial-position">Property Investor</div>

                    </div>
                </div>
            </b-carousel-slide>

            <!-- Slides with custom text -->
            <b-carousel-slide class="img-responsive-carousel" img-blank img-alt="Blank image">
                <i class="fa fa-quote-left quotes"></i>
                <h2 class="testimonial-message"><i>“Fast, easy and simple”</i></h2>
                <div class="d-flex justify-content-center">
                    <div>
                        <img width="150" height="150" src="@/assets/ecsk-Jacky-Sun-2-1-150x150.png" class="tm-image full" alt="" draggable="false">
                    </div>
                    <div class="testimonial-text">

                        <h3 class="text-uppercase testimonial-name">Jacky Sun, ECSK</h3>

                        <div class="tm-author-credentials testimonial-position">Accounting Firm</div>

                    </div>

                </div>
            </b-carousel-slide>

        </b-carousel>
    </div>
    </div>
</template>

<script>
export default {
  name: 'testimonials',
  data () {
    return {
      slide: 0,
      sliding: null
    }
  },
  methods: {
    onSlideStart (slide) {
      this.sliding = true
    },
    onSlideEnd (slide) {
      this.sliding = false
    }
  }
}
</script>

<style scoped>

    .testimonial-message{
        color: #54595f;
        font-weight: normal;
    }
    .carousel-item.active, .carousel-item-next, .carousel-item-prev {
        margin-bottom: 10px;
    }

    @media screen and (max-width: 320px) {
        .testimonial-text {
            padding: 5px;
        }
    }
    @media screen and (max-width:767px) {

        .testimonial-name{
            font-size: 80%;
            line-height: 100%;
        }

        .testimonial-position{
            font-size: 50%;
        }

        .testimonial-message{
            font-size: 80%;
        }
    }
</style>

import Vue from 'vue'

const masks = {
  currency: {
    mask (value) {
      let temp = ''
      if (value !== null && value !== undefined) {
        temp = value
      }
      return '$' + temp.toLocaleString()
    },
    unmask (value) {
      let temp = ''
      if (value !== null && value !== undefined) {
        temp = parseFloat(value.toString().replace(/[^\d.]/g, ''))
      }
      return isNaN(temp) ? 0 : temp
    }
  },
  currencyValue: {
    mask (value) {
      let temp = ''
      if (value !== null && value !== undefined) {
        temp = value
      }
      return temp.toLocaleString()
    },
    unmask (value) {
      let temp = ''
      if (value !== null && value !== undefined) {
        temp = parseFloat(value.toString().replace(/[^\d.]/g, ''))
      }
      return isNaN(temp) ? 0 : temp
    }
  },
  negCurrencyValue: {
    mask (value) {
      let temp = ''
      if (value !== null && value !== undefined) {
        temp = value
      }
      return temp.toLocaleString()
    },
    unmask (value) {
      let temp = ''
      if (value !== null && value !== undefined) { // temp = value.toString().replace(/[+\-]?\d*\.?\d+/g, '')
        temp = value.toString().replace(/[^\-?\d.]/g, '')
        temp = parseFloat(temp)
      }
      return isNaN(temp) ? 0 : temp
    }
  }
}

export default Vue.extend({
  props: {
    value: null,
    maskType: String,
    placeHolder: String,
    maxValue: null,
    minValue: null
  },
  template: `
      <input type="tel"
        v-model="displayValue"
        class="app-admin-input"
        style="max-width: 100%;"
        @blur="handleInputState; $emit('blurfire')"
        @focus="handleInputState; $emit('focusefire')"
        @keyup="$emit('keyupfire')"
        @keyup.enter="$emit('keyupfireEnter')" maxlength="18" size="18"
        :placeholder="placeHolder">
    `,

  data: function () {
    return {
      inputFocused: false
    }
  },
  methods: {
    handleInputState (event) {
      this.inputFocused = event.type === 'focus'
    },
    unmask (value) {
      return masks[this.maskType].unmask(value)
    },
    mask (value) {
      return masks[this.maskType].mask(value)
    }
  },
  computed: {
    displayValue: {
      get: function () {
        if (this.inputFocused && this.value) {
          console.log(this.maxValue)
          console.log(this.value)
          if (this.maxValue !== null && this.maxValue !== undefined) {
            if (this.value > Number(this.maxValue)) {
              // this.value = this.maxValue
              this.$emit('input', Number(this.maxValue))
            }
          }
          if (this.minValue !== null && this.minValue !== undefined) {
            if (this.value < Number(this.minValue)) {
              // this.value = this.minValue;
              this.$emit('input', Number(this.minValue))
            }
          }
          return this.value.toLocaleString()
        } else {
          if (this.value === null || this.value === 0) {
            return ''
          }
          return this.mask(this.value)
        }
      },
      set: function (modifiedValue) {
        console.log(this.maxValue)
        console.log(modifiedValue)
        if (this.maxValue !== null && this.maxValue !== undefined) {
          if (this.unmask(modifiedValue) > Number(this.maxValue)) {
            modifiedValue = Number(this.maxValue)
          }
        }
        if (this.minValue !== null && this.minValue !== undefined) {
          if (this.unmask(modifiedValue) < Number(this.minValue)) {
            modifiedValue = Number(this.minValue)
          }
        }
        this.$forceUpdate()
        // this.value = modifiedValue;
        this.$emit('input', this.unmask(modifiedValue))
      }
    }
  }
})

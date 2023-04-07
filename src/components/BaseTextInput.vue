<template>
  <div class="fieldWrapper" :class="{invalid, success}">
    <label>
      <span class="labelText" :style="{display: placesEnabled && gmapsLoaded ? 'none' : 'inline'}" :class="{focussedOrValid: focussed || value}">{{ label }}</span>
      <input
        ref="input"
        :type="type"
        :name="name"
        :required="required"
        :value="value"
        :autocomplete="auto"
        :placeholder="name === 'address_1' ? 'Street Address' : null"
        :pattern="numpad ? '[0-9]*' : null"
        @input="validate($event)"
        @change="validate($event)"
        @focus="setFocus"
        @keyup.enter="onEnterKey"
        @blur="setBlur($event)" />
      <span class="border"></span>
    </label>
    <p class="errorHint" v-html="invalid ? errorHint : '&nbsp;'"></p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

function arraysEqual (a: any[], b: any[]) {
  if (a === b) return true
  if (a == null || b == null) return false
  if (a.length !== b.length) return false

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false
  }
  return true
}

@Component
export default class TextInput extends Vue {
  @Prop({ type: Boolean, default: false }) placesEnabled: boolean // whether google places autocomplete is turned on for this field
  @Prop({ default: 'text' }) type!: string
  @Prop({ type: Boolean, default: false }) required: boolean
  @Prop({ type: Boolean, default: false }) numpad: boolean
  @Prop({ type: Function, default: () => {} }) onEnterKey: Function
  @Prop() name!: string
  @Prop() label!: string
  @Prop() value: string
  @Prop() autocomplete: string

  hint: string = 'init error hint'
  invalid: boolean = false
  focussed: boolean = false
  success: boolean = false
  googlePoll: number
  googleAutocomplete: any
  gmapsLoaded: boolean = false

  get auto () {
    if (!this.autocomplete) return null
    if (this.name === 'address_1' && !this.focussed) return 'address-line1'
    // if the prop is placesEnabled, we turn on google's places api
    // but if the field doesn't have focus, just turn it on (like if they enter their name first)
    if (this.name === 'address_1' && this.focussed) return 'disabled'
    return this.autocomplete
  }

  mounted () {
    // set up poll for google maps to add autocomplete
    if (this.placesEnabled) {
      this.googlePoll = setInterval(this.mapsCallback, 150)
    }
  }

  @Watch('value')
  handleValueChange (val: string) {
    if (val) {
      this.invalid = false
      this.success = true
    }
  }

  mapsCallback () {
    if (window.google && window.google.maps) {
      window.clearInterval(this.googlePoll)

      this.gmapsLoaded = true

      let streetNumber: string
      let route: string
      let city: string
      let state: string
      let zip: string
      let country: string

      // eslint-disable-next-line
      this.googleAutocomplete = new window.google.maps.places.Autocomplete( this.$refs.input, { types: ['geocode'] } )
      this.googleAutocomplete.addListener('place_changed', () => {
        const place = this.googleAutocomplete.getPlace()
        console.log('place', place)
        // I guess build an Address object?
        if (place && place.address_components) {
          place.address_components.forEach(({ short_name, types }: { short_name: string, types: string[] }) => {
            if (arraysEqual(types, ['street_number'])) {
              streetNumber = short_name
            } else if (arraysEqual(types, ['route'])) {
              route = short_name
            } else if (arraysEqual(types, ['locality', 'political']) || arraysEqual(types, ['sublocality_level_1', 'sublocality', 'political'])) {
              city = short_name
            } else if (arraysEqual(types, ['administrative_area_level_1', 'political'])) {
              state = short_name
            } else if (arraysEqual(types, ['postal_code'])) {
              zip = short_name
            } else if (arraysEqual(types, ['country', 'political'])) {
              country = short_name
            }
          })

          const address: GooglePlace = {
            streetNumber,
            route,
            city,
            state,
            zip,
            country,
          }

          this.$emit('googlePlaceChange', address)
        }
      })
    }
  }

  get errorHint () {
    return `Invalid ${this.label}`
  }

  validate ($event: any) {
    const val = $event.target.value
    this.invalid = ((this.required && val === '') || !$event.target.validity.valid)
    this.$emit('input', val)
    this.success = !this.invalid
  }

  setFocus () {
    this.focussed = true
  }

  setBlur ($event: any) {
    const val = $event.target.value
    this.invalid = this.required && val === ''
    this.focussed = false
    this.success = !this.invalid
    this.$emit('blur', this.name, $event.target.value)
  }
}
</script>

<style scoped>
.fieldWrapper {
  position: relative;
  margin-bottom: 0;
}

.errorHint {
  color: #a00;
  text-align: left;
  margin: 0;
  font-size: 13px;
}

label {
  position: relative;
  display: block;
  padding-top: 1rem;
  font-size: 1.25rem;
  color: inherit;
  outline: 0px;
}

.labelText {
  font-style: normal;
  font-weight: 400;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.0375rem;
  position: absolute;
  left: 0;
  font-size: 1.25rem;
  color: rgb(163, 163, 163);
  transform-origin: 0 0;
  pointer-events: none;
  padding: 0.15rem 0px;
  transition: transform 0.3s ease-out 0s;
  transform: translateY(0) scale(1);
}

.focussedOrValid {
  transform: translateY(-1.5rem) scale(.8);
}

input, input:invalid, input:required {
  border: none !important;
  outline: 0 !important;
  box-shadow: none !important;
  letter-spacing: 0.0375rem;
  padding: .25rem 0 !important;
  filter: none;
  display: block;
  width: 100%;
  font-size: 1.15rem !important;
  background: white;
  outline: currentColor none 0;
  font-family: Jost, 'Helvetica Neue', Helvetica, sans-serif;
}

.border {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  border-bottom: 1px solid rgb(30, 48, 10);
  pointer-events: none;
  transition: none 0s ease 0s;
}

.success .border,
.success .border::after,
.success .border::before {
  border-bottom-color: #3BA462;
}

.success::after {
  content: '✓';
  color: #3BA462;
  position: absolute;
  right: 4px;
  top: 10px;
  font-size: 24px;
}

.border::before, .border::after {
  content: '';
  position: absolute;
  bottom: -1px;
  width: 0;
  height: 2px;
  background-color: rgb(30, 48, 10);
  transition: width 0.15s ease-out 0s;
}

.invalid .border {
  border-bottom-color: #a00;
}

.invalid .border::before,
.invalid .border::after {
  background-color: #a00;
}

.border::before {
  left: 50%;
}

.border::after {
  right: 50%;
}

input:focus + .border::before, input:focus + .border::after {
  width: 50%;
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active,
select:-webkit-autofill  {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}

</style>

<template>
  <div class="fieldWrapper">
    <label>
      <span class="labelText" :class="focussed || value !== '' ? 'small' : 'large'">{{ label }}</span>
      <input
        :type="type"
        :name="name"
        :value="value"
        :required="required"
        @input="validate($event)"
        @focus="setFocus"
        @blur="setBlur($event)" />
      <span class="border" :class="{invalid}"></span>
    </label>
    <p v-if="invalid" class="errorHint">{{ errorHint }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class TextInput extends Vue {
  @Prop({ default: '' }) value!: string
  @Prop({ default: 'text' }) type!: string;
  @Prop({ type: Boolean, default: false }) required: boolean
  @Prop() name!: string;
  @Prop() label!: string;

  hint: string = 'init error hint'
  invalid: boolean = false
  focussed: boolean = false

  get errorHint () {
    return `Invalid ${this.label}`
  }

  validate ($event: any) {
    const val = $event.target.value
    this.invalid = (this.required && val === '')
    this.$emit('input', val)
  }

  setFocus () {
    this.focussed = true
  }

  setBlur ($event: any) {
    this.invalid = this.value === ''
    this.focussed = false
  }
}
</script>

<style scoped>
.fieldWrapper {
  position: relative;
  padding-right: .75rem;
  padding-left: .75rem;
  margin-bottom: 1.75rem;
}

.errorHint {
  color: red;
  text-align: left;
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
  left: 0px;
  z-index: 1;
  font-size: 1.25rem;
  color: rgb(163, 163, 163);
  transform-origin: 0px 0px;
  pointer-events: none;
  padding: 0.25rem 0px;
  transition: transform 0.3s ease-out 0s
}

.large {
  transform: translateY(0) scale(1);
}

.small {
  transform: translateY(-1.5rem) scale(.8);
}

input, input:invalid, input:required {
  border: none !important;
  outline: 0 !important;
  box-shadow: none;
  letter-spacing: 0.0375rem;
  padding: .25rem 0;
  display: block;
  width: 100%;
  font-size: 1.25rem;
  background: white;
  outline: currentColor none 0;
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

.border:before, .border:after {
  content: '';
  position: absolute;
  bottom: -1px;
  width: 0;
  height: 2px;
  background-color: rgb(30, 48, 10);
  transition: width 0.15s ease-out 0s;
}

.border.invalid {
  border-bottom-color: red;
}

.border.invalid:before,
.border.invalid:after {
  background-color: red;
}

.border:before {
  left: 50%;
}

.border:after {
  right: 50%;
}

input:focus + .border:before, input:focus + .border:after {
  width: 50%;
}

</style>

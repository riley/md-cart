<template>
  <div class="md__dropdown-field-wrapper">
    <label class="md__dropdown-label">
      <span class="md__dropdown-label-text" :class="focussed || selected !== '' ? 'md__dropdown-small' : 'md__dropdown-large'">{{ label }}</span>
      <vSelect
        v-on:search:focus="setFocus"
        v-on:search:blur="setBlur"
        @input="setSelected"
        :options="options" />
      <span class="md__dropdown-border"></span>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

@Component({
  components: { vSelect },
})
export default class Dropdown extends Vue {
  @Prop({ default: 'no label' }) label!: string
  @Prop() options!: DropdownOption[]

  focussed: boolean = false
  selected:string = ''

  constructor () {
    super()
    // this.selected = 'United States of America'
    console.log('options', this.options)
  }

  setFocus () {
    this.focussed = true
    console.log('focussed?')
  }

  setBlur () {
    this.focussed = false
    console.log('blurred?')
  }

  setSelected (value: any) {
    this.selected = value.label
    console.log('setSelected', this.selected, value.code, arguments)
    this.$emit('input', value.code)
  }
}

</script>

<style>
/* override vSelect styles */
.vs__dropdown-toggle {
  border: none;
}

.md__dropdown-field-wrapper {
  position: relative;
  padding-right: .75rem;
  padding-left: .75rem;
  margin-bottom: 1.75rem;
}

.md__dropdown-label {
  position: relative;
  display: block;
  padding-top: 1rem;
  font-size: 1.25rem;
  color: inherit;
  outline: 0px;
}

.md__dropdown-label-text {
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

.md__dropdown-large {
  transform: translateY(0) scale(1);
}

.md__dropdown-small {
  transform: translateY(-1.5rem) scale(.8);
}

.md__dropdown-border {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  border-bottom: 1px solid rgb(30, 48, 10);
  pointer-events: none;
  transition: none 0s ease 0s;
}

.md__dropdown-border:before, .md__dropdown-border:after {
  content: '';
  position: absolute;
  bottom: -1px;
  width: 0;
  height: 2px;
  background-color: rgb(30, 48, 10);
  transition: width 0.15s ease-out 0s;
}

.md__dropdown-border:before {
  left: 50%;
}

.md__dropdown-border:after {
  right: 50%;
}

input:focus + .md__dropdown-border:before, input:focus + .md__dropdown-border:after {
  width: 50%;
}
</style>

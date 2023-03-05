<template>
  <div class="md__dropdown-field-wrapper">
    <label class="md__dropdown-label">
      <span class="md__dropdown-label-text">{{ label }}</span>
      <select
        :value="value"
        class="md__select"
        :autocomplete="autocomplete"
        @input="setSelected"
        @focus="setFocus"
        @blur="setBlur">
        <option disabled value="">Select {{ name }}</option>
        <option v-for="(code, label) in options" :value="code" :key="code">{{ label }}</option>
      </select>
      <span class="md__dropdown-border"></span>
    </label>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  components: { },
})
export default class Dropdown extends Vue {
  @Prop() name!: string
  @Prop({ default: 'no label' }) label!: string
  @Prop() options!: DropdownOption[]
  @Prop() value: string
  @Prop() autocomplete: string

  focussed: boolean = false

  setFocus () {
    this.focussed = true
  }

  setBlur (e: any) {
    this.focussed = false
    this.$emit('blur', e.target.value, this.name)
  }

  setSelected (e: any) {
    this.$emit('input', e.target.value)
  }
}
</script>

<style>
/* basis for styles https://www.filamentgroup.com/lab/select-css.html */

.md__select {
  display: block;
  font-size: 1.15rem !important;
  line-height: 1.3;
  padding: .5rem;
  width: 100%;
  filter: none;
  max-width: 100%;
  box-sizing: border-box;
  box-shadow: none !important;
  margin: 0;
  border: none;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E');
  background-repeat: no-repeat, repeat;
  background-position: right .7em top 50%, 0 0;
  background-size: .65em auto, 100%;
}

.md__select::-ms-expand {
  display: none;
}

.md__select:hover {
  border-color: #888;
}
.md__select:focus {
  border-color: #aaa;
  box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
  box-shadow: 0 0 0 3px -moz-mac-focusring;
  color: #222;
  outline: none;
}
.md__select option {
  font-weight: normal;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, sans-serif;
}

.md__dropdown-field-wrapper {
  position: relative;
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
  font-size: 1.25rem;
  color: rgb(163, 163, 163);
  transform-origin: 0px 0px;
  pointer-events: none;
  padding: 0.25rem 0px;
  transition: transform 0.3s ease-out 0s;
  transform: translateY(-1.5rem) scale(.8);
}

.md__dropdown-border {
  position: absolute;
  right: 0;
  bottom: 1px;
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

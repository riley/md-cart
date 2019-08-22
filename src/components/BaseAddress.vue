<template>
  <div>
    <TextInput @input="handleInput" required type="text" name="name" label="Name" />
    <TextInput @input="handleInput" required type="text" name="address1" label="Street Address" />
    <TextInput @input="handleInput" type="text" name="address2" label="Apt / Building No." />
    <TextInput @input="handleInput" required type="text" name="city" label="City" />
    <Dropdown @input="handleInput" required label="State" :options="states" name="state" />
    <TextInput @input="handleInput" required label="Zip code" type="text" name="zip" />
    <Dropdown @input="handleInput" required label="Country" :options="countries" name="country" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import vSelect from 'vue-select'
import Dropdown from './BaseDropdown.vue'
import TextInput from './BaseTextInput.vue'
import states from '../utils/states'
import provinces from '../utils/provinces'
import countries from '../utils/countries'

@Component({
  components: { vSelect, TextInput, Dropdown },
})
export default class Address extends Vue {
  states = states
  provinces = provinces
  countries = countries.reduce((carry: any, [label, code]) => {
    carry[label] = code
    return carry
  }, {})

  handleInput ($event: FormInputEvent) {
    console.log('handleInput', $event)
    this.$emit('input', { name: $event.name, value: $event.value })
  }
}
</script>

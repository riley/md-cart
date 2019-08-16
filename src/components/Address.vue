<template>
  <div>
    <TextInput v-model="address.name" required type="text" name="shipping_name" label="Name" />
    <TextInput v-model="address.address1" required type="text" name="shipping_address_1" label="Street Address" />
    <TextInput v-model="address.address2" type="text" name="shipping_address_2" label="Apt / Building No." />
    <TextInput v-model="address.city" required type="text" name="shipping_city" label="City" />
    <Dropdown v-model="address.state" required label="State" :options="states" name="shipping_state" />
    <TextInput v-model="address.zip" required label="Zip code" type="text" name="shipping_zip" />
    <Dropdown v-model="address.country" required label="Country" :options="countries" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import vSelect from 'vue-select'
import Dropdown from './Dropdown.vue'
import TextInput from './TextInput.vue'
import states from '../utils/states'
import provinces from '../utils/provinces'
import countries from '../utils/countries'

@Component({
  components: { vSelect, TextInput, Dropdown }
})
export default class Address extends Vue {
  @Prop() address!: Address;

  states = states
  provinces = provinces
  countries = countries.reduce((carry: any, [label, code]) => {
    carry[label] = code
    return carry
  }, {})
}
</script>

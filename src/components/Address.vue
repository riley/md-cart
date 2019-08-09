<template>
  <div>
    <TextInput v-model="address.name" type="text" name="shipping_name" label="Name" />
    <TextInput v-model="address.address1" type="text" name="shipping_address_1" label="Street Address" />
    <TextInput v-model="address.address2" type="text" name="shipping_address_2" label="Apt / Suite # (optional)" />
    <TextInput v-model="address.city" type="text" name="shipping_city" label="City" />
    <Dropdown v-model="address.state" label="State" :options="states" name="shipping_state" />
    <TextInput v-model="address.zip" label="Zip code" type="text" name="shipping_zip" />
    <Dropdown v-model="address.country" label="Country" :options="countries" />
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

  states = Object.entries(states).map(([label, code]) => ({ label, code }))
  countries = countries.map(([label, code]) => ({ label, code }))
}
</script>

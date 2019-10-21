
<template>
  <!-- this class will render input fields for an Address or just display one statically -->
  <div>
    <div v-if="displayOnly">
      <address>
        {{ name }}<br>{{ address_1 }} {{ address_2 }}<br>{{ city }}, {{ state }} {{ zip }}<br>{{ country }}
      </address>
    </div>
    <div v-else>
      <TextInput :value="name" @input="handleName" required type="text" name="name" label="Name" />
      <TextInput
        autocomplete
        required
        :value="address_1"
        @input="handleAddress1"
        @googlePlaceChange="handleGooglePlaceChange"
        type="text"
        name="address_1"
        label="Street Address" />
      <TextInput :value="address_2" @input="handleAddress2" type="text" name="address_2" label="Apt / Building No." />
      <TextInput :value="city" @input="handleCity" required type="text" name="city" label="City" />

      <Dropdown v-if="country === 'US'" :value="state" @input="handleState" required label="State" :options="states" name="state" />
      <Dropdown v-if="country === 'CA'" :value="state" @input="handleState" required label="Province" :options="provinces" name="state" />
      <TextInput v-if="country !== 'US' && country !== 'CA'" :value="state" @input="handleState" required label="Province" name="state" />

      <TextInput :value="zip" @input="handleZip" required label="Zip code" :type="country === 'US' ? 'tel' : 'text'" name="zip" />
      <Dropdown :value="country" @input="handleCountry" required label="Country" :options="countries" name="country" />
    </div>
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
export default class BaseAddress extends Vue {
  @Prop({ type: Boolean, default: false }) displayOnly: boolean
  @Prop() name: string
  @Prop() address_1: string
  @Prop() address_2: string
  @Prop() city: string
  @Prop() state: string
  @Prop() zip: string
  @Prop() country: string

  states = states
  provinces = provinces
  countries = countries.reduce((carry: any, [label, code]) => {
    carry[label] = code
    return carry
  }, {})

  handleGooglePlaceChange (value: GooglePlace) {
    console.log('handle place chagne', value)

    const address: Address = {
      name: this.name,
      address_1: (value.streetNumber && value.route) ? `${value.streetNumber} ${value.route}` : '',
      address_2: '',
      city: value.city,
      state: value.state,
      zip: value.zip,
      country: value.country
    }
    this.$emit('replaceAddress', address)
  }

  handleName (value: string) {
    this.$emit('input', { name: 'name', value })
  }

  handleAddress1 (value: string) {
    this.$emit('input', { name: 'address_1', value })
  }

  handleAddress2 (value: string) {
    this.$emit('input', { name: 'address_2', value })
  }

  handleCity (value: string) {
    this.$emit('input', { name: 'city', value })
  }

  handleState (value: string) {
    this.$emit('input', { name: 'state', value })
  }

  handleZip (value: string) {
    this.$emit('input', { name: 'zip', value })
  }

  handleCountry (value: string) {
    this.$emit('input', { name: 'country', value })
  }
}

</script>

<style scoped>
address {
  padding-left: 1rem;
  line-height: 1.6em;
  border-left: 5px solid rgba(0, 0, 0, .2);
}
</style>

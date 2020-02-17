
<template>
  <!-- this class will render input fields for an Address or just display one statically -->
  <div>
    <div v-if="displayOnly">
      <address>
        {{ name }}<br>{{ address_1 }} {{ address_2 }}<br>{{ city }}, {{ state }} {{ zip }}<br>{{ country }}
      </address>
    </div>
    <div v-else>
      <TextInput :value="name" @input="handleName" @blur="handleBlur" required type="text" name="name" label="Name" />
      <TextInput
        autocomplete
        required
        :value="address_1"
        @input="handleAddress1"
        @blur="handleBlur"
        @googlePlaceChange="handleGooglePlaceChange"
        type="text"
        name="address_1"
        label="Street Address" />
      <TextInput :value="address_2" @input="handleAddress2" @blur="handleBlur" type="text" name="address_2" label="Apt / Building No." />
      <TextInput :value="city" @input="handleCity" @blur="handleBlur" type="text" name="city" label="City" />
      <div class="state-zip-holder">
        <Dropdown v-if="country === 'US'" :value="state" @input="handleState" @blur="handleBlur" required label="State" :options="states" name="state" />
        <Dropdown v-if="country === 'CA'" :value="state" @input="handleState" @blur="handleBlur" label="Province" :options="provinces" name="state" />
        <TextInput v-if="country !== 'US' && country !== 'CA'" :value="state" @input="handleState" @blur="handleBlur" required label="Province" name="state" />
        <TextInput :value="zip" @input="handleZip" @blur="handleBlur" label="Zip code" :type="country === 'US' ? 'tel' : 'text'" name="zip" />
      </div>
      <Dropdown :value="country" @input="handleCountry" @blur="handleBlur" required label="Country" :options="countries" name="country" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Dropdown from './BaseDropdown.vue'
import TextInput from './BaseTextInput.vue'
import states from '../utils/states'
import provinces from '../utils/provinces'
import countries from '../utils/countries'

@Component({
  components: { TextInput, Dropdown },
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

  handleBlur (name: string, value: string) {
    console.log('handle address blur', name, value)
    this.$emit('blur', name, value)
  }
}

</script>

<style scoped>
address {
  line-height: 1.6em;
}

.state-zip-holder {
  display: flex;
}

.state-zip-holder > div:first-child {
  margin-right: 1rem;
  flex-grow: 1;
}
</style>

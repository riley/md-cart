<template>
  <div id="shipping-info" class="card">
    <p>{{ instructions }}</p>
    <fieldset>
      <legend>Shipping Info</legend>
      <TextInput v-model="email" type="email" name="email" label="Email Address" />
      <Address :address="address" />
    </fieldset>
    <ul>
      <li v-for="(value, fieldName) in address" v-bind:key="fieldName">{{ fieldName }}: {{ value }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TextInput from './TextInput.vue'
import Address from './Address.vue'
import Dropdown2 from './Dropdown2.vue'

@Component({
  components: { TextInput, Dropdown2, Address }
})
export default class ShippingInfo extends Vue {
  @Prop() private instructions!: string;
  @Prop() address!: Address;

  email = ''
}
</script>

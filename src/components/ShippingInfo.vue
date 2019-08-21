<template>
  <section id="shipping-info">
    <Instructions text="Your Shipping Address" step="1"/>
    <fieldset>
      <legend>Shipping Info</legend>
      <TextInput required v-model="email" type="email" name="email" label="Email Address" />
      <Address :address="address" />
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'
import Address from './BaseAddress.vue'
import Instructions from './BaseInstructions.vue'

@Component({
  components: { TextInput, Address, Instructions }
})
export default class ShippingInfo extends Vue {
  @Prop() address!: Address;

  email = ''
}
</script>

<style scoped>
section {
  position: relative;
}
</style>

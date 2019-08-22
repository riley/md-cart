<template>
  <section id="shipping-info">
    <Instructions text="Your Shipping Address" step="1"/>
    <fieldset>
      <legend>Shipping Info</legend>
      <TextInput required @input="setEmail" type="email" name="email" label="Email Address" />
      <Address @input="updateAddress" />
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'
import Address from './BaseAddress.vue'
import Instructions from './BaseInstructions.vue'
import { mapMutations } from 'vuex'

@Component({
  components: { TextInput, Address, Instructions },
  methods: {
    ...mapMutations(['setEmail'])
  }
})
export default class ShippingInfo extends Vue {
  updateAddress ($event: FormInputEvent) {
    this.$store.commit('setAddress', {
      location: 'shipping',
      field: $event.name,
      value: $event.value,
    })
  }
}
</script>

<style scoped>
section {
  position: relative;
}
</style>

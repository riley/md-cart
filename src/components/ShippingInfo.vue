<template>
  <section id="shipping-info">
    <Instructions text="Your Shipping Address" step="1"/>
    <fieldset>
      <legend>Shipping Info</legend>
      <TextInput required @input="setEmail" @blur="checkUsername" type="email" name="email" label="Email Address" />
      <BaseBanner title="Welcome Back!" @main="expressCheckout" @secondary="closeBanner">
        <template v-slot:copy>
          Looks like you've ordered from us before! Use express checkout to use your previous info, or continue as normal and we'll link to your account.
        </template>
        <template v-slot:main>
          Express Checkout
        </template>
        <template v-slot:secondary>
          Continue
        </template>
      </BaseBanner>
      <BaseAddress @input="updateAddress" />
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'
import BaseAddress from './BaseAddress.vue'
import BaseBanner from './BaseBanner.vue'
import Instructions from './BaseInstructions.vue'
import { mapMutations, mapActions } from 'vuex'

@Component({
  components: { TextInput, BaseAddress, BaseBanner, Instructions },
  methods: {
    ...mapMutations(['setEmail']),
    ...mapActions(['checkUsername'])
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
  expressCheckout () {
    console.log('expressCheckout')
  }
  closeBanner () {
    console.log('closeBanner')
  }
}
</script>

<style scoped>
section {
  position: relative;
}
</style>

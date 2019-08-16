<template>
  <section>
    <Instructions text="Your Payment Method" step="3"/>
    Payment Info
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Instructions from './Instructions.vue'

@Component({
  components: { Instructions }
})
export default class PaymentInfo extends Vue {

}
</script>

<style scoped>
section {
  position: relative;
}
</style>

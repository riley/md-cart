<template>
  <div id="billing-info">
    <fieldset>
      <legend>Billing Info</legend>
      <Address :address="address" />
    </fieldset>
    <ul>
      <li v-for="(value, fieldName) in address" v-bind:key="fieldName">{{ fieldName }}: {{ value }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Address from './Address.vue'

@Component({
  components: { Address }
})
export default class BillingInfo extends Vue {
  @Prop() address!: Address;
}
</script>

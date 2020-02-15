<template>
  <div>
    <div class="vip-toggle">
      <div class="vip" :class="{active: isVip}" @click="emitChange">
        VIP Subscription
      </div>
      <div class="pay-as-you-go" :class="{active: !isVip}" @click="emitChange">
        One-time Purchase
      </div>
    </div>
    <ul v-if="isVip">
      <li>Subscribe and save with automatic shipments every 2 months.</li>
      <li>Skip any shipment, control frequency, or cancel online any time with a couple clicks.</li>
      <li>If more than 2 products ordered, only your first 2 items are subscribed.</li>
      <li> Free US shipping on all future one-time orders.</li>
    </ul>
    <ul v-else>
      <li>Free US Shipping on $49+ orders.</li>
      <li>100 day Free US Returns & Exchanges.</li>
      <li>100% Satisfaction Guaranteed.</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class BaseVipToggle extends Vue {
  @Prop() isVip: boolean

  emitChange () {
    this.$emit('toggleVip', !this.isVip)
  }
}
</script>

<style scoped>
.vip-toggle {
  display: flex;
  border: 2px solid #5C7975;
  margin-bottom: .5rem;
  border-radius: 5px;
  cursor: pointer;
}

.vip-toggle > div {
  width: 50%;
  padding: .5rem 1rem;
  position: relative;
}

.active {
  background: #5C7975;
  color: white;
}

.active::after {
  content: '✓';
  position: absolute;
  right: 1rem;
  top: .5rem;
}
</style>

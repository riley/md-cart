<template>
  <div class="item-row">
    <img class="thumb" :src="iconUrl(item.icon)" />
    <div class="item-detail">
      <span class="item-title">{{ item.title }}</span>
      <span class="item-quantity">
        Quantity {{ item.quantity }}
      </span>
    </div>
    <div class="item-cost">${{ isNaN(item.cost / 100) ? '0' : item.cost / 100 }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { env } from '@/utils/computed'

@Component
export default class ItemRow extends Vue {
  @Prop() item: any;

  iconUrl (icon: string) {
    return `https://${env === 'production' ? 'mrdavis.com' : 'staging.mrdavis.com'}/img/icons/${icon}`
  }
}
</script>

<style scoped>
.item-row {
  display: flex;
  margin-bottom: 1rem;
  padding: 1rem;
}

.item-detail {
  flex: 1 0;
}

.item-title, .item-cost {
  display: block;
  margin-bottom: 1rem;
  font-weight: bold;
}

.item-quantity {
  display: block;
  margin-bottom: 1rem;
}

.thumb {
  max-width: 8rem;
  max-height: 8rem;
  margin-right: .5rem;
}
</style>

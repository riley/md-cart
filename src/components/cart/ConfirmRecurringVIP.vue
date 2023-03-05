<template>
  <Card>
    <CardContent>
      <p>Since you’re already a VIP we are treating this as a <span class="one-time">one-time</span> purchase with VIP pricing. If you want to create a new subscription for this order check the box below.</p>
      <Checkbox @input="$emit('updateRecurring', $event)" label="Make recurring" :checked="makeRecurring" />
    </CardContent>
  </Card>
</template>

<script lang="ts">
import Card from '../BaseCard.vue'
import CardContent from '../BaseCardContent.vue'
import Checkbox from '../BaseCheckbox.vue'

export default {
  components: { Card, CardContent, Checkbox },
  props: { makeRecurring: Boolean }
}
</script>

<style scoped>
.one-time {
  font-weight: bold;
}
</style>

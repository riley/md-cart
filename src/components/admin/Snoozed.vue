<template>
  <div>
    <Alert v-if="snoozeError" variant="warning" closeButton>
      <p v-html="snoozeError" />
    </Alert>
    <Card v-if="nextDelivery">
      <CardContent>
        <Heading>Snooze Confirmation ✔</Heading>
        <p>You have successfully snoozed your VIP for {{ cycleDays }} days until {{ shortDate(nextDelivery) }}.</p>
        <p>Check out some of our other products if you're not familiar with them yet</p>
        <div class="other-categories">
          <CategoryCard v-for="info of otherCategories" :key="info.category" :info="info" />
        </div>
        <Button inline @click="$emit('dismiss')">Close</Button>
      </CardContent>
    </Card>
    <div v-if="fetchingSnooze">
      <Spinner />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Alert from '../BaseAlert.vue'
import Button from '../BaseButton.vue'
import Heading from '../BaseHeading.vue'
import Card from '../BaseCard.vue'
import CardContent from '../BaseCardContent.vue'
import CategoryCard from '../BaseCategoryCard.vue'
import Spinner from '../BaseSpinner.vue'
import { shortDate } from '../../utils/dates'

@Component({ components: { Alert, Button, Heading, CategoryCard, Card, CardContent, Spinner } })
export default class Snoozed extends Vue {
  @Prop() fetchingSnooze: boolean
  @Prop() snoozeError: string
  @Prop() nextDelivery: Date
  @Prop() cycleDays: number
  @Prop() items: Item[]

  shortDate = shortDate

  clothingTypes = {
    'undershirts': 'https://mrdavis.com/best-undershirt/',
    'underwear': 'https://mrdavis.com/best-underwear/',
    'performance-socks': 'https://mrdavis.com/best-dress-socks',
    'everyday-socks': 'https://mrdavis.com/best-everyday-socks/',
    'longjohns': 'https://mrdavis.com/best-long-john-underwear/',
    'no-show-socks': 'https://mrdavis.com/best-no-show-socks/',
    'lounge-shirt': 'https://mrdavis.com/comfortable-lounge-shirt/',
    'everyday-tee-crew': 'https://mrdavis.com/best-everyday-tee-shirt/',
    'tank-top': 'https://mrdavis.com/best-womens-tank-top/',
    'deep-v': 'https://mrdavis.com/best-womens-undershirt/',
    'camisole': 'https://mrdavis.com/best-womens-camisole/',
  }

  get otherCategories () {
    if (!this.items) return

    console.log(this.nextDelivery, 'nextDelivery')
    const vipCategories = this.items.map((item: Item) => item.clothingType)
    return Object.entries(this.clothingTypes)
      .filter((info: string[]) => !vipCategories.includes(info[0]))
      .map((info: string[]) => ({ type: info[0], link: info[1] }))
      .slice(0, 3)
  }
}
</script>

<style scoped>
.other-categories {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  clear: both;
}
</style>

<template>
  <div>
    <Alert v-if="snoozeError" variant="warning" closeButton>
      <p v-html="snoozeError" />
    </Alert>
    <Card v-if="snoozedVIP">
      <CardContent>
        <Heading>Snooze Confirmation ✔</Heading>
        <p>You have successfully snoozed your VIP for {{ snoozedVIP.cycleDays }} days until {{ shortDate(snoozedVIP.nextDelivery) }}.</p>
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
import { Vue, Component } from 'vue-property-decorator'
import { State, Mutation, Action } from 'vuex-class'
import Alert from '../components/BaseAlert.vue'
import Button from '../components/BaseButton.vue'
import Heading from '../components/BaseHeading.vue'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import CategoryCard from '../components/BaseCategoryCard.vue'
import Spinner from '../components/BaseSpinner.vue'
import { shortDate } from '../utils/dates'

@Component({ components: { Alert, Button, Heading, CategoryCard, Card, CardContent, Spinner } })
export default class Snoozed extends Vue {
  @State snoozeError: string
  @State fetchingSnooze: boolean
  @State snoozedVIP: VIP
  @Action snoozeByHash: (id: string) => Promise<void>

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

  async mounted () {
    if (typeof this.$route.query.s_id === 'string') {
      this.snoozeByHash(this.$route.query.s_id)
    } else {
      // show an error about a malformed url?
    }
  }

  get otherCategories () {
    if (!this.snoozedVIP) return

    console.log(this.snoozedVIP.nextDelivery, 'nextDelivery')
    const vipCategories = this.snoozedVIP.items.map((item: Item) => item.clothingType)
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

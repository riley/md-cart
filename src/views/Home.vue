<template>
  <Card v-if="loggedIn">
    <div class="row">
      <Heading>Welcome {{ name }}!</Heading>
      <p>{{ username }}</p>
    </div>
    <div v-if="credit > 0" class="store-credit row">
      <p><strong>Store Credit</strong></p>
      <p>${{ (credit / 100).toFixed(2) }}</p>
    </div>
    <div class="row">
      <p class="what-is-vip">The benefits of your VIP subscription</p>
      <ul class="vip-perks">
        <li>
          <Money class="icon" />
          <p>Best Pricing</p>
          <p>Active VIP members lock in our lowest prices.</p>
        </li>
        <li>
          <Calendar class="icon" />
          <p>Flexible</p>
          <p>Skip any shipment, control frequency, or cancel online any time with a couple clicks.</p>
        </li>
        <li>
          <Bento class="icon" />
          <p>Free Shipping</p>
          <p>VIP Subscribers receive free US shipping on any order, including one-time orders.</p>
        </li>
      </ul>
    </div>
  </Card>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import Bento from '../components/icons/bento.vue'
import Calendar from '../components/icons/calendar.vue'
import Money from '../components/icons/money.vue'

const user = namespace('user')

@Component({ components: { Heading, Card, CardContent, Money, Bento, Calendar } })
export default class Home extends Vue {
  @user.State(state => state.billing.address.name) name: string
  @user.State username: string
  @user.State credit: number

  @user.Getter loggedIn: boolean
}
</script>

<style scoped>
.row {
  border-bottom: 1rem solid #f0f0f0;
  padding: 1rem;
}

.row:last-child {
  border: none;
}

.icon {
  border: 1px solid gray;
  border-radius: 50px;
  padding: 10px;
  box-sizing: content-box;
}

.vip-perks {
  padding: 0;
  text-align: center;
  display: flex;
}

.vip-perks li p:first-of-type {
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: underline;
}

.vip-perks li {
  display: inline-block;
  width: 33.3%;
}

.store-credit {
  display: flex;
  justify-content: space-between;
}

.what-is-vip {
  text-align: center;
  font-weight: bold;
  font-size: 1.4em;
  text-transform: capitalize;
}
</style>

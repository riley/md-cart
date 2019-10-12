<template>
  <div>
    <div class="ship-status-info">
      <div class="order-status">
        <span class="confirmed">Confirmed</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg><br>
        <span class="created-date">{{ formattedDate }}</span>
      </div>
    </div>
    <div ref="map" class="map-container">
      <Spinner />
    </div>
  </div>
</template>

<script lang="ts">
/* this component renders a map of our location and the user's location if possible */
import { Vue, Prop, Component } from 'vue-property-decorator'
import Spinner from './BaseSpinner.vue'

const MAPS_API_KEY = 'AIzaSyDVxVeHOWujABozmN_3mI-s6Jjy8i68hPU'
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

@Component({
  components: { Spinner }
})
export default class ShipStatus extends Vue {
  @Prop() status: string
  @Prop() address: Address
  @Prop() createdAt: Date

  mounted () {
    if (typeof window.google !== 'undefined') return this.mapsCallback()
    window.mapsCallback = this.mapsCallback
    const script = document.createElement('script')
    script.async = true
    script.defer = true
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&callback=mapsCallback`
    script.onerror = this.mapsFailed
    document.head.appendChild(script)
  }

  get formattedDate () {
    return `${months[this.createdAt.getMonth()]} ${this.createdAt.getDate()}`
  }

  mapsCallback () {
    console.log('mapsCallback', this)
    const geocoder = new window.google.maps.Geocoder()
    const map = new window.google.maps.Map(this.$refs.map, {
      disableDefaultUI: true,
      zoomControl: true
    })

    const address = `${this.address.address_1} ${this.address.city}, ${this.address.state} ${this.address.zip}`

    geocoder.geocode({ address }, (results: {geometry: any, location: any}[], status: string) => {
      if (status !== 'OK' || !results[0]) {
        throw Error(status)
      }

      const [{ geometry }] = results

      map.setCenter(geometry.location)
      map.fitBounds(geometry.viewport)

      const locationCopy = `Current Shipping Location<br><span style="font-weight: bold;">${address}</span>`

      const infoWindow = new window.google.maps.InfoWindow({ content: locationCopy })
      const marker = new window.google.maps.Marker({
        position: geometry.location,
        map,
        title: 'Mr. Davis'
      })
      infoWindow.open(map, marker)
    })
  }

  mapsFailed () {
    console.error('failed to load map')
  }
}
</script>

<style scoped>
svg {
  fill: #1976d2;
  transform: scale(.8) translateY(7px);
  margin-left: 5px;
}

.order-status {
  display: inline-block;
}

.confirmed {
  color: #1976d2;
}

.created-date {
  font-size: .8em;
}

.map-container {
  height: 300px;
}

.ship-status-info {
  padding: 1.5rem;
}
</style>

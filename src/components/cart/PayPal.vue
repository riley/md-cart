<template>
  <section>
    <h3 class="express-checkout">Express Checkout</h3>
    <div ref="paypal" />
    <Overlay :active="processingPaypal">
      <p v-if="paypalCapturing" class="capturing">
        <span class="pleaseWait">Processing</span>
        <span class="creating">We're creating your Mr. Davis order!</span>
        <Spinner class="paypal-spinner" />
      </p>
    </Overlay>
  </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Mutation, Action, namespace } from 'vuex-class'
import Overlay from '../Overlay.vue'
import Spinner from '../BaseSpinner.vue'

const cart = namespace('cart')
const intlShippingErrorMessage = 'Due to pandemic we are seeing significant international delays. We are limiting international shipping for the time being. We apologize for any inconvenience.'

@Component({ components: { Overlay, Spinner } })
export default class PayPal extends Vue {
  @cart.State processingPaypal: boolean
  @cart.State paypalCapturing: boolean
  @cart.State paypalOrderInit: PayPalOrderInit
  @cart.State shippingInvalidCountries: string[]
  @cart.Mutation setPaypalAvailable: (status: boolean) => void
  @cart.Mutation setProcessingPaypal: (status: boolean) => void
  @cart.Mutation setPaypalCapturing: (status: boolean) => void
  @cart.Mutation setGlobalError: (message: string) => void
  @cart.Action createPaypalOrder: () => Promise<void>
  @cart.Action updatePaypalShipping: (shipping: PayPalShippingAddress) => Promise<void>
  @cart.Action completePaypalOrder: (info: any) => Promise<void>

  paypalPoll: number

  async mounted () {
    this.paypalPoll = setInterval(this.paypalCallback, 150)
  }

  paypalCallback () {
    if (window.paypal && window.paypal.Buttons) {
      this.setPaypalAvailable(true)
      window.clearInterval(this.paypalPoll)

      window.paypal.Buttons({
        locale: 'en-US',
        style: {
          size: 'responsive',
          color: 'silver',
          shape: 'rect',
          label: 'checkout',
          tagline: false
        },
        createOrder: async (data: any, actions: PayPalActions) => {
          window.woopra && window.woopra.track('paypal-init-checkout')

          try {
            await this.createPaypalOrder()

            // have some sort of overlay

            if (this.paypalOrderInit.processed === true) {
              location.href = '/thankyou'
              return null
            }

            return this.paypalOrderInit.id
          } catch (error) {
            window.woopra && window.woopra.track('cart-js-errors', { message: `network error code when trying to create paypal order` })
            this.setGlobalError(error.message)
          }
        },
        onShippingChange: async (data: any, { resolve, reject }: PayPalActions) => {
          const shippingAcceptable = !this.shippingInvalidCountries.includes(data.shipping_address.country_code)

          if (!shippingAcceptable) {
            this.setGlobalError(intlShippingErrorMessage)
          } else {
            await this.updatePaypalShipping(data.shipping_address)
          }

          return shippingAcceptable ? resolve() : reject()
        },
        onCancel: () => {
          // hide the overlay
          this.setProcessingPaypal(false)
          this.setPaypalCapturing(false)
        },
        onError: (error: Error) => {
          // track the error
          this.setGlobalError(`Oh no! Something went wrong while processing your paypment: ${error?.message}`)
          this.setProcessingPaypal(false)
          this.setPaypalCapturing(false)
        },
        onApprove: async (data: any, actions: any) => {
          const details = await actions.order.capture()

          await this.completePaypalOrder({ data, details })
          this.setPaypalCapturing(true)
        }
      }).render(this.$refs.paypal)
    }
  }
}
</script>

<style scoped>
section {
  position: relative;
  margin-bottom: 1rem;
  background: white;
  padding: 1.5rem;
}

.express-checkout {
  font: normal normal normal 1.25rem 'Helvetica Neue', Helvetica, Arial, Helvetica, sans-serif !important;
  text-transform: uppercase;
  color: #303030;
  -moz-box-align: center;
  align-items: center;
  width: 100%;
  margin: 0px 0px 1.5rem !important;
  pointer-events: none;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: .5rem;
}

.capturing {
  color: white;
}

.pleaseWait {
  font-size: 3em;
}

.creating {
  margin-bottom: 1.5rem;
  display: block;
}

.paypal-spinner {
  width: 30px;
}
</style>

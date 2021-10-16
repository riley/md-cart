let apiHost: string
let environment
if (window.location.host === 'mrdavis.com') {
  apiHost = process.env.VUE_APP_PROD_HOST
  environment = 'production'
} else if (window.location.host === 'staging.mrdavis.com') {
  apiHost = process.env.VUE_APP_STG_HOST
  environment = 'staging'
} else {
  apiHost = process.env.VUE_APP_DEV_HOST
  environment = 'development'
}

export const host = apiHost

let stripePublishable: string
if (window.location.host === 'mrdavis.com') {
  stripePublishable = process.env.VUE_APP_STRIPE_PROD_PUBLISHABLE
} else {
  stripePublishable = process.env.VUE_APP_STRIPE_DEV_PUBLISHABLE
}

export const stripePublishableKey = stripePublishable

export const env = environment

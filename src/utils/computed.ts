let apiHost: string
if (window.location.host === 'mrdavis.com') {
  apiHost = process.env.VUE_APP_PROD_HOST
} else if (window.location.host === 'staging.mrdavis.com') {
  apiHost = process.env.VUE_APP_STG_HOST
} else {
  apiHost = process.env.VUE_APP_DEV_HOST
}

export const host = apiHost

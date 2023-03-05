const meta: ProductMeta = {
  'everyday-tee': { // the old everyday tee v
    prompt: 'tee',
    cta: 'Select closeout v tee',
    props: {
      color: ['white', 'grey', 'navy', 'black'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl', 'xxl']
    },
    addMore: ['everyday-tee', 'undershirts', 'lounge-shirt', 'performance-socks']
  },
  undershirts: {
    prompt: 'shirt',
    cta: 'Select undershirt',
    props: {
      color: ['tone', 'white', 'grey', 'black'],
      style: ['v neck', 'crew'],
      cut: ['tailored', 'traditional'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl', 'xxl', 'xxxl']
    },
    addMore: ['undershirts', 'underwear', 'everyday-tee-crew', 'lounge-shirt', 'performance-socks'],
    url: 'https://mrdavis.com/best-undershirt/'
  },
  'lounge-shirt': {
    prompt: 'shirt',
    cta: 'Select L/S Undershirt',
    props: {
      cut: ['v neck', 'crew'],
      color: ['white', 'grey', 'black'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl', 'xxl']
    },
    addMore: ['lounge-shirt', 'undershirts', 'underwear', 'performance-socks', 'longjohns'],
    url: 'https://mrdavis.com/comfortable-lounge-shirt/'
  },
  underwear: {
    prompt: 'pair',
    cta: 'Select bamboo undies',
    props: {
      cut: ['standard', 'trunks'],
      color: ['tone', 'grey', 'navy', 'black'],
      size: [{ label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl', 'xxl'],
    },
    addMore: ['underwear', 'undershirts', 'longjohns', 'performance-socks', 'lounge-shirt'],
    url: 'https://mrdavis.com/best-underwear/'
  },
  longjohns: {
    prompt: 'pair',
    cta: 'Select long johns',
    props: {
      size: [{ label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl', 'xxl'],
    },
    addMore: ['longjohns', 'lounge-shirt', 'undershirts', 'performance-socks', 'everyday-socks'],
    url: 'https://mrdavis.com/best-long-john-underwear/'
  },
  camisole: {
    prompt: 'camisole',
    cta: 'Select closeout cami',
    props: {
      color: ['tone', 'white', 'black'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl']
    },
    addMore: ['camisole', 'tank-top', 'deep-v'],
    url: 'https://mrdavis.com/best-womens-camisole/'
  },
  'everyday-tee-crew': {
    prompt: 'shirt',
    cta: 'Select everyday crew',
    props: {
      color: ['charcoal', 'navy', 'crimson'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl', 'xxl']
    },
    addMore: ['everyday-tee-crew', 'undershirts', 'underwear', 'everyday-tee', 'everyday-socks'],
    url: 'https://mrdavis.com/best-everyday-tee-shirt/'
  },
  'deep-v': {
    prompt: 'deep-v',
    cta: 'Select women\'s deep v',
    props: {
      color: ['tone', 'white', 'black'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl']
    },
    addMore: ['deep-v', 'tank-top', 'camisole'],
    url: 'https://mrdavis.com/best-womens-undershirt/'
  },
  'tank-top': {
    prompt: 'tank top',
    cta: 'Select closeout tank',
    props: {
      color: ['tone', 'white', 'black'],
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl']
    },
    addMore: ['tank-top', 'deep-v', 'camisole'],
    url: 'https://mrdavis.com/best-womens-tank-top/'
  },
  'performance-socks': {
    prompt: 'sock pattern',
    cta: 'Select dress socks',
    props: {
      sku: [
        'Dress-Dots-Gry-Lime-OS',
        'Dress-Stripes-Nvy-Gren-OS',
        'Dress-Stripes-Nvy-NtGrey-OS',
        'Dress-Stripes2-Nvy-Port-OS',
        'Dress-Stripes2-Gry-Marina-OS',
        'Dress-Stripes2-Blk-NvyPeony-OS',
        'Dress-Solid-Blk-Gold-OS',
        'Dress-Solid-Nvy-Gold-OS',
        'Dress-Solid-DrkGrey-Gold-OS',
        'Dress-Solid-Oat-Port-OS',
        'Dress-Argyle-Nvy-Grey-OS',
        'Dress-Argyle-Burg-Grey-OS',
        'Dress-Future-Argyle-BlueGry-OS',
        'Dress-1Stripe-DrkGren-OS',
        'Dress-4Stripe-GryGreen-OS',
        'Dress-SportStripe-Navy-OS',
      ]
    },
    addMore: ['performance-socks', 'everyday-socks', 'underwear', 'undershirts', 'no-show-socks'],
    url: 'https://mrdavis.com/best-dress-socks'
  },
  'everyday-socks': {
    prompt: 'sock pattern',
    cta: 'Select everyday socks',
    props: {
      sku: [
        'ED-Socks-Solid-LtGrey-Port-OS',
        'ED-Socks-Solid-White-Gry-OS',
        'ED-Socks-Solid-DrkGrey-Navy-OS',
        'ED-Socks-Solid-Navy-Gold-OS',
        'ED-Socks-Solid-Black-Gold-OS',
        'ED-Socks-Pixel-Navy-OS',
        'ED-Socks-Pixel-LtGrey-OS',
        'ED-Socks-Pixel-Black-OS',
        'ED-Socks-Solid-Oat-Green-OS',
      ]
    },
    addMore: ['everyday-socks', 'performance-socks', 'undershirts', 'underwear', 'everyday-tee-crew'],
    url: 'https://mrdavis.com/best-everyday-socks/'
  },
  'dress-socks': {
    prompt: 'pair',
    cta: 'Select dress socks',
    props: {
      color: ['light-grey', 'dark-grey', 'black', 'khaki'],
      size: ['small', 'large']
    },
    addMore: ['dress-socks', 'undershirts', 'underwear', 'everyday-tee-crew', 'everyday-socks']
  },
  'no-show-socks': {
    prompt: 'pair',
    cta: 'Select no-show socks',
    props: {
      size: ['xs', { label: 'S', value: 'small' }, { label: 'M', value: 'medium' }, { label: 'L', value: 'large' }, 'xl']
    },
    addMore: ['no-show-socks', 'everyday-socks', 'underwear', 'undershirts', 'performance-socks'],
    url: 'https://mrdavis.com/best-no-show-socks/'
  }
}

export const buyableCategories = [
  'undershirts',
  'underwear',
  'performance-socks',
  'everyday-socks',
  'longjohns',
  'no-show-socks',
  'lounge-shirt',
  'everyday-tee-crew',
  'tank-top',
  'deep-v',
  'camisole',
]

export const addMoreIcons = {
  'everyday-tee': 'mens_everyday_tee_grey.png',
  undershirts: 'mens_ushirt_trad_v_tone.png',
  'lounge-shirt': 'mens_lounge_shirt_grey.png',
  underwear: 'mens_uwear_std_grey.png',
  longjohns: 'mens_longjohns_black.png',
  camisole: 'womens_cami_tone.png',
  'everyday-tee-crew': 'edt_crew_crimson.png',
  'deep-v': 'womens_v_tone.png',
  'tank-top': 'womens_tank_tone.png',
  'performance-socks': 'Dress-Argyle-Nvy-Grey-OS.png',
  'everyday-socks': 'ED-Socks-Solid-Black-Gold-OS.png',
  'dress-socks': 'old_dress_sock_dk_grey.png',
  'no-show-socks': 'no_show_socks.png'
}

export default meta

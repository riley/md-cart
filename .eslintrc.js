module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'comma-dangle': 'off',
    'camelcase': [
      'error',
      {
        allow: [
          '_id',
          'content_ids',
          'num_items',
          'content_type',
          'est_delivery_days',
          'address_1',
          'address_2',
          'transaction_id',
          'list_name',
          'list_position',
          'short_name',
          '$first_name',
          'address_line_1',
          'address_line_2',
          'admin_area_1',
          'admin_area_2',
          'postal_code',
          'country_code',
          'address_city',
          'address_country',
          'address_line1',
          'address_line2',
          'address_line1_check',
          'address_line2_check',
          'address_state',
          'address_zip',
          'address_zip_check',
          'cvc_check',
          'dynamic_last4',
          'exp_month',
          'exp_year',
          'tokenization_method',
          'client_ip',
        ]
      }
    ]
  },
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  globals: {
    Stripe: 'readonly'
  }
}

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
          'est_delivery_days',
          'address_1',
          'address_2',
          'transaction_id',
          'list_name',
          'list_position',
          'short_name',
          '$first_name'
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

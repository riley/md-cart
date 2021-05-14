module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/app/' : undefined,
  outputDir: 'dist',
  chainWebpack: config => {
    config.performance
      .maxEntrypointSize(400000)
      .maxAssetSize(400000)
  },
  pages: {
    cart: {
      entry: 'src/main.ts',
      template: 'public/cart.html',
      filename: 'cart.html',
      title: 'Your Cart',
    },
    thankyou: {
      entry: 'src/thankyou.ts',
      template: 'public/thankyou.html',
      filename: 'thankyou.html',
      title: 'Thank You - Mr. Davis'
    },
    admin: {
      entry: 'src/admin.ts',
      template: 'public/admin.html',
      filename: 'admin.html',
      title: 'Admin - Mr. Davis'
    }
  }
}

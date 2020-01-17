module.exports = {
  outputDir: 'dist',
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
    }
  }
}

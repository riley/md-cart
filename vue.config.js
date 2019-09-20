module.exports = {
  outputDir: 'dist',
  pages: {
    cart: {
      entry: 'src/main.ts',
      template: 'public/index.html',
      filename: 'index.html',
      title: 'Your Cart',
    },
    thankyou: {
      entry: 'src/thankyou.ts',
      template: 'public/index.html',
      filename: 'thankyou.html',
      title: 'Thank You - Mr. Davis'
    }
  }
}

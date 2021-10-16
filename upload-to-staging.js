/*
upload built files to staging server
*/
const fs = require('fs')
const Client = require('ssh2-sftp-client')

async function run () {
  const host = '104.197.69.102'
  const username = 'mrdavis'
  const password = 'pCxcvRkuhhTxNW4'
  const port = '24974'
  const appDir = '/www/mrdavis_429/public/app'

  let sftp = new Client()
  sftp.on('upload', info => {
    console.log(`Listener: Uploaded ${info.source}`)
  })
  await sftp.connect({ host, username, password, port })

  try {
    await sftp.rmdir(`${appDir}/css`, true)
    await sftp.rmdir(`${appDir}/js`, true)
  } catch (e) {
    console.log('no css or js folders. continuing')
  }

  await sftp.mkdir(`${appDir}/css`)
  await sftp.mkdir(`${appDir}/js`)

  if (fs.existsSync('./dist/cart.js')) {
    console.log('build mode: staging')
    await sftp.put('./dist/cart.js', `${appDir}/js/cart.js`)
    console.log(`uploaded ${appDir}/js/cart.js`)
    await sftp.put('./dist/thankyou.js', `${appDir}/js/thankyou.js`)
    console.log(`uploaded ${appDir}/js/thankyou.js`)
    await sftp.put('./dist/admin.js', `${appDir}/js/admin.js`)
    console.log(`uploaded ${appDir}/js/admin.js`)
  } else {
    console.log('build mode: production')
    const cssFiles = fs.readdirSync('./dist/css')
    const jsFiles = fs.readdirSync('./dist/js')

    console.log('css files', cssFiles)
    console.log('js files', jsFiles)

    for (const css of cssFiles) {
      await sftp.put(`./dist/css/${css}`, `${appDir}/css/${css}`)
      console.log(`↑ ${appDir}/css/${css}`)
    }

    for (const js of jsFiles) {
      await sftp.put(`./dist/js/${js}`, `${appDir}/js/${js}`)
      console.log(`↑ ${appDir}/js/${js}`)
    }
  }

  sftp.end()

  process.exit()
}

run().then(results => {
  console.log(results)
  process.exit()
}).catch(error => {
  console.error(error)
  console.error(error.stack)
  process.exit(1)
})

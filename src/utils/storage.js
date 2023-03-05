// transfers sessionStorage from one tab to another
const sessionStorageTransfer = function (event) {
  if (!event) { event = window.event } // ie suq
  if (!event.newValue) return // do nothing if no value to work with
  if (event.key === 'getSessionStorage') {
    // another tab asked for the sessionStorage -> send it
    localStorage.setItem('sessionStorage', JSON.stringify(sessionStorage))
    // the other tab should now have it, so we're done with it.
    localStorage.removeItem('sessionStorage') // <- could do short timeout as well.
  } else if (event.key === 'sessionStorage' && !sessionStorage.length) {
    // another tab sent data <- get it
    var data = JSON.parse(event.newValue)
    for (var key in data) {
      sessionStorage.setItem(key, data[key])
    }
  }
}

// Set a Cookie
function setCookie (name, value, expDays) {
  let date = new Date()
  date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000))
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value}; ${expires}; path=/`
}

function getCookie (cName) {
  const name = cName + '='
  const cDecoded = decodeURIComponent(document.cookie) // to be careful
  const cArr = cDecoded.split('; ')
  let res
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length)
  })
  return res
}

function unsetCookie (name) {
  const domain = process.env.NODE_ENV === 'production' ? '.mrdavis.com' : '.backmatic.com'
  document.cookie = `${name}=;path=/;domain=${domain};expires=Thu, 01 Jan 1970 00:00:01 GMT;`
}

// listen for changes to localStorage
if (window.addEventListener) {
  window.addEventListener('storage', sessionStorageTransfer, false)
} else {
  window.attachEvent('onstorage', sessionStorageTransfer)
}

// Ask other tabs for session storage (this is ONLY to trigger event)
if (!sessionStorage.length) {
  localStorage.setItem('getSessionStorage', 'foobar')
  localStorage.removeItem('getSessionStorage', 'foobar')
};

function isSupported (getStorage) {
  try {
    const key = '__some_rando_key__'
    getStorage().setItem(key, key)
    getStorage().removeItem(key)
    return true
  } catch (e) {
    return false
  }
}

const store = isSupported(() => localStorage) ? localStorage : sessionStorage

export const getToken = () => {
  const authToken = store.getItem('auth_token')
  return authToken
  // return store.getItem('auth_token') || getCookie('md_jwt') || getCookie('jwt')
}

export const setToken = (token) => {
  try {
    store.setItem('auth_token', token)
    setCookie('jwt', token, 365)
    return true
  } catch (e) {
    return false
  }
}

export const unsetToken = () => {
  try {
    store.removeItem('auth_token')
  } catch (e) {
    console.error(e)
    return false
  }

  try {
    unsetCookie('md_jwt')
  } catch (e) {
    console.error(e)
    return false
  }

  try {
    unsetCookie('jwt')
  } catch (e) {
    console.error(e)
    return false
  }

  return true
}

export const getRefId = () => {
  return store.getItem('refId')
}

export const unsetRefId = () => {
  return store.removeItem('refId')
}

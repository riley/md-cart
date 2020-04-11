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
  return store.getItem('auth_token')
}

export const setToken = (token) => {
  try {
    store.setItem('auth_token', token)
    return true
  } catch (e) {
    return false
  }
}

export const getRefId = () => {
  return store.getItem('refId')
}

export const unsetRefId = () => {
  return store.removeItem('refId')
}

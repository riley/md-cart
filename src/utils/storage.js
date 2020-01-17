function isSupported (getStorage) {
  try {
    const key = '__some_random_key_you_are_not_going_to_use__'
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

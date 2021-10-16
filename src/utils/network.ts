import { host } from './computed'
import { getToken } from './storage'

export const makeFetch = (path = '', { method = 'GET', headers = {}, body = undefined }: RequestInit = {}) => {
  const homeHost = new URL(host)
  const token = getToken()
  console.log('token for request', token)
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...headers
    },
    mode: host === 'mrdavis.com' ? 'same-origin' : 'cors',
    credentials: 'include'
  }

  if (body) {
    options.body = body
  }

  if (location.hostname !== window.location.host) {
    options.mode = 'cors'
  }

  return fetch(`${host}${path}`, options)
}

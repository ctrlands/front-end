import { createStorage as create } from './Storage'

// debug模式下不加密

const createOptions = (storage = sessionStorage) => {
  return {
    storage,
    prefixKey: 'djangson',
  }
}
export const WebStorage = create(createOptions())

export const createStorage = (storage: Storage = sessionStorage) => {
  return create(createOptions(storage))!
}
export default WebStorage

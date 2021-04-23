import { createGlobalState, useStorage } from '@vueuse/core'

export const useGlobalState = createGlobalState(() =>
  useStorage('vue-use-locale-storage', null)
)

export const setRequestInterceptor = (
  input: RequestInfo,
  init: RequestInit | undefined
) => {
  if (init === undefined) {
    init = {} as RequestInit
  }
  const token = '1231212312312'
  let headers = new Headers(init.headers)
  headers.append('Authorization', 'Bearer ' + token)
  init.headers = headers
  return { input, init }
}

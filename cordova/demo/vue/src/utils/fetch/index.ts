/**
 * 返回 Promise({ code, data, message, success});
 */
import { CustomResponse } from '../axios/types'
import { setRequestInterceptor } from './setRequestInterceptor'
// 在 config/env.js 中设置
export const origin = process.env.ORIGIN

export default (input: RequestInfo, init: RequestInit | undefined) => {
  // url 动态添加 origin
  // debugger
  // if (typeof input === 'string') {
  //   if (!/https?:\/\//.test(input)) {
  //     input = origin + input
  //   }
  // }
  // 开始
  // console.log('fetch request start......')
  // console.log('request url: ', input)

  const { input: input1, init: init1 } = setRequestInterceptor(input, init)
  input = input1
  init = init1

  // 请求
  return fetch(input, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...init,
  })
    .then((resp) => {
      // code 不为 2xx
      if (!/^2\d{2}$/.test(String(resp.status))) {
        return {
          code: resp.status.toString(),
          success: false,
          dataType: 'rpc',
        } as CustomResponse
      }

      return resp
        .json()
        .then((json) => {
          // toast错误信息
          if (!json.success) {
            console.log('error:', json.message)
          }

          json.dataType = 'rpc'

          // 请求成功的数据
          return json
        })
        .catch((err) => {
          // 不是 json 格式
          return {
            code: '999998',
            message: 'data is not json.',
            success: false,
            dataType: 'rpc',
          } as CustomResponse
        })
    })
    .catch((err) => {
      // 请求发送失败
      console.log('error:您的网络可能不通，请确认后重试')
      return {
        code: '999999',
        message: err,
        success: false,
        dataType: 'rpc',
      } as CustomResponse
    })
    .finally(() => {
      // 结束
      // console.log('fetch request end......')
    })
}

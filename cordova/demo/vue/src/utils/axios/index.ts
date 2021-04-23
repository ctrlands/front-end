/**
 * axios基础构建
 * @date 2019-12-24
 */
// import getUrl from './config';
import axios from './axios'
import { AxiosRequest, CustomResponse } from './types'

// 外部传入的baseUrl
const baseURLs: string = process.env.VUE_APP_BaseURL || ''
// 自定义header头
const headerss: object = {
  ContentType: 'application/json;charset=UTF-8',
}

const apiAxios = ({
  baseURL: baseURLs,
  headers: headerss,
  method,
  url,
  data,
  params,
  responseType,
}: AxiosRequest): Promise<CustomResponse> => {
  // url解析
  const _url = (url as string).split('.')

  return new Promise((resolve, reject) => {
    axios({
      baseURL: baseURLs,
      headers: headerss,
      method,
      url,
      params,
      data,
      responseType,
    })
      .then((res) => {
        // 200:服务端业务处理正常结束
        if (res.status === 200) {
          if (res.data.success) {
            resolve({
              success: true,
              message: res.data?.message || 'success',
              data: res.data?.data,
              code: res.data?.code || '000000',
              dataType: res.data?.dataType || 'rpc',
            })
          } else {
            // Vue.prototype.$message({ type: 'error', message: res.data?.errorMessage || (url + '请求失败') });
            console.log('请求失败')
            resolve({
              success: false,
              message: res.data?.message || url + '请求失败',
              data: res.data?.data,
              code: res.data?.code,
              dataType: res.data?.dataType || 'rpc',
            })
          }
        } else {
          resolve({
            success: false,
            message: res.data?.message || url + '请求失败',
            data: null,
            code: '',
            dataType: res.data?.dataType || 'rpc',
          })
        }
      })
      .catch((err) => {
        const message =
          err?.data?.errorMessage || err?.message || url + '请求失败'
        // Vue.prototype.$message({ type: 'error', message });
        console.log(message)
        // eslint-disable-next-line
        reject({ status: false, message, data: null })
      })
  })
}

/**
 * GET类型的网络请求
 */
const getReq = ({
  baseURL,
  headers,
  url,
  data,
  params,
  responseType,
}: AxiosRequest) => {
  return apiAxios({
    baseURL,
    headers,
    method: 'GET',
    url,
    data,
    params,
    responseType,
  })
}

/**
 * POST类型的网络请求
 */
const postReq = ({
  baseURL,
  headers,
  url,
  data,
  params,
  responseType,
}: AxiosRequest) => {
  return apiAxios({
    baseURL,
    headers,
    method: 'POST',
    url,
    data,
    params,
    responseType,
  })
}

/**
 * PUT类型的网络请求
 */
const putReq = ({
  baseURL,
  headers,
  url,
  data,
  params,
  responseType,
}: AxiosRequest) => {
  return apiAxios({
    baseURL,
    headers,
    method: 'PUT',
    url,
    data,
    params,
    responseType,
  })
}

/**
 * DELETE类型的网络请求
 */
const deleteReq = ({
  baseURL,
  headers,
  url,
  data,
  params,
  responseType,
}: AxiosRequest) => {
  return apiAxios({
    baseURL,
    headers,
    method: 'DELETE',
    url,
    data,
    params,
    responseType,
  })
}

export { getReq, postReq, putReq, deleteReq }

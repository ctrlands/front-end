import { CustomResponse } from '../utils/axios/types'
import { UserApi } from '/@/api/index'

export const userMock = (Mock: any) => {
  Mock.mock(UserApi.getUser, 'get', {
    data: '222',
    success: true,
    code: '000000',
    dataType: 'mock',
  } as CustomResponse)
}

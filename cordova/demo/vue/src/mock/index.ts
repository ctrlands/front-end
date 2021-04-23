import Mock from 'better-mock'
import { userMock } from './user'

Mock.setup({
  timeout: '400-600', // mockFetch支持 mockjs 已有的 timeout 设置项
})

userMock(Mock)

export default Mock

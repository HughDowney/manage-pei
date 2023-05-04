import axios from 'axios'
import config from '../config'
import { ElMessage } from 'element-plus'
import router from '../router'

const TOKEN_ERROR = 'Token认证失败，请重新登录'
const NET_ERROR = '网络请求异常，请稍后重试一下...'

// 创建 axios 实例对象 添加配置
const service = axios.create({
  baseURL: config.baseApi,
  timeout: 8000
})

// 请求拦截器
service.interceptors.request.use((req) => {
  const header = req.headers
  if (!header.Authorization) header.Authorization = 'Jason'
  return req
})

// 响应拦截器
service.interceptors.response.use((res) => {
  const { code, data, msg } = res.data
  if (code === 200) {
    return data
  } else if (code === 50001) {
    ElMessage.error(TOKEN_ERROR)
    setTimeout(() => {
      router.push('/login')
    }, 1500)
    return Promise.reject(TOKEN_ERROR)
  } else {
    ElMessage.error(msg || NET_ERROR)
    return Promise.reject(msg || NET_ERROR)
  }
})

// 核心的 request 函数
function request(options) {
  options.method = options.method || 'get'
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data
  }

  if (typeof options.mock !== 'undefined') {
    config.mock = options.mock
  }

  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
  }

  return service(options)
}

;['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
  request[item] = (url, data, options) => {
    return request({
      url,
      data,
      method: item,
      ...options
    })
  }
})

export default request

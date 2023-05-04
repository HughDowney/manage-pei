// 环境配置封装

const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseApi: '/api',
    mockApi: 'https://www.fastmock.site/mock/5bf138f200ce6a09d36d278d8e052f6f/api'
  },
  test: {
    baseApi: '//test.future.com/api',
    mockApi: 'https://www.fastmock.site/mock/5bf138f200ce6a09d36d278d8e052f6f/api'
  },
  prod: {
    baseApi: '//future.com/api',
    mockApi: 'https://www.fastmock.site/mock/5bf138f200ce6a09d36d278d8e052f6f/api'
  }
}

export default {
  env,
  mock: true,
  ...EnvConfig[env],
  namespace: 'manage'
}

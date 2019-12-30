// 服务器地址
let sysServerAddress = ''

if (process.env.NODE_ENV === 'production') {
  // 生产环境服务器地址
  sysServerAddress = 'https://www.liulongbin.top:8888/api/private/v1'
} else {
  sysServerAddress = 'https://www.liulongbin.top:8888/api/private/v1'
}

// 服务器api地址
const sysApi = {
  login: '/login', // 登录
  menus: '/menus', // 左侧菜单
  users: {
    list: '/users', // 用户数据列表
    add: '/users'
  },
  power: {
    list: '/rights/list',
    treeList: '/rights/tree',
    roles: '/roles'
  }
}

// 自动给接口地址添加域名
const autoAddServiceAddress = function (obj, serviceAddress) {
  const result = Object.create(null)
  for (let key in obj) {
    if (typeof obj[key] === 'object') {
      result[key] = autoAddServiceAddress(obj[key], serviceAddress)
    } else {
      result[key] = serviceAddress + obj[key]
    }
  }
  return result
}

export default {
  sys: autoAddServiceAddress(sysApi, sysServerAddress)
}

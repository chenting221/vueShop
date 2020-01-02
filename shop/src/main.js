// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// ElementUI
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// FontAwesome
import 'font-awesome/css/font-awesome.css'
import tool from './assets/js/tool'
import store from './store/index'

// vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.component('tree-table', TreeTable)
Vue.use(ElementUI)
Vue.use(VueQuillEditor)

// 设置axios的默认超时时间为60秒
axios.defaults.timeout = 60000
// 设置axios的请求拦截器
axios.interceptors.request.use(
  config => {
    const token = tool.session.get('token')
    if (token) {
      config.headers.Authorization = tool.session.get('token')
    } else {
      vm.$router.replace('/login')
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)
// 设置axios的默认错误处理的拦截器
axios.interceptors.response.use(
  response => {
    const data = response
    // token 超时
    if (data.code) {
      // 删除axios的默认全局token设置
      delete Vue.prototype.$axios.defaults.headers['Authorization']

      Message({
        type: 'warning',
        message: '操作超时'
      })
      vm.$router.replace('/login')
    }
    return response
  },
  err => {
    if (err.stack.indexOf('timeout') >= 0) {
      Message.error('操作超时')
    } else {
      if (err.response) {
        const { data } = err.response
        if (data.code) {
          Message({
            type: 'warning',
            message: data.msg
          })
        } else {
          Message.error('操作失败，系统异常')
        }
      } else {
        Message.error('服务器连接失败')
      }
    }
    return err
  }
)

Vue.prototype.$axios = axios
Vue.prototype.$tool = tool

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hours = (dt.getHours() + '').padStart(2, '0')
  const mintues = (dt.getMinutes() + '').padStart(2, '0')
  const sencond = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${mintues}:${sencond}`
})

/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

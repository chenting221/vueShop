// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

// ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// FontAwesome
import 'font-awesome/css/font-awesome.css'
import tool from './assets/js/tool'
import store from './store/index'

// vue-table-with-tree-grid
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

Vue.use(ElementUI)

// 设置axios的默认超时时间为60秒
axios.defaults.timeout = 60000
// 设置axios的请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = tool.session.get('token')
  return config
})

// 设置axios的默认错误处理的拦截器
axios.interceptors.response.use(config => {
  return config
})

Vue.prototype.$axios = axios
Vue.prototype.$tool = tool

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

import Vue from 'vue'
import Vuex from 'vuex'

// 服务器api接口地址
import api from './serviceApi'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { api }
})

export default store

import Vue from 'vue'
import Vuex from 'vuex'

// 服务器api接口地址
import api from './serviceApi'
import topMenu from './topMenu'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: { api },
  modules: {
    topMenu
  }
})

export default store

const state = {
  list: []
}

const mutations = {
  /**
   * 替换 顶部全部菜单
   * @param state
   * @param topMenuList 顶部菜单列表
   */
  replaceAll (state, topMenuList) {
    state.list = topMenuList
  },
  /**
   * 替换 顶部菜单
   * @param state
   * @param topMenuConfig 替换的配置信息
   *        topMenuConfig.index 替换的索引
   *        topMenuConfig.topMenu 替换的顶部菜单
   */
  replace (state, topMenuConfig) {
    state.list[topMenuConfig.index] = topMenuConfig.topMenu
  },
  /**
   * 追加 顶部菜单
   * @param state
   * @param topMenuList 顶部菜单列表
   */
  push (state, topMenu) {
    state.list.push(topMenu)
  },
  /**
   * 删除 顶部菜单
   * @param state
   * @param topMenuList 需要删除的索引
   */
  splice (state, index) {},

  /**
   * 清空  顶部菜单
   */
  clear (state) {
    state.list = []
  }
}

const module = {
  namespaced: true,
  state: state,
  mutations: mutations
}

export default module

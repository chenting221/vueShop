<template>
  <el-container v-loading="loading"
                element-loading-background="rgba(0, 0, 0, 0)">
    <el-aside :width="isCollapse ? '65px' : '240px'">
      <el-header style="background:#333744;color:#fff;font-size:22px;text-align:center;">shop</el-header>
      <side-bar :collapse="isCollapse"></side-bar>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">
          <i :class="['fa','fa-bars']" @click="switchCollapse"></i>
          <el-breadcrumb v-if="breadcrumbList && breadcrumbList.length > 0" separator-class="el-icon-arrow-right">
            <template v-for="(item, index) of breadcrumbList">
              <el-breadcrumb-item v-if="item.path" :to="{path:item.path}" v-bind:key="index">{{item.name}}</el-breadcrumb-item>
              <el-breadcrumb-item v-else v-bind:key="index">{{item.name}}</el-breadcrumb-item>
            </template>
          </el-breadcrumb>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="layout">退出</el-button>
          <!-- <el-dropdown trigger="click">
            <div class="el-dropdown-div">
              <span class="nickname"
                    v-text="'ctt'"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">个人信息</el-dropdown-item>
              <el-dropdown-item :command="1">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </el-header>
      <div class="index-top">
        <el-tabs v-model="topMenuIndex" @tab-click="tabClick" @tab-remove="tabRemove">
          <el-tab-pane name="/home" label="首页"></el-tab-pane>
          <el-tab-pane
            v-for="item of topMenuList"
            :key="'topMenu' + item.name"
            :label="item.label"
            :name="item.name"
            :closable="item.name === '/home' ? false : true"
          ></el-tab-pane>
        </el-tabs>
        <el-main>
          <keep-alive>
            <router-view />
          </keep-alive>
        </el-main>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import SideBar from '@/components/common/SideBar.vue'

export default {
  name: 'Index',
  components: {
    'side-bar': SideBar
  },
  data () {
    return {
      loading: false,
      isCollapse: false,
      breadcrumbList: [], // 面包屑列表
      topMenuIndex: '/home',
      topMenuIndex2: '/home'
    }
  },
  computed: {
    ...mapState('topMenu', {
      topMenuList: state => state.list
    })
  },
  created () {
    const _self = this
    // 很重要 作用是 刷新页面使动态面包屑不会消失
    _self.breadcrumbList = _self.$route.meta['breadcrumb']
    // 设置顶部导航面板
    const topMenu = _self.$tool.session.get('topMenu')
    const topMenuList = _self.$tool.session.get('topMenuList')
    if (topMenuList) {
      _self.topMenuReplaceAll(topMenuList)
    }
    if (topMenu) {
      _self.topMenuIndex = topMenu
      _self.topMenuIndex2 = topMenu
    }
    _self.init()
  },
  activated () {
    const _self = this
    _self.init()
  },
  methods: {
    ...mapMutations('topMenu', {
      topMenuPush: 'push',
      topMenuClear: 'clear',
      topMenuReplaceAll: 'replaceAll'
    }),
    init () {
      const _self = this
      const collapse = _self.$tool.session.get('collapse')
      if (collapse && collapse === 'true') {
        _self.isCollapse = true
      } else if (collapse && collapse === 'false') {
        _self.isCollapse = false
      } else {
        _self.$tool.session.set('collapse', 'false')
      }
    },
    /**
     * 切换折叠
     * @param
     * @returns void
     */
    switchCollapse () {
      const _self = this
      _self.isCollapse = !_self.isCollapse
      _self.$tool.session.set('collapse', _self.isCollapse.toString())
    },
    /**
     * 退出按钮
     */
    layout () {
      const _self = this
      _self.$tool.session.del('token')
      _self.$router.push('/login')
    },
    /**
     * 切换导航tab
     * @returns void
     */
    tabClick (obj) {
      const _self = this
      if (_self.topMenuIndex === '/home') {
        _self.topMenuIndex2 = '/home'
        _self.$router.push({ path: '/home' })
      } else {
        if (obj.name === _self.topMenuIndex2) return
        _self.$nextTick(() => {
          const breadcrumb = _self.topMenuList.find((item) => {
            return item.name === _self.topMenuIndex
          })
          if (breadcrumb) {
            let path = ''
            if (breadcrumb.hasParams) path = breadcrumb.truePath
            else path = breadcrumb.name
            _self.$router.push({
              path: path,
              query: breadcrumb.query ? breadcrumb.query : {}
            })
          }
          _self.topMenuIndex2 = _self.topMenuIndex
          _self.$tool.session.set('topMenu', _self.topMenuIndex)
        })
      }
    },

    /**
     * 删除导航tab
     * @param name 路由地址
     * @returns void
     */
    tabRemove (name) {
      const _self = this
      let activeName = _self.topMenuIndex
      let tabs = _self.topMenuList

      if (_self.topMenuIndex === name) {
        let nextTab = null
        _self.topMenuList.forEach((item, index) => {
          if (item.name === name) {
            nextTab = tabs[index + 1] || tabs[index - 1]
            if (nextTab) activeName = nextTab.name
          }
        })

        if (_self.topMenuIndex === activeName) {
          activeName = '/home'
          tabs = []
        } else {
          tabs = tabs.filter((item) => item.name !== name)
        }
      } else {
        tabs = tabs.filter((item) => item.name !== name)
      }

      _self.topMenuReplaceAll(_self.$tool.deepCopy(tabs))
      _self.topMenuIndex = activeName
      _self.topMenuIndex2 = _self.topMenuIndex

      _self.$nextTick(() => {
        if (activeName !== '/home') {
          const breadcrumb = _self.topMenuList.find((item) => {
            return item.name === _self.topMenuIndex
          })
          if (breadcrumb) {
            let path = ''
            if (breadcrumb.hasParams) path = breadcrumb.truePath
            else path = breadcrumb.name
            _self.$router.push({
              path: path,
              query: breadcrumb.query ? breadcrumb.query : {}
            })
          }
        } else {
          _self.$router.push('/home')
        }
        _self.$tool.session.set('topMenu', _self.topMenuIndex)
        _self.$tool.session.set('topMenuList', _self.topMenuList)
      })
    }
  },
  /**
   * 根据路由展示面包屑
  */
  beforeRouteUpdate (to, from, next) {
    const _self = this
    if (to.meta.breadcrumb) {
      _self.breadcrumbList = to.meta['breadcrumb']
    } else {
      _self.breadcrumbList = []
    }
    if (to.path === '/home') {
      next()
      return
    }
    // 顶部菜单面板
    const keys = Object.keys(to.params)
    let path = to.path
    if (keys.length > 0) {
      const pathArr = to.path.split('/')
      path = pathArr.slice(0, pathArr.length - keys.length).join('/')
    } else {
      path = to.path
    }
    const topMenuItem = _self.topMenuList.find((item) => {
      let result = item.name === path
      if (!result) {
        const pathArr = to.path.split('/')
        result = item.name === pathArr.slice(0, pathArr.length - keys.length).join('/')
      }
      return result
    })
    if (topMenuItem) {
      _self.topMenuIndex = topMenuItem.name
      _self.topMenuIndex2 = topMenuItem.name
    } else {
      const breadcrumb = _self.breadcrumbList[_self.breadcrumbList.length - 1]
      if (breadcrumb) {
        _self.topMenuPush({
          name: path,
          label: to.meta.breadcrumb[to.meta.breadcrumb.length - 1].name,
          hasParams: keys.length > 0,
          truePath: to.path,
          query: to.query
        })
      }
      _self.$nextTick(() => {
        _self.topMenuIndex = topMenuItem ? topMenuItem.name : path
        _self.topMenuIndex2 = _self.topMenuIndex
        _self.$tool.session.set('topMenu', _self.topMenuIndex)
        _self.$tool.session.set('topMenuList', _self.topMenuList)
      })
    }
    next()
  }
}
</script>

<style lang="less" scoped>
@media screen and(max-width:767px) {
  .el-container {
    min-height: 100vh;
    width: 2000px;
  }
}
@media screen and(min-width:768px) {
  .el-container {
    min-height: 100vh;
  }
}
.el-aside {
  max-height: 100vh;
  overflow: auto;
  overflow-x: hidden;
  background-color: #333744;
}
.el-main {
  max-height: calc(100vh - 60px);
  overflow: auto;
  background-color: #ecf0f4;
}
.el-header {
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .fa-bars {
    font-size: 30px;
    color: #5a738e;
    cursor: pointer;
  }

  .header-left {
    display: flex;
    align-items: center;

    .el-breadcrumb {
      margin-left: 20px;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }
}

.dropdown-menu {
  cursor: pointer;
  margin-right: 20px;
  color: #999;
}

.el-dropdown-div {
  display: flex;
  align-items: center;
  cursor: pointer;

  .header-img {
    width: 35px;
    height: 35px;
    border-radius: 50%;
  }

  .nickname {
    padding-left: 10px;
    font-size: 14px;
  }
}

.el-dropdown-menu {
  top: 45px !important;
}
.el-dropdown-menu__item {
  width: 160px !important;
}

.index-top {
  .el-tabs:first-child {
    color: red;
    /deep/ .el-tabs__header {
      margin-bottom: 0px !important;

      .el-tabs__nav-wrap {
        box-shadow: none !important;
        padding: 0 20px !important;
        background: #fff !important;
        border-top: 1px solid #e4e7ed !important;

        .el-tabs__item {
          height: 45px !important;
          line-height: 45px !important;
          font-weight: normal;
          color: #606266;
        }
        .el-tabs__item.is-active {
          color: #409eff;
        }
      }

      .tabs-link {
        display: block;
        height: 45px;
        line-height: 45px;
        text-decoration: none;
        color: inherit;
      }
    }
  }
}
</style>

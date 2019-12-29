<template>
  <el-container v-loading="loading"
                element-loading-background="rgba(0, 0, 0, 0)">
    <el-aside :width="isCollapse ? '65px' : '240px'">
      <el-header style="background:#2A3F54;color:#fff;font-size:22px;text-align:center;">Shopgogo</el-header>
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
          <el-dropdown trigger="click">
            <div class="el-dropdown-div">
              <span class="nickname"
                    v-text="'ctt'"></span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="0">个人信息</el-dropdown-item>
              <el-dropdown-item :command="1">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
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
      breadcrumbList: [] // 面包屑列表
    }
  },
  created () {
    const _self = this
    _self.init()
  },
  methods: {
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
    }
  },
  /**
   * 根据路由展示面包屑
  */
  beforeRouteUpdate (to, from, next) {
    console.log(to)
    const _self = this
    if (to.meta.breadcrumb) {
      _self.breadcrumbList = to.meta['breadcrumb']
    } else {
      _self.breadcrumbList = []
    }
    if (to.path === '/home') {
      next()
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
  background-color: #2a3f54;
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

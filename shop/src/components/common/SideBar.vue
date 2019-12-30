<template>
  <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" :default-active="activePath" :unique-opened="true" :router="true" :collapse="collapse" :collapse-transition="false" :style="{width:collapse?'65px':'241px'}">
    <template v-for="menu of menuList">
      <el-submenu v-if="menu.children && menu.children.length>=0" :index="menu.path" :route="menu.path" :key="menu.path">
        <template slot="title">
          <i class="el-icon-circle-check"></i>
          <span v-text="menu.authName"></span>
        </template>
        <el-menu-item v-for="submenu of menu.children" :index="'/'+ submenu.path" :route="submenu.path" :key="submenu.path" @click="saveNavState('/'+ submenu.path)">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span v-text="submenu.authName"></span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-menu-item v-else :index="menu.path" :route="menu.path" :key="menu.path">
        <i class="el-icon-location"></i>
        <span slot="title">{{ menu.authName }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'SideBar',
  props: ['collapse'],
  data () {
    return {
      menuIndex: '',
      menuList: [],
      activePath: ''
    }
  },
  computed: {
    ...mapState({
      stateApi: state => state.api
    })
  },
  created () {
    const _self = this
    _self.init()
    _self.activePath = _self.$tool.session.get('activePath')
  },
  methods: {
    /**
     * 左侧菜单的数据获取
     */
    init () {
      const _self = this
      _self.$axios({
        method: 'get',
        url: _self.stateApi.sys.menus
      }).then((response) => {
        const res = response.data
        if (res.meta.status === 200) {
          _self.menuList = res.data
        } else {
          _self.$message.fail(res.meta.msg)
        }
      }).catch(() => { })
    },
    /**
     * 保存链接的激活状态
     */
    saveNavState (activePath) {
      const _self = this
      _self.$tool.session.set('activePath', activePath)
      _self.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>

</style>

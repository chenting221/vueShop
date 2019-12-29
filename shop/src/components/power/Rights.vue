<template>
  <div style="min-height: calc(100vh - 100px)" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="main" style="margin-bottom: 20px;">
      <el-table stripe border :max-height="tableHeight" :data="tableData">
        <el-table-column align="center" header-align="center" prop="authName" label="权限名称" fixed></el-table-column>
        <el-table-column align="center" header-align="center" prop="path" label="路径"></el-table-column>
        <el-table-column align="center" header-align="center" prop="level" label="权限等级">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.level === '0'">一级</el-tag>
             <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
             <el-tag v-else-if="scope.row.level === '2'" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Rights',
  data () {
    return {
      tableData: [],
      loading: false
    }
  },
  computed: {
    tableHeight () {
      return window.innerHeight - 160
    },
    ...mapState({
      stateApi: state => state.api
    })
  },
  methods: {
    /**
     * 页面初始化调用
     * @returns void
     */
    init () {
      const _self = this
      _self.loading = true
      // 列表接口
      _self
        .$axios({
          method: 'get',
          url: _self.stateApi.sys.power.list
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.tableData = data.data
            // _self.pageInfos.total = data.data.total
          } else {
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
    }
  },
  created () {
    const _self = this
    _self.init()
  },
  activated () {
    const _self = this
    _self.init()
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 20px;
  background: #ffffff;
}
</style>

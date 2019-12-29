<template>
  <div style="min-height: calc(100vh - 100px)" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="main" style="margin-bottom: 20px;">
      <form class="screen">
        <div class="screen-item">
          <label>电话:</label>
          <el-input v-model="searchInfo.mobile"></el-input>
        </div>
        <div class="screen-item"></div>
        <div class="screen-btns">
          <el-button @click="onReset">清空</el-button>
          <el-button type="primary" @click="onSearch">查询</el-button>
        </div>
      </form>
    </div>
    <div class="main" style="margin-bottom: 20px;">
      <el-button type="primary" style="margin-bottom: 20px;" @click="addNewUser">添加新用户</el-button>
      <el-table stripe border :max-height="tableHeight" :data="tableData">
        <el-table-column align="center" header-align="center" prop="username" label="姓名" fixed></el-table-column>
        <el-table-column align="center" header-align="center" prop="email" label="邮箱"></el-table-column>
        <el-table-column align="center" header-align="center" prop="mobile" label="电话"></el-table-column>
        <el-table-column align="center" header-align="center" prop="role_name" label="角色"></el-table-column>
        <el-table-column align="center" header-align="center" prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeStatus(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" fixed="right" label="操作" width="140" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand(scope.row, $event)">
              <el-button type="primary" plain>操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfos.pageindex" :page-sizes="pageInfos.pagesizes" layout="total, sizes, prev, pager, next, jumper" :total="pageInfos.total"></el-pagination>
      </el-footer>
      <add-newUser v-if="dialogFormVisible" :visible.sync="dialogFormVisible" @closeDL="handleCloseDialog" @refreshList="onRefresList"></add-newUser>
      <edit-newUser v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2" @closeDL="handleCloseDialog2" :data="editInfos" @refreshList="onRefresList"></edit-newUser>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Users',
  data () {
    return {
      tableData: [],
      loading: false,
      searchInfo: {
        mobile: ''
      },
      pageInfos: {
        pagesizes: [10, 25, 50, 100],
        pagesize: 10,
        pageindex: 1,
        total: 0
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      editInfos: {}
    }
  },
  components: {
    'add-newUser': () => import('@/components/users/dialog/AddNewUser.vue'),
    'edit-newUser': () => import('@/components/users/dialog/EditNewUser.vue')
  },
  computed: {
    tableHeight () {
      return window.innerHeight - 304
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
          url: _self.stateApi.sys.users.list,
          params: {
            query: _self.searchInfo.mobile,
            pagenum: _self.pageInfos.pageindex,
            pagesize: _self.pageInfos.pagesize
          }
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.tableData = data.data.users
            _self.pageInfos.total = data.data.total
          } else {
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
    },
    /**
     * 清空按钮
     * @returns void
     */
    onReset (formName) {
      const _self = this
      _self.searchInfo = {
        mobile: ''
      }
      _self.pageInfos.pageindex = 1
      _self.init()
    },
    /**
     * 查询按钮
     * @returns void
     */
    onSearch (formName) {
      const _self = this
      _self.pageInfos.pageindex = 1
      _self.init()
    },
    /**
     * 分页页码改变时调用
     * @param val 当前页码
     * @returns void
     */
    handleCurrentChange (val) {
      const _self = this
      _self.pageInfos.pageindex = val
      _self.init()
    },
    /**
     * 分页每页显示条数改变时调用
     * @param val 当前条数
     * @returns void
     */
    handleSizeChange (val) {
      const _self = this
      _self.pageInfos.pageindex = 1
      _self.pageInfos.pagesize = val
      _self.init()
    },
    changeStatus (userinfo) {
      const _self = this
      _self
        .$axios({
          method: 'put',
          url: `https://www.liulongbin.top:8888/api/private/v1/users/${
            userinfo.id
          }/state/${userinfo.mg_state}`
        })
        .then(response => {
          _self.loading = false
          const { data } = response
          if (data.meta.status === 200) {
            _self.$message.success(data.meta.msg)
          } else {
            userinfo.mg_state = !userinfo.mg_state
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
    },
    /** 添加新用户按钮 */
    addNewUser () {
      const _self = this
      _self.dialogFormVisible = true
    },
    /**
     * 操作事件
     * @returns void
     */
    handleCommand (row, command) {
      const _self = this
      // 编辑
      if (command === 'edit') {
        _self.dialogFormVisible2 = true
        _self.editInfos = JSON.parse(JSON.stringify(row))
      }
      // 删除
      if (command === 'del') {
        _self.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            _self
              .$axios({
                method: 'delete',
                url: `https://www.liulongbin.top:8888/api/private/v1/users/${row.id}`
              })
              .then(response => {
                _self.loading = false
                const { data } = response
                if (data.meta.status === 200) {
                  _self.$message.success(data.meta.msg)
                  _self.init()
                } else {
                  _self.$message.error(data.meta.msg)
                }
              })
              .catch(() => {
                _self.loading = false
              })
          })
          .catch(() => {})
      }
    },
    /**
     * 在子页面刷新父页面数据 - 添加
     * @returns void
     */
    onRefresList () {
      const _self = this
      _self.loading = true
      _self.init()
    },
    /**
     * 添加按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog () {
      const _self = this
      _self.dialogFormVisible = false
    },
    /**
     * 编辑按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog2 () {
      const _self = this
      _self.dialogFormVisible2 = false
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
.el-form {
  display: flex;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item.flex1 {
  flex: 1;
}
.el-form-item:last-child {
  margin-right: 0px;
}
.el-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>

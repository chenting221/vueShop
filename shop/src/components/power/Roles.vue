<template>
  <div style="min-height: calc(100vh - 100px)" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="main" style="margin-bottom: 20px;">
      <el-button type="primary" style="margin-bottom: 20px;" @click="addRoles">添加角色</el-button>
      <el-table stripe border :max-height="tableHeight" :data="tableData">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'rowflex']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级、三级权限 -->
              <el-col :span="19">
                <!-- 通过for循环嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'rowflex']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 通过for循环嵌套渲染三级权限 -->
                    <el-tag closable type="warning" v-for="(item3) in item2.children" :key="item3.id" @close="removeRightById(scope.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column align="center" header-align="center" prop="roleName" label="角色名称"></el-table-column>
        <el-table-column align="center" header-align="center" prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column align="center" header-align="center" fixed="right" label="操作">
          <template slot-scope="scope">
            <el-dropdown @command="handleCommand(scope.row, $event)">
              <el-button type="primary" plain>操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="edit">编辑</el-dropdown-item>
                <el-dropdown-item command="del">删除</el-dropdown-item>
                <el-dropdown-item command="allocation">分配权限</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfos.pageindex" :page-sizes="pageInfos.pagesizes" layout="total, sizes, prev, pager, next, jumper" :total="pageInfos.total"></el-pagination>
      </el-footer>
      <add-roles v-if="dialogFormVisible" :visible.sync="dialogFormVisible" @closeDL="handleCloseDialog" @refreshList="onRefresList"></add-roles>
      <edit-roles v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2" @closeDL="handleCloseDialog2" :data="editInfos" @refreshList="onRefresList"></edit-roles>
      <allocation v-if="dialogFormVisible3" :visible.sync="dialogFormVisible3" @closeDL="handleCloseDialog3" :data="editInfos" @refreshList="onRefresList"></allocation>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Roles',
  data () {
    return {
      tableData: [],
      loading: false,
      pageInfos: {
        pagesizes: [10, 25, 50, 100],
        pagesize: 10,
        pageindex: 1,
        total: 0
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      editInfos: {}
    }
  },
  components: {
    'add-roles': () => import('@/components/power/dialog/AddRoles.vue'),
    'edit-roles': () => import('@/components/power/dialog/EditRoles.vue'),
    'allocation': () => import('@/components/power/dialog/allocation')
  },
  computed: {
    tableHeight () {
      return window.innerHeight - 302
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
          url: _self.stateApi.sys.power.roles
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
    },
    /**
     * 根据对应的id删除相应的权限节点
     */
    removeRightById (role, rightId) {
      const _self = this
      _self
        .$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _self
            .$axios({
              method: 'delete',
              url: `https://www.liulongbin.top:8888/api/private/v1/roles/${
                role.id
              }/rights/${rightId}`
            })
            .then(response => {
              _self.loading = false
              const { data } = response
              if (data.meta.status === 200) {
                _self.$message.success(data.meta.msg)
                // 删除成功后 不建议重新渲染列表
                // 把服务器返回的最新的权限节点直接赋给当前角色的childeren属性，
                // 防止当前列表的刷新，提高用户体验度
                role.children = data.data
              } else {
                _self.$message.error(data.meta.msg)
              }
            })
            .catch(() => {
              _self.loading = false
            })
        })
        .catch(() => {})
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
    /** 添加用户 */
    addRoles () {
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
        _self
          .$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          .then(() => {
            _self
              .$axios({
                method: 'delete',
                url: `https://www.liulongbin.top:8888/api/private/v1/roles/${
                  row.id
                }`
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
      // 分配权限
      if (command === 'allocation') {
        _self.dialogFormVisible3 = true
        _self.editInfos = JSON.parse(JSON.stringify(row))
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
    },
    /**
     * 分配权限按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog3 () {
      const _self = this
      _self.dialogFormVisible3 = false
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
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 7px;
}
.rowflex {
  display: flex;
  align-items: center;
}
</style>

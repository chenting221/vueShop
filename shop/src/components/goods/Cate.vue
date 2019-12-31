<template>
  <div style="min-height: calc(100vh - 100px)" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="main" style="margin-bottom: 20px;">
      <el-button type="primary" style="margin-bottom: 20px;" @click="addCategories">添加分类</el-button>
      <tree-table :data="tableData" :columns="columns" :selection-type="false" :expand-type="false" border :show-row-hover="false">
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen;"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="isLevel" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="command" slot-scope="scope">
          <el-button @click="edit(scope.row)" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button @click="del(scope.row)" type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>

      </tree-table>
      <el-footer>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageInfos.pageindex" :page-sizes="pageInfos.pagesizes" layout="total, sizes, prev, pager, next, jumper" :total="pageInfos.total"></el-pagination>
      </el-footer>
      <add-cate v-if="dialogFormVisible" :visible.sync="dialogFormVisible" @closeDL="handleCloseDialog" @refreshList="onRefresList"></add-cate>
      <edit-cate v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2" @closeDL="handleCloseDialog2" :data="editInfos" @refreshList="onRefresList"></edit-cate>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Cate',
  data () {
    return {
      tableData: [],
      loading: false,
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          headerAlign: 'center',
          align: 'center'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isOk',
          headerAlign: 'center',
          align: 'center'
        },
        {
          label: '排序',
          type: 'template',
          template: 'isLevel',
          headerAlign: 'center',
          align: 'center'
        },
        {
          label: '操作',
          type: 'template',
          template: 'command',
          headerAlign: 'center',
          align: 'center'
        }
      ],
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
    'add-cate': () => import('@/components/goods/cate/AddCate.vue'),
    'edit-cate': () => import('@/components/goods/cate/EditCate.vue')
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
          url: _self.stateApi.sys.goods.cate.list,
          params: {
            pagenum: _self.pageInfos.pageindex,
            pagesize: _self.pageInfos.pagesize
          }
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.tableData = data.data.result
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
    /** 添加分类 */
    addCategories () {
      const _self = this
      _self.dialogFormVisible = true
    },
    /**
     * 编辑按钮
     * @returns void
     */
    edit (row) {
      const _self = this
      _self.dialogFormVisible2 = true
      _self.editInfos = JSON.parse(JSON.stringify(row))
    },
    /**
     * 删除按钮
     * @returns void
     */
    del (row) {
      const _self = this
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
              url: _self.stateApi.sys.goods.cate.list + '/' + row.cat_id
            })
            .then(response => {
              _self.loading = false
              const { data } = response
              if (data.meta.status === 200) {
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

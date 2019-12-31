<template>
  <div style="min-height: calc(100vh - 100px)" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="main" style="margin-bottom: 20px;">
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader :options="parentCateList" expand-trigger="hover" :props="cascaderProps" @change="handleChange" clearable></el-cascader>
        </el-col>
      </el-row>
    </div>
    <div class="main" style="margin-bottom: 20px;">
      <el-alert title="注意：指允许为第三级分类设置相关参数！" type="warning" show-icon style="margin-bottom: 20px;" :closable="false"></el-alert>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="first">动态参数</el-tab-pane>
        <el-tab-pane label="静态属性" name="second">静态属性</el-tab-pane>
      </el-tabs>
      <add-cate v-if="dialogFormVisible" :visible.sync="dialogFormVisible" @closeDL="handleCloseDialog" @refreshList="onRefresList"></add-cate>
      <edit-cate v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2" @closeDL="handleCloseDialog2" :data="editInfos" @refreshList="onRefresList"></edit-cate>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Params',
  data() {
    return {
      tableData: [],
      loading: false,
      parentCateList: [],
      activeName: 'first',
      dialogFormVisible: false,
      dialogFormVisible2: false,
      editInfos: {},
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  components: {
    'add-cate': () => import('@/components/goods/cate/AddCate.vue'),
    'edit-cate': () => import('@/components/goods/cate/EditCate.vue')
  },
  computed: {
    tableHeight() {
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
    init() {
      const _self = this
      _self.loading = true
      // 列表接口
      // _self
      //   .$axios({
      //     method: 'get',
      //     url: _self.stateApi.sys.goods.cate.list,
      //     params: {
      //       pagenum: _self.pageInfos.pageindex,
      //       pagesize: _self.pageInfos.pagesize
      //     }
      //   })
      //   .then(response => {
      //     const { data } = response
      //     _self.loading = false
      //     if (data.meta.status === 200) {
      //       _self.tableData = data.data.result
      //       _self.pageInfos.total = data.data.total
      //     } else {
      //       _self.$message.error(data.meta.msg)
      //     }
      //   })
      //   .catch(() => {
      //     _self.loading = false
      //   })
      _self
        .$axios({
          method: 'get',
          url: _self.stateApi.sys.goods.cate.list
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.parentCateList = data.data
          } else {
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
    },
    /** 添加分类 */
    addCategories() {
      const _self = this
      _self.dialogFormVisible = true
    },
    /**
     * 编辑按钮
     * @returns void
     */
    edit(row) {
      const _self = this
      _self.dialogFormVisible2 = true
      _self.editInfos = JSON.parse(JSON.stringify(row))
    },
    /**
     * 删除按钮
     * @returns void
     */
    del(row) {
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
     * 父级分类
     */
    handleChange (value) {},
    /**
     * 在子页面刷新父页面数据 - 添加
     * @returns void
     */
    onRefresList() {
      const _self = this
      _self.loading = true
      _self.init()
    },
    /**
     * 添加按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog() {
      const _self = this
      _self.dialogFormVisible = false
    },
    /**
     * 编辑按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog2() {
      const _self = this
      _self.dialogFormVisible2 = false
    }
  },
  created() {
    const _self = this
    _self.init()
  },
  activated() {
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

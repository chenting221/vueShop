<template>
  <div
    style="min-height: calc(100vh - 100px)"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div
      class="main"
      style="margin-bottom: 20px;"
    >
      <el-row>
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            :options="parentCateList"
            v-model="parentCate"
            expand-trigger="hover"
            :props="cascaderProps"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
    </div>
    <div
      class="main"
      style="margin-bottom: 20px;"
    >
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        style="margin-bottom: 20px;"
        :closable="false"
      ></el-alert>
      <el-tabs
        v-model="activeName"
        @tab-click="handleTabClick"
      >
        <el-tab-pane
          label="动态参数"
          name="many"
        >
          <el-button
            type="primary"
            :disabled="isTrue"
            style="margin-bottom: 20px;"
            @click="AddParams"
          >添加参数</el-button>
          <el-table
            :data="activeList"
            border
            stripe
          >
            <el-table-column
              type="expand"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click="edit(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  @click="del(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane
          label="静态属性"
          name="only"
        >
          <el-button
            type="primary"
            :disabled="isTrue"
            style="margin-bottom: 20px;"
            @click="AddParams"
          >添加属性</el-button>
          <el-table
            :data="staticList"
            border
            stripe
          >
            <el-table-column
              type="expand"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                >{{ item }}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              align="center"
              header-align="center"
            ></el-table-column>
            <el-table-column
              label="操作"
              align="center"
              header-align="center"
            >
              <template slot-scope="scope">
                <el-button
                  @click="edit(scope.row)"
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                >编辑</el-button>
                <el-button
                  @click="del(scope.row)"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <add-params
        v-if="dialogFormVisible"
        :visible.sync="dialogFormVisible"
        @closeDL="handleCloseDialog"
        @refreshList="onRefresList"
        :title="titleName"
        :parentCate="parentCate"
      ></add-params>
      <edit-params
        v-if="dialogFormVisible2"
        :visible.sync="dialogFormVisible2"
        @closeDL="handleCloseDialog2"
        :data="editInfos"
        :title="titleName"
        :parentCate="parentCate"
        @refreshList="onRefresList"
      ></edit-params>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Params',
  data () {
    return {
      tableData: [],
      loading: false,
      parentCateList: [],
      parentCate: [],
      activeName: 'many',
      activeList: [],
      staticList: [],
      dialogFormVisible: false,
      dialogFormVisible2: false,
      editInfos: {},
      isTrue: true,
      titleName: '',
      inputVisible: false,
      inputValue: '',
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      }
    }
  },
  components: {
    'add-params': () => import('@/components/goods/params/AddParams.vue'),
    'edit-params': () => import('@/components/goods/params/EditParams.vue')
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
    AddParams () {
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
        .$confirm('此操作将永久删除该值, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _self
            .$axios({
              method: 'delete',
              url:
                _self.stateApi.sys.goods.cate.list +
                '/' +
                row.cat_id +
                '/attributes/' +
                row.attr_id
            })
            .then(response => {
              _self.loading = false
              const { data } = response
              if (data.meta.status === 200) {
                if (_self.activeName === 'many') {
                  _self.getList('many', _self.parentCate)
                } else {
                  _self.getList('only', _self.parentCate)
                }
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
    handleChange (value) {
      const _self = this
      if (value.length === 3) {
        _self.isTrue = false
        _self.parentCate = value[value.length - 1]
        _self.getList('many', _self.parentCate)
        _self.titleName = '动态参数'
      } else {
        _self.isTrue = true
        _self.activeList = []
        _self.staticList = []
      }
    },
    /**
     * tabs
     *  */
    handleTabClick (tab, event) {
      const _self = this
      _self.getList(tab.name, _self.parentCate)
      if (tab.name === 'many') {
        _self.titleName = '动态参数'
      } else {
        _self.titleName = '静态属性'
      }
    },
    /**
     * 在子页面刷新父页面数据 - 添加
     * @returns void
     */
    onRefresList () {
      const _self = this
      _self.loading = true
      if (_self.activeName === 'many') {
        _self.getList('many', _self.parentCate)
      } else {
        _self.getList('only', _self.parentCate)
      }
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
     * 获取列表数据
     */
    getList (val, value) {
      const _self = this
      // 列表接口
      _self
        .$axios({
          method: 'get',
          url:
            _self.stateApi.sys.goods.cate.list +
            '/' +
            value +
            '/' +
            'attributes',
          params: {
            sel: val
          }
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            data.data.forEach(item => {
              item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              // 控制文本框的显示与隐藏
              item.inputVisible = false
              // 文本框中输入的值
              item.inputValue = ''
            })
            if (val === 'many') {
              _self.activeList = data.data
            } else {
              _self.staticList = data.data
            }
          } else {
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
    },
    /**
     * 添加tag
     */
    handleInputConfirm (row) {
      const _self = this
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 如果没有return，则证明输入了内容，需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      _self.saveTagAttr(row)
    },
    showInput (row) {
      const _self = this
      row.inputVisible = true
      /**
       * $nextTick 方法的作用，就是当页面上的元素被重新渲染之后，才会指定回调函数中的代码
       */
      _self.$nextTick(_ => {
        _self.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleClose (index, row) {
      const _self = this
      row.attr_vals.splice(index, 1)
      _self.saveTagAttr(row)
    },
    saveTagAttr (row) {
      const _self = this
      _self
        .$axios({
          method: 'put',
          url:
            _self.stateApi.sys.goods.cate.list +
            '/' +
            row.cat_id +
            '/attributes/' +
            row.attr_id,
          data: {
            attr_name: row.attr_name,
            attr_sel: row.attr_sel,
            attr_vals: row.attr_vals.join(' ')
          }
        })
        .then(response => {
          _self.loading = false
          const { data } = response
          if (data.meta.status === 200) {
            _self.$message.success(data.meta.msg)
            if (_self.activeName === 'many') {
              _self.getList('many', _self.parentCate)
            } else {
              _self.getList('only', _self.parentCate)
            }
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
.el-tag {
  margin: 8px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
}
.input-new-tag {
  width: 120px;
}
</style>

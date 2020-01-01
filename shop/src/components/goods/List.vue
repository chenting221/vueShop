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
      <form class="screen">
        <div class="screen-item">
          <label>请输入搜索内容:</label>
          <el-input v-model="searchInfo"></el-input>
        </div>
        <div class="screen-item"></div>
        <div class="screen-btns">
          <el-button @click="onReset">清空</el-button>
          <el-button
            type="primary"
            @click="onSearch"
          >查询</el-button>
        </div>
      </form>
    </div>
    <div
      class="main"
      style="margin-bottom: 20px;"
    >
      <el-button
        type="primary"
        style="margin-bottom: 20px;"
        @click="addGoods"
      >添加商品</el-button>
      <el-table
        stripe
        border
        :max-height="tableHeight"
        :data="tableData"
      >
        <el-table-column
          align="center"
          header-align="center"
          prop="goods_name"
          label="商品名称"
          fixed
        ></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="goods_price"
          label="商品价格"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="goods_weight"
          label="商品重量"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="add_time"
          label="创建时间"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          fixed="right"
          label="操作"
          width="220"
        >
          <template slot-scope="scope">
             <!-- @click="edit(scope.row)" -->
            <el-button
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
      <el-footer>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfos.pageindex"
          :page-sizes="pageInfos.pagesizes"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfos.total"
        ></el-pagination>
      </el-footer>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'List',
  data () {
    return {
      tableData: [],
      loading: false,
      searchInfo: '',
      pageInfos: {
        pagesizes: [10, 25, 50, 100],
        pagesize: 10,
        pageindex: 1,
        total: 0
      }
    }
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
          url: _self.stateApi.sys.goods.goods.list,
          params: {
            query: _self.searchInfo,
            pagenum: _self.pageInfos.pageindex,
            pagesize: _self.pageInfos.pagesize
          }
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.tableData = data.data.goods
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
      _self.searchInfo = ''
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
    /** 添加商品 */
    addGoods () {
      const _self = this
      _self.$router.push('/goods/add')
    },
    /**
     * 编辑按钮
     */
    // edit(row) {
    //   _self.dialogFormVisible2 = true;
    //   _self.editInfos = JSON.parse(JSON.stringify(row));
    // },
    /**
     * 删除按钮
     */
    del (row) {
      const _self = this
      _self
        .$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _self
            .$axios({
              method: 'delete',
              url:
                _self.stateApi.sys.goods.goods.list +
                '/' +
                row.goods_id
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

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
      <el-table
        stripe
        border
        :max-height="tableHeight"
        :data="tableData"
      >
        <el-table-column
          align="center"
          header-align="center"
          prop="order_number"
          label="订单编号"
          fixed
        ></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="order_price"
          label="订单价格"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="pay_status"
          label="是否付款"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="is_send"
          label="是否发货"
          width="120"
        ></el-table-column>
        <el-table-column
          align="center"
          header-align="center"
          prop="create_time"
          label="下单时间"
          width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
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
            <el-button
              @click="edit(scope.row)"
              type="primary"
              icon="el-icon-edit"
              size="mini"
            >编辑</el-button>
            <el-button
              @click="location(scope.row)"
              type="success"
              icon="el-icon-location"
              size="mini"
            >定位</el-button>
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
      <edit-order v-if="dialogFormVisible" :visible.sync="dialogFormVisible" @closeDL="handleCloseDialog" :data="editInfos" @refreshList="onRefresList"></edit-order>
      <logistics v-if="dialogFormVisible2" :visible.sync="dialogFormVisible2" @closeDL="handleCloseDialog2" :data="editInfos" @refreshList="onRefresList"></logistics>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Order',
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
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      editInfos: {}
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
  components: {
    'edit-order': () => import('@/components/order/dialog/EditOrder.vue'),
    'logistics': () => import('@/components/order/dialog/logistics.vue')
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
          url: _self.stateApi.sys.order.list,
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
    edit (row) {
      const _self = this
      _self.dialogFormVisible = true
      _self.editInfos = JSON.parse(JSON.stringify(row))
    },
    location (row) {
      const _self = this
      _self.dialogFormVisible2 = true
      _self.editInfos = JSON.parse(JSON.stringify(row))
    },
    /**
     * 编辑按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog () {
      const _self = this
      _self.dialogFormVisible = false
    },
    /**
     * 定位按钮的关闭弹框事件
     * @returns void
     */
    handleCloseDialog2 () {
      const _self = this
      _self.dialogFormVisible2 = false
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

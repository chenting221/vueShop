<template>
  <el-dialog title="编辑分类" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="data" :rules="rules" ref="data">
      <el-form-item label="分类名称" :label-width="formLabelWidth" prop="catename">
        <el-input v-model="data.cat_name" class="select"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle('data')">取消</el-button>
      <el-button type="primary" @click="handleSubmit('data')" :disabled="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'EditCate',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    data: {
      type: Object
    }
  },
  data () {
    return {
      formLabelWidth: '180px',
      loading: false,
      rules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: ['change', 'blur']
          }
        ]
      }
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
            type: 2
          }
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
    /**
     * 关闭弹框事件
     * @returns void
     */
    closeDialog () {
      const _self = this
      _self.$emit('closeDL')
    },
    /**
     * 取消按钮
     * @returns void
     */
    handleCancle (formName) {
      const _self = this
      _self.closeDialog()
      _self.$refs[formName].resetFields()
    },
    /**
     * 确定发货按钮
     * @returns void
     */
    handleSubmit (formName) {
      const _self = this
      _self.$refs[formName].validate(valid => {
        if (valid) {
          if (!_self.loading) {
            _self.loading = true
            _self
              .$axios({
                method: 'put',
                url: _self.stateApi.sys.goods.cate.list + '/' + _self.data.cat_id,
                data: {
                  cat_name: _self.data.cat_name
                }
              })
              .then(response => {
                _self.loading = false
                const { data } = response
                if (data.meta.status === 200) {
                  _self.$message.success(data.meta.msg)
                  _self.closeDialog()
                  _self.$emit('refreshList')
                } else {
                  _self.$message.error(data.meta.msg)
                }
              })
              .catch(() => {
                _self.loading = false
              })
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.select {
  width: 64%;
}
</style>

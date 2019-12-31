<template>
  <el-dialog :title="'编辑' + title" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="data" :rules="rules" ref="data">
      <el-form-item :label="title" :label-width="formLabelWidth" prop="attr_name">
        <el-input v-model="data.attr_name" class="select"></el-input>
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
  name: 'EditParams',
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    data: {
      type: Object
    },
    title: {
      type: String
    },
    parentCate: {
      type: Number
    }
  },
  created () {
    const _self = this
    if (_self.title === '动态参数') {
      _self.attrSel = 'many'
    } else {
      _self.attrSel = 'only'
    }
  },
  data () {
    const _self = this
    return {
      formLabelWidth: '180px',
      attrSel: '',
      loading: false,
      rules: {
        attr_name: [
          {
            required: true,
            message: '请输入' + _self.title,
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
  methods: {
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
     * 确定按钮
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
                url: _self.stateApi.sys.goods.cate.list + '/' + _self.data.cat_id + '/attributes/' + _self.data.attr_id,
                data: {
                  attr_name: _self.data.attr_name,
                  attr_sel: _self.attrSel
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

<template>
  <el-dialog :title="'添加' + title" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="formInfo" :rules="rules" ref="formInfo">
      <el-form-item :label="title" :label-width="formLabelWidth" prop="activeParams">
        <el-input v-model="formInfo.activeParams" class="select"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle('formInfo')">取消</el-button>
      <el-button type="primary" @click="handleSubmit('formInfo')" :disabled="loading">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AddParams',
  props: {
    visible: {
      required: true,
      type: Boolean
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
      formInfo: {
        activeParams: ''
      },
      attrSel: '',
      loading: false,
      rules: {
        activeParams: [
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
                method: 'post',
                url: _self.stateApi.sys.goods.cate.list + '/' + _self.parentCate + '/attributes',
                data: {
                  attr_name: _self.formInfo.activeParams,
                  attr_sel: _self.attrSel
                }
              })
              .then(response => {
                _self.loading = false
                const { data } = response
                if (data.meta.status === 201) {
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

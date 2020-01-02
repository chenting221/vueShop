<template>
  <el-dialog title="修改地址" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="formInfo" :rules="rules" ref="formInfo">
      <el-form-item label="省市区/县" :label-width="formLabelWidth" prop="address1">
        <el-input v-model="formInfo.address1" class="select"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" :label-width="formLabelWidth" prop="address2">
        <el-input v-model="formInfo.address2" class="select"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle('formInfo')">取消</el-button>
      <el-button type="primary" @click="handleSubmit('formInfo')" :disabled="loading">确定</el-button>
    </span>
  </el-dialog>

</template>

<script>
export default {
  name: 'EditOrder',
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
      formInfo: {
        address1: [],
        address2: ''
      },
      rules: {
        address1: [
          {
            required: true,
            message: '请选择省市区/县',
            trigger: ['change', 'blur']
          }
        ],
        address2: [
          {
            required: true,
            message: '请输入详细地址',
            trigger: ['change', 'blur']
          }
        ]
      }
    }
  },
  methods: {
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
     * 关闭弹框事件
     * @returns void
     */
    closeDialog () {
      const _self = this
      _self.$emit('closeDL')
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
                url: `https://www.liulongbin.top:8888/api/private/v1/users/${_self.data.id}`,
                data: {
                  email: _self.data.email,
                  mobile: _self.data.mobile
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

<style scoped lang="less">
.select {
  width: 64%;
}
</style>

<template>
  <el-dialog title="添加" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="formInfo" :rules="rules" ref="formInfo">
      <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
        <el-input v-model="formInfo.username" class="select"></el-input>
      </el-form-item>
      <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
        <el-input v-model="formInfo.password" class="select"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="formInfo.email" class="select"></el-input>
      </el-form-item>
      <el-form-item label="手机" :label-width="formLabelWidth" prop="mobile">
        <el-input v-model="formInfo.mobile" class="select"></el-input>
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
  name: 'Add',
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
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的邮箱'))
      }
    }
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法的手机号'))
      }
    }
    return {
      formLabelWidth: '180px',
      formInfo: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      loading: false,
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: ['change', 'blur']
          },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3-10个字符之间',
            trigger: ['change', 'blur']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: ['change', 'blur']
          },
          {
            min: 6,
            max: 15,
            message: '密码长度在3-10个字符之间',
            trigger: ['change', 'blur']
          }
        ],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: ['change', 'blur']
          },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: ['change', 'blur'] },
          { validator: checkMobile, trigger: 'blur' }
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
                method: 'post',
                url: _self.stateApi.sys.users.add,
                data: _self.formInfo
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

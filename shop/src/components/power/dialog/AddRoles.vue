<template>
  <el-dialog title="添加角色" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="formInfo" :rules="rules" ref="formInfo">
      <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
        <el-input v-model="formInfo.roleName" class="select"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
        <el-input v-model="formInfo.roleDesc" class="select"></el-input>
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
  name: 'AddRoles',
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
      formInfo: {
        roleName: '',
        roleDesc: ''
      },
      loading: false,
      rules: {
        roleName: [
          {
            required: true,
            message: '请输入用户名称',
            trigger: ['change', 'blur']
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
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
                url: 'https://www.liulongbin.top:8888/api/private/v1/roles',
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

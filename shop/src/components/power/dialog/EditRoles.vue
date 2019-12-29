<template>
  <el-dialog title="编辑角色" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="data" :rules="rules" ref="data">
      <el-form-item label="角色名称" :label-width="formLabelWidth" prop="roleName">
        <el-input v-model="data.roleName" class="select"></el-input>
      </el-form-item>
      <el-form-item label="角色描述" :label-width="formLabelWidth" prop="roleDesc">
        <el-input v-model="data.roleDesc" class="select"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle('data')">取消</el-button>
      <el-button type="primary" @click="handleSubmit('data')" :disabled="loading">确定</el-button>
    </span>
  </el-dialog>

</template>

<script>
export default {
  name: 'editRoles',
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
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
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
                url: `https://www.liulongbin.top:8888/api/private/v1/roles/${_self.data.id}`,
                data: {
                  roleId: _self.data.id,
                  roleName: _self.data.roleName,
                  roleDesc: _self.data.roleDesc,
                  rolePermissionDesc: null
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

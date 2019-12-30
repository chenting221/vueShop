<template>
  <el-dialog title="分配角色" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="formInfo" :rules="rules" ref="formInfo">
      <el-form-item label="当前的用户" :label-width="formLabelWidth">
        <span>{{ data.username }}</span>
      </el-form-item>
      <el-form-item label="当前的角色" :label-width="formLabelWidth">
        <span>{{ data.role_name }}</span>
      </el-form-item>
      <el-form-item label="分配新角色" :label-width="formLabelWidth" prop="roles">
        <el-select v-model="formInfo.roles" placeholder="请选择" class="select">
          <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
          </el-option>
        </el-select>
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
  name: 'AssignRoles',
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
        roles: ''
      },
      rolesList: [],
      rules: {
        roles: [
          { required: true, message: '请选择要分配的新角色', trigger: 'change' }
        ]
      }
    }
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
          url: 'https://www.liulongbin.top:8888/api/private/v1/roles'
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.rolesList = data.data
          } else {
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
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
                url: `https://www.liulongbin.top:8888/api/private/v1/users/${
                  _self.data.id
                }/role`,
                data: {
                  rid: _self.formInfo.roles
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

<template>
  <el-dialog title="添加动态参数" :visible="visible" width="38%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="formInfo" :rules="rules" ref="formInfo">
      <el-form-item label="分类名称" :label-width="formLabelWidth" prop="activeParam">
        <el-input v-model="formInfo.activeParam" class="select"></el-input>
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
  name: 'EditActiveParams',
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
        activeParam: ''
      },
      loading: false,
      rules: {
        catename: [
          {
            required: true,
            activeParam: '请输入动态参数',
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
                method: 'post',
                url: _self.stateApi.sys.goods.cate.list,
                data: {
                  cat_pid: _self.cat_pid,
                  cat_name: _self.formInfo.catename,
                  cat_level: _self.cat_level
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
    },
    /**
     * 父级分类
     */
    handleChange (value) {
      const _self = this
      if (value.length > 0) {
        _self.cat_pid = value[value.length - 1]
        _self.cat_level = value.length
      } else {
        _self.cat_pid = 0
        _self.cat_level = 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.select {
  width: 64%;
}
</style>

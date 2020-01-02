<template>
  <el-dialog title="查看物流进度" :visible="visible" width="45%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form style="height: 400px; overflow-y: scroll;">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
    </el-form>
  </el-dialog>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Logistics',
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
      },
      progressInfo: []
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
    init () {
      const _self = this
      _self.loading = true
      // 列表接口
      _self
        .$axios({
          method: 'get',
          url: _self.stateApi.sys.order.kuaidi + '/804909574412544580'
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.progressInfo = data.data
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

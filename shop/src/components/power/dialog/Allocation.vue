<template>
  <el-dialog title="分配权限" :visible="visible" width="45%" :before-close="closeDialog" @close="closeDialog" :close-on-click-modal="false">
    <el-form :model="data" ref="data" style="height: 400px; overflow-y: scroll;">
      <el-tree ref="treeRef" :data="rightTreeList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defkeys"></el-tree>
    </el-form>
    <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancle()">取消</el-button>
        <el-button type="primary" @click="handleSubmit(data)" :disabled="loading">确定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Allocation',
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
      loading: false,
      rightTreeList: [],
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      defkeys: []
    }
  },
  created () {
    const _self = this
    _self.init()
  },
  computed: {
    ...mapState({
      stateApi: state => state.api
    })
  },
  methods: {
    /**
     * 页面初始化调用
     * @returns void
     */
    init () {
      const _self = this
      _self.loading = true
      _self.getLeafKeys(_self.data, _self.defkeys)
      // 列表接口
      _self
        .$axios({
          method: 'get',
          url: _self.stateApi.sys.power.treeList
        })
        .then(response => {
          const { data } = response
          _self.loading = false
          if (data.meta.status === 200) {
            _self.rightTreeList = data.data
          } else {
            _self.$message.error(data.meta.msg)
          }
        })
        .catch(() => {
          _self.loading = false
        })
    },
    /**
     * 通过递归的形式，获取角色下所有三级权限的id, 并保存在defkeys数组中
     * node 节点是否是三级节点
     */
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    /**
     * 关闭弹框事件
     * @returns void
     */
    closeDialog () {
      const _self = this
      _self.defkeys = []
      _self.$emit('closeDL')
    },
    /**
     * 取消按钮
     * @returns void
     */
    handleCancle () {
      const _self = this
      _self.closeDialog()
    },
    /**
     * 确定发货按钮
     * @returns void
     */
    handleSubmit (data) {
      const _self = this
      const keys = [
        ..._self.$refs.treeRef.getCheckedKeys(),
        ..._self.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      if (!_self.loading) {
        _self.loading = true
        _self
          .$axios({
            method: 'post',
            url: `https://www.liulongbin.top:8888/api/private/v1/roles/${data.id}/rights`,
            data: {
              rids: idStr
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
    }
  }
}
</script>
<style lang="less" scoped>
.select {
  width: 64%;
}
</style>

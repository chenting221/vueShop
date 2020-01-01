<template>
  <div
    style="min-height: calc(100vh - 100px)"
    v-loading="loading"
    element-loading-background="rgba(0, 0, 0, 0)"
  >
    <div
      class="main"
      style="margin-bottom: 20px;"
    >
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="100px" label-position="top">
        <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeLeave" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input type="number" v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input type="number" v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input type="number" v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                style="width: 40%;"
                :options="parentCateList"
                v-model="addForm.goods_cat"
                expand-trigger="hover"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox v-for="(cb, i) in item.attr_vals" :key="i" :label="cb" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="this.stateApi.sys.goods.upload.upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleUploadSuccess"
              list-type="picture">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" style="margin-top: 15px;" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
        <img :src="previewPath" alt="" class="previewImg"/>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'GoodsAddPage',
  data () {
    const _self = this
    return {
      loading: false,
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      parentCateList: [],
      manyTableData: [],
      onlyTableData: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      headerObj: {
        Authorization: _self.$tool.session.get('token')
      },
      previewPath: '',
      dialogVisible: false,
      rules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'change' }]
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
  activated () {
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
      _self
        .$axios({
          method: 'get',
          url: _self.stateApi.sys.goods.cate.list
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
    handleChange (value) {
      const _self = this
      if (!value.length === 3) {
        _self.addForm.goods_cat = []
      }
    },
    beforeLeave (activeName, oldActiveName) {
      const _self = this
      if (oldActiveName === '0' && _self.addForm.goods_cat.length !== 3) {
        _self.$message.warning('请先选择商品分类')
        return false
      }
    },
    tabClick () {
      const _self = this
      // 访问的动态参数面板
      if (_self.activeIndex === '1') {
        _self
          .$axios({
            method: 'get',
            url: _self.stateApi.sys.goods.cate.list + '/' + _self.addForm.goods_cat[2] + '/attributes',
            params: {
              sel: 'many'
            }
          })
          .then(response => {
            const { data } = response
            _self.loading = false
            if (data.meta.status === 200) {
              data.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
              })
              _self.manyTableData = data.data
            } else {
              _self.$message.error(data.meta.msg)
            }
          })
          .catch(() => {
            _self.loading = false
          })
      }
      if (_self.activeIndex === '2') {
        _self
          .$axios({
            method: 'get',
            url: _self.stateApi.sys.goods.cate.list + '/' + _self.addForm.goods_cat[2] + '/attributes',
            params: {
              sel: 'only'
            }
          })
          .then(response => {
            const { data } = response
            _self.loading = false
            if (data.meta.status === 200) {
              _self.onlyTableData = data.data
            } else {
              _self.$message.error(data.meta.msg)
            }
          })
          .catch(() => {
            _self.loading = false
          })
      }
    },
    handleUploadSuccess (response, file, fileList) {
      const _self = this
      const picInfo = {
        pic: response.data.tmp_path
      }
      _self.addForm.pics.push(picInfo)
    },
    handlePreview (file) {
      const _self = this
      _self.previewPath = file.response.data.url
      _self.dialogVisible = true
    },
    handleRemove (file) {
      const _self = this
      const filePath = file.response.data.tmp_path
      const i = _self.addForm.pics.findIndex(x => x.pic === filePath)
      _self.addForm.pics.splice(i, 1)
    },
    addGoods () {
      const _self = this
      _self.$refs.addFormRef.validate((valid) => {
        if (valid) {
          const copyData = _self.$tool.deepCopy(_self.addForm)
          copyData.goods_cat = copyData.goods_cat.join(',')
          // 处理动态参数
          _self.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(' ')
            }
            _self.addForm.attrs.push(newInfo)
          })
          // 处理静态属性
          _self.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals
            }
            _self.addForm.attrs.push(newInfo)
          })
          copyData.attrs = _self.addForm.attrs
          // 发起请求
          _self
            .$axios({
              method: 'post',
              url: _self.stateApi.sys.goods.goods.list,
              data: copyData
            })
            .then(response => {
              const { data } = response
              _self.loading = false
              if (data.meta.status === 201) {
                _self.$message.success(data.meta.msg)
                _self.$router.push('/goods')
              } else {
                _self.$message.error(data.meta.msg)
              }
            })
            .catch(() => {
              _self.loading = false
            })
        } else {
          _self.$message.warning('请填写必要的表单项')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  padding: 20px;
  background: #ffffff;
}
.el-form {
  display: flex;
}
.el-form-item {
  margin-bottom: 0px;
}
.el-form-item.flex1 {
  flex: 1;
}
.el-form-item:last-child {
  margin-right: 0px;
}
.el-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.el-tabs {
  width: 100%;
}
.el-steps {
  margin: 20px;
}
.previewImg {
  width: 100%;
}
/deep/.el-step__title {
  font-size: 13px;
}
/deep/.el-checkbox {
  margin: 0 5px 0 0;
}
/deep/.ql-editor {
  min-height: 300px;
}
</style>

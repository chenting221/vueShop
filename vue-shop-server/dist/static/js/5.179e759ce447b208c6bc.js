webpackJsonp([5],{VeCQ:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=a("Dd8w"),s=a.n(o),r=a("NYxO"),i={name:"GoodsAddPage",data:function(){return{loading:!1,activeIndex:"0",addForm:{goods_name:"",goods_cat:[],goods_price:"",goods_number:"",goods_weight:"",goods_introduce:"",pics:[],attrs:[]},parentCateList:[],manyTableData:[],onlyTableData:[],cascaderProps:{value:"cat_id",label:"cat_name",children:"children"},headerObj:{Authorization:this.$tool.session.get("token")},previewPath:"",dialogVisible:!1,rules:{goods_name:[{required:!0,message:"请输入商品名称",trigger:"blur"}],goods_price:[{required:!0,message:"请输入商品价格",trigger:"blur"}],goods_weight:[{required:!0,message:"请输入商品重量",trigger:"blur"}],goods_number:[{required:!0,message:"请输入商品数量",trigger:"blur"}],goods_cat:[{required:!0,message:"请选择商品分类",trigger:"change"}]}}},computed:s()({},Object(r.b)({stateApi:function(t){return t.api}})),created:function(){this.init()},activated:function(){this.init()},methods:{init:function(){var t=this;t.loading=!0,t.$axios({method:"get",url:t.stateApi.sys.goods.cate.list}).then(function(e){var a=e.data;t.loading=!1,200===a.meta.status?t.parentCateList=a.data:t.$message.error(a.meta.msg)}).catch(function(){t.loading=!1})},handleChange:function(t){3===!t.length&&(this.addForm.goods_cat=[])},beforeLeave:function(t,e){if("0"===e&&3!==this.addForm.goods_cat.length)return this.$message.warning("请先选择商品分类"),!1},tabClick:function(){var t=this;"1"===t.activeIndex&&t.$axios({method:"get",url:t.stateApi.sys.goods.cate.list+"/"+t.addForm.goods_cat[2]+"/attributes",params:{sel:"many"}}).then(function(e){var a=e.data;t.loading=!1,200===a.meta.status?(a.data.forEach(function(t){t.attr_vals=t.attr_vals?t.attr_vals.split(" "):[]}),t.manyTableData=a.data):t.$message.error(a.meta.msg)}).catch(function(){t.loading=!1}),"2"===t.activeIndex&&t.$axios({method:"get",url:t.stateApi.sys.goods.cate.list+"/"+t.addForm.goods_cat[2]+"/attributes",params:{sel:"only"}}).then(function(e){var a=e.data;t.loading=!1,200===a.meta.status?t.onlyTableData=a.data:t.$message.error(a.meta.msg)}).catch(function(){t.loading=!1})},handleUploadSuccess:function(t,e,a){var o={pic:t.data.tmp_path};this.addForm.pics.push(o)},handlePreview:function(t){this.previewPath=t.response.data.url,this.dialogVisible=!0},handleRemove:function(t){var e=t.response.data.tmp_path,a=this.addForm.pics.findIndex(function(t){return t.pic===e});this.addForm.pics.splice(a,1)},addGoods:function(){var t=this;t.$refs.addFormRef.validate(function(e){if(!e)return t.$message.warning("请填写必要的表单项"),!1;var a=t.$tool.deepCopy(t.addForm);a.goods_cat=a.goods_cat.join(","),t.manyTableData.forEach(function(e){var a={attr_id:e.attr_id,attr_value:e.attr_vals.join(" ")};t.addForm.attrs.push(a)}),t.onlyTableData.forEach(function(e){var a={attr_id:e.attr_id,attr_value:e.attr_vals};t.addForm.attrs.push(a)}),a.attrs=t.addForm.attrs,t.$axios({method:"post",url:t.stateApi.sys.goods.goods.list,data:a}).then(function(e){var a=e.data;t.loading=!1,201===a.meta.status?(t.$message.success(a.meta.msg),t.$router.push("/goods")):t.$message.error(a.meta.msg)}).catch(function(){t.loading=!1})})}}},n={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{"min-height":"calc(100vh - 100px)"},attrs:{"element-loading-background":"rgba(0, 0, 0, 0)"}},[a("div",{staticClass:"main",staticStyle:{"margin-bottom":"20px"}},[a("el-alert",{attrs:{title:"添加商品信息",type:"info",center:"","show-icon":"",closable:!1}}),t._v(" "),a("el-steps",{attrs:{space:200,active:t.activeIndex-0,"finish-status":"success","align-center":""}},[a("el-step",{attrs:{title:"基本信息"}}),t._v(" "),a("el-step",{attrs:{title:"商品参数"}}),t._v(" "),a("el-step",{attrs:{title:"商品属性"}}),t._v(" "),a("el-step",{attrs:{title:"商品图片"}}),t._v(" "),a("el-step",{attrs:{title:"商品内容"}}),t._v(" "),a("el-step",{attrs:{title:"完成"}})],1),t._v(" "),a("el-form",{ref:"addFormRef",attrs:{model:t.addForm,rules:t.rules,"label-width":"100px","label-position":"top"}},[a("el-tabs",{attrs:{"tab-position":"left","before-leave":t.beforeLeave},on:{"tab-click":t.tabClick},model:{value:t.activeIndex,callback:function(e){t.activeIndex=e},expression:"activeIndex"}},[a("el-tab-pane",{attrs:{label:"基本信息",name:"0"}},[a("el-form-item",{attrs:{label:"商品名称",prop:"goods_name"}},[a("el-input",{model:{value:t.addForm.goods_name,callback:function(e){t.$set(t.addForm,"goods_name",e)},expression:"addForm.goods_name"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"商品价格",prop:"goods_price"}},[a("el-input",{attrs:{type:"number"},model:{value:t.addForm.goods_price,callback:function(e){t.$set(t.addForm,"goods_price",e)},expression:"addForm.goods_price"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"商品重量",prop:"goods_weight"}},[a("el-input",{attrs:{type:"number"},model:{value:t.addForm.goods_weight,callback:function(e){t.$set(t.addForm,"goods_weight",e)},expression:"addForm.goods_weight"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"商品数量",prop:"goods_number"}},[a("el-input",{attrs:{type:"number"},model:{value:t.addForm.goods_number,callback:function(e){t.$set(t.addForm,"goods_number",e)},expression:"addForm.goods_number"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"商品分类",prop:"goods_cat"}},[a("el-cascader",{staticStyle:{width:"40%"},attrs:{options:t.parentCateList,"expand-trigger":"hover",props:t.cascaderProps,clearable:""},on:{change:t.handleChange},model:{value:t.addForm.goods_cat,callback:function(e){t.$set(t.addForm,"goods_cat",e)},expression:"addForm.goods_cat"}})],1)],1),t._v(" "),a("el-tab-pane",{attrs:{label:"商品参数",name:"1"}},t._l(t.manyTableData,function(e){return a("el-form-item",{key:e.attr_id,attrs:{label:e.attr_name}},[a("el-checkbox-group",{model:{value:e.attr_vals,callback:function(a){t.$set(e,"attr_vals",a)},expression:"item.attr_vals"}},t._l(e.attr_vals,function(t,e){return a("el-checkbox",{key:e,attrs:{label:t,border:""}})}),1)],1)}),1),t._v(" "),a("el-tab-pane",{attrs:{label:"商品属性",name:"2"}},t._l(t.onlyTableData,function(e){return a("el-form-item",{key:e.attr_id,attrs:{label:e.attr_name}},[a("el-input",{model:{value:e.attr_vals,callback:function(a){t.$set(e,"attr_vals",a)},expression:"item.attr_vals"}})],1)}),1),t._v(" "),a("el-tab-pane",{attrs:{label:"商品图片",name:"3"}},[a("el-upload",{attrs:{action:this.stateApi.sys.goods.upload.upload,"on-preview":t.handlePreview,"on-remove":t.handleRemove,headers:t.headerObj,"on-success":t.handleUploadSuccess,"list-type":"picture"}},[a("el-button",{attrs:{size:"small",type:"primary"}},[t._v("点击上传")])],1)],1),t._v(" "),a("el-tab-pane",{attrs:{label:"商品内容",name:"4"}},[a("quill-editor",{model:{value:t.addForm.goods_introduce,callback:function(e){t.$set(t.addForm,"goods_introduce",e)},expression:"addForm.goods_introduce"}}),t._v(" "),a("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary"},on:{click:t.addGoods}},[t._v("添加商品")])],1)],1)],1),t._v(" "),a("el-dialog",{attrs:{title:"提示",visible:t.dialogVisible,width:"50%"},on:{"update:visible":function(e){t.dialogVisible=e}}},[a("img",{staticClass:"previewImg",attrs:{src:t.previewPath,alt:""}})])],1)])},staticRenderFns:[]};var d=a("VU/8")(i,n,!1,function(t){a("W5d1")},"data-v-59437bdd",null);e.default=d.exports},W5d1:function(t,e){}});
//# sourceMappingURL=5.179e759ce447b208c6bc.js.map
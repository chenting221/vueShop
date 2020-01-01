webpackJsonp([6],{Q60B:function(t,e){},hgIy:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=a("mvHQ"),i=a.n(n),s=a("Dd8w"),l=a.n(s),r=a("NYxO"),o={name:"Params",data:function(){return{tableData:[],loading:!1,parentCateList:[],parentCate:[],activeName:"many",activeList:[],staticList:[],dialogFormVisible:!1,dialogFormVisible2:!1,editInfos:{},isTrue:!0,titleName:"",inputVisible:!1,inputValue:"",cascaderProps:{value:"cat_id",label:"cat_name",children:"children"}}},components:{"add-params":function(){return a.e(18).then(a.bind(null,"9TWy"))},"edit-params":function(){return a.e(15).then(a.bind(null,"6xZj"))}},computed:l()({tableHeight:function(){return window.innerHeight-304}},Object(r.b)({stateApi:function(t){return t.api}})),methods:{init:function(){var t=this;t.loading=!0,t.$axios({method:"get",url:t.stateApi.sys.goods.cate.list}).then(function(e){var a=e.data;t.loading=!1,200===a.meta.status?t.parentCateList=a.data:t.$message.error(a.meta.msg)}).catch(function(){t.loading=!1})},AddParams:function(){this.dialogFormVisible=!0},edit:function(t){this.dialogFormVisible2=!0,this.editInfos=JSON.parse(i()(t))},del:function(t){var e=this;e.$confirm("此操作将永久删除该用户, 是否继续?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then(function(){e.$axios({method:"delete",url:e.stateApi.sys.goods.cate.list+"/"+t.cat_id+"/attributes/"+t.attr_id}).then(function(t){e.loading=!1;var a=t.data;200===a.meta.status?"many"===e.activeName?e.getList("many",e.parentCate):e.getList("only",e.parentCate):e.$message.error(a.meta.msg)}).catch(function(){e.loading=!1})}).catch(function(){})},handleChange:function(t){3===t.length?(this.isTrue=!1,this.parentCate=t[t.length-1],this.getList("many",this.parentCate),this.titleName="动态参数"):(this.isTrue=!0,this.activeList=[],this.staticList=[])},handleTabClick:function(t,e){this.getList(t.name,this.parentCate),"many"===t.name?this.titleName="动态参数":this.titleName="静态属性"},onRefresList:function(){this.loading=!0,"many"===this.activeName?this.getList("many",this.parentCate):this.getList("only",this.parentCate)},handleCloseDialog:function(){this.dialogFormVisible=!1},handleCloseDialog2:function(){this.dialogFormVisible2=!1},getList:function(t,e){var a=this;a.$axios({method:"get",url:a.stateApi.sys.goods.cate.list+"/"+e+"/attributes",params:{sel:t}}).then(function(e){var n=e.data;a.loading=!1,200===n.meta.status?(n.data.forEach(function(t){t.attr_vals=t.attr_vals?t.attr_vals.split(" "):[],t.inputVisible=!1,t.inputValue=""}),"many"===t?a.activeList=n.data:a.staticList=n.data):a.$message.error(n.meta.msg)}).catch(function(){a.loading=!1})},handleInputConfirm:function(t){if(0===t.inputValue.trim().length)return t.inputValue="",void(t.inputVisible=!1);t.attr_vals.push(t.inputValue.trim()),t.inputValue="",t.inputVisible=!1,this.saveTagAttr(t)},showInput:function(t){var e=this;t.inputVisible=!0,e.$nextTick(function(t){e.$refs.saveTagInput.$refs.input.focus()})},handleClose:function(t,e){e.attr_vals.splice(t,1),this.saveTagAttr(e)},saveTagAttr:function(t){var e=this;e.$axios({method:"put",url:e.stateApi.sys.goods.cate.list+"/"+t.cat_id+"/attributes/"+t.attr_id,data:{attr_name:t.attr_name,attr_sel:t.attr_sel,attr_vals:t.attr_vals.join(" ")}}).then(function(t){e.loading=!1;var a=t.data;200===a.meta.status?(e.$message.success(a.meta.msg),"many"===e.activeName?e.getList("many",e.parentCate):e.getList("only",e.parentCate)):e.$message.error(a.meta.msg)}).catch(function(){e.loading=!1})}},created:function(){this.init()},activated:function(){this.init()}},c={render:function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],staticStyle:{"min-height":"calc(100vh - 100px)"},attrs:{"element-loading-background":"rgba(0, 0, 0, 0)"}},[a("div",{staticClass:"main",staticStyle:{"margin-bottom":"20px"}},[a("el-row",[a("el-col",[a("span",[t._v("选择商品分类:")]),t._v(" "),a("el-cascader",{attrs:{options:t.parentCateList,"expand-trigger":"hover",props:t.cascaderProps,clearable:""},on:{change:t.handleChange},model:{value:t.parentCate,callback:function(e){t.parentCate=e},expression:"parentCate"}})],1)],1)],1),t._v(" "),a("div",{staticClass:"main",staticStyle:{"margin-bottom":"20px"}},[a("el-alert",{staticStyle:{"margin-bottom":"20px"},attrs:{title:"注意：指允许为第三级分类设置相关参数！",type:"warning","show-icon":"",closable:!1}}),t._v(" "),a("el-tabs",{on:{"tab-click":t.handleTabClick},model:{value:t.activeName,callback:function(e){t.activeName=e},expression:"activeName"}},[a("el-tab-pane",{attrs:{label:"动态参数",name:"many"}},[a("el-button",{staticStyle:{"margin-bottom":"20px"},attrs:{type:"primary",disabled:t.isTrue},on:{click:t.AddParams}},[t._v("添加参数")]),t._v(" "),a("el-table",{attrs:{data:t.activeList,border:"",stripe:""}},[a("el-table-column",{attrs:{type:"expand",align:"center","header-align":"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._l(e.row.attr_vals,function(n,i){return a("el-tag",{key:i,attrs:{closable:""},on:{close:function(a){return t.handleClose(i,e.row)}}},[t._v(t._s(n))])}),t._v(" "),e.row.inputVisible?a("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:function(a){return t.handleInputConfirm(e.row)}},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.handleInputConfirm(e.row)}},model:{value:e.row.inputValue,callback:function(a){t.$set(e.row,"inputValue",a)},expression:"scope.row.inputValue"}}):a("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:function(a){return t.showInput(e.row)}}},[t._v("+ New Tag")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"attr_name",label:"参数名称",align:"center","header-align":"center"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center","header-align":"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"mini"},on:{click:function(a){return t.edit(e.row)}}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini"},on:{click:function(a){return t.del(e.row)}}},[t._v("删除")])]}}])})],1)],1),t._v(" "),a("el-tab-pane",{attrs:{label:"静态属性",name:"only"}},[a("el-button",{staticStyle:{"margin-bottom":"20px"},attrs:{type:"primary",disabled:t.isTrue},on:{click:t.AddParams}},[t._v("添加属性")]),t._v(" "),a("el-table",{attrs:{data:t.staticList,border:"",stripe:""}},[a("el-table-column",{attrs:{type:"expand",align:"center","header-align":"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._l(e.row.attr_vals,function(n,i){return a("el-tag",{key:i,attrs:{closable:""},on:{close:function(a){return t.handleClose(i,e.row)}}},[t._v(t._s(n))])}),t._v(" "),e.row.inputVisible?a("el-input",{ref:"saveTagInput",staticClass:"input-new-tag",attrs:{size:"small"},on:{blur:function(a){return t.handleInputConfirm(e.row)}},nativeOn:{keyup:function(a){return!a.type.indexOf("key")&&t._k(a.keyCode,"enter",13,a.key,"Enter")?null:t.handleInputConfirm(e.row)}},model:{value:e.row.inputValue,callback:function(a){t.$set(e.row,"inputValue",a)},expression:"scope.row.inputValue"}}):a("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:function(a){return t.showInput(e.row)}}},[t._v("+ New Tag")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"attr_name",label:"参数名称",align:"center","header-align":"center"}}),t._v(" "),a("el-table-column",{attrs:{label:"操作",align:"center","header-align":"center"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-button",{attrs:{type:"primary",icon:"el-icon-edit",size:"mini"},on:{click:function(a){return t.edit(e.row)}}},[t._v("编辑")]),t._v(" "),a("el-button",{attrs:{type:"danger",icon:"el-icon-delete",size:"mini"},on:{click:function(a){return t.del(e.row)}}},[t._v("删除")])]}}])})],1)],1)],1),t._v(" "),t.dialogFormVisible?a("add-params",{attrs:{visible:t.dialogFormVisible,title:t.titleName,parentCate:t.parentCate},on:{"update:visible":function(e){t.dialogFormVisible=e},closeDL:t.handleCloseDialog,refreshList:t.onRefresList}}):t._e(),t._v(" "),t.dialogFormVisible2?a("edit-params",{attrs:{visible:t.dialogFormVisible2,data:t.editInfos,title:t.titleName,parentCate:t.parentCate},on:{"update:visible":function(e){t.dialogFormVisible2=e},closeDL:t.handleCloseDialog2,refreshList:t.onRefresList}}):t._e()],1)])},staticRenderFns:[]};var u=a("VU/8")(o,c,!1,function(t){a("Q60B")},"data-v-53a97274",null);e.default=u.exports}});
//# sourceMappingURL=6.9eefe9e0489f91979677.js.map
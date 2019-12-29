<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="less">
html,
body {
  padding: 0;
  margin: 0;
}
// 修改默认的折叠面板样式（用于多个条件的筛选框）
.screen {
  display: flex;
  margin: 0px;
  padding: 0px;
  align-items: center;

  .screen-item {
    flex: 1;
    display: flex;
    align-items: center;
    margin-right: 10px;
    min-height: 1px;

    label {
      color: #606266;
      font-size: 14px;
      margin-right: 10px;
    }

    .el-date-editor,
    .el-select,
    .el-input {
      flex: 1;
      width: auto;
    }
  }
  .screen-item.no-margin-right {
    margin-right: 0px;
  }
  .screen-btns {
    width: auto;
  }
}

.screen2 {
  margin: 0px;
  margin-bottom: 15px;
  padding: 0px;

  &:last-child {
    margin-bottom: 0px;
  }

  .screen2-item-group {
    width: 100%;
    display: flex;
    margin-bottom: 15px;

    &:last-child {
      margin-bottom: 0px;
    }

    .screen2-item {
      flex: 1;
      display: flex;
      align-items: center;
      margin-right: 20px;
      min-height: 1px;

      &:last-child {
        margin-right: 0px;
      }

      label {
        color: #606266;
        font-size: 14px;
        margin-right: 12px;
      }

      .el-date-editor,
      .el-select,
      .el-input {
        flex: 1;
        width: auto;
      }
    }
  }

  .screen2-item-group-fold {
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    transition-duration: 5s;
    transition-property: height, display;

    &:last-child {
      margin-bottom: 0px;
    }
  }

  .screen2-item-group-btn {
    width: 100%;
    display: flex;
    border-top: 1px dashed #ccc;
    padding-top: 15px;
    justify-content: flex-end;
  }
}
</style>

<template>
  <el-container v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="login-bg">
      <div class="login">
        <form class="login-form">
          <h1 class="title">
            <span>密码登录</span>
          </h1>
          <div class="form-item">
            <div class="form-item-container">
              <label for="username" class="form-icon icon-phone"></label>
              <input id="username" type="text" placeholder="请输入用户名" v-model.trim="username" v-on:keyup.13="login" spellcheck="false">
            </div>
          </div>
          <div class="form-item">
            <div class="form-item-container">
              <label for="password" class="form-icon icon-lock"></label>
              <input type="password" placeholder="请输入密码" v-model.trim="password" v-on:keyup.13="login" autocomplete>
            </div>
          </div>
          <div class="form-item">
            <a class="btn-login" @click="login">登录</a>
          </div>
          <div class="form-item">
            <p class="forget-password">若忘记密码，请联系管理员</p>
          </div>
        </form>
      </div>
    </div>
  </el-container>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      loading: false,
      username: '',
      password: ''
    }
  },
  methods: {
    login () {
      const _self = this
      if (!_self.username) {
        _self.$message.warning('请输入用户名')
      } else if (!_self.password) {
        _self.$message.warning('请输入密码')
      } else {
        _self.$message.success('登录成功')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login-bg {
  width: 100vw;
  height: 100vh;
  background: #2d4d6d;;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login {
  width: 350px;
  .login-form {
    background: #fff;
    border-radius: 7px;
    padding-bottom: 40px;
    position: relative;
  }
}
.title {
  display: block;
  text-align: center;
  margin-bottom: 40px;
  box-sizing: content-box;
  padding-top: 30px;
  border-top-left-radius: 7px;
  border-top-right-radius: 7px;

  &::after {
    content: '';
    display: block;
    width: 100%;
    height: 1px;
    background: #f2f6f7;
  }

  span {
    font-size: 16px;
    color: #404040;

    &::after {
      content: '';
      display: block;
      width: 60px;
      height: 3px;
      margin: 0 auto;
      margin-top: 15px;
      background: #188ff0;
    }
  }
}

.form-item {
  padding: 0px 40px;
  margin-bottom: 20px;

  &:nth-last-child(2) {
    margin-bottom: 40px;
  }

  &:last-child {
    margin-bottom: 0px;
  }

  .form-item-container {
    border: 1px solid #f2f6f7;
    border-radius: 3px;
    display: flex;
    flex-direction: row;
    padding: 1px;

    .form-icon {
      display: block;
      width: 40px;
      height: 40px;

      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
      }

      &.icon-phone {
        &::before {
          background: url(../../static/images/icon-phone.png) center/35%
            no-repeat;
        }
      }

      &.icon-lock {
        &::before {
          background: url(../../static/images/icon-lock.png) center/35% no-repeat;
        }
      }
    }

    input {
      border: 0px;
      flex: 1;
      outline: none;
      font-size: 14px;
      color: #999999;
    }
  }

  .btn-login {
    display: block;
    background: #188ff0;
    color: #fff;
    line-height: 40px;
    text-align: center;
    border-radius: radius1;
    font-size: 16px;
    cursor: pointer;
  }

  .forget-password {
    color: #999999;
    text-align: center;
    font-size: 14px;
  }
}

input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-text-fill-color: #999999 !important;
  box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent;
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
}
</style>

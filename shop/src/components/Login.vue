<template>
  <el-container>
    <div class="login-bg">
      <div class="login">
        <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="30px" class="login-form">
          <h1 class="title">
            <span>密码登录</span>
          </h1>
          <el-form-item label="" prop="username" class="itemMargin">
            <el-input v-model.trim="loginForm.username" placeholder="请输入用户名" @keyup.enter.native="submitForm('loginForm')" spellcheck="false" prefix-icon="el-icon-user-solid"></el-input>
          </el-form-item>
          <el-form-item label="" prop="password" class="itemMargin">
            <el-input v-model.trim="loginForm.password" placeholder="请输入密码" @keyup.enter.native="submitForm('loginForm')" autocomplete prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <el-form-item class="itemMargin">
            <el-button type="primary" @click="submitForm('loginForm')" class="btnLogin">登录</el-button>
          </el-form-item>
          <p class="forget-password">若忘记密码，请联系管理员</p>
        </el-form>
      </div>
    </div>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      stateApi: state => state.api
    })
  },
  methods: {
    submitForm (formName) {
      const _self = this
      _self.$refs[formName].validate(valid => {
        if (valid) {
          _self.$axios({
            method: 'post',
            url: _self.stateApi.sys.login,
            data: {
              username: _self.loginForm.username,
              password: _self.loginForm.password
            }
          }).then((response) => {
            const res = response.data
            if (res.meta.status === 200) {
              _self.$tool.session.set('token', res.data.token)
              _self.$router.push('/home')
            } else {
              _self.$message.error(res.meta.msg)
            }
          }).catch(() => {
            return false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.login-bg {
  width: 100vw;
  height: 100vh;
  background: #2d4d6d;
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
  .itemMargin {
    margin-right: 30px;
  }
}
.title {
  display: block;
  text-align: center;
  margin-bottom: 40px;
  padding-top: 20px;
  box-sizing: content-box;
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
      background: #2d4d6d;
    }
  }
}

.btnLogin {
  width: 100%;
  background: #2d4d6d;
  border: 1px solid #2d4d6d;
}

.forget-password {
  color: #999999;
  text-align: center;
  font-size: 14px;
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

<template>
  <v-app>
    <v-btn color="primary" fab flat @click.prevent.native="$router.back()">
      <v-icon>close</v-icon>
    </v-btn>
    <v-container>
      <div class="jk_logo">
        <img src="../assets/logo.jpg" alt="蕉庫logo" class="logo">
      </div>
      <div class="jk_login">
        <div class="login_phone f-row">
          <input v-model="phoneNum" class="phone f-1" type="tel" maxlength="11" placeholder="请输入手机号"/>
          <v-btn flat :color="canSendSms?'secondary':'default'" @click="sendSmsCode" class="login_phone-btn" :disabled="!canSendSms">
            {{timeoutValue}}
          </v-btn>
        </div>
        <div class="login_verify">
          <input v-model="smsCode" class="verify" type="number" placeholder="请输入验证码">
        </div>
      </div>
      <v-btn depressed color="primary" class="now_login black--text"
             :disabled="!canTapLogin" @click="doLogin">立即登录</v-btn>
      <div class="agree_login f-row f-center">
        <v-checkbox v-model="allowedArguments" hide-details color="success"></v-checkbox>
        <span class="before_login">登录前请同意</span>
        <div class="use_login" @click.prevent="gotoDocPage">《无人便利店使用条款》</div>
      </div>
    </v-container>
    <v-snackbar
      :timeout="snackbarData.snackbarTimeout"
      bottom
      v-model="snackbarData.showSnackbar"
      :color="snackbarData.color"
    >
      {{snackbarData.snackbarText}}
    </v-snackbar>
  </v-app>
</template>

<script>
  export default {
    name: "login",
    data () {
      return {
        phoneNum: '',   //手机号码
        smsCode: '',    //短信验证码
        timeoutValue: '获取验证码',
        intervalTime: 60,
        canSendSms: false,  //可以点击发送按钮
        canTapLogin: false, //可以点击登陆按钮
        allowedArguments: true,  //是否同意协议
        snackbarData: {
          showSnackbar: false,
          snackbarTimeout: 3000,
          snackbarText: '',
          color: 'success'
        }
      }
    },
    watch: {
      phoneNum (val) {
        // Boolean 函数判断是否输入了手机号码
        this.canSendSms = Boolean(val.match(/1[3|4|5|6|7|8|9]\d{9}/))
        this.canTapLogin = Boolean(this.canSendSms && this.allowedArguments && this.smsCode)
      },
      smsCode (val) {
        this.canTapLogin = Boolean(val.match(/\d{6}/) && this.allowedArguments && this.phoneNum)
      },
      allowedArguments (val) {
        console.log(val)
        this.canTapLogin = Boolean(val && this.smsCode && this.phoneNum)
      }
    },
    methods: {
      sendSmsCode() {
        this.requestSmsCode().then(r => {
          console.log('requestSmsCode: ',r)
        })

        this.canSendSms = false
        this.countSecond = this.intervalTime    // intervalTime 不可变，重新点击按钮会为负数
        this.timeoutValue = this.countSecond + 's'
        this.interval = setInterval(() => {
          this.countSecond --
          this.timeoutValue = this.countSecond + 's'
          if(this.countSecond == 0){
            clearInterval(this.interval)
            this.timeoutValue = '获取验证码'
            this.interval = null
            this.canSendSms = true
          }
        }, 1000)
      },
      requestSmsCode () {
        let data = {
          smsType: 'LOGIN_REG_APP',
          seconds: '120',
          nationCode: '86',
          mblNo: this.phoneNum
        }
        return window.yy.POST('sendLoginRegAppSms', data, {checkSession:false})
      },
      doLogin () {
        this.requestLogin().then(res => {
          if (res.code == 'FSP0000') {
            if(res.data.isBlack == 'Y') {
              let snackbarData = {
                showSnackbar: true,
                color: 'error',
                snackbarText: '抱歉，您的账号已被禁，请联系客户'
              }
              Object.assign(this.snackbarData, snackbarData)
              return
            }

            let snackbarData = {
              showSnackbar: true,
              snackbarText: '登录成功'
            }
            Object.assign(this.snackbarData, snackbarData)

            window.localStorage.setItem('userId',res.data.userId)
            window.localStorage.setItem('mblNo',res.data.mblNo)
            yy.config.userId = res.data.userId
            yy.config.mblNo = res.data.mblNo

            this.$cookie.set('sessionId', res.data.sessionId)
            this.$cookie.set('sessionValid',true,{expires: '50m'})
            this.$router.back()
          } else {
            let snackbarData = {
              showSnackbar: true,
              snackbarText: res.message,
              color: 'error'
            }
            Object.assign(this.snackbarData, snackbarData)
          }
        })
      },
      gotoDocPage(){
        this.$router.push('/agreement')
      },
      requestLogin () {
        let data = {
          userType: 'APP',
          mblNo: this.phoneNum,
          smsNo: this.smsCode,
          nationCode: '86'
        }
        return window.yy.POST('loginReg', data,{checkSession:false})
      },
    }
  }
</script>

<style scoped>
  input[type="number"]{
    -moz-appearance: none;
    -webkit-appearance:none;
  }
  input:focus,button:focus{
    outline: none;
  }
  .jk_logo{
    width: 100px;
    height: 100px;
    margin: 10px auto 60px;
  }
  .logo{
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .jk_login{
    margin: 20px auto;
  }
  .login_phone{
    align-items: center;
    height: 60px;
    border-top: 1px solid #D2D2D2;
    border-bottom: 1px solid #D2D2D2;
  }
  .login_verify{
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #D2D2D2;
  }
  .phone{
    height: 30px;
    line-height: 30px;
  }
  .verify{
    height: 40px;
    line-height: 40px;
  }

  .login_phone-btn{
    color: #AAAAAA;
    font-size: 15px;
    border-left: 1px solid #D2D2D2;
  }
  .now_login{
    width: 100%;
    height: 50px;
    margin: 15px auto;
    border-radius: 20px;
    background: #FFF21F !important;
    color: #AAAAAA;
    font-size: 22px;
  }
  .agree_login > .input-group{
    flex: 0 !important;
  }
  .before_login{
    color: #AAAAAA;
  }
  .use_login{
    color: #FFE224;
  }
</style>

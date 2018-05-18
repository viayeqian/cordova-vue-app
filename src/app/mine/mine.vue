<template>
  <v-container style="margin: 0; padding: 0px;">
    <div>
      <div class="user-list">
        <div class="user-left f-row">
          <div>
            <img class="user-picture" src="../../assets/logo.jpg"/>
          </div>
          <div class="userInfo f-col">
            <div><b class="user-name">昵称～</b></div>
            <div class="user-phone">
              <img class="mobile" src="../../assets/login/mobile.png"/>
              <span class="phoneNum">{{mblNo}}</span>
            </div>

            <!--<div class="mine-wallet f-row">-->
            <!--<img src="../../assets/mine/mine-wallet.jpg"/>-->
            <!--<div class="f-col wallet-item">-->
            <!--<span>我的钱包</span>-->
            <!--<span>即将上线</span>-->
            <!--</div>-->
            <!--</div>-->
          </div>
        </div>
        <div class="user-right">
          <img src="../../assets/login/arrow.png" class="arrow">
        </div>
      </div>
    </div>
    <div class="line"></div>
    <div class="mine-feedback">
      <ul>
        <!--<li>-->
          <!--<span>我的积分</span>-->
          <!--<img src="../../assets/login/arrow.png" class="arrow">-->
        <!--</li>-->
        <li @click="showDevloping">
          <span>我的优惠</span>
          <img src="../../assets/login/arrow.png" class="arrow">
        </li>
        <li>
          <a href="tel:400-8938-066" class="f-row f-1" style="justify-content: space-between;align-items: center;">
            <span>反馈</span>
            <img src="../../assets/login/arrow.png" class="arrow">
          </a>
        </li>
        <li>
          <span>关于</span>
          <img src="../../assets/login/arrow.png" class="arrow">
        </li>
        <li  @click.prevent="$router.push('/agreement')">
          <span>用户协议</span>
          <img src="../../assets/login/arrow.png" class="arrow">
        </li>
      </ul>
    </div>
    <div class="f-row f-center">
      <button @click="exitLogin" class="quit_login">退出当前账号</button>
    </div>
  </v-container>

</template>

<script>
    export default {
      name: "mine",
      data () {
        return {
          mblNo: ''
        }
      },
      mounted () {
        let mblNo = yy.config.mblNo
        this.mblNo = mblNo.substr(0,3)+"****"+mblNo.substr(7);
      },
      methods: {
        exitLogin(){
          window.localStorage.removeItem('userId')
          window.localStorage.removeItem('mblNo')
          this.$cookie.delete('sessionValid')
          this.$cookie.delete('sessionId')
          this.$router.replace('/home')
        },
        showDevloping(){
          yy.showDialog({
            title: '温馨提示',
            content: '请在现场领取翼支付的优惠券',
            showCancel: false
          })
        }
      }
    }
</script>

<style scoped>
  .user-list{
    height: 155px;
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
  }
  .user-left{
    display: flex;
    justify-content: space-between;
  }
  .user-name{
    margin-bottom: 13px;
    font-size: 20px;
    color: #000;
  }
  .user-picture{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .mine-wallet img{
    width: 40px;
    height: 40px;
  }
  .wallet-item span{
    margin-left: 10px;
    font-size: 14px;
    color: #888;
  }
  .mine-apply{
    height: 100px;
  }
  .mine-feedback{
    padding: 0px 16px;
  }
  .mine-feedback ul li,.mine-apply ul li{
    height: 50px;
    line-height: 50px;
    display: flex;
    font-size: 16px;
    color: #000;
    justify-content: space-between;
    align-items: center;
  }
  .material-icons{
    line-height: 50px;
  }
  .userInfo{
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .quit_login{
    width: 300px;
    height: 45px;
    border: 1px solid #b2b2b2;
    border-radius: 20px;
    font-size: 17px;
    color: #000;
    font-weight: bold;
    margin-top: 30px;
  }
  .user-phone{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mobile{
    width: 15px;
    height: 15px;
  }
  .phoneNum{
    font-size: 13px;
    color: #353535;
  }
  .line{
    width: 100%;
    height: 10px;
    background: #f5f5f5;
  }
  .arrow{
    width: 12px;
    height: 12px;
    transform:rotate(180deg);
  }
  button:hover{
    outline: none;
  }

</style>

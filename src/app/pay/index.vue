<template>
  <v-app>
    <div class="layout">
      <div class="header">
        <v-toolbar color="primary" flat="">
          <v-btn floating icon @click.prevent="$router.go(-1)" style="z-index: 999">
            <v-icon>arrow_back</v-icon>
          </v-btn>
          <v-toolbar-title class="black--text">购物车</v-toolbar-title>
        </v-toolbar>
      </div>
      <div class="content">
        <v-container style="margin: 0; padding-top: 10px">
          <div class="user-list">
            <div class="user-left f-row">
              <div>
                <img class="user-picture" src="../../assets/logo.jpg"/>
              </div>
              <div class="userInfo f-col">
                <div>蕉庫无人便利店</div>
                <div class="shop">
                  <span class="shop-name">{{mercNm}}</span>
                </div>
                <div class="shop">
                  <span class="shop-name">开始扫描：{{startSecond}} 秒</span>
                </div>
                <div class="shop">
                  <span class="shop-name">结束扫描：{{endSecond}} 秒</span>
                </div>
              </div>
            </div>
          </div>
          <div class="cart-container" v-if="goodslist.length > 0">
            <div class="goods-container">
              <div style="font-size: 16px;font-weight: bold;">商品详情</div>
              <div class="list-goods">
                <div class="item-goods f-row" v-for="item in goodslist">
                  <div class="f-1">{{item.goodsName}}</div>
                  <div class="num">x{{item.num}}</div>
                  <div class="price">¥ {{item.goodsAmt/100}}</div>
                </div>
              </div>
              <div class="goods-total-price f-row">合计 &nbsp;<div class="red--text">¥ {{totalFee/100}}</div></div>
            </div>
          </div>
        </v-container>
      </div>
      <!--<div class="bottom f-row" v-if="goodslist.length > 0">-->
        <!--<v-btn @click.prevent="cancelPay" class="pay">取消支付</v-btn>-->
        <!--<v-btn color="primary" class="pay" @click.native="showPaywayModel = true">翼支付</v-btn>-->
      <!--</div>-->
      <div class="bottom f-row" v-if="goodslist.length > 0">
        <v-btn @click.prevent="cancelPay" class="pay">取消支付</v-btn>
        <v-btn @click.prevent="doBestPay" class="pay" color="primary" style="color: #353535;">翼支付</v-btn>
        <!--<v-btn color="primary" class="pay" @click.prevent="showPaywayModel">翼支付</v-btn>-->
      </div>
    </div>
    <v-progress-circular style="z-index: 999999;" class="full-loading f-center" v-if="showProgress"
                         indeterminate :size="50" color="primary"></v-progress-circular>
    <v-snackbar
      :timeout="snackbarTimeout"
      bottom
      v-model="showSnackbar"
      color="success"
    >
      {{snackbarText}}
    </v-snackbar>
    <!--<div class="model-payway" v-if="showPaywayModel">-->
      <!--&lt;!&ndash;<div class="mask" @click.prevent="hidePaywayModel"></div>&ndash;&gt;-->
      <!--<div class="container-payway f-col">-->
        <!--<h2 style="margin:5px 0;">选择支付方式</h2>-->
        <!--<div class="list-payway">-->
          <!--<div class="item-payway f-row" v-for="(pay, i) in payway" @click.prevent="switchPayway(i)">-->
            <!--<div class="label f-1">{{pay.title}}</div>-->
            <!--<v-icon :class="paywayActiveIndex == i ? 'icon-select' : 'icon-not-select'" color="white">done</v-icon>-->
          <!--</div>-->
        <!--</div>-->
        <!--<v-btn color="primary" class="black&#45;&#45;text" @click.prevent="pay">支付 ¥ 5元</v-btn>-->
      <!--</div>-->
    <!--</div>-->
  </v-app>
</template>

<script>
  const maxOrderCount = 6
    export default {
      name: "pay",
      data () {
        return {
          orderNo: '',
          getOrderCount: 0,          // 循环获取订单的次数计时器
          showProgress: true,
          showSnackbar: false,
          showPaywayModel: false,
          snackbarTimeout: 1000,
          snackbarText: '',
          paywayActiveIndex: 0,
          payway: [{
            icon: '',
            title: '翼支付'
          },{
            icon: '',
            title: '支付宝'
          },{
            icon: '',
            title: '微信支付'
          }],
          goodslist: [],
          totalFee: 0,
          mercNm: '',
          needCancelOrder: true,      // 需要在销毁页面时取消订单
          startSecond: '',
          endSecond: ''
        }
      },
      beforeDestroy () {
        this.orderListTimeOut && clearTimeout(this.orderListTimeOut);
        if(this.needCancelOrder) this.doCancelOrder()
      },
      mounted () {
        this.orderNo = this.$route.query.orderNo
        this.startSecond = (new Date()).getSeconds()
        setTimeout(() => {
          this.getGoodsList()
        }, 4000)
      },
      methods: {
        /**
         * 循环获取订单数据、 处理异常
         * */
        getGoodsList () {
          const vm = this
          this.reuqestOrderList().then(r => {
            if (this.getOrderCount > maxOrderCount) {
              // 超过次数后弹出提示
              this.showProgress = false
              yy.showDialog({
                title: '温馨提示',
                content: '获取订单超时，请重新扫码',
                persistent: true,
                sure () {
                  vm.$router.back()
                }
              })
              return
            }
            var dialogContent = ''
            switch (r.code) {
              case "FSP0000":
                this.endSecond = (new Date()).getSeconds()
                this.showProgress = false;
                this.getOrderCount = 0;  //  计时器归0
                this.goodslist = r.data.orderInfoList || [];
                this.totalFee = r.data.totalFee;
                this.mercNm = r.data.mercNm;
                this.payStr = r.data.signString + '&OTHERFLOW=01';
                clearTimeout(this.orderListTimeOut);
                break;
              case 'FSP8203':
                if(this.getOrderCount <= maxOrderCount){
                  this.orderListTimeOut = setTimeout(() => {
                    this.getOrderCount ++
                    this.getGoodsList()
                  },1000)
                }
                break;
              case 'FSP8201':
              case 'FSP8202':
              case 'FSP8206':
              case 'FSP8209':
              case 'FSP8212':
              case 'FSP8213':
                dialogContent = r.message
                break;
              case 'FSP8210':
                dialogContent = '请勿站在结算区外操作结算';
                break;
              case 'FSP8211':
                dialogContent = '设备异常，请联系客服';   // 天线异常
                break;
            }
            if (r.code != 'FSP0000' && r.code != 'FSP8203') {
              this.endSecond = (new Date()).getSeconds()
              this.showProgress = false
              yy.showDialog({
                title: '温馨提示',
                content: dialogContent,
                persistent: true,
                sure () {
                  vm.needCancelOrder = false
                  vm.$router.back()
                }
              })
            }
          })
        },
        /**
         * 请求订单数据
         * */
        reuqestOrderList(){
          let data = {
            mercId: yy.config.mercId,
            ordNo: this.orderNo,
            userType: 'APP',
            userId: yy.config.userId
          }
          return yy.POST('sunny/api/getOrder',data)
        },
        /**
         * 点击取消订单
         * */
        cancelPay () {
          const vm = this
          yy.showDialog({
            title: '温馨提示',
            content: '是否确认取消订单',
            showCancel: true,
            sure () {
              vm.showProgress = true
              vm.doCancelOrder().then(r => {
                vm.showProgress = false
                vm.showSnackbar = true
                vm.snackbarText = '取消成功'
                setTimeout(() => {
                  vm.needCancelOrder = false
                  vm.$router.back()
                },1000)
              })
            }
          })
        },
        PaywayModel () {
          this.showProgress = true
          setTimeout(() => {
            this.showSnackbar = true
            this.snackbarText = '模拟支付成功'
            setTimeout(() => {
              this.$router.back()
            },1000)
          }, 1000)
        },
        /***
         * 请求取消订单
         * @returns {*}
         */
        doCancelOrder () {
          let data = {
            mercId: yy.config.mercId,
            ordNo: this.orderNo,
            userType: 'APP',
            userId: yy.config.userId
          }
          return yy.POST('sunny/api/closeOrder',data)
        },
        /**
         * 调起翼支付
         * */
        doBestPay () {
          console.log(this.payStr)
          this.showProgress = true
          const vm = this
          cordova && cordova.BestPay(this.payStr,(res) => {
            // 成功回调
            console.log('success ',res)
            vm.sendPaySuccess().then(r => {
              vm.showProgress = false
              vm.needCancelOrder = false
              vm.$router.replace('/pay/result')
            })
          },(res) => {
            // 失败回调
            console.log('fail ',res)
            vm.showProgress = false
            vm.$route.meta.stopBackOnce = true
            yy.showDialog({
              title: '支付失败',
              content: '原因： ' + res.result,
              persistent: true,
              showCancel: false,
              sure () {

              }
            })
          })
        },
        /**
         * 前端支付成功后的结果反馈
         * */
        sendPaySuccess(){
          let data = {
            mercId: yy.config.mercId,
            ordNo: this.orderNo,
            userType: 'APP',
            userId: yy.config.userId
          }
          return yy.POST('sunny/api/paySuccess',data)
        }
      }
    }
</script>

<style scoped>
  .goods-container{
    background: #ffffff;
    border-radius: 10px;
    padding: 10px 14px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  }
  .list-goods .item-goods{
    padding: 10px 0;
    border-bottom: 1px solid #eeeeee;
    display: flex;
    align-items: center;
  }
  .list-goods .item-goods .num,
  .list-goods .item-goods .price{
    padding: 4px 0px;
    min-width: 60px;
    display: flex;
    justify-content: center;
  }
  .list-goods .item-goods .price{
    background-color: #FFF21F;
    border-radius: 50px;
  }
  .goods-total-price{
    margin-top: 10px;
    justify-content: flex-end;
    font-size: 18px;
    font-weight: bold;
  }
  .bottom{
    justify-content: space-between;
    padding: 0 20px;
  }

  .model-payway,
  .model-payway .mask{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    height: 100%;
    width: 100%;
  }
  .model-payway .mask{
    background: rgba(0,0,0,.4);
  }
  .container-payway{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    background: #fff;
    z-index: 9999;
    padding: 20px;
    border-radius: 4px;
  }
  .list-payway .item-payway{
    padding: 10px 0;
  }
  .list-payway .item-payway .label{
    display: flex;
    align-items: center;
  }
  .list-payway .item-payway .icon-not-select{
    border: 2px solid #eee;
    border-radius: 50%;
  }
  .list-payway .item-payway .icon-select{
    border: 2px solid #05a941;
    border-radius: 50%;
    background: #05a941;
    color: white;
  }
  .pay{
    color: #000;
    border-radius: 18px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  }
  .header .toolbar{
    box-shadow: none;
    position: relative;
  }
  .black--text{
    position: absolute;
    width: 100%;
    margin: 0 auto;
    text-align: center;
  }
  .user-list{
    height: 85px;
    display: flex;
    padding: 0 16px;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    border-radius: 10px;
    margin-bottom: 10px;
    box-shadow: 0 0 5px rgba(0, 0, 0, .1);
  }
  .user-left{
    display: flex;
    justify-content: space-between;
  }
  .user-list.user-name{
    margin-bottom: 12px;
    font-size: 15px;
    color: #888;
  }
  .user-picture{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 12px;
  }
  .user-list .userInfo{
    display: flex;
    align-items: flex-start;
    justify-content: center;
  }
  .user-list .shop{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .shop-name{
    font-size: 18px;
    color: #000;
    font-weight: bold;
  }
</style>

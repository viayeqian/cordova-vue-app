<template>
  <div style="width: 100%">
    <v-carousel style="height: 210px;" class="carousel" hide-controls>
      <v-carousel-item v-for="(img,i) in bannerImgList" :key="i" >
        <img :src="img" alt="" style="height: 100%;width: 100%;">
      </v-carousel-item>
    </v-carousel>
    <v-container class="container">
      <div class="btn-group f-center f-row" style="height: 120px">
        <div class="home-scan">
          <img src="../../assets/home/icon-scan.png"  @click="startScanner('IN')">
          <span class="index_text">扫码进门</span>
        </div>
        <div class="home-open">
          <img src="../../assets/home/icon-open.png" @click="startScanner('OUT')">
          <span class="index_text">结算/出门</span>
        </div>
        <a class="home-feedback" href="tel:400-8938-066">
          <img src="../../assets/home/icon-feedback.png">
          <span class="index_text">问题反馈</span>
        </a>
      </div>
      <div class="shop-process">
        <img src="../../assets/home/shop-process.jpg" @click.prevent="$router.push('/process')"/>
      </div>
    </v-container>
  </div>

</template>

<script>
  import defaultBannerImg from '../../assets/logo.jpg';   //  插件需要有一个默认图，开启图片的显示
  export default {
    name: "home",
    data () {
      return {
        qrScannerResult: '',
        fromOrderScanner: false,
        bannerImgList: [defaultBannerImg],
        encMercId: '',  // 二维码参数1
        qRcodeType: '', // 二维码参数2
        createTm: '',   // 二维码参数3
      }
    },
    created () {
      this.bannerInfo().then(r => {
        let bannerImgList = []
        r.banners.map(item => {
          bannerImgList.push(item.banUrl)
        })
        this.bannerImgList = bannerImgList
      });
    },
    methods: {
      bannerInfo(){
        let data = {}
        return yy.POST('appintf/findbanner',data,{
          checkLogin:false,
          host: yy.config.up_host
        })
      },
      /***
       * 统一处理扫码的结果，分scanType再处理业务
       * */
      startScanner (scanType) {
        if (this.checkLogin()) {

          // 模拟二维码数据
          const vm = this
          const qrText = 'b4UMZEOwust/U4TpfyYNQX5QBcNx6hAO75Wi1awpNLM=&20180506181522&' + scanType
          const scanData = qrText.split('&') || []
          if(scanData.length != 3){
            yy.showDialog({
              title: '温馨提示',
              content: '请扫描BanaCoo无人便利店的APP二维码',
              sure () {}
            })
            return
          }
          vm.encMercId = scanData[0]
          vm.createTm = scanData[1]
          vm.qRcodeType = scanData[2]

          if (vm.qRcodeType != scanType) {
            let content = scanType == 'IN' ? '如需进门，请扫描入口处的二维码' : '如需结算或出门，请扫描结算区的二维码'
            yy.showDialog({
              title: '温馨提示',
              content: content,
              sure () {}
            })
            return
          }
          setTimeout(() => {
            vm.doDoorInOrOut()
            // for (let i = 0 ; i< 10; i++) {
            //   for (let j =0 ;j < 100; j++){
            //     vm.doDoorInOrOut()
            //   }
            // }
          },300)

          return

          yy.QRScanner({
            success (r) {
              console.log(r)
              const scanData = r.split('&') || []
              if(scanData.length != 3){
                yy.showDialog({
                  title: '温馨提示',
                  content: '请扫描BanaCoo无人便利店的APP二维码',
                  sure () {}
                })
                return
              }
              vm.encMercId = scanData[0]
              vm.createTm = scanData[1]
              vm.qRcodeType = scanData[2]

              if (vm.qRcodeType != scanType) {
                let content = scanType == 'IN' ? '如需进门，请扫描入口处的二维码' : '如需结算或出门，请扫描结算区的二维码'
                yy.showDialog({
                  title: '温馨提示',
                  content: content,
                  sure () {}
                })
                return
              }
              setTimeout(() => {
                vm.doDoorInOrOut()
              },300)
            },
            fail () {
              console.log('取消扫码')
            }
          })
        }
      },
      checkLogin () {
        let notNeedLogin = window.yy.checkLoginInfo()
        !notNeedLogin && this.$router.push('/login')
        return notNeedLogin
      },
      doDoorInOrOut(){
        this.parseMercId().then(res=>{
          if (!res) return;
          if (res.code == 'FSP0000') {
            yy.config.mercId = res.data.mercId
            if (this.qRcodeType == 'IN') {
              //满足条件停止循环
              if (false) {
                clearTimeout(this.openDoorTimeOut)
                yy.showDialog({
                  title: '温馨提示',
                  content: '请稍后片刻，正在为您开门。如10S内无反应，请重新尝试，谢谢配合！',
                  sure () {}
                })
                // alert('等待开门')
                return
              }else {
                this.openDoorTimeOut = setTimeout(()=>{
                  this.doDoorInOrOut()
                },2000)
              }
            } else {
              this.requestOrderNo().then(r => {
                if (r.code == 'FSP0000')
                 this.$router.push('/pay?orderNo='+r.data.ordNo)
              })
            }
          } else {
            this.qRcodeType == 'IN' && clearTimeout(this.openDoorTimeOut)
            let content = ''
            if (res.code == 'FSP6001'){
              // 已打烊
              content = '门店已打烊'
            }
            if(res.code == 'FSP6002') {
              // 提示已打烊
              content = '门店已打烊'
            }
            if (res.code == 'FSP8201') {
              // 商户不存在
              content = '门店不存在'
            }
            yy.showDialog({
              title: '温馨提示',
              content: content,
              sure () {}
            })
            return
          }
        })
      },
      /***
       * 请求解析二维码中的mercId
       * @returns {*}
       */
      parseMercId(){
        let data = {
          encMercId: this.encMercId,
          qRcodeType: this.qRcodeType,
          createTm: this.createTm,
          userType: 'APP',
          userId: yy.config.userId
        }
        return window.yy.POST('sunny/api/scanQRcode', data)
      },
      /***
       * 获取订单号
       *
       * @returns {*}
       */
      requestOrderNo(){
        let data = {
          userType: 'APP',
          userId: yy.config.userId,
          mercId: yy.config.mercId
        }
        return yy.POST('sunny/api/scanGoods',data)
      }
    }
  }
</script>

<style scoped>
  /*.btn-group{*/
  /*margin-top: 30px;*/
  /*}*/
  .home-scan,.home-open,.home-feedback{
    width: 33.3%;
    height: 80px;
    text-align: center;
    font-size: 16px;
  }
  .home-scan img,.home-open img,.home-feedback img{
    width: 45px;
    height: 45px;
    display: block;
    margin: auto;
    margin-bottom: 10px;
  }
  /*.shop-process{*/
  /*margin-top: 30px;*/
  /*}*/
  .shop-process img{
    width: 100%;
    height: 120px;
    border-radius: 20px;
  }
  .carousel >>>  .carousel__controls{
    background: transparent !important;
    margin-bottom: 14px;
  }
  .carousel >>>.carousel__controls__item{
    margin: 0px !important;
    /*color: #fff;*/
  }
  .carousel >>>  .carousel__controls__item--active{
    color: #c4c4c4;
  }
  /*.carousel >>> .btn{*/
  /*color: #00b0ff;*/
  /*}*/
  .carousel >>>  .material-icons{
    font-size: 8px !important;
  }
  .index_text{
    font-size: 15px;
  }
  .container{
    margin: 0px;
    padding: 0px 20px 20px;
    background: white;
    position: relative;
    z-index: 999;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    margin-top: -20px;
  }
  .carouselImg{
    width: 100%;
    height: 100%;
  }
</style>
